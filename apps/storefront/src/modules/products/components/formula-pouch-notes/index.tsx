import { AuraFormula } from "@lib/data/aura-collection"

type FormulaPouchNotesProps = {
  formula: AuraFormula
  tone?: "forest" | "cream"
  dense?: boolean
}

const FormulaPouchNotes = ({
  formula,
  tone = "forest",
  dense = false,
}: FormulaPouchNotesProps) => {
  const onDark = tone === "cream"

  return (
    <div data-testid={`pouch-notes-${formula.key}`}>
      <p className="aura-eyebrow text-aura-gold">Benefits</p>
      <div
        className={`mt-2 divide-y ${
          onDark ? "divide-aura-cream/15" : "divide-aura-forest/10"
        }`}
      >
        {formula.benefits.map((benefit) => (
          <div key={benefit.title} className={dense ? "py-4" : "py-6"}>
            <h3
              className={`aura-display leading-[1.08] ${
                dense
                  ? "text-[22px] small:text-[26px]"
                  : "text-[28px] small:text-[32px]"
              } ${onDark ? "text-aura-cream" : "text-aura-forest"}`}
            >
              {benefit.title}
            </h3>
            <p
              className={`mt-3 text-[15px] leading-7 ${
                onDark ? "text-aura-cream/75" : "text-aura-forest/70"
              }`}
            >
              {benefit.body}
            </p>
          </div>
        ))}
      </div>
      <p
        className={`text-[12px] leading-5 ${
          onDark ? "text-aura-cream/50" : "text-aura-forest/50"
        }`}
      >
        These notes describe the pouch and the ingredients in it. They are
        general wellness information, not a claim that the finished patch
        treats or prevents any condition.
      </p>
    </div>
  )
}

export default FormulaPouchNotes
