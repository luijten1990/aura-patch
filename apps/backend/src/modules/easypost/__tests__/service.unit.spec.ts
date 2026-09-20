import { EasyPostFulfillmentService } from "../service"

const options = {
  apiKey: "EZTEST_test",
  baseUrl: "https://api.easypost.com/v2",
  itemDescription: "Vitamin patch",
  itemValueUsd: 49.99,
  itemHsCode: "3005109000",
  customsSigner: "Aura Patch",
  originStreet: "1 Origin Street",
  originCity: "Los Angeles",
  originState: "CA",
  originZip: "90001",
  originCountry: "US",
  originPhone: "3105550100",
  weightOz: 3,
  lengthIn: 8.3,
  widthIn: 5.8,
  heightIn: 0.25,
}

const destination = {
  country_code: "us",
  first_name: "Test",
  last_name: "Order",
  address_1: "100 Market Street",
  city: "San Francisco",
  province: "CA",
  postal_code: "94105",
}

const rates = [
  {
    id: "rate_ground",
    shipment_id: "shp_test",
    rate: "6.07",
    currency: "USD",
    carrier: "USPS",
    service: "GroundAdvantage",
  },
  {
    id: "rate_express",
    shipment_id: "shp_test",
    rate: "28.40",
    currency: "USD",
    carrier: "USPS",
    service: "PriorityMailExpress",
  },
]

describe("EasyPostFulfillmentService", () => {
  it("quotes the matching EasyPost service instead of the cheapest overall", async () => {
    const originalFetch = global.fetch
    global.fetch = (async () => Response.json({ id: "shp_test", rates })) as typeof fetch

    const service = new EasyPostFulfillmentService({}, options)
    try {
      await expect(
        service.calculatePrice(
          { id: "easypost-usps-ground" },
          { easypost_live: true },
          { shipping_address: destination } as never
        )
      ).resolves.toEqual({
        calculated_amount: 6.07,
        is_calculated_price_tax_inclusive: false,
      })
      await expect(
        service.calculatePrice(
          { id: "easypost-express" },
          { easypost_live: true },
          { shipping_address: destination } as never
        )
      ).resolves.toEqual({
        calculated_amount: 28.4,
        is_calculated_price_tax_inclusive: false,
      })
    } finally {
      global.fetch = originalFetch
    }
  })

  it("reuses one EasyPost shipment for multiple checkout options", async () => {
    let calls = 0
    const originalFetch = global.fetch
    global.fetch = (async () => {
      calls += 1
      await new Promise((resolve) => setTimeout(resolve, 20))
      return Response.json({ id: "shp_test", rates })
    }) as typeof fetch

    const service = new EasyPostFulfillmentService({}, options)
    try {
      const [ground, express] = await Promise.all([
        service.calculatePrice({ id: "easypost-usps-ground" }, { easypost_live: true }, {
          shipping_address: destination,
        } as never),
        service.calculatePrice({ id: "easypost-express" }, { easypost_live: true }, {
          shipping_address: destination,
        } as never),
      ])
      expect(ground.calculated_amount).toBe(6.07)
      expect(express.calculated_amount).toBe(28.4)
      expect(calls).toBe(1)
    } finally {
      global.fetch = originalFetch
    }
  })

  it("does not 500 when EasyPost has no matching carrier for an option", async () => {
    const originalFetch = global.fetch
    global.fetch = (async () => Response.json({ id: "shp_test", rates })) as typeof fetch

    const service = new EasyPostFulfillmentService({}, options)
    try {
      await expect(
        service.calculatePrice(
          { id: "easypost-ups-ground" },
          { easypost_live: true },
          { shipping_address: destination } as never
        )
      ).resolves.toEqual({
        calculated_amount: 0,
        is_calculated_price_tax_inclusive: false,
      })
    } finally {
      global.fetch = originalFetch
    }
  })

  it("does not call EasyPost while adding to an existing cart", async () => {
    let calls = 0
    const originalFetch = global.fetch
    global.fetch = (async () => {
      calls += 1
      return Response.json({ id: "shp_test", rates })
    }) as typeof fetch

    const service = new EasyPostFulfillmentService({}, options)
    try {
      await expect(
        service.calculatePrice(
          { id: "easypost-usps-ground" },
          {},
          { shipping_address: destination } as never
        )
      ).resolves.toEqual({
        calculated_amount: 0,
        is_calculated_price_tax_inclusive: false,
      })
      expect(calls).toBe(0)
    } finally {
      global.fetch = originalFetch
    }
  })

  it("does not fail cart updates when the destination address is incomplete", async () => {
    const service = new EasyPostFulfillmentService({}, options)
    await expect(
      service.calculatePrice(
        { id: "easypost-usps-ground" },
        {},
        { shipping_address: { country_code: "nl" } } as never
      )
    ).resolves.toEqual({
      calculated_amount: 0,
      is_calculated_price_tax_inclusive: false,
    })
  })

  it("offers USPS, UPS, a lowest-cost alternative, and express for international addresses", async () => {
    const originalFetch = global.fetch
    const nlRates = [
      {
        id: "rate_usps",
        shipment_id: "shp_nl",
        rate: "13.04",
        currency: "USD",
        carrier: "USPS",
        service: "FirstClassPackageInternationalService",
      },
      {
        id: "rate_ups",
        shipment_id: "shp_nl",
        rate: "24.47",
        currency: "USD",
        carrier: "UPS",
        service: "UPSStandard",
      },
      {
        id: "rate_alt",
        shipment_id: "shp_nl",
        rate: "15.10",
        currency: "USD",
        carrier: "DhlEcs",
        service: "PacketInternational",
      },
      {
        id: "rate_express",
        shipment_id: "shp_nl",
        rate: "39.51",
        currency: "USD",
        carrier: "DHLExpress",
        service: "ExpressWorldwide",
      },
    ]
    global.fetch = (async () =>
      Response.json({ id: "shp_nl", rates: nlRates })) as typeof fetch

    const service = new EasyPostFulfillmentService({}, options)
    const netherlands = {
      country_code: "nl",
      first_name: "Mirjam",
      last_name: "Luijten",
      address_1: "Bezuidenhoutseweg 261",
      city: "Den Haag",
      postal_code: "2594AN",
    }
    try {
      await expect(
        service.calculatePrice({ id: "easypost-usps" }, { easypost_live: true }, {
          shipping_address: netherlands,
        } as never)
      ).resolves.toEqual({
        calculated_amount: 13.04,
        is_calculated_price_tax_inclusive: false,
      })
      await expect(
        service.calculatePrice({ id: "easypost-ups" }, { easypost_live: true }, {
          shipping_address: netherlands,
        } as never)
      ).resolves.toEqual({
        calculated_amount: 24.47,
        is_calculated_price_tax_inclusive: false,
      })
      await expect(
        service.calculatePrice({ id: "easypost-alt" }, { easypost_live: true }, {
          shipping_address: netherlands,
        } as never)
      ).resolves.toEqual({
        calculated_amount: 15.1,
        is_calculated_price_tax_inclusive: false,
      })
      await expect(
        service.calculatePrice({ id: "easypost-express" }, { easypost_live: true }, {
          shipping_address: netherlands,
        } as never)
      ).resolves.toEqual({
        calculated_amount: 39.51,
        is_calculated_price_tax_inclusive: false,
      })
    } finally {
      global.fetch = originalFetch
    }
  })
})
