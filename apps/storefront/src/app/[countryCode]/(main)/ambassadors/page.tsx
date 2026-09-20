import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Ambassador Program | Aura Patch",
  description: "Share Aura Patch and earn 20% commission on eligible referred product sales.",
}

const steps = [
  ["01", "Apply", "Tell us about you, your audience, and why Aura feels like a natural fit."],
  ["02", "Share", "Approved ambassadors receive a personal referral link and memorable partner code."],
  ["03", "Earn", "Receive 20% commission on eligible net product sales attributed to you."],
]

const goodFits = [
  "Wellness and lifestyle creators",
  "Biohacking and performance communities",
  "Fitness, yoga, and recovery professionals",
  "Wellness practitioners and educators",
  "Beauty, spa, and self-care voices",
  "Customers who genuinely love the Aura ritual",
]

const opportunities = [
  ["Affiliate marketing", "Share a personal link and earn 20% commission on eligible attributed sales."],
  ["Gifting", "Experience Aura first through considered product seeding for aligned partners."],
  ["Discount codes", "Receive a memorable partner code your community can use and share easily."],
  ["Campaigns", "Join selected seasonal launches, education moments, and new-product stories."],
  ["Content creation", "Create original photo, video, written, or educational content in your own voice."],
  ["Usage rights", "Explore separately agreed paid usage when Aura would like to license your content."],
  ["Something more", "Pitch a thoughtful collaboration, event, studio partnership, or community idea."],
]

const campaignTiles = [
  ["/images/ambassador-daily-ritual.webp", "Wellness", "in real life"],
  ["/images/ambassador-apply.webp", "Share your ritual", "in your own voice"],
  ["/images/ambassador-create.webp", "Create with intention", "earn as you inspire"],
  ["/images/aura-core-front.webp", "Join the Aura community", "today"],
]

const programFaqs = [
  ["How much can I earn?", "Aura ambassadors earn 20% commission on eligible net product sales. Net product sales exclude discounts, taxes, shipping, returns, refunds, chargebacks, and cancelled or fraudulent orders."],
  ["How are referrals tracked?", "Approved ambassadors will receive a personal link and code. Link tracking will use a first-party attribution cookie, while the code provides a backup for social, podcast, and offline sharing. Final tracking details will be provided when the program opens."],
  ["When are commissions approved?", "Commissions remain pending until the applicable return and payment-review period has passed. Payout timing, thresholds, and available payout methods will be included in the final Ambassador Agreement."],
  ["Do subscription renewals earn commission?", "The initial eligible Subscribe & Save purchase can be attributed to an ambassador. Future renewals are not commissioned unless we notify you otherwise."],
  ["Can I make health claims?", "No ambassador may say that Aura diagnoses, treats, cures, or prevents disease, or make claims beyond Aura’s current approved materials. We will provide a concise messaging guide and approved creative."],
  ["Do I need to disclose the relationship?", "Yes. Ambassadors must clearly disclose their material relationship with Aura wherever they share the brand—for example, with an easy-to-see “ad,” “sponsored,” or “Aura Partner” disclosure placed with the endorsement."],
]

const applicationHref =
  "mailto:support@getaurapatch.com?subject=Aura%20Ambassador%20Application&body=Name%3A%0AEmail%3A%0ALocation%3A%0AWebsite%20or%20social%20profiles%3A%0AAudience%20size%3A%0AWhy%20Aura%20feels%20like%20a%20fit%3A%0A"

export default function AmbassadorsPage() {
  return (
    <main className="bg-aura-cream text-aura-forest">
      <section className="aura-shell grid gap-12 py-14 small:grid-cols-[0.92fr_1.08fr] small:items-center small:py-20">
        <div className="max-w-[650px]">
          <p className="aura-eyebrow text-aura-gold">The Aura Ambassador Program</p>
          <h1 className="aura-display mt-6 text-[54px] leading-[0.94] small:text-[76px]">
            Share a ritual you believe in.
          </h1>
          <p className="mt-7 max-w-[570px] text-[17px] leading-8 text-aura-forest/72">
            Help more people discover a beautifully simple approach to daily
            wellness—and earn 20% commission on eligible product sales you refer.
          </p>
          <a href={applicationHref} className="aura-button mt-9 inline-flex">
            Become an ambassador
          </a>
        </div>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[510px] overflow-hidden rounded-[2rem]">
          <Image
            src="/images/aura-patch-how-it-works.webp"
            alt="Woman wearing an Aura wellness patch"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 90vw, 510px"
          />
          <div className="absolute bottom-5 left-5 rounded-full bg-aura-cream/90 px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-aura-forest backdrop-blur">
            20% commission
          </div>
        </div>
      </section>

      <section className="aura-shell pb-16 small:pb-24">
        <div className="grid gap-4 small:grid-cols-4">
          {campaignTiles.map(([image, title, line], index) => (
            <article key={title} className="group relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-aura-sage">
              <Image src={image} alt="Aura ambassador lifestyle" fill className={`transition-transform duration-700 group-hover:scale-[1.025] ${index === 3 ? "object-contain p-8 mix-blend-multiply" : "object-cover"}`} sizes="(max-width: 1023px) 50vw, 25vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-aura-forest/90 via-aura-forest/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-aura-cream">
                <h2 className="aura-display text-[30px] leading-[0.95]">{title}</h2>
                <div className="mt-3 h-px w-10 bg-aura-gold" />
                <p className="mt-3 text-sm tracking-[0.04em] text-aura-cream/80">{line}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-aura-forest py-16 text-aura-cream small:py-24">
        <div className="aura-shell">
          <p className="aura-eyebrow text-aura-gold">How it works</p>
          <h2 className="aura-display mt-6 max-w-[850px] text-[48px] leading-none small:text-[64px]">
            Your voice. Your link. A considered partnership.
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] bg-aura-cream/15 small:grid-cols-3">
            {steps.map(([number, title, copy]) => (
              <article key={number} className="bg-aura-forest px-7 py-10 small:px-9 small:py-12">
                <span className="text-xs tracking-[0.2em] text-aura-gold">{number}</span>
                <h3 className="aura-display mt-12 text-[40px] leading-none">{title}</h3>
                <p className="mt-6 text-[15px] leading-7 text-aura-cream/65">{copy}</p>
              </article>
            ))}
          </div>
          <div className="mt-12 rounded-[2rem] border border-aura-cream/15 px-7 py-8 small:flex small:items-center small:justify-between small:gap-10 small:px-10">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-aura-gold">Your partner link</p>
              <p className="aura-display mt-3 break-all text-[27px] small:text-[34px]">getaurapatch.com/?ref=yourname</p>
            </div>
            <div className="mt-7 shrink-0 small:mt-0 small:text-right">
              <p className="text-xs uppercase tracking-[0.18em] text-aura-gold">Your partner code</p>
              <p className="aura-display mt-3 text-[34px]">YOURNAME</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-aura-sage py-16 small:py-24">
        <div className="aura-shell">
          <p className="aura-eyebrow text-aura-gold">Partnership opportunities</p>
          <h2 className="aura-display mt-6 max-w-[780px] text-[48px] leading-none small:text-[64px]">More than one way to create together.</h2>
          <div className="mt-12 grid gap-4 small:grid-cols-2">
            {opportunities.map(([title, copy], index) => (
              <article key={title} className={`rounded-[1.5rem] bg-aura-cream p-7 small:p-9 ${index === opportunities.length - 1 ? "small:col-span-2" : ""}`}>
                <span className="text-[10px] tracking-[0.2em] text-aura-gold">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="aura-display mt-6 text-[32px] leading-none">{title}</h3>
                <p className="mt-4 max-w-[620px] text-[14px] leading-6 text-aura-forest/68">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="aura-shell grid gap-12 py-16 small:grid-cols-[0.8fr_1.2fr] small:py-24">
        <div>
          <p className="aura-eyebrow text-aura-gold">Who we partner with</p>
          <h2 className="aura-display mt-6 text-[48px] leading-none small:text-[62px]">
            Genuine voices.<br />Thoughtful communities.
          </h2>
          <p className="mt-7 max-w-[480px] text-[16px] leading-7 text-aura-forest/70">
            Audience size matters less than trust, alignment, and the ability to
            communicate wellness responsibly.
          </p>
        </div>
        <ul className="divide-y divide-aura-forest/15 border-y border-aura-forest/15">
          {goodFits.map((item, index) => (
            <li key={item} className="flex items-center gap-7 py-6 text-[18px]">
              <span className="text-xs tracking-[0.16em] text-aura-gold">0{index + 1}</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="aura-shell pb-16 small:pb-24">
        <div className="grid gap-14 small:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="aura-eyebrow text-aura-gold">Program details</p>
            <h2 className="aura-display mt-6 text-[48px] leading-none small:text-[62px]">
              Good to know.
            </h2>
          </div>
          <div className="divide-y divide-aura-forest/20 border-y border-aura-forest/20">
            {programFaqs.map(([question, answer]) => (
              <details key={question} className="group py-7">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-8 text-[19px]">
                  {question}
                  <span className="text-aura-gold transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-[690px] pt-5 text-[15px] leading-7 text-aura-forest/70">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="aura-shell pb-20 small:pb-28">
        <div className="rounded-[2rem] bg-aura-sage px-7 py-14 text-center small:px-16 small:py-20">
          <p className="aura-eyebrow text-aura-gold">Grow with Aura</p>
          <h2 className="aura-display mx-auto mt-6 max-w-[880px] text-[48px] leading-none small:text-[68px]">
            Ready to share your Aura?
          </h2>
          <p className="mx-auto mt-6 max-w-[620px] text-[16px] leading-7 text-aura-forest/70">
            Introduce yourself, your community, and the kind of content you create.
            We’ll review your application and follow up with next steps.
          </p>
          <a href={applicationHref} className="aura-button mt-9 inline-flex">
            Apply to become an ambassador
          </a>
          <p className="mt-5 text-sm text-aura-forest/55">support@getaurapatch.com</p>
        </div>
      </section>
    </main>
  )
}
