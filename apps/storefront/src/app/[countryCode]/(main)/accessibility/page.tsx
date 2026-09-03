import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Accessibility | Aura Patch",
  description: "Aura Patch's commitment to an accessible online store.",
}

const sections = [
  {
    title: "Our commitment",
    copy: [
      "Aura Patch wants everyone to be able to browse, understand, and use our online store, including people who use assistive technologies. We are working to provide a clear and inclusive experience and to improve accessibility as our website evolves.",
      "Our aim is to follow generally recognized accessibility practices informed by the Web Content Accessibility Guidelines (WCAG). This statement describes our goal and ongoing work; it is not a certification that every page currently meets every WCAG success criterion.",
    ],
  },
  {
    title: "Accessibility practices",
    copy: [
      "We consider accessible structure, keyboard use, visible focus, readable contrast, responsive text, descriptive page titles, meaningful link text, labels for interactive controls, and text alternatives for informative images when creating and updating the store.",
      "The website is built with standard web technologies including HTML, CSS, and JavaScript. Accessibility can vary depending on the browser, device, operating system, and assistive technology being used, so keeping these tools updated may provide the best experience.",
    ],
  },
  {
    title: "Known limitations",
    copy: [
      "Some content, product imagery, integrations, or third-party services may not yet provide the experience we intend. Third-party features—such as payment, account, shipping, analytics, or social-media services—are partly controlled by their providers and may have their own accessibility support and policies.",
      "We continue to review the store as products and features change. When we identify an accessibility issue within our control, we will make reasonable efforts to correct it or provide an alternative way to access the relevant information or service.",
    ],
  },
  {
    title: "Need assistance?",
    copy: [
      "If you have difficulty using any part of the Aura Patch website, please contact us through the Contact section. Tell us which page or feature caused difficulty, what you were trying to do, and—if you are comfortable sharing it—the browser or assistive technology you used.",
      "We welcome accessibility feedback and will make reasonable efforts to respond, provide the information or service in another format where practical, and improve the experience for future visitors.",
    ],
  },
  {
    title: "Updates",
    copy: [
      "We may update this statement as our website, practices, and accessibility work develop. The latest version will be posted on this page with its revision date.",
    ],
  },
]

export default function AccessibilityPage() {
  return (
    <main className="bg-aura-cream text-aura-forest">
      <div className="aura-shell py-16 small:py-24">
        <p className="aura-eyebrow text-aura-gold">Designed for everyone</p>
        <h1 className="aura-display mt-5 text-[52px] leading-none small:text-[76px]">
          Accessibility
        </h1>
        <p className="mt-6 text-sm text-aura-forest/55">
          Last updated September 3, 2026
        </p>
        <p className="mt-10 max-w-[780px] text-[17px] leading-8 text-aura-forest/75">
          We believe wellness—and the experience of discovering it—should feel
          welcoming and usable for as many people as possible.
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
