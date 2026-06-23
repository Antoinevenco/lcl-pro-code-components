import { declareComponent } from "@webflow/react"
import { props } from "@webflow/data-types"
import type { ReactNode } from "react"
import ComparisonV3 from "./ComparisonV3"

type WebflowProps = {
  offer1Name: string
  offer1CtaLabel: string
  offer1CtaHref: { href: string; target?: string }
  offer1Recommended: boolean
  offer2Name: string
  offer2CtaLabel: string
  offer2CtaHref: { href: string; target?: string }
  offer2Recommended: boolean
  sections: ReactNode
}

function ComparisonV3Webflow({
  offer1Name,
  offer1CtaLabel,
  offer1CtaHref,
  offer1Recommended,
  offer2Name,
  offer2CtaLabel,
  offer2CtaHref,
  offer2Recommended,
  sections,
}: WebflowProps) {
  return (
    <ComparisonV3
      offer1Name={offer1Name}
      offer1CtaLabel={offer1CtaLabel}
      offer1CtaHref={offer1CtaHref?.href ?? "#"}
      offer1Recommended={offer1Recommended}
      offer2Name={offer2Name}
      offer2CtaLabel={offer2CtaLabel}
      offer2CtaHref={offer2CtaHref?.href ?? "#"}
      offer2Recommended={offer2Recommended}
    >
      {sections}
    </ComparisonV3>
  )
}

export default declareComponent(ComparisonV3Webflow, {
  name: "LCL Comparateur — 2 offres",
  description:
    "Comparateur 2 offres (parent). En-tête des 2 offres (badge Recommandé + boutons), bascule mobile, et un slot où déposer des « LCL Comparateur — Catégorie ».",
  group: "LCL",
  props: {
    offer1Name: props.Text({ name: "Offre 1 — nom", defaultValue: "L by LCL Pro" }),
    offer1CtaLabel: props.Text({ name: "Offre 1 — bouton", defaultValue: "Ouvrir un compte" }),
    offer1CtaHref: props.Link({ name: "Offre 1 — lien" }),
    offer1Recommended: props.Boolean({ name: "Offre 1 — badge Recommandé", defaultValue: true }),
    offer2Name: props.Text({ name: "Offre 2 — nom", defaultValue: "LCL À la carte PRO" }),
    offer2CtaLabel: props.Text({ name: "Offre 2 — bouton", defaultValue: "Prendre rendez-vous" }),
    offer2CtaHref: props.Link({ name: "Offre 2 — lien" }),
    offer2Recommended: props.Boolean({ name: "Offre 2 — badge Recommandé", defaultValue: false }),
    sections: props.Slot({ name: "Catégories" }),
  },
})
