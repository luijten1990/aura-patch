import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Aura Patch",
  description: "How Aura Patch collects, uses, and protects personal information.",
}

const sections = [
  ["Information we collect", "We may collect information you provide when you create an account, place an order, contact us, or sign up for updates. This can include your name, email address, telephone number, billing and shipping details, and order information. Payment information is processed by our payment providers and is not stored directly by Aura Patch unless specifically stated."],
  ["Information collected automatically", "When you use our website, technical information such as your IP address, browser type, device information, pages viewed, and interactions with the site may be collected automatically. We use this information to operate, secure, understand, and improve the website."],
  ["How we use information", "We use personal information to provide and fulfil orders, manage accounts, respond to questions, prevent fraud, maintain security, improve our services, comply with legal obligations, and send marketing communications when you have chosen to receive them."],
  ["Cookies", "We may use cookies and similar technologies to remember preferences, maintain cart and account sessions, understand site performance, and support relevant communications. Browser settings can be used to control cookies, although some store features may not function correctly without them."],
  ["When information is shared", "We may share information with service providers that help us operate the store, including hosting, analytics, fulfilment, customer support, and payment partners. We may also disclose information when required by law, to protect rights and safety, or as part of a business transfer. We do not sell personal information for money."],
  ["Data choices", "Depending on where you live, you may have rights to request access, correction, deletion, or a copy of your personal information, and to opt out of certain uses. You may unsubscribe from marketing messages at any time using the link provided in those messages."],
  ["Security and retention", "We use reasonable administrative and technical safeguards designed to protect personal information. No online service can guarantee absolute security. We retain information only for as long as reasonably necessary for the purposes described here, including legal, accounting, and security requirements."],
  ["Contact and updates", "Questions or privacy requests can be sent through the Contact section of this website. We may update this policy as our services or legal obligations change. The latest version will always be posted on this page."],
]

export default function PrivacyPage() {
  return (
    <main className="bg-aura-cream text-aura-forest">
      <div className="aura-shell py-16 small:py-24">
        <p className="aura-eyebrow text-aura-gold">Your information</p>
        <h1 className="aura-display mt-5 text-[52px] leading-none small:text-[76px]">Privacy Policy</h1>
        <p className="mt-6 text-sm text-aura-forest/55">Last updated September 3, 2026</p>
        <p className="mt-10 max-w-[780px] text-[17px] leading-8 text-aura-forest/75">This policy explains how Aura Patch collects, uses, shares, and protects information when you visit our website, create an account, or make a purchase.</p>
        <div className="mt-14 max-w-[920px] divide-y divide-aura-forest/15 border-y border-aura-forest/15">
          {sections.map(([title, copy]) => (
            <section key={title} className="grid gap-4 py-8 small:grid-cols-[0.55fr_1.45fr]">
              <h2 className="aura-display text-[28px] leading-tight">{title}</h2>
              <p className="text-[15px] leading-7 text-aura-forest/72">{copy}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
