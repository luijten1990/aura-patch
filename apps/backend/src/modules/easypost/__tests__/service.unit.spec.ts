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
  country_code: "nl",
  first_name: "Mirjam",
  last_name: "Luijten",
  address_1: "Bezuidenhoutseweg 261",
  city: "Den Haag",
  postal_code: "2594AN",
}

describe("EasyPostFulfillmentService", () => {
  it("does not crash when quote data is missing easypost_origin", async () => {
    const originalFetch = global.fetch
    global.fetch = (async () =>
      Response.json({
        id: "shp_test",
        rates: [
          {
            id: "rate_1",
            shipment_id: "shp_test",
            rate: "18.40",
            currency: "USD",
            carrier: "DHLExpress",
            service: "ExpressWorldwide",
          },
        ],
      })) as typeof fetch

    const service = new EasyPostFulfillmentService({}, options)
    try {
      await expect(
        service.calculatePrice(
          { id: "easypost" },
          {},
          { shipping_address: destination } as never
        )
      ).resolves.toEqual({
        calculated_amount: 18.4,
        is_calculated_price_tax_inclusive: false,
      })
    } finally {
      global.fetch = originalFetch
    }
  })

  it("reuses an in-flight quote instead of calling EasyPost twice", async () => {
    let calls = 0
    const originalFetch = global.fetch
    global.fetch = (async () => {
      calls += 1
      await new Promise((resolve) => setTimeout(resolve, 20))
      return Response.json({
        id: "shp_test",
        rates: [
          {
            id: "rate_1",
            shipment_id: "shp_test",
            rate: "18.40",
            currency: "USD",
            carrier: "DHLExpress",
            service: "ExpressWorldwide",
          },
        ],
      })
    }) as typeof fetch

    const service = new EasyPostFulfillmentService({}, options)
    try {
      const [first, second] = await Promise.all([
        service.calculatePrice({ id: "easypost" }, {}, {
          shipping_address: destination,
        } as never),
        service.calculatePrice({ id: "easypost" }, {}, {
          shipping_address: destination,
        } as never),
      ])
      expect(first.calculated_amount).toBe(18.4)
      expect(second.calculated_amount).toBe(18.4)
      expect(calls).toBe(1)
    } finally {
      global.fetch = originalFetch
    }
  })
})
