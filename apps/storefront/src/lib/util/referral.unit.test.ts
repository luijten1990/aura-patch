import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { normalizeReferralCode } from "./referral.ts"

describe("normalizeReferralCode", () => {
  it("keeps a short partner code", () => {
    assert.equal(normalizeReferralCode(" Maya "), "maya")
  })

  it("drops codes that are not a single token", () => {
    assert.equal(normalizeReferralCode("maya smith"), "")
    assert.equal(normalizeReferralCode(""), "")
    assert.equal(normalizeReferralCode(null), "")
  })
})
