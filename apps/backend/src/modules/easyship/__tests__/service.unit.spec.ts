import { MedusaError } from "@medusajs/framework/utils"
import { EasyshipFulfillmentService } from "../service"

const options = {
  apiToken: "token",
  baseUrl: "https://public-api.easyship.com",
  itemDescription: "Vitamin patch",
  itemValueUsd: 49.99,
  weightOz: 3,
  lengthIn: 8.3,
  widthIn: 5.8,
  heightIn: 0.25,
}

describe("EasyshipFulfillmentService", () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("does not crash when quote data is missing easyship_origin", async () => {
    const service = new EasyshipFulfillmentService({}, options)

    await expect(
      service.calculatePrice(
        { id: "easyship-international" },
        undefined as never,
        {
          shipping_address: {
            address_1: "Bezuidenhoutseweg 261",
            city: "Den Haag",
            postal_code: "2594AN",
            country_code: "nl",
          },
        } as never
      )
    ).rejects.toBeInstanceOf(MedusaError)
  })

  it("reuses an in-flight quote instead of calling Easyship twice", async () => {
    const service = new EasyshipFulfillmentService({}, options)
    const destination = {
      address_1: "Bezuidenhoutseweg 261",
      city: "Den Haag",
      postal_code: "2594AN",
      country_code: "nl",
    }
    const origin = {
      address_1: "1 Warehouse",
      city: "Austin",
      postal_code: "78701",
      country_code: "us",
    }

    jest.spyOn(global, "fetch").mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: async () => ({
                rates: [
                  {
                    currency: "USD",
                    total_charge: 18.5,
                    courier_service: { name: "DHL Express" },
                  },
                ],
              }),
            } as Response)
          }, 20)
        })
    )

    const [first, second] = await Promise.all([
      service.calculatePrice(
        { id: "easyship-international" },
        { easyship_origin: origin },
        { shipping_address: destination, from_location: { address: origin } } as never
      ),
      service.calculatePrice(
        { id: "easyship-international" },
        { easyship_origin: origin },
        { shipping_address: destination, from_location: { address: origin } } as never
      ),
    ])

    expect(first.calculated_amount).toBe(1850)
    expect(second.calculated_amount).toBe(1850)
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
