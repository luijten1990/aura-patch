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
    exports, Buffer, Response, console,
    process: { env: { ...env, ...overrides.env } },
    fetch: overrides.fetch || (() => { throw new Error("Network disabled") }),
    require: (name) => {
      if (name === "@medusajs/framework/utils") return {
        ContainerRegistrationKeys: { LOGGER: "logger", QUERY: "query" },
        AbstractFulfillmentProviderService: class {},
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
  const fulfilled = { ...order, items: [{ id: "item_test", quantity: 1 }], fulfillments: [], shipping_address: { country_code: "us" }, shipping_methods: [{ shipping_option: { provider_id: "fp_usps_usps" } }] }
  await test("Automatic carrier fulfillment is disabled unless opted in", async () => {
    let calls = 0
    await load("apps/backend/src/subscribers/auto-fulfill-usps-order.ts", { run: async () => calls++ }).default(args(fulfilled))
    assert.equal(calls, 0)
  })
  await test("Opted-in USPS orders fulfill once and existing fulfillments are skipped", async () => {
    const calls = []
    const handler = load("apps/backend/src/subscribers/auto-fulfill-usps-order.ts", {
      env: { AUTO_FULFILL_ON_ORDER_PAID: "true" }, run: async (input) => calls.push(input),
    }).default
    await handler(args(fulfilled))
    await handler(args({ ...fulfilled, fulfillments: [{ id: "ful_test" }] }))
    await handler(args({ ...fulfilled, shipping_methods: [{ shipping_option: { provider_id: "other" } }] }))
    assert.equal(calls.length, 1)
    assert.equal(calls[0].input.order_id, order.id)
  })
  await test("Opted-in international Easyship orders fulfill and never route US addresses to Easyship", async () => {
    const calls = []
    const handler = load("apps/backend/src/subscribers/auto-fulfill-usps-order.ts", {
      env: { AUTO_FULFILL_ON_ORDER_PAID: "true" }, run: async (input) => calls.push(input),
    }).default
    const international = {
      ...fulfilled,
      shipping_address: { country_code: "gb" },
      shipping_methods: [{ shipping_option: { provider_id: "fp_easyship_easyship" } }],
    }
    await handler(args(international))
    await handler(args({ ...international, shipping_address: { country_code: "us" } }))
    assert.equal(calls.length, 1)
  })
  await test("Easyship creates an international label with the sandbox endpoint", async () => {
    const calls = []
    const Service = load("apps/backend/src/modules/easyship/service.ts", { fetch: async (url, request) => {
      calls.push({ url, body: JSON.parse(request.body) })
      return Response.json({ shipment: {
        easyship_shipment_id: "ESGB10000001", tracking_number: "EASYSHIP-TEST",
        label_url: "https://labels.example.test/ESGB10000001.pdf", tracking_url: "https://track.example.test/EASYSHIP-TEST",
      } }, { status: 201 })
    } }).EasyshipFulfillmentService
    const service = new Service({}, {
      baseUrl: "https://public-api-sandbox.easyship.com", apiToken: "sand_test", itemDescription: "Vitamin patch", itemValueUsd: 49.99,
      itemHsCode: "3005109000", weightOz: 3, lengthIn: 8.3, widthIn: 5.8, heightIn: 0.25,
    })
    const destination = { country_code: "gb", first_name: "Sandbox", last_name: "Test", address_1: "1 Test Street", city: "London", postal_code: "SW1A 1AA" }
    const origin = { country_code: "us", first_name: "Aura", last_name: "Patch", address_1: "1 Origin Street", city: "Los Angeles", province: "CA", postal_code: "90001" }
    const result = await service.createFulfillment({ easyship_origin: origin }, [], { id: "order_test", shipping_address: destination }, {})
    assert.equal(result.labels[0].tracking_number, "EASYSHIP-TEST")
    assert.equal(result.labels[0].label_url, "https://labels.example.test/ESGB10000001.pdf")
    assert.equal(calls[0].url, "https://public-api-sandbox.easyship.com/2024-09/shipments")
    assert.equal(calls[0].body.shipping_settings.buy_label, true)
  })
  await test("USPS response PDF is preserved and attached to the orders mailbox email", async () => {
    const pdf = Buffer.from("%PDF-1.4\nTEST FIXTURE ONLY\n%%EOF")
    const calls = []
    const Service = load("apps/backend/src/modules/usps/service.ts", { fetch: async (url, request) => {
      calls.push({ url, body: JSON.parse(request.body) })
      if (url.endsWith("/token")) return Response.json({ access_token: "test" })
      if (url.endsWith("/payment-authorization")) return Response.json({ paymentAuthorizationToken: "test" })
      if (url.endsWith("/label")) return new Response(Buffer.concat([
        Buffer.from('--test\r\nContent-Disposition: form-data; name="labelMetadata"\r\n\r\n{"trackingNumber":"TEST-TRACKING"}\r\n--test\r\nContent-Disposition: form-data; name="labelImage"\r\nContent-Type: application/pdf\r\n\r\n'),
        pdf, Buffer.from("\r\n--test--\r\n"),
      ]), { headers: { "content-type": "multipart/form-data; boundary=test" } })
      assert.equal(url, "https://api.brevo.com/v3/smtp/email")
      return Response.json({ messageId: "test" })
    } }).UspsFulfillmentService
    const service = new Service({}, {
      baseUrl: "https://apis-tem.usps.com", clientId: "test", clientSecret: "test",
      crid: "test", mid: "test", paymentAccountNumber: "test", paymentAccountType: "EPS",
      weightOz: 3, lengthIn: 6, widthIn: 4, heightIn: 1, mailClass: "PRIORITY_MAIL", rateIndicator: "SP",
      brevoApiKey: "test", labelEmailFrom: "info@getaurapatch.com", labelEmailTo: "orders@getaurapatch.com",
    })
    const address = { country_code: "us", first_name: "Sandbox", last_name: "Test", address_1: "1 Test Street", city: "Test", province: "CA", postal_code: "90001" }
    const result = await service.createFulfillment({ usps_origin: address }, [], { shipping_address: address }, {})
    assert.equal(result.labels[0].tracking_number, "TEST-TRACKING")
    const email = calls.at(-1).body
    assert.equal(email.to[0].email, "orders@getaurapatch.com")
    assert.equal(email.attachment[0].content, pdf.toString("base64"))
    assert.equal(email.attachment[0].name, "usps-label-TEST-TRACKING.pdf")
    assert.ok(calls.slice(0, 3).every(({ url }) => url.startsWith("https://apis-tem.usps.com/")))
  })
  fs.writeFileSync(path.join(output, "results.json"), JSON.stringify({
    mode: "Local isolated tests with simulated order and provider responses. No email sent, no carrier label generated, no inbox delivery verified.",
    sampleTotal: 49.95, results,
  }, null, 2))
  for (const result of results) console.log(`${result.status}: ${result.name}${result.detail ? ` — ${result.detail}` : ""}`)
  process.exitCode = results.some(({ status }) => status === "FAIL") ? 1 : 0
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
