import { declareComponent, useWebflowContext } from "@webflow/react"
import { props } from "@webflow/data-types"
import type { ReactNode } from "react"
import ComparisonRow from "./ComparisonRow"
import type { RowVariant } from "./types"

type WebflowProps = {
  variant: RowVariant
  label: string
  value1: string
  sub1: string
  value2: string
  sub2: string
  richCol1: ReactNode
  richCol2: ReactNode
  richMerged: ReactNode
  mergedIntro: string
}

function ComparisonRowWebflow({
  variant,
  label,
  value1,
  sub1,
  value2,
  sub2,
  richCol1,
  richCol2,
  richMerged,
  mergedIntro,
}: WebflowProps) {
  // interactive === false on the canvas → force dropdowns open so their
  // RichText is visible and editable while designing.
  const ctx = useWebflowContext()
  const editorMode = !(ctx?.interactive ?? true)
  return (
    <ComparisonRow
      variant={variant}
      label={label}
      value1={value1}
      sub1={sub1}
      value2={value2}
      sub2={sub2}
      richCol1={richCol1}
      richCol2={richCol2}
      richMerged={richMerged}
      mergedIntro={mergedIntro}
      editorMode={editorMode}
    />
  )
}

export default declareComponent(ComparisonRowWebflow, {
  name: "LCL Comparateur — Ligne",
  description:
    "Une ligne de comparaison. 3 types : classic (libellé + 2 valeurs), dropdown-split (un panneau RichText par offre), dropdown-merged (un panneau commun). À déposer dans une « LCL Comparateur — Catégorie ».",
  group: "LCL",
  props: {
    variant: props.Variant({
      name: "Type de ligne",
      options: ["classic", "dropdown-split", "dropdown-merged"],
      defaultValue: "classic",
    }),
    label: props.Text({ name: "Libellé", defaultValue: "Caractéristique" }),
    value1: props.Text({ name: "Offre 1 — valeur", defaultValue: "" }),
    sub1: props.Text({ name: "Offre 1 — sous-ligne", defaultValue: "" }),
    value2: props.Text({ name: "Offre 2 — valeur", defaultValue: "" }),
    sub2: props.Text({ name: "Offre 2 — sous-ligne", defaultValue: "" }),
    richCol1: props.RichText({ name: "Dropdown split — panneau Offre 1" }),
    richCol2: props.RichText({ name: "Dropdown split — panneau Offre 2" }),
    richMerged: props.RichText({ name: "Dropdown fusionné — panneau commun" }),
    mergedIntro: props.Text({ name: "Dropdown fusionné — intro (optionnel)", defaultValue: "" }),
  },
})
