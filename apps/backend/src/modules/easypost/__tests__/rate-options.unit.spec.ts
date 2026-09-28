import { formatCarrierDisplayName } from "../rate-options"

describe("formatCarrierDisplayName", () => {
  it("names DHL ecommerce as DHL", () => {
    expect(formatCarrierDisplayName("DhlEcs", "PacketInternational")).toBe("DHL")
  })

  it("names DHL Express separately from ecommerce", () => {
    expect(formatCarrierDisplayName("DHLExpress", "ExpressWorldwide")).toBe(
      "DHL Express"
    )
  })

  it("keeps USPS and UPS labels", () => {
    expect(formatCarrierDisplayName("USPS", "GroundAdvantage")).toBe("USPS")
    expect(formatCarrierDisplayName("UPS", "UPSStandard")).toBe("UPS")
  })
})
