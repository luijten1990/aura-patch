const faqs = [
  [
    "Where do I put the patch?",
    "Choose clean, dry, relatively hair-free skin on the upper arm or stomach. Rotate the site each day. Avoid lotions or oils where the patch will sit.",
  ],
  [
    "How long do I wear one?",
    "Up to 12 hours. Remove it, and apply a new one the next day.",
  ],
  [
    "Can I wear it in the shower?",
    "Showering with the patch on is not ideal. Apply it after you shower, once you have dried off.",
  ],
  [
    "What if my skin is sensitive?",
    "Use it only on healthy, unbroken skin. Stop if you notice irritation, and talk with a healthcare provider if it continues.",
  ],
  [
    "Who should check with a doctor first?",
    "Anyone who is pregnant, nursing, taking medication, or managing a health condition should check with a healthcare provider before using a new supplement.",
  ],
  [
    "What's in it?",
    "19 ingredients, including vitamins, minerals, probiotics, botanicals, adaptogens, and amino acids. Amounts per patch are printed on the pouch. This page does not add a separate dose panel.",
  ],
  [
    "What's the subscription like?",
    "A new pouch is billed and shipped each month. You can cancel anytime from your account.",
  ],
  [
    "Do you ship internationally?",
    "Aura Patch currently ships in the United States.",
  ],
  [
    "What's your return policy?",
    "Return terms are shown at checkout.",
  ],
]

const AuraProductFaq = () => (
  <section id="product-faq" className="content-container py-16 small:py-24">
    <p className="aura-eyebrow">Good to know</p>
    <h2 className="aura-display mt-4 text-[42px] leading-none small:text-[56px]">
      Product questions
    </h2>
    <div className="mt-8 divide-y divide-aura-forest/20 border-y border-aura-forest/20">
      {faqs.map(([question, answer]) => (
        <details key={question} className="group py-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-8 text-[18px]">
            {question}
            <span className="text-aura-gold transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="max-w-[680px] pt-4 text-[16px] leading-7 text-aura-forest/70">
            {answer}
          </p>
        </details>
      ))}
    </div>
  </section>
)

export default AuraProductFaq
