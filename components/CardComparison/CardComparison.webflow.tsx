import { declareComponent } from "@webflow/react"
import { props } from "@webflow/data-types"
import CardComparison from "./CardComparison"

/**
 * Webflow binding. Flat Designer props mapped onto the component; the table
 * structure + values live in ./data.ts (hybrid model). props.Link returns an
 * object with `.href`, so we unwrap it to the string the component expects.
 */
type WebflowProps = {
  rdvUrl: { href: string; target?: string }
  rdvLabel: string
  sectionTitle: string
  availabilityNote: string
}

function CardComparisonWebflow({
  rdvUrl,
  rdvLabel,
  sectionTitle,
  availabilityNote,
}: WebflowProps) {
  return (
    <CardComparison
      rdvUrl={rdvUrl?.href ?? "#"}
      rdvLabel={rdvLabel}
      sectionTitle={sectionTitle}
      availabilityNote={availabilityNote}
    />
  )
}

export default declareComponent(CardComparisonWebflow, {
  name: "LCL Card Comparison",
  description:
    "Tableau de comparaison des cartes LCL Pro. Desktop : grille (intitulés + colonnes cartes). Mobile : carrousel 2 cartes visibles avec swipe. Données intégrées ; lien RDV, titre de section et note éditables.",
  group: "LCL",
  props: {
    rdvUrl: props.Link({ name: "Lien Prendre rendez-vous" }),
    rdvLabel: props.Text({ name: "Libellé bouton", defaultValue: "Prendre rendez-vous" }),
    sectionTitle: props.Text({ name: "Titre de section", defaultValue: "Compte pro et cartes" }),
    availabilityNote: props.Text({
      name: "Note de disponibilité",
      defaultValue: "Uniquement disponible avec un compte L by LCL",
    }),
  },
})
