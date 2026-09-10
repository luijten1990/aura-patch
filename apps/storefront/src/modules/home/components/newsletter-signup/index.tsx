const BREVO_FORM_URL =
  "https://863fe79f.sibforms.com/v2/serve/MUIFAMI6TqrUKksTB4nJw_WyLu2GHzoi5rzeXxky19vw2_vdQNIv_PtCZg5NBrDJ3wr-d5SKx9DryRrTs-y8b5caTytR011qcDIJFfRnW9q5_sNG2_YiNxhIRAiXaoisrQsyzyTo6O2skPmUrOokQfB08SxSAvkCPpe0EeQwkXFXnvfyCTVShgheWJWGvYLTWi2LwCFmXUw8VDv0Sg=="

export default function NewsletterSignup() {
  return (
    <aside className="overflow-hidden rounded-[1.5rem] bg-aura-cream p-6 text-left small:p-8">
      <p className="aura-eyebrow">Stay in the loop</p>
      <h3 className="aura-display mt-4 text-[34px] leading-none small:text-[42px]">
        A daily ritual, delivered to your inbox.
      </h3>
      <p className="mt-4 max-w-[470px] text-[15px] leading-7 text-aura-forest/70">
        Be first to hear about new formulas, launches, and early access.
      </p>
      <iframe
        title="Aura newsletter signup"
        src={BREVO_FORM_URL}
        className="mt-5 block h-[250px] w-full border-0"
        scrolling="no"
      />
    </aside>
  )
}
