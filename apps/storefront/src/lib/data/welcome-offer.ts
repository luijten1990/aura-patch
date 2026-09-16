"use server"

import { sdk } from "@lib/config"

export async function subscribeWelcomeOffer(email: string): Promise<{
  ok: boolean
  message: string
}> {
  try {
    await sdk.client.fetch<{ ok: boolean; code: string }>(
      "/store/welcome-offer",
      {
        method: "POST",
        body: { email },
        cache: "no-store",
      }
    )

    return {
      ok: true,
      message: "Your 15% code is on its way. Check your inbox for ILOVEAURA.",
    }
  } catch {
    return {
      ok: false,
      message: "We couldn't send the code just now. Please try again.",
    }
  }
}
