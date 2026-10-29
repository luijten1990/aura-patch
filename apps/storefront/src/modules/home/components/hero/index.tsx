import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import IngredientsShowcase from "@modules/home/components/ingredients-showcase"
import CollectionChooser from "@modules/home/components/collection-chooser"
import ContactForm from "@modules/home/components/contact-form"
import NewsletterSignup from "@modules/home/components/newsletter-signup"
import Image from "next/image"
import CustomerReviews from "@modules/products/components/customer-reviews"

type HeroProps = {
  product?: HttpTypes.StoreProduct
  region?: HttpTypes.StoreRegion
}

const benefits = [
  ["01", "Worn on the skin", "Apply one patch to clean, dry skin. The ingredient matrix stays against the skin while you wear it, for up to 12 hours."],
  ["02", "Nothing to swallow", "No capsules to line up, no scoop, and no glass of water. Peel, apply, and continue with your day."],
  ["03", "Your daily defense", "Aura Patch is meant to be worn every day. Vitamin C, zinc, and vitamin A are included for normal immune function. It does not treat or cure any infection or disease."],
  ["04", "A 30-day pouch", "One patch for each day. Pack the pouch when you travel. There is no shaker to bring along."],
]

const BenefitIllustration = ({ number }: { number: string }) => (
  <svg
    viewBox="0 0 120 100"
    className="h-[100px] w-[120px] text-aura-forest"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="60" cy="50" r="40" className="fill-aura-cream/60" stroke="none" />
    {number === "01" && (
      <>
        <circle cx="56" cy="46" r="19" />
        <path d="M56 16v-5m0 70v-5M26 46h-5m70 0h-5M35 25l-4-4m50 50-4-4M35 67l-4 4m50-50-4 4" className="stroke-aura-gold" />
        <path d="M56 34v12l8 5" />
        <path d="M78 37a29 29 0 0 1-20 38m0 0 5-7m-5 7 9 2" className="stroke-aura-gold" />
      </>
    )}
    {number === "02" && (
      <>
        <path d="M34 23h39a9 9 0 0 1 9 9v32L61 85H34a9 9 0 0 1-9-9V32a9 9 0 0 1 9-9Z" />
        <path d="M61 85V73a9 9 0 0 1 9-9h12" className="stroke-aura-gold" />
        <circle cx="53" cy="49" r="15" className="stroke-aura-gold" />
        <path d="m47 49 4 4 8-9M91 22v10m-5-5h10" />
      </>
    )}
    {number === "03" && (
      <>
        <rect x="26" y="32" width="54" height="49" rx="8" />
        <path d="M42 32v-8a11 11 0 0 1 22 0v8M27 44h52" />
        <circle cx="53" cy="61" r="10" className="stroke-aura-gold" />
        <path d="M53 55v12m-6-6h12" className="stroke-aura-gold" />
        <rect x="76" y="53" width="20" height="29" rx="5" className="fill-aura-mint stroke-aura-gold" transform="rotate(12 86 67)" />
      </>
    )}
    {number === "04" && (
      <>
        <rect x="28" y="25" width="64" height="56" rx="8" />
        <path d="M28 41h64M44 18v14m32-14v14" />
        <circle cx="60" cy="61" r="13" className="stroke-aura-gold" />
        <path d="m54 61 4 4 9-9" className="stroke-aura-gold" />
      </>
    )}
  </svg>
)

const faqs = [
  ["What is Aura Patch for?", "Aura Patch is your daily defense. Wear it every day. Vitamin C, zinc, and vitamin A are included for their established roles in normal immune function. It does not treat or cure any infection or disease."],
  ["How do I use Aura Patch?", "Remove one patch from its protective backing and apply it to clean, dry skin according to the product instructions. Aura Patch is meant to be worn daily."],
  ["Where should I apply it?", "Choose a clean, dry, relatively hair-free area of healthy, unbroken skin, such as your upper arm or stomach. Avoid lotions or oils where the patch will be placed, as they can affect adhesion."],
  ["Can you shower with it?", "Showering with the patch on is not ideal. Apply it after you shower, once you have dried off."],
  ["How long can I wear it?", "Aura is designed for comfortable wear for up to 12 hours. Always follow the directions on your product packaging and remove the patch sooner if irritation occurs."],
  ["How many patches are included?", "Each pouch is designed as a 30-day supply, with one patch for each day of your routine."],
  ["Can I take Aura Patch with me?", "Yes. The lightweight pouch and individually protected patches make it easy to keep your routine with you."],
  ["How does the patch work?", "You wear it on the skin. There is nothing to swallow or mix. That describes the format. It is not a claim that the patch absorbs better than a pill, and this site does not publish amounts delivered through the skin. Amounts per patch are on the pouch label."],
  ["What if my skin reacts?", "Use it only on healthy, unbroken skin. Remove the patch if irritation occurs. If you know you react to an ingredient, read the ingredient list on the pouch before you try it."],
  ["What about shipping and returns?", "Shipping and taxes are calculated at checkout. Return terms shown at checkout apply to the order."],
]

const Hero = ({ product }: HeroProps) => {
  const productHref = product?.handle
    ? `/products/${product.handle}`
    : "/products/aura-patch"
  const price = product ? getProductPrice({ product }).cheapestPrice : null

  return (
    <div className="bg-aura-cream text-aura-forest">
      <section className="aura-shell grid items-center gap-10 py-14 small:grid-cols-2 small:py-16">
        <div className="max-w-[600px]">
          <p className="aura-eyebrow text-aura-gold">The Aura Collection</p>
          <span className="mt-5 aura-spark" />
          <h1 className="aura-display mt-6 text-[50px] leading-[1.04] small:text-[68px]">
            Next-generation<br />daily wellness.
          </h1>
          <p className="mt-7 max-w-[540px] text-[16px] leading-7 text-aura-forest/80">
            Aura Patch is your daily defense: one patch, worn on the skin every day, with vitamin C, zinc, and vitamin A for their roles in normal immune function. Nothing to mix or swallow. Wear for up to 12 hours. A 30-day pouch.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <LocalizedClientLink href={productHref} className="aura-button">Shop Aura Patch</LocalizedClientLink>
            <a href="#collection" className="aura-button-outline">Compare formulas</a>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[540px]">
            <LocalizedClientLink href={productHref} className="group relative block">
              <div className="relative aspect-[4/5] min-h-[420px] w-full overflow-hidden bg-aura-cream">
                <Image
                  src="/images/aura-patch-pouch-front.webp"
                  alt="Aura Patch 30-day daily wellness pouch with gold mandala"
                  fill
                  priority
                  quality={90}
                  className="object-contain transition-transform duration-700 group-hover:scale-[1.015]"
                  sizes="(max-width: 1024px) 90vw, 540px"
                />
              </div>
              <div className="mt-2 flex items-baseline justify-between gap-5 border-t border-aura-forest/20 pt-4 text-[14px]">
                <span>{product?.title || "Aura Patch — 30-day supply"}</span>
                <span className="font-semibold">{price?.calculated_price || "$49.99"}</span>
              </div>
            </LocalizedClientLink>
        </div>
      </section>

      <section id="science" className="border-y border-aura-forest/10 py-16 small:py-20">
        <div className="aura-shell">
          <p className="aura-eyebrow">Why a patch</p>
          <h2 className="aura-display mt-5 max-w-[1000px] text-[44px] leading-none small:text-[60px]">Worn on the skin. Nothing to swallow.</h2>
          <p className="mt-6 max-w-[760px] text-[17px] leading-8 text-aura-forest/75">
            Aura is a transdermal patch: the formula sits on clean, dry skin for up to 12 hours. That is a simpler daily step than capsules or a powder. It is not a claim that the patch absorbs better than a pill, and we do not publish a finished-formula absorption study here. Amounts per patch are printed on the pouch.
          </p>
          <LocalizedClientLink href="/why-a-patch" className="mt-6 inline-flex text-[11px] font-bold uppercase tracking-[0.16em] underline decoration-aura-gold decoration-2 underline-offset-8">
            Read why a patch
          </LocalizedClientLink>
          <div className="mt-10 grid gap-5 xsmall:grid-cols-2 medium:grid-cols-4">
            {benefits.map(([number, title, copy]) => (
              <article key={title} className="aura-feature-card">
                <div className="mb-6"><BenefitIllustration number={number} /></div>
                <h3 className="aura-display text-[32px] leading-tight xsmall:min-h-[80px]">{title}</h3>
                <p className="mt-4 text-[16px] leading-7 text-aura-forest/75">{copy}</p>
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
          <ol className="grid gap-5">
            {[["01", "Peel", "Remove one patch from its protective backing."], ["02", "Apply", "Adhere to clean, dry skin as directed."], ["03", "Go", "Continue with your day and your routine."]].map(([number, title, copy]) => (
              <li key={number} className="grid gap-5 rounded-[1.5rem] bg-aura-mint px-7 py-8 xsmall:grid-cols-[42px_150px_1fr] xsmall:items-baseline small:px-8 small:py-10">
                <span className="text-sm text-aura-gold">{number}</span>
                <h3 className="aura-display text-[42px] leading-none">{title}</h3>
                <p className="max-w-[320px] text-[16px] leading-7 text-aura-forest/75">{copy}</p>
              </li>
            ))}
          </ol>
          <div className="relative min-h-[480px] overflow-hidden rounded-[2rem] small:min-h-[580px]">
            <Image
              src="/images/aura-patch-how-it-works-current.webp"
              alt="Person applying a round gold AURA patch, with the Aura Patch pouch nearby"
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

          <div className="mt-14 overflow-hidden rounded-[2rem] bg-aura-cream text-aura-forest">
            <div className="relative">
              <Image
                src="/images/aura-anatomy-teal.webp"
                alt="Illustrative exploded view of an Aura patch: a branded protective outer layer, ingredient matrix, and adhesive layer. Not to scale."
                width={1672}
                height={941}
                className="h-auto w-full"
                sizes="(max-width: 1320px) 100vw, 1256px"
              />
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

      <CollectionChooser corePrice={price?.calculated_price} />

      <IngredientsShowcase />

      <section className="aura-shell pb-4 small:pb-8">
        <CustomerReviews />
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
        <div className="grid gap-10 rounded-[2rem] bg-aura-mint px-7 py-12 small:grid-cols-[0.78fr_1.22fr] small:items-center small:px-12 small:py-16">
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
