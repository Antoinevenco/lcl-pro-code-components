import { declareComponent } from "@webflow/react"
import { props } from "@webflow/data-types"
import type { ReactNode } from "react"
import ComparisonSection from "./ComparisonSection"

type WebflowProps = {
  title: string
  icon: ReactNode
  rows: ReactNode
}

function ComparisonSectionWebflow({ title, icon, rows }: WebflowProps) {
  return (
    <ComparisonSection title={title} icon={icon}>
      {rows}
    </ComparisonSection>
  )
}

export default declareComponent(ComparisonSectionWebflow, {
  name: "LCL Comparateur — Catégorie",
  description:
    "Une catégorie (ex. « Virements et prélèvements »). En-tête icône + titre, et un slot où déposer des « LCL Comparateur — Ligne ».",
  group: "LCL",
  props: {
    title: props.Text({ name: "Titre", defaultValue: "Compte pro et cartes" }),
    icon: props.Slot({ name: "Icône (optionnel)" }),
    rows: props.Slot({ name: "Lignes" }),
  },
})
