import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import IngredientsShowcase from "@modules/home/components/ingredients-showcase"
import ContactForm from "@modules/home/components/contact-form"
import NewsletterSignup from "@modules/home/components/newsletter-signup"
import Image from "next/image"

type HeroProps = {
  product?: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

const benefits = [
  ["01", "Transdermal Delivery", "A convenient format designed to fit seamlessly into your daily wellness routine."],
  ["02", "Easy to Use", "Peel, apply, and continue with your day. No pills, powders, or complicated routines."],
  ["03", "Portable Wellness", "Take your daily ritual wherever the day takes you, with one discreet patch."],
  ["04", "Simple Routine", "One elegant daily step, created for modern life and effortless consistency."],
]

const faqs = [
  ["How do I use Aura Patch?", "Remove one patch from its protective backing and apply it to clean, dry skin according to the product instructions."],
  ["Where should I apply it?", "Choose a clean, dry, relatively hair-free area of healthy, unbroken skin. Avoid lotions or oils where the patch will be placed, as they can affect adhesion."],
  ["How long can I wear it?", "Aura is designed for comfortable wear for up to 12 hours. Always follow the directions on your product packaging and remove the patch sooner if irritation occurs."],
  ["How many patches are included?", "Each pouch is designed as a 30-day supply, with one patch for each day of your routine."],
  ["Can I take Aura Patch with me?", "Yes. The lightweight pouch and individually protected patches make it easy to keep your routine with you."],
]

const Hero = ({ product }: HeroProps) => {
  const productHref = product?.handle ? `/products/${product.handle}` : "/store"
  const price = product ? getProductPrice({ product }).cheapestPrice : null

  return (
    <div className="bg-aura-cream text-aura-forest">
      <section className="aura-shell grid items-center gap-10 py-14 small:grid-cols-[1fr_0.8fr] small:py-16">
        <div className="max-w-[600px]">
          <p className="aura-eyebrow">The next generation of wellness</p>
          <h1 className="aura-display mt-6 text-[50px] leading-[1.04] small:text-[68px]">
            19 Ingredients.<br />One Daily Patch.
          </h1>
          <p className="mt-7 max-w-[540px] text-[16px] leading-7 text-aura-forest/80">
            A smarter, simpler way to support your daily wellness routine. Thoughtfully formulated and delivered in one beautifully easy daily ritual.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <LocalizedClientLink href={productHref} className="aura-button">Shop Aura Patch</LocalizedClientLink>
            <a href="#how-it-works" className="aura-button-outline">See how it works</a>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[460px]">
          <div className="absolute inset-[10%] rounded-[48%] bg-aura-sage/70 blur-3xl" />
            <LocalizedClientLink href={productHref} className="group relative block">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/images/aura-patch-front-original.webp"
                  alt="Aura Patch 30-day pouch"
                  fill
                  priority
                  className="object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-[1.015]"
                  sizes="(max-width: 1024px) 90vw, 460px"
                />
              </div>
              <div className="mt-2 flex items-baseline justify-between gap-5 border-t border-aura-forest/20 pt-4 text-[14px]">
                <span>{product?.title || "Aura Patch — 30-day supply"}</span>
                {price && <span className="font-semibold">{price.calculated_price}</span>}
              </div>
            </LocalizedClientLink>
        </div>
      </section>

      <section id="science" className="border-y border-aura-forest/10 py-16 small:py-20">
        <div className="aura-shell">
          <p className="aura-eyebrow">Wellness, reimagined</p>
          <h2 className="aura-display mt-5 max-w-[1000px] text-[44px] leading-none small:text-[60px]">A simpler path to daily wellness.</h2>
          <div className="mt-12 grid gap-5 small:grid-cols-4">
            {benefits.map(([number, title, copy]) => (
              <article key={title} className="aura-feature-card">
                <span className="text-xs tracking-[0.2em] text-aura-gold">{number}</span>
                <h3 className="aura-display mt-12 text-[34px] leading-tight">{title}</h3>
                <p className="mt-8 text-[16px] leading-7 text-aura-forest/75">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="aura-shell py-16 small:py-24">
        <div className="grid gap-16 small:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="aura-eyebrow">Your routine, simplified</p>
            <h2 className="aura-display mt-6 text-[48px] leading-none small:text-[64px]">Peel. Apply. Go.</h2>
          </div>
          <p className="self-end text-[19px] leading-8 text-aura-forest/75">Wellness should fit your life—not take it over. Aura Patch turns a long supplement routine into one calm, considered daily moment.</p>
        </div>
        <div className="mt-16 grid gap-12 small:grid-cols-[1.05fr_0.95fr] small:items-stretch">
          <ol className="divide-y divide-aura-forest/20 border-y border-aura-forest/20">
            {[["01", "Peel", "Remove one patch from its protective backing."], ["02", "Apply", "Adhere to clean, dry skin as directed."], ["03", "Go", "Continue with your day and your routine."]].map(([number, title, copy]) => (
              <li key={number} className="grid gap-5 py-8 xsmall:grid-cols-[42px_150px_1fr] xsmall:items-baseline small:py-10">
                <span className="text-sm text-aura-gold">{number}</span>
                <h3 className="aura-display text-[42px] leading-none">{title}</h3>
                <p className="max-w-[320px] text-[16px] leading-7 text-aura-forest/75">{copy}</p>
              </li>
            ))}
          </ol>
          <div className="relative min-h-[480px] overflow-hidden rounded-[2rem] small:min-h-[580px]">
            <Image
              src="/images/aura-patch-how-it-works.webp"
              alt="Woman applying an Aura Patch to her upper arm"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
          </div>
        </div>
      </section>

      <section className="bg-aura-forest py-16 text-aura-cream small:py-24">
        <div className="aura-shell">
          <div className="grid gap-10 small:grid-cols-[0.72fr_1.28fr] small:items-end">
            <div>
              <p className="aura-eyebrow text-aura-gold">Made with intention</p>
              <h2 className="aura-display mt-6 text-[48px] leading-none small:text-[68px]">
                The Anatomy<br />of Aura.
              </h2>
            </div>
            <p className="max-w-[600px] text-[18px] leading-8 text-aura-cream/72 small:justify-self-end">
              Three considered layers come together in one discreet daily patch—
              created for comfortable, consistent wear.
            </p>
          </div>

          <div className="mt-14 overflow-hidden rounded-[2rem] bg-[#f5efe4] text-aura-forest">
            <div className="relative">
              <div className="relative aspect-[4/3] min-h-[390px] small:aspect-[16/9] small:min-h-[620px]">
                <Image
                  src="/images/aura-patch-anatomy.webp"
                  alt="Exploded view showing the three round layers of an Aura Patch"
                  fill
                  className="object-cover object-center small:object-contain"
                  sizes="100vw"
                />

                <div className="absolute right-[5%] top-[13%] hidden w-[250px] small:block">
                  <span className="mb-3 block h-px w-24 bg-aura-gold" />
                  <h3 className="aura-display text-[28px] leading-none">Protective outer layer</h3>
                  <p className="mt-3 text-[14px] leading-6 text-aura-forest/70">
                    Helps keep the ingredient matrix stable and effective.
                  </p>
                </div>

                <div className="absolute left-[5%] top-[45%] hidden w-[230px] text-right small:block">
                  <span className="mb-3 ml-auto block h-px w-24 bg-aura-gold" />
                  <h3 className="aura-display text-[28px] leading-none">Ingredient matrix</h3>
                  <p className="mt-3 text-[14px] leading-6 text-aura-forest/70">
                    Holds Aura’s carefully formulated wellness ingredients.
                  </p>
                </div>

                <div className="absolute bottom-[11%] right-[6%] hidden w-[260px] small:block">
                  <span className="mb-3 block h-px w-24 bg-aura-gold" />
                  <h3 className="aura-display text-[28px] leading-none">Medical-grade adhesive</h3>
                  <p className="mt-3 text-[14px] leading-6 text-aura-forest/70">
                    Designed to stay securely in place for up to 12 hours.
                  </p>
                </div>
              </div>
              <ol className="divide-y divide-aura-forest/15 px-7 py-4 small:hidden">
                {[
                  ["01", "Protective outer layer", "Helps keep the ingredient matrix stable and effective."],
                  ["02", "Ingredient matrix", "Holds Aura’s carefully formulated wellness ingredients."],
                  ["03", "Medical-grade adhesive", "Designed to stay securely in place for up to 12 hours."],
                ].map(([number, title, copy]) => (
                  <li key={number} className="py-7">
                    <div className="flex items-baseline justify-between gap-5">
                      <h3 className="aura-display text-[29px] leading-tight">{title}</h3>
                      <span className="text-xs tracking-[0.18em] text-aura-gold">{number}</span>
                    </div>
                    <p className="mt-3 max-w-[360px] text-[15px] leading-6 text-aura-forest/70">
                      {copy}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="aura-shell py-16 small:py-24">
        <div className="grid gap-10 small:grid-cols-[0.75fr_1.25fr] small:items-end">
          <div>
            <p className="aura-eyebrow text-aura-gold">A considered topical format</p>
            <h2 className="aura-display mt-6 text-[48px] leading-none small:text-[64px]">
              Designed around<br />skin contact.
            </h2>
          </div>
          <p className="max-w-[620px] text-[18px] leading-8 text-aura-forest/72 small:justify-self-end">
            Aura uses a matrix-style construction that keeps the formulation in
            close contact with the skin while the patch is worn—without water,
            mixing, or another step in your supplement routine.
          </p>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] bg-aura-forest/15 small:grid-cols-2 medium:grid-cols-4">
          {[
            ["01", "Prepare", "Choose healthy, relatively hair-free skin. Clean and dry the area completely, without lotion or oil."],
            ["02", "Place", "Peel away the backing and position the patch directly on the prepared area."],
            ["03", "Press", "Apply firm, even pressure across the patch to help the medical-grade adhesive make secure contact."],
            ["04", "Wear", "Continue with your day for up to 12 hours, following the package directions. Remove gently after use."],
          ].map(([number, title, copy]) => (
            <article key={number} className="bg-aura-cream px-7 py-9 small:px-8 small:py-11">
              <span className="text-xs tracking-[0.2em] text-aura-gold">{number}</span>
              <h3 className="aura-display mt-12 text-[36px] leading-none">{title}</h3>
              <p className="mt-6 text-[15px] leading-7 text-aura-forest/70">{copy}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-5 border-t border-aura-forest/15 pt-7 text-[14px] leading-6 text-aura-forest/60 small:flex-row small:items-start small:justify-between">
          <p className="max-w-[720px]">
            The patch format is designed to hold the formulation against the skin.
            Absorption and performance depend on the finished formulation and
            should not be inferred from general ingredient research alone.
          </p>
          <p className="shrink-0">For external use only · Single use</p>
        </div>
      </section>

      <IngredientsShowcase />

      <section className="aura-shell py-16 small:py-24">
        <div className="flex flex-col gap-8 small:flex-row small:items-end small:justify-between">
          <div>
            <p className="aura-eyebrow text-aura-gold">The Aura collection</p>
            <h2 className="aura-display mt-6 max-w-[760px] text-[50px] leading-none small:text-[64px]">
              More ways to meet your day.
            </h2>
          </div>
          <p className="max-w-[430px] text-[17px] leading-7 text-aura-forest/70">
            Two new daily rituals are taking shape. Thoughtfully formulated,
            beautifully simple, and coming soon.
          </p>
        </div>

        <div className="mt-14 grid gap-6 small:grid-cols-2">
          {[
            {
              name: "Aura Recover",
              description: "A considered reset for replenishment and restoration.",
              image: "/images/aura-restore-coming-soon.webp",
              background: "bg-[#e4e8d8]",
            },
            {
              name: "Aura Energy",
              description: "A brighter ritual created for momentum and focus.",
              image: "/images/aura-energy-coming-soon.webp",
              background: "bg-[#f3dfaa]",
            },
          ].map((item) => (
            <article key={item.name} className={`${item.background} overflow-hidden rounded-[2rem]`}>
              <div className="relative aspect-[4/3] small:aspect-[5/4]">
                <span className="absolute left-6 top-6 z-10 rounded-full bg-aura-cream/90 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-aura-forest backdrop-blur small:left-8 small:top-8">
                  Coming soon
                </span>
                <Image
                  src={item.image}
                  alt={`${item.name} pouch, coming soon`}
                  fill
                  className="object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="flex flex-col gap-3 px-7 py-7 small:flex-row small:items-end small:justify-between small:px-9 small:py-9">
                <h3 className="aura-display text-[38px] leading-none">{item.name}</h3>
                <p className="max-w-[280px] text-[14px] leading-6 text-aura-forest/70 small:text-right">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="faq" className="aura-shell py-16 small:py-24">
        <div className="grid gap-16 small:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="aura-eyebrow">Good to know</p>
            <h2 className="aura-display mt-6 text-[50px] leading-none small:text-[62px]">Frequently asked.</h2>
          </div>
          <div className="divide-y divide-aura-forest/20 border-y border-aura-forest/20">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group py-7">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-8 text-[20px]">{question}<span className="text-aura-gold transition-transform group-open:rotate-45">+</span></summary>
                <p className="max-w-[650px] pt-5 text-[16px] leading-7 text-aura-forest/70">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="aura-shell pb-20 small:pb-32">
        <div className="grid gap-10 rounded-[2rem] bg-aura-sage px-7 py-12 small:grid-cols-[0.78fr_1.22fr] small:items-center small:px-12 small:py-16">
          <div>
            <p className="aura-eyebrow">Contact Aura</p>
            <h2 className="aura-display mt-6 text-[46px] leading-none small:text-[62px]">We’d love to hear from you.</h2>
            <p className="mt-6 max-w-[430px] text-[15px] leading-7 text-aura-forest/70">Questions about Aura, your order, wholesale, partnerships, or investing? Send us a note and we’ll point it to the right place.</p>
            <LocalizedClientLink href={productHref} className="mt-8 inline-flex text-[11px] font-bold uppercase tracking-[0.16em] text-aura-forest underline decoration-aura-gold decoration-2 underline-offset-8">Explore Aura Patch</LocalizedClientLink>
          </div>
          <div className="flex flex-col gap-6">
            <ContactForm />
            <NewsletterSignup />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero
