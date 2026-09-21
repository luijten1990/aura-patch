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

export default function GlobalError({
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
    <html lang="en">
      <body className="m-0 bg-[#f6f0e5] text-[#17382f]">
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em]">Aura Patch</p>
          <h1 className="mt-5 text-[36px] leading-none">This page is catching up.</h1>
          <p className="mt-4 max-w-md text-[16px] leading-7 text-[#17382f]/75">
            Refresh to try again. Home still loads even if the catalog is briefly unavailable.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reloadStorefront}
              className="rounded-full bg-[#c4a574] px-7 py-4 text-[13px] font-medium uppercase tracking-[0.12em] text-[#17382f]"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.assign("/us")
              }}
              className="rounded-full border border-[#17382f]/40 px-7 py-4 text-[13px] font-medium uppercase tracking-[0.12em] text-[#17382f]"
            >
              Go home
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
