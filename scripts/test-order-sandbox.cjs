const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const vm = require("node:vm")
const { transformSync } = require("@swc/core")

// Isolated test: no database, credentials, network requests, or postage purchases.
const root = path.resolve(__dirname, "..")
const output = path.join(root, "test-results/order-sandbox")
fs.mkdirSync(output, { recursive: true })
const results = []
const env = {
  BREVO_API_KEY: "test-only",
  BREVO_SENDER_EMAIL: "info@getaurapatch.com",
  BREVO_NEW_ORDER_RECIPIENTS: "orders@getaurapatch.com",
}
const order = {
  id: "order_sandbox_preview",
  display_id: "TEST-PREVIEW",
  email: "luijtem@gmail.com",
  currency_code: "usd",
  total: 49.95,
  items: [{ product_title: "Aura Patch", quantity: 1, unit_price: 49.95 }],
}
function load(relativePath, overrides = {}) {
  const source = fs.readFileSync(path.join(root, relativePath), "utf8")
  const { code } = transformSync(source, {
    jsc: { parser: { syntax: "typescript" }, target: "es2022" },
    module: { type: "commonjs" },
  })
  const exports = {}
  vm.runInNewContext(code, {
    exports, Buffer, Response, console, AbortController, setTimeout, clearTimeout,
    process: { env: { ...env, ...overrides.env } },
    fetch: overrides.fetch || (() => { throw new Error("Network disabled") }),
    require: (name) => {
      if (name === "@medusajs/framework/utils") return {
        ContainerRegistrationKeys: { LOGGER: "logger", QUERY: "query" },
        AbstractFulfillmentProviderService: class {},
        MedusaError: class MedusaError extends Error {
          static Types = { INVALID_DATA: "invalid_data", UNEXPECTED_STATE: "unexpected_state" }
          constructor(_type, message) { super(message) }
        },
      }
      if (name === "@medusajs/medusa/core-flows") return {
        createOrderFulfillmentWorkflow: () => ({ run: overrides.run }),
      }
      throw new Error(`Unexpected dependency ${name}`)
    },
  }, { filename: relativePath })
  return exports
}
function args(data = order) {
  return { event: { data: { id: data.id } }, container: { resolve: (key) => {
    if (key === "logger") return { info() {}, warn() {}, error() {} }
    if (key === "query") return { graph: async () => ({ data: [data] }) }
    throw new Error(`Unexpected service ${key}`)
  } } }
}
async function test(name, fn) {
  try { await fn(); results.push({ name, status: "PASS" }) }
  catch (error) { results.push({ name, status: "FAIL", detail: error.message }) }
}
async function main() {
  const emails = []
  const emailHandler = load("apps/backend/src/subscribers/order-placed-brevo.ts", {
    fetch: async (url, request) => {
      assert.equal(url, "https://api.brevo.com/v3/smtp/email")
      emails.push(JSON.parse(request.body))
      return new Response("{}", { status: 201 })
    },
  }).default
  await emailHandler(args())
  fs.writeFileSync(path.join(output, "thank-you-preview.html"), emails[0].htmlContent)
  fs.writeFileSync(path.join(output, "internal-order-preview.html"), emails[1].htmlContent)
  await test("Customer confirmation targets luijtem@gmail.com", () => {
    assert.equal(emails.length, 2)
    assert.equal(emails[0].to[0].email, "luijtem@gmail.com")
    assert.match(emails[0].htmlContent, /Thank you<br>for your purchase/)
  })
  await test("Internal order notice targets orders@getaurapatch.com", () => {
    assert.equal(emails[1].to[0].email, "orders@getaurapatch.com")
    assert.match(emails[1].subject, /New Aura Patch order/)
  })
  await test("Customer and internal emails display the correct $49.95 total", () => {
    for (const email of emails) assert.ok(email.htmlContent.includes("$49.95"), "Expected $49.95; email showed a different total")
  })
  await test("Product names are HTML escaped", async () => {
    await emailHandler(args({ ...order, items: [{ product_title: "<script> & test", quantity: 1 }] }))
    assert.match(emails[2].htmlContent, /&lt;script&gt; &amp; test/)
  })
  await test("Missing or blank recipient settings default to the orders mailbox", async () => {
    for (const setting of [undefined, "", "  "]) {
      const sent = []
      const handler = load("apps/backend/src/subscribers/order-placed-brevo.ts", {
        env: { BREVO_NEW_ORDER_RECIPIENTS: setting },
        fetch: async (_url, request) => {
          sent.push(JSON.parse(request.body))
          return Response.json({})
        },
      }).default
      await handler(args())
      assert.equal(sent[1].to[0].email, "orders@getaurapatch.com")
    }
  })
  const fulfilled = { ...order, items: [{ id: "item_test", quantity: 1 }], fulfillments: [], shipping_methods: [{ shipping_option: { provider_id: "fp_easypost_easypost" } }] }
  await test("Automatic carrier fulfillment is disabled unless opted in", async () => {
    let calls = 0
    await load("apps/backend/src/subscribers/auto-fulfill-easypost-order.ts", { run: async () => calls++ }).default(args(fulfilled))
    assert.equal(calls, 0)
  })
  await test("Opted-in EasyPost orders fulfill once and existing fulfillments are skipped", async () => {
    const calls = []
    const handler = load("apps/backend/src/subscribers/auto-fulfill-easypost-order.ts", {
      env: { AUTO_FULFILL_ON_ORDER_PAID: "true" }, run: async (input) => calls.push(input),
    }).default
    await handler(args(fulfilled))
    await handler(args({ ...fulfilled, fulfillments: [{ id: "ful_test" }] }))
    await handler(args({ ...fulfilled, shipping_methods: [{ shipping_option: { provider_id: "other" } }] }))
    assert.equal(calls.length, 1)
    assert.equal(calls[0].input.order_id, order.id)
  })
  await test("EasyPost emails a generated label to the orders mailbox", async () => {
    const pdf = Buffer.from("%PDF-1.4\nTEST FIXTURE ONLY\n%%EOF")
    const calls = []
    const Service = load("apps/backend/src/modules/easypost/service.ts", { fetch: async (url, request) => {
      calls.push({ url, body: request?.body ? JSON.parse(request.body) : undefined })
      if (String(url).includes("/buy")) {
        return Response.json({
          id: "shp_test",
          tracking_code: "EASYPOST-TEST",
          tracker: { public_url: "https://track.easypost.com/EASYPOST-TEST" },
          postage_label: { label_pdf_url: "https://easypost.test/label.pdf" },
          selected_rate: { id: "rate_1", rate: "8.20", currency: "USD", carrier: "USPS", service: "Priority" },
        })
      }
      if (String(url).endsWith("/shipments")) {
        return Response.json({
          id: "shp_test",
          rates: [{ id: "rate_1", shipment_id: "shp_test", rate: "8.20", currency: "USD", carrier: "USPS", service: "Priority" }],
        }, { status: 201 })
      }
      if (String(url) === "https://easypost.test/label.pdf") {
        return new Response(pdf)
      }
      assert.equal(url, "https://api.brevo.com/v3/smtp/email")
      return Response.json({ messageId: "test" })
    } }).EasyPostFulfillmentService
    const service = new Service({}, {
      baseUrl: "https://api.easypost.com/v2", apiKey: "EZTEST_test", itemDescription: "Vitamin patch", itemValueUsd: 49.99,
      itemHsCode: "3005109000", customsSigner: "Aura Patch", weightOz: 3, lengthIn: 8.3, widthIn: 5.8, heightIn: 0.25,
      brevoApiKey: "test", labelEmailFrom: "info@getaurapatch.com", labelEmailTo: "orders@getaurapatch.com",
    })
    const destination = { country_code: "gb", first_name: "Sandbox", last_name: "Test", address_1: "1 Test Street", city: "London", postal_code: "SW1A 1AA" }
    const origin = { country_code: "us", first_name: "Aura", last_name: "Patch", address_1: "1 Origin Street", city: "Los Angeles", province: "CA", postal_code: "90001", phone: "3105550100" }
    const result = await service.createFulfillment({ easypost_origin: origin }, [], { id: "order_test", shipping_address: destination }, {})
    assert.equal(result.labels[0].tracking_number, "EASYPOST-TEST")
    assert.ok(result.labels[0].label_url.startsWith("data:application/pdf;base64,"))
    assert.equal(calls[0].url, "https://api.easypost.com/v2/shipments")
    assert.equal(calls[0].body.shipment.customs_info.contents_type, "merchandise")
    assert.ok(calls.some(({ url }) => String(url).includes("/buy")))
    const email = calls.at(-1).body
    assert.equal(email.to[0].email, "orders@getaurapatch.com")
    assert.equal(email.attachment[0].name, "easypost-label-EASYPOST-TEST.pdf")
    assert.equal(email.attachment[0].content, pdf.toString("base64"))
  })
  fs.writeFileSync(path.join(output, "results.json"), JSON.stringify({
    mode: "Local isolated tests with simulated order and provider responses. No email sent, no carrier label generated, no inbox delivery verified.",
    sampleTotal: 49.95, results,
  }, null, 2))
  for (const result of results) console.log(`${result.status}: ${result.name}${result.detail ? ` — ${result.detail}` : ""}`)
  process.exitCode = results.some(({ status }) => status === "FAIL") ? 1 : 0
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
