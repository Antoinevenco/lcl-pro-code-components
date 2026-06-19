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
  hideCard1: boolean
  hideCard2: boolean
  hideCard3: boolean
  hideCard4: boolean
}

function CardComparisonWebflow({
  rdvUrl,
  rdvLabel,
  sectionTitle,
  availabilityNote,
  hideCard1,
  hideCard2,
  hideCard3,
  hideCard4,
}: WebflowProps) {
  return (
    <CardComparison
      rdvUrl={rdvUrl?.href ?? "#"}
      rdvLabel={rdvLabel}
      sectionTitle={sectionTitle}
      availabilityNote={availabilityNote}
      hiddenColumns={[hideCard1, hideCard2, hideCard3, hideCard4]}
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
    hideCard1: props.Boolean({ name: "Cacher carte 1", defaultValue: false }),
    hideCard2: props.Boolean({ name: "Cacher carte 2", defaultValue: false }),
    hideCard3: props.Boolean({ name: "Cacher carte 3", defaultValue: false }),
    hideCard4: props.Boolean({ name: "Cacher carte 4", defaultValue: false }),
  },
})
