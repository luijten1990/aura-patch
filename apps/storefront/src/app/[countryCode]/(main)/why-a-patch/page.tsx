import type { Metadata } from "next"
import Image from "next/image"
import { auraCore } from "@lib/data/aura-collection"
import { getBaseURL } from "@lib/util/env"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import styles from "./page.module.css"

const title = "Why a patch? 5 reasons to rethink your daily ritual"
const description =
  "Explore the practical appeal of Aura Core: one daily patch, 19 ingredients and a 30-day pouch. Understand the format, the formula and what to know before you choose."

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params
  const url = `${getBaseURL()}/${countryCode}/why-a-patch`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "Aura Patch",
      images: [{ url: auraCore.image, alt: auraCore.imageAlt }],
    },
    twitter: { card: "summary_large_image", title, description, images: [auraCore.image] },
  }
}

const reasons = [
  { id: "one-step", label: "One daily step" },
  { id: "nothing-to-swallow", label: "Nothing to swallow" },
  { id: "fits-your-day", label: "Fits your day" },
  { id: "one-pouch", label: "One portable pouch" },
  { id: "know-your-formula", label: "Know your formula" },
]

function ProductLink({ children }: { children: React.ReactNode }) {
  return (
    <LocalizedClientLink href={auraCore.href} className={`aura-button ${styles.cta}`}>
      {children}<span aria-hidden="true"> →</span>
    </LocalizedClientLink>
  )
}

export default function WhyAPatchPage() {
  return (
    <article className={styles.article} aria-labelledby="article-title">
      <header className={styles.hero}>
        <div>
          <p className="aura-eyebrow">The Aura journal · A guide by Aura Patch</p>
          <h1 id="article-title" className={`aura-display ${styles.title}`}>
            Your daily ritual.<br /><em>One less thing to juggle.</em>
          </h1>
          <p className={styles.dek}>
            Why a patch? Five reasons to consider a simpler format—and what to know before you choose one.
          </p>
          <p className={styles.intro}>
            Some routines ask for a glass of water, a scoop and a moment you don’t have.
            Aura Core starts with a different daily step: peel, apply, go.
          </p>
          <a href="#five-reasons" className={styles.readLink}>Explore the five reasons <span aria-hidden="true">↓</span></a>
        </div>
        <figure className={styles.productFigure}>
          <div className={styles.productImage}>
            <Image src={auraCore.image} alt={auraCore.imageAlt} fill priority sizes="(max-width: 900px) 90vw, 480px" className={styles.contain} />
          </div>
          <figcaption>Aura Core · 19 ingredients · 30-day pouch</figcaption>
        </figure>
      </header>

      <div className={styles.facts} aria-label="Aura Core at a glance">
        <span>One patch a day</span><span>Nothing to mix or swallow</span><span>Wear for up to 12 hours</span>
      </div>

      <div className={styles.editorial}>
        <aside className={styles.contents} aria-label="Article navigation">
          <p className="aura-eyebrow">In this guide</p>
          <nav aria-label="Five reasons">
            <ol>{reasons.map((reason, index) => (
              <li key={reason.id}><a href={`#${reason.id}`}><span>0{index + 1}</span>{reason.label}</a></li>
            ))}</ol>
          </nav>
          <a href="#before-you-choose" className={styles.textLink}>Before you choose</a>
        </aside>

        <div className={styles.body}>
          <section id="five-reasons" className={styles.opening}>
            <p className="aura-eyebrow">A small change in format</p>
            <h2 className="aura-display">Start with the routine, not a bigger promise.</h2>
            <p>
              A daily ritual should make sense on an ordinary morning. The appeal of a patch is practical:
              it is a step you can take before getting on with your day. Here are five things that make
              the format worth a closer look.
            </p>
            <p className={styles.note}>
              Ease of use is not proof of absorption or effectiveness. Aura Core should not be treated
              as a replacement for prescribed treatment or a supplement recommended by your clinician.
            </p>
          </section>

          <section id="one-step" className={styles.reason}>
            <p className="aura-eyebrow">Reason 01</p>
            <h2 className="aura-display">Make room for one simple step.</h2>
            <p>
              With Aura Core, the routine is easy to describe: remove a patch from its backing,
              apply it to clean, dry skin as directed, and continue with your day.
              No scoop to measure. No drink to prepare.
            </p>
            <p>
              Pairing it with a familiar part of your morning gives the ritual a natural place.
              The aim is a routine that fits your life, rather than another task to organise.
            </p>
            <ol className={styles.steps} aria-label="How to use Aura Core">
              <li><strong>Peel</strong><span>Remove the protective backing.</span></li>
              <li><strong>Apply</strong><span>Place on clean, dry skin as directed.</span></li>
              <li><strong>Go</strong><span>Carry on with your day.</span></li>
            </ol>
          </section>

          <section id="nothing-to-swallow" className={styles.reason}>
            <p className="aura-eyebrow">Reason 02</p>
            <h2 className="aura-display">Nothing to swallow. Nothing to mix.</h2>
            <p>
              If swallowing capsules or preparing powders feels like a chore, a wearable format
              offers a different experience. You apply Aura Core externally instead of taking it by mouth.
            </p>
            <p>
              That is a difference in how you use it—not a claim that it delivers the same nutrients
              as a pill, absorbs better or avoids side effects. Choose the format with clear expectations.
            </p>
          </section>

          <aside className={styles.midCta} aria-label="Explore Aura Core">
            <p className="aura-eyebrow">Meet your next daily ritual</p>
            <h2 className="aura-display">Curious about Core?</h2>
            <p>See the product details and available purchase options before you decide.</p>
            <ProductLink>Explore Aura Core</ProductLink>
          </aside>

          <section id="fits-your-day" className={styles.reason}>
            <p className="aura-eyebrow">Reason 03</p>
            <h2 className="aura-display">Wear it while life happens.</h2>
            <p>
              Aura Core is designed to be worn for up to 12 hours. There is no second preparation
              step once it is applied. Follow the packaging directions for placement, wear and removal.
            </p>
            <p>
              Apply only to healthy, unbroken skin and remove sooner if irritation occurs.
              The wear time describes the routine; it is not a promise of 12 hours of nutrient delivery.
            </p>
          </section>

          <section id="one-pouch" className={styles.reason}>
            <p className="aura-eyebrow">Reason 04</p>
            <h2 className="aura-display">A month of your ritual, in one pouch.</h2>
            <p>
              Core comes as a 30-day pouch, with one patch for each day. Keep it with your morning
              essentials, or pack it when you travel. The same peel-and-apply step goes with you.
            </p>
            <p>
              There is no shaker or measuring spoon to bring along. Keep the pouch stored as directed
              on the packaging wherever your routine takes you.
            </p>
          </section>

          <section id="know-your-formula" className={styles.reason}>
            <p className="aura-eyebrow">Reason 05</p>
            <h2 className="aura-display">Get to know what you’re choosing.</h2>
            <p>
              Aura Core brings 19 listed ingredients into one daily patch. The formula includes
              vitamins, botanicals and blends, including Vitamin C, Organic Ashwagandha and a BCAA + EAA Blend.
            </p>
            <p>
              An ingredient list tells you what is in the formula. It does not establish how much
              reaches your body through the skin, or what results the finished patch will produce.
              Research on an ingredient taken by mouth cannot answer those questions for Aura Core.
            </p>
            <details className={styles.ingredients}>
              <summary>Explore all 19 listed ingredients <span aria-hidden="true">+</span></summary>
              <ul>{auraCore.ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}</ul>
              <p>Refer to the product packaging for the full label and directions.</p>
            </details>
          </section>

          <section className={styles.designNote} aria-labelledby="design-heading">
            <p className="aura-eyebrow">The thinking behind the format</p>
            <h2 id="design-heading" className="aura-display">A considered design. A simple routine.</h2>
            <p>
              Aura’s approach brings together an ingredient matrix, a protective outer layer and
              an adhesive layer in a wearable patch. The matrix holds the formulation against
              the skin while the patch is worn.
            </p>
            <p>
              The practical idea is straightforward: put a daily ritual into a format that needs
              no water or mixing. The construction explains how you wear it; it does not, by itself,
              demonstrate absorption or a health benefit.
            </p>
          </section>

          <section id="before-you-choose" className={styles.reason}>
            <p className="aura-eyebrow">A clear choice starts with clear information</p>
            <h2 className="aura-display">Before you choose a patch.</h2>
            <p>
              Look at the formula, directions and purchase terms together. A testimonial is someone’s
              experience, not evidence that a patch will deliver the same result for you.
            </p>
            <div className={styles.faqs}>
              <details><summary>Does a patch replace my supplements?</summary><p>No equivalence is established here. Do not replace a prescribed treatment or clinician-recommended supplement on the basis of this guide.</p></details>
              <details><summary>Does this guide show that Aura Core is clinically proven?</summary><p>No. This guide explains the format and product details. It does not present a clinical trial of Aura Core or establish nutrient absorption through the skin.</p></details>
              <details><summary>Where can I see the price and purchase options?</summary><p>The Aura Core product page shows the available options for your region. Review the price and any recurring subscription terms there before adding to your cart.</p></details>
            </div>
          </section>

          <section className={styles.finalCta} aria-labelledby="next-step">
            <p className="aura-eyebrow">Your next step</p>
            <h2 id="next-step" className="aura-display">Less preparation.<br />A little more simplicity.</h2>
            <p>If the format fits your day, take a closer look at Aura Core.</p>
            <ProductLink>See Aura Core &amp; purchase options</ProductLink>
            <p className={styles.caption}>19 ingredients · One daily patch · 30-day pouch</p>
          </section>
          <p className={styles.disclosure}>
            Written by Aura Patch about its own product. For external use only. Follow the product
            label. Aura Core is not intended to diagnose, treat, cure or prevent any disease.
          </p>
        </div>
      </div>

      <div className={styles.sticky} aria-label="Aura Core product link">
        <div><strong>Aura Core</strong><span>Discover the 30-day pouch</span></div>
        <ProductLink>View Core</ProductLink>
      </div>
    </article>
  )
}
