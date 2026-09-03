import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Aura Patch",
  description: "Terms governing use of the Aura Patch website and store.",
}

const sections = [
  {
    title: "Using this website",
    copy: [
      "These Terms of Service govern your use of the Aura Patch website, store, accounts, content, and related services. By visiting the website or placing an order, you agree to these terms and our Privacy Policy. If you do not agree, please do not use the website.",
      "You must be at least 18 years old, or the age of legal majority where you live, to make a purchase. You agree to provide information that is accurate, current, and complete and to keep your account credentials secure.",
    ],
  },
  {
    title: "Products and orders",
    copy: [
      "Product descriptions, images, availability, and prices may change without notice. We make reasonable efforts to present information accurately, but screen settings and photography can affect how colors and packaging appear.",
      "Submitting an order is an offer to purchase. We may accept, decline, limit, or cancel an order, including because of availability, suspected fraud, pricing errors, shipping restrictions, or other operational reasons. If we cancel a paid order, we will refund the affected amount to the original payment method.",
      "You are responsible for confirming that purchasing, receiving, and using our products is lawful in your location. Applicable shipping, return, refund, and promotion terms shown during checkout or elsewhere on the website form part of these terms.",
    ],
  },
  {
    title: "Prices and payment",
    copy: [
      "Prices are displayed in the currency shown on the website and may exclude taxes, duties, shipping, or other charges unless stated otherwise. You authorize us and our payment providers to charge the payment method you select for the total displayed at checkout. Prices and promotions may be changed or withdrawn at any time, but changes will not affect an order we have already accepted except where required to correct an obvious error.",
    ],
  },
  {
    title: "Health and wellness information",
    copy: [
      "Aura Patch products and website content are intended for general wellness and informational purposes only. They are not medical advice and are not intended to diagnose, treat, cure, or prevent any disease. Statements about our products have not been evaluated by the U.S. Food and Drug Administration unless expressly stated otherwise.",
      "Consult a qualified healthcare professional before use if you are pregnant or nursing, take medication, have a medical condition, have known allergies, or have questions about whether a product is appropriate for you. Stop use and seek appropriate advice if you experience irritation or another adverse reaction. Never delay or disregard professional medical advice because of information on this website.",
    ],
  },
  {
    title: "Acceptable use",
    copy: [
      "You may use the website only for lawful, personal purposes. You must not misuse the website, attempt unauthorized access, interfere with its operation, introduce harmful code, scrape or copy content at scale, impersonate another person, submit false or unlawful material, or use the website in a way that infringes the rights of Aura Patch or anyone else.",
      "We may suspend or terminate access when we reasonably believe these terms have been violated or when necessary to protect the website, our customers, or others.",
    ],
  },
  {
    title: "Intellectual property",
    copy: [
      "The Aura Patch name, logos, product names, designs, photographs, text, graphics, and other original website content are owned by or licensed to Aura Patch and are protected by applicable intellectual-property laws. No ownership rights are transferred to you. You may not reproduce, distribute, modify, sell, or commercially exploit this material without prior written permission, except where the law expressly allows it.",
    ],
  },
  {
    title: "Third-party services",
    copy: [
      "The website may use or link to services operated by third parties, such as payment, shipping, social-media, or analytics providers. We do not control their websites or practices, and your use of them may be governed by their own terms and privacy policies. Links are provided for convenience and do not necessarily imply endorsement.",
    ],
  },
  {
    title: "Service availability and disclaimers",
    copy: [
      "We may change, pause, or discontinue any part of the website or store. We aim to keep the service accurate and available, but cannot promise that it will always be uninterrupted, secure, or error-free. To the fullest extent permitted by law, the website and its content are provided on an “as available” basis without warranties not expressly stated in these terms. Nothing in these terms excludes warranties or rights that cannot lawfully be excluded.",
    ],
  },
  {
    title: "Limitation of liability",
    copy: [
      "To the fullest extent permitted by law, Aura Patch will not be liable for indirect, incidental, special, punitive, or consequential loss arising from use of, or inability to use, the website or its content. Our total liability for a claim relating to a product purchase will not exceed the amount paid for the product giving rise to the claim. These limitations do not apply where liability cannot legally be limited, including for fraud or willful misconduct.",
    ],
  },
  {
    title: "Changes, governing law, and contact",
    copy: [
      "We may update these terms to reflect changes to our services, practices, or legal obligations. The revised terms become effective when posted, and the date below will be updated. Your continued use of the website after that date means you accept the revised terms.",
      "These terms are governed by the laws applicable to the Aura Patch business entity identified in our order or company information, without limiting any mandatory consumer protections available where you live. If one provision is found unenforceable, the remaining provisions will continue in effect.",
      "Questions about these terms can be sent through the Contact section of this website.",
    ],
  },
]

export default function TermsPage() {
  return (
    <main className="bg-aura-cream text-aura-forest">
      <div className="aura-shell py-16 small:py-24">
        <p className="aura-eyebrow text-aura-gold">Using Aura Patch</p>
        <h1 className="aura-display mt-5 text-[52px] leading-none small:text-[76px]">
          Terms of Service
        </h1>
        <p className="mt-6 text-sm text-aura-forest/55">
          Last updated September 3, 2026
        </p>
        <p className="mt-10 max-w-[780px] text-[17px] leading-8 text-aura-forest/75">
          These terms explain the rules that apply when you visit Aura Patch,
          create an account, or purchase our wellness products.
        </p>
        <div className="mt-14 max-w-[920px] divide-y divide-aura-forest/15 border-y border-aura-forest/15">
          {sections.map(({ title, copy }) => (
            <section
              key={title}
              className="grid gap-4 py-8 small:grid-cols-[0.55fr_1.45fr]"
            >
              <h2 className="aura-display text-[28px] leading-tight">
                {title}
              </h2>
              <div className="space-y-4 text-[15px] leading-7 text-aura-forest/72">
                {copy.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
