import { commissionAmount } from "../commission"

describe("commissionAmount", () => {
  it("pays 20 percent of a 49.99 order as 10.00", () => {
    expect(commissionAmount(49.99, 20)).toBe(10)
  })

  it("pays nothing on a zero base", () => {
    expect(commissionAmount(0, 20)).toBe(0)
  })
})
