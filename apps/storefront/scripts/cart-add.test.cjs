const { test } = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const ts = require("typescript")

// Exercise the actual server action with an SDK boundary stub; no network or DB.
function action({ cartId = "cart_existing", fail, existing = null } = {}) {
  const calls = []
  const confirmed = {
    id: "cart_confirmed",
    currency_code: "usd",
    items: [{ id: "line", quantity: 1 }],
  }
  const sdk = {
    client: { fetch: async () => ({ cart: existing }) },
    store: {
      cart: {
        createLineItem: async (...args) => {
          calls.push(["add", ...args])
          if (fail && args[0] === "cart_existing") throw fail
          return { cart: confirmed }
        },
        updateLineItem: async (...args) => {
          calls.push(["update", ...args])
          return { cart: confirmed }
        },
        create: async (...args) => {
          calls.push(["create", ...args])
          return { cart: { id: "cart_new", region_id: "region", items: [] } }
        },
        update: async () => ({}),
      },
    },
  }
  const imports = {
    "@lib/config": { sdk },
    "@lib/util/medusa-error": {
      default: (error) => {
        throw error
      },
    },
    "next/cache": { revalidateTag: () => {} },
    "next/navigation": {},
    "./cookies": {
      getAuthHeaders: async () => ({}),
      getCacheOptions: async () => ({}),
      getCacheTag: async () => "cart",
      getCartId: async () => cartId,
      setCartId: async () => {},
      removeCartId: async () => {},
    },
    "./regions": { getRegion: async () => ({ id: "region" }) },
    "./locale-actions": { getLocale: async () => "en" },
    "@lib/util/subscription": {},
    "@lib/util/bundle": {
      bundleCodeForQuantity: () => null,
      isBundleCode: () => false,
    },
  }
  const source = fs.readFileSync(
    path.join(__dirname, "../src/lib/data/cart.ts"),
    "utf8",
  )
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText
  const module = { exports: {} }
  new Function("require", "module", "exports", code)(
    (id) => {
      if (!(id in imports)) throw new Error(`Unexpected import: ${id}`)
      return imports[id]
    },
    module,
    module.exports,
  )
  return { add: module.exports.addToCart, calls, confirmed }
}

const input = {
  variantId: "variant",
  quantity: 1,
  countryCode: "us",
  purchaseType: "one_time",
}

test("existing cart returns the confirmed mutation response without a second cart read", async () => {
  const fixture = action()
  assert.equal(await fixture.add(input), fixture.confirmed)
  assert.equal(fixture.calls.length, 1)
  assert.equal(fixture.calls[0][2].metadata.purchase_type, "one_time")
})

test("subscription selection is preserved in the mutation", async () => {
  const fixture = action()
  await fixture.add({ ...input, purchaseType: "subscription" })
  assert.equal(fixture.calls[0][2].metadata.purchase_type, "subscription")
})

test("a timeout is surfaced without retrying a possibly completed add", async () => {
  const failure = new Error("Timed out")
  const fixture = action({ fail: failure })
  await assert.rejects(fixture.add(input), /Timed out/)
  assert.equal(fixture.calls.length, 1)
})

test("a stock validation error does not create a second cart or retry", async () => {
  const fixture = action({
    fail: Object.assign(new Error("Out of stock"), { status: 400 }),
  })
  await assert.rejects(fixture.add(input), /Out of stock/)
  assert.equal(fixture.calls.length, 1)
})

test("a missing cart is recreated and returns the new confirmed cart", async () => {
  const fixture = action({
    fail: Object.assign(new Error("Not found"), { status: 404 }),
  })
  assert.equal(await fixture.add(input), fixture.confirmed)
  assert.deepEqual(
    fixture.calls.map((call) => call[0]),
    ["add", "create", "add"],
  )
})

test("first add creates a cart once", async () => {
  const fixture = action({ cartId: null })
  assert.equal(await fixture.add(input), fixture.confirmed)
  assert.deepEqual(
    fixture.calls.map((call) => call[0]),
    ["create", "add"],
  )
})

test("fallback increments existing quantity instead of replacing it", async () => {
  // A cookie-less request cannot retrieve a cart; use the missing-cart recovery path.
  const recovered = action({
    fail: Object.assign(new Error("Not found"), { status: 404 }),
    existing: {
      id: "cart_new",
      region_id: "region",
      items: [{ id: "line", variant_id: "variant", quantity: 2 }],
    },
  })
  await recovered.add(input)
  assert.equal(
    recovered.calls.find((call) => call[0] === "update")[3].quantity,
    3,
  )
})
