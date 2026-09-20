import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Wholesale | Aura Patch",
  description: "Partner with Aura Patch and bring beautifully simple daily wellness to your customers.",
}

const partnerBenefits = [
  ["Premium shelf presence", "Distinctive packaging created to feel considered, elevated, and easy to discover."],
  ["A simple daily ritual", "A wearable wellness format customers can understand and add naturally to their routines."],
  ["A focused collection", "Aura Daily Wellness leads a growing family designed around defense, energy, and recovery."],
  ["Retailer support", "Product education and brand materials designed to help your team introduce Aura with confidence."],
]

const wholesaleFaqs = [
  ["Who can apply?", "We welcome inquiries from established retailers, wellness studios, spas, hospitality partners, and other businesses that share Aura’s considered approach to modern wellness."],
  ["Are wholesale terms available online?", "Wholesale pricing, opening-order requirements, territories, and fulfilment details are shared with approved partners so we can provide terms appropriate to each relationship."],
  ["Where is Aura currently available?", "Aura Patch is currently focused on the United States. Please include your store location and sales channels with your inquiry."],
  ["What information should I include?", "Tell us your business name, website or social profile, store locations, primary contact, and why Aura feels right for your customers."],
]

const inquiryHref =
  "mailto:support@getaurapatch.com?subject=Aura%20Patch%20Wholesale%20Inquiry&body=Business%20name%3A%0AWebsite%3A%0ALocation%3A%0AContact%20name%3A%0ATell%20us%20about%20your%20store%3A%0A"

export default function WholesalePage() {
  return (
    <main className="bg-aura-cream text-aura-forest">
      <section className="aura-shell grid gap-12 py-14 small:grid-cols-[0.9fr_1.1fr] small:items-center small:py-20">
        <div className="max-w-[620px]">
          <p className="aura-eyebrow text-aura-gold">Aura for retailers</p>
          <h1 className="aura-display mt-6 text-[54px] leading-[0.94] small:text-[76px]">
            Wellness that fits beautifully into real life.
          </h1>
          <p className="mt-7 max-w-[560px] text-[17px] leading-8 text-aura-forest/72">
            Bring Aura’s thoughtful daily wellness ritual to your customers.
            We’re building partnerships with retailers who value clear products,
            premium presentation, and a more considered approach to wellbeing.
          </p>
          <a href={inquiryHref} className="aura-button mt-9 inline-flex">
            Become a wholesale partner
          </a>
        </div>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[500px] overflow-hidden rounded-[2rem] bg-aura-cream">
          <Image
            src="/images/aura-patch-front-original.webp"
            alt="Aura Patch 30-day wellness pouch"
            fill
            priority
            className="object-contain p-6 small:p-9"
            sizes="(max-width: 1024px) 90vw, 500px"
          />
        </div>
      </section>

      <section className="bg-aura-forest py-16 text-aura-cream small:py-24">
        <div className="aura-shell">
          <div className="grid gap-8 small:grid-cols-[0.75fr_1.25fr] small:items-end">
            <div>
              <p className="aura-eyebrow text-aura-gold">Why Aura</p>
              <h2 className="aura-display mt-6 text-[48px] leading-none small:text-[64px]">
                Made to be noticed.<br />Easy to understand.
              </h2>
            </div>
            <p className="max-w-[580px] text-[18px] leading-8 text-aura-cream/70 small:justify-self-end">
              Aura pairs elevated design with a beautifully simple wearable
              format—giving customers an approachable new way to support their
              everyday wellness routine.
            </p>
          </div>
          <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] bg-aura-cream/15 small:grid-cols-2">
            {partnerBenefits.map(([title, copy], index) => (
              <article key={title} className="bg-aura-forest px-7 py-9 small:px-10 small:py-12">
                <span className="text-xs tracking-[0.2em] text-aura-gold">0{index + 1}</span>
                <h3 className="aura-display mt-10 text-[34px] leading-tight">{title}</h3>
                <p className="mt-5 max-w-[470px] text-[15px] leading-7 text-aura-cream/65">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="aura-shell py-16 small:py-24">
        <div className="grid gap-14 small:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="aura-eyebrow text-aura-gold">Good partnerships start clearly</p>
            <h2 className="aura-display mt-6 text-[48px] leading-none small:text-[62px]">
              Wholesale questions.
            </h2>
          </div>
          <div className="divide-y divide-aura-forest/20 border-y border-aura-forest/20">
            {wholesaleFaqs.map(([question, answer]) => (
              <details key={question} className="group py-7">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-8 text-[19px]">
                  {question}
                  <span className="text-aura-gold transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-[680px] pt-5 text-[15px] leading-7 text-aura-forest/70">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="aura-shell pb-20 small:pb-28">
        <div className="rounded-[2rem] bg-aura-sage px-7 py-14 text-center small:px-16 small:py-20">
          <p className="aura-eyebrow text-aura-gold">Let’s grow together</p>
          <h2 className="aura-display mx-auto mt-6 max-w-[900px] text-[48px] leading-none small:text-[68px]">
            Ready to bring Aura to your customers?
          </h2>
          <p className="mx-auto mt-6 max-w-[600px] text-[16px] leading-7 text-aura-forest/70">
            Introduce your business and tell us where you’d like to carry Aura.
            Our team will follow up with next steps and wholesale information.
          </p>
          <a href={inquiryHref} className="aura-button mt-9 inline-flex">
            Start a wholesale inquiry
          </a>
          <p className="mt-5 text-sm text-aura-forest/55">support@getaurapatch.com</p>
        </div>
      </section>
    </main>
  )
}
