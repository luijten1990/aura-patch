const FALLBACK_BASE_URL = "https://www.getaurapatch.com"

export const getBaseURL = () => {
  const value = process.env.NEXT_PUBLIC_BASE_URL || FALLBACK_BASE_URL
  try {
    return new URL(value).origin
  } catch {
    return FALLBACK_BASE_URL
  }
}
