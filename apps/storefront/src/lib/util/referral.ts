export const REFERRAL_COOKIE = "aura_ref"
export const REFERRAL_QUERY = "ref"
export const REFERRAL_MAX_AGE = 60 * 60 * 24 * 60

export const normalizeReferralCode = (value?: string | null) => {
  const code = value?.trim().toLowerCase() || ""
  if (!/^[a-z0-9][a-z0-9_-]{0,31}$/.test(code)) {
    return ""
  }
  return code
}
