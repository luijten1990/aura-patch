"use client"

import { subscribeWelcomeOffer } from "@lib/data/welcome-offer"
import { FormEvent, useEffect, useState } from "react"

const DISMISSED_KEY = "aura-welcome-offer-dismissed"

export default function WelcomePopup() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (window.localStorage.getItem(DISMISSED_KEY)) return

    const timer = window.setTimeout(() => setOpen(true), 8000)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss()
    }

    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const dismiss = () => {
    window.localStorage.setItem(DISMISSED_KEY, "true")
    setOpen(false)
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim() || !email.includes("@")) {
      setMessage("Please enter a valid email address.")
      return
    }

    setSubmitting(true)
    const result = await subscribeWelcomeOffer(email.trim())
    setSubmitting(false)
    setMessage(result.message)

    if (result.ok) {
      setSent(true)
      window.localStorage.setItem(DISMISSED_KEY, "true")
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-aura-forest/65 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) dismiss()
      }}
    >
      <div className="relative w-full max-w-[680px] overflow-hidden rounded-[2rem] bg-aura-cream shadow-2xl">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close welcome offer"
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-aura-forest/20 text-xl text-aura-forest transition-colors hover:bg-aura-forest hover:text-aura-cream"
        >
          ×
        </button>

        <div className="h-3 bg-aura-gold" />
        <div className="px-7 py-12 small:px-14 small:py-16">
          <p className="aura-eyebrow text-aura-gold">A welcome from Aura</p>
          <h2
            id="welcome-title"
            className="aura-display mt-5 max-w-[520px] text-[46px] leading-[0.96] text-aura-forest small:text-[62px]"
          >
            Join our email list.
          </h2>
          <p className="mt-6 max-w-[520px] text-[18px] leading-8 text-aura-forest/72">
            15% off your first order—straight to your inbox.
          </p>

          <form onSubmit={submit} className="mt-9">
            <div className="flex flex-col overflow-hidden rounded-[1.25rem] border border-aura-forest/20 bg-white/45 focus-within:border-aura-gold small:flex-row">
              <label htmlFor="welcome-email" className="sr-only">
                Email address
              </label>
              <input
                id="welcome-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setMessage("")
                }}
                placeholder="Email address"
                disabled={submitting || sent}
                className="min-w-0 flex-1 bg-transparent px-6 py-5 text-[16px] text-aura-forest outline-none placeholder:text-aura-forest/45 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={submitting || sent}
                className="m-1.5 rounded-[0.95rem] bg-aura-forest px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-aura-cream transition-colors hover:bg-aura-wine disabled:opacity-60"
              >
                {submitting ? "Sending" : sent ? "Sent" : "Sign up"}
              </button>
            </div>
            {message && (
              <p className="mt-3 text-sm text-aura-forest/65" role="status">
                {message}
              </p>
            )}
          </form>

          <p className="mt-5 text-xs leading-5 text-aura-forest/48">
            By signing up, you agree to receive Aura Patch news and offers. You
            can unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  )
}
