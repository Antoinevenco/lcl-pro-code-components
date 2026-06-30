import { declareComponent } from "@webflow/react"
import { props } from "@webflow/data-types"
import CardComparison from "./CardComparison"
import { CARD_COMPARISON_DATA } from "./data"
import type { CardComparisonData } from "./CardComparison.types"

/**
 * Webflow binding. Flat Designer props mapped onto the component; the table
 * structure + values live in ./data.ts (hybrid model).
 *
 * Buttons: each card has its own CTA. Defaults (label + link) are baked in
 * ./data.ts (cards 1-3 → "Découvrir" + their product page). The per-card props
 * below OVERRIDE those when filled; left empty, the baked default wins, and a
 * card with no per-card link/label at all falls back to the shared
 * rdvUrl / rdvLabel. props.Link returns an object with `.href`, and an untouched
 * link arrives as `{ href: "#" }` — treat "#"/empty as "unset".
 */
function linkHref(link?: { href?: string }): string | undefined {
  const h = link?.href?.trim()
  return h && h !== "#" ? h : undefined
}

type WebflowProps = {
  rdvUrl: { href: string; target?: string }
  rdvLabel: string
  sectionTitle: string
  hideCard1: boolean
  hideCard2: boolean
  hideCard3: boolean
  hideCard4: boolean
  card1CtaLabel: string
  card1CtaHref: { href: string; target?: string }
  card2CtaLabel: string
  card2CtaHref: { href: string; target?: string }
  card3CtaLabel: string
  card3CtaHref: { href: string; target?: string }
  card4CtaLabel: string
  card4CtaHref: { href: string; target?: string }
}

function CardComparisonWebflow({
  rdvUrl,
  rdvLabel,
  sectionTitle,
  hideCard1,
  hideCard2,
  hideCard3,
  hideCard4,
  card1CtaLabel,
  card1CtaHref,
  card2CtaLabel,
  card2CtaHref,
  card3CtaLabel,
  card3CtaHref,
  card4CtaLabel,
  card4CtaHref,
}: WebflowProps) {
  const ctaInputs = [
    { label: card1CtaLabel, link: card1CtaHref },
    { label: card2CtaLabel, link: card2CtaHref },
    { label: card3CtaLabel, link: card3CtaHref },
    { label: card4CtaLabel, link: card4CtaHref },
  ]

  // Override the baked per-card CTA only when a prop is actually filled; empty
  // props keep the ./data.ts default (which itself falls back to rdvUrl/rdvLabel
  // in the component when a card has none).
  const data: CardComparisonData = {
    ...CARD_COMPARISON_DATA,
    cards: CARD_COMPARISON_DATA.cards.map((card, i) => {
      const label = (ctaInputs[i]?.label ?? "").trim()
      const href = linkHref(ctaInputs[i]?.link)
      return {
        ...card,
        ...(label ? { ctaLabel: label } : {}),
        ...(href ? { ctaHref: href } : {}),
      }
    }),
  }

  return (
    <CardComparison
      data={data}
      rdvUrl={rdvUrl?.href ?? "#"}
      rdvLabel={rdvLabel}
      sectionTitle={sectionTitle}
      hiddenColumns={[hideCard1, hideCard2, hideCard3, hideCard4]}
    />
  )
}

export default declareComponent(CardComparisonWebflow, {
  name: "LCL Card Comparison",
  description:
    "Tableau de comparaison des cartes LCL Pro. Desktop : grille (intitulés + colonnes cartes). Mobile : carrousel 2 cartes visibles avec swipe. Données intégrées ; bouton par carte (libellé + lien) éditable, sinon défaut partagé.",
  group: "LCL",
  props: {
    rdvUrl: props.Link({ name: "Lien bouton — défaut (toutes cartes)" }),
    rdvLabel: props.Text({
      name: "Libellé bouton — défaut (toutes cartes)",
      defaultValue: "Prendre rendez-vous",
    }),
    sectionTitle: props.Text({ name: "Titre de section", defaultValue: "Compte pro et cartes" }),
    // Per-card overrides — empty = use the baked default for that card.
    card1CtaLabel: props.Text({ name: "Carte 1 · libellé bouton", defaultValue: "" }),
    card1CtaHref: props.Link({ name: "Carte 1 · lien bouton" }),
    card2CtaLabel: props.Text({ name: "Carte 2 · libellé bouton", defaultValue: "" }),
    card2CtaHref: props.Link({ name: "Carte 2 · lien bouton" }),
    card3CtaLabel: props.Text({ name: "Carte 3 · libellé bouton", defaultValue: "" }),
    card3CtaHref: props.Link({ name: "Carte 3 · lien bouton" }),
    card4CtaLabel: props.Text({ name: "Carte 4 · libellé bouton", defaultValue: "" }),
    card4CtaHref: props.Link({ name: "Carte 4 · lien bouton" }),
    hideCard1: props.Boolean({ name: "Cacher carte 1", defaultValue: false }),
    hideCard2: props.Boolean({ name: "Cacher carte 2", defaultValue: false }),
    hideCard3: props.Boolean({ name: "Cacher carte 3", defaultValue: false }),
    hideCard4: props.Boolean({ name: "Cacher carte 4", defaultValue: false }),
  },
})
