"use client"

import { useState } from "react"
import type { FormEvent } from "react"

const BREVO_FORM_ACTION =
  "https://863fe79f.sibforms.com/serve/MUIFAMI6TqrUKksTB4nJw_WyLu2GHzoi5rzeXxky19vw2_vdQNIv_PtCZg5NBrDJ3wr-d5SKx9DryRrTs-y8b5caTytR011qcDIJFfRnW9q5_sNG2_YiNxhIRAiXaoisrQsyzyTo6O2skPmUrOokQfB08SxSAvkCPpe0EeQwkXFXnvfyCTVShgheWJWGvYLTWi2LwCFmXUw8VDv0Sg=="

export default function NewsletterSignup() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus("idle")

    try {
      await fetch(BREVO_FORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        body: new FormData(event.currentTarget),
      })
      event.currentTarget.reset()
      setStatus("success")
    } catch {
      setStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <aside className="overflow-hidden rounded-[1.5rem] bg-aura-cream p-6 text-left small:p-8">
      <p className="aura-eyebrow">Stay in the loop</p>
      <h3 className="aura-display mt-4 text-[34px] leading-none small:text-[42px]">
        A daily ritual, delivered to your inbox.
      </h3>
      <p className="mt-4 max-w-[470px] text-[15px] leading-7 text-aura-forest/70">
        Be first to hear about new formulas, launches, and early access.
      </p>
      <form className="mt-6" onSubmit={handleSubmit}>
        <label className="aura-eyebrow block" htmlFor="newsletter-email">
          Email address
        </label>
        <div className="mt-3 flex flex-col gap-3 small:flex-row">
          <input
            className="min-w-0 flex-1 rounded-full border border-aura-forest/25 bg-transparent px-5 py-4 text-[15px] text-aura-forest outline-none transition-colors placeholder:text-aura-forest/45 focus:border-aura-gold"
            id="newsletter-email"
            name="EMAIL"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
          <button
            className="aura-button inline-flex shrink-0 disabled:cursor-wait disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Joining..." : "Join the list"}
          </button>
        </div>
        <input name="email_address_check" type="text" className="hidden" tabIndex={-1} autoComplete="off" />
        <input name="locale" type="hidden" value="en" />
        <p aria-live="polite" className="mt-3 text-[13px] leading-5 text-aura-forest/70">
          {status === "success" && "You’re on the list. Welcome to Aura."}
          {status === "error" && "We couldn’t add you just now. Please try again."}
        </p>
      </form>
    </aside>
  )
}
