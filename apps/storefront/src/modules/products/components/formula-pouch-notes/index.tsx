import { AuraFormula } from "@lib/data/aura-collection"

type FormulaPouchNotesProps = {
  formula: AuraFormula
  tone?: "forest" | "cream"
}

const FormulaPouchNotes = ({
  formula,
  tone = "forest",
}: FormulaPouchNotesProps) => {
  const onDark = tone === "cream"

  return (
    <div data-testid={`pouch-notes-${formula.key}`}>
      <p className="aura-eyebrow text-aura-gold">In the 30-day pouch</p>
      <ul className="mt-5 space-y-3">
        {formula.pouchNotes.map((note) => (
          <li
            key={note}
            className={`flex gap-3 text-[15px] leading-7 ${
              onDark ? "text-aura-cream/80" : "text-aura-forest/75"
            }`}
          >
            <span className="mt-[0.7rem] h-px w-5 shrink-0 bg-aura-gold" />
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FormulaPouchNotes
