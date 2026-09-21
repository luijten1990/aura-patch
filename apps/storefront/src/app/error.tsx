"use client"

import { useEffect } from "react"

const RETRY_KEY = "aura-error-reload-at"

function reloadStorefront() {
  try {
    sessionStorage.removeItem(RETRY_KEY)
  } catch {
    // ignore storage failures
  }

  window.location.reload()
}

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    try {
      const last = Number(sessionStorage.getItem(RETRY_KEY) || "0")
      if (Date.now() - last < 20000) {
        return
      }

      sessionStorage.setItem(RETRY_KEY, String(Date.now()))
      window.location.reload()
    } catch {
      // ignore storage failures
    }
  }, [error])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f6f0e5] px-6 text-center text-[#17382f]">
      <p className="text-xs uppercase tracking-[0.2em]">Aura Patch</p>
      <h1 className="mt-5 text-[36px] leading-none">This page is catching up.</h1>
      <p className="mt-4 max-w-md text-[16px] leading-7 text-[#17382f]/75">
        The store is still here. Refresh to try again, or come back to Home.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reloadStorefront}
          className="rounded-full bg-[#72262f] px-7 py-4 text-[13px] font-medium uppercase tracking-[0.12em] text-[#f3e9df]"
        >
          Try again
        </button>
        <button
          type="button"
          onClick={() => {
            window.location.assign("/us")
          }}
          className="rounded-full border border-[#17382f]/40 px-7 py-4 text-[13px] font-medium uppercase tracking-[0.12em]"
        >
          Go home
        </button>
      </div>
    </div>
  )
}
