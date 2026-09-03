"use client"

import { FormEvent, useState } from "react"

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get("name") || "")
    const email = String(form.get("email") || "")
    const inquiry = String(form.get("inquiry") || "General inquiry")
    const message = String(form.get("message") || "")

    const subject = encodeURIComponent(`Aura Patch: ${inquiry}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nInquiry: ${inquiry}\n\n${message}`
    )

    setSubmitted(true)
    window.location.href = `mailto:support@getaurapatch.com?subject=${subject}&body=${body}`
  }

  const fieldClass =
    "w-full border-b border-aura-forest/25 bg-transparent px-0 py-3 text-[15px] text-aura-forest outline-none transition-colors placeholder:text-aura-forest/45 focus:border-aura-gold"

  return (
    <form onSubmit={handleSubmit} className="rounded-[1.5rem] bg-aura-cream p-6 text-left small:p-8">
      <div className="grid gap-5 small:grid-cols-2">
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-aura-gold">Name</span>
          <input className={fieldClass} name="name" type="text" autoComplete="name" placeholder="Your name" required />
        </label>
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-aura-gold">Email</span>
          <input className={fieldClass} name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </label>
      </div>
      <label className="mt-6 block">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-aura-gold">I’m contacting Aura about</span>
        <select className={fieldClass} name="inquiry" defaultValue="General inquiry">
          <option>General inquiry</option>
          <option>Order support</option>
          <option>Wholesale</option>
          <option>Ambassador partnerships</option>
          <option>Investor relations</option>
          <option>Press and media</option>
        </select>
      </label>
      <label className="mt-6 block">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-aura-gold">Message</span>
        <textarea className={`${fieldClass} min-h-[110px] resize-y`} name="message" placeholder="How can we help?" required />
      </label>
      <div className="mt-7 flex flex-col gap-4 small:flex-row small:items-center small:justify-between">
        <button type="submit" className="aura-button inline-flex justify-center">Send by email</button>
        <p className="text-[11px] leading-5 text-aura-forest/55">
          {submitted ? "Your email app should open now." : "Replies come from support@getaurapatch.com"}
        </p>
      </div>
    </form>
  )
}
