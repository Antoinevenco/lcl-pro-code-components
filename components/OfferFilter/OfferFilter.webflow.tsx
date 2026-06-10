import { declareComponent } from "@webflow/react"
import { props } from "@webflow/data-types"

import OfferFilter from "./OfferFilter"
import type { Offer } from "./OfferFilter.types"

/**
 * Webflow binding for `OfferFilter`.
 *
 * Why a fixed number of offer slots and not a JSON array?
 *   The `@webflow/data-types` prop API exposes Text / RichText / Number /
 *   Variant / Link / Image / Slot / Boolean / Attributes — but no `Array` or
 *   structured JSON. The repo's existing pattern (see Form/data/formConfig.ts)
 *   is to keep lists in code, but the brief asks for editable options. The
 *   closest fit available is repeating Text pairs. Four slots is enough for
 *   the LCL Pro comparison table; empty `title` disables a slot.
 *
 * The CTA's link uses `props.Link` so the Designer gets the proper URL +
 * target affordance — same pattern NavigationMenu uses for its CTA.
 */

type WebflowProps = {
  offer1Title: string
  offer1Value: string
  offer2Title: string
  offer2Value: string
  offer3Title: string
  offer3Value: string
  offer4Title: string
  offer4Value: string
  defaultValue: string
  ctaLabel: string
  ctaLink: { href: string; target?: string }
  imageSrc: { src: string; alt?: string }
}

function OfferFilterWebflow({
  offer1Title,
  offer1Value,
  offer2Title,
  offer2Value,
  offer3Title,
  offer3Value,
  offer4Title,
  offer4Value,
  defaultValue,
  ctaLabel,
  ctaLink,
  imageSrc,
}: WebflowProps) {
  const raw = [
    { title: offer1Title, value: offer1Value },
    { title: offer2Title, value: offer2Value },
    { title: offer3Title, value: offer3Value },
    { title: offer4Title, value: offer4Value },
  ]
  // A slot is "filled" iff both title and value are provided — value drives
  // the cell/card selectors so an empty value would silently break filtering.
  const offers: Offer[] = raw.filter(
    (o) => o.title.trim().length > 0 && o.value.trim().length > 0,
  )

  return (
    <OfferFilter
      offers={offers}
      defaultValue={defaultValue || undefined}
      ctaLabel={ctaLabel}
      ctaHref={ctaLink?.href || "#"}
      ctaTarget={ctaLink?.target}
      imageSrc={imageSrc?.src || undefined}
      imageAlt={imageSrc?.alt || ""}
    />
  )
}

export default declareComponent(OfferFilterWebflow, {
  name: "Offer Filter",
  description:
    "Card with a dropdown that filters the LCL Pro comparison table and swaps the active offer card on mobile.",
  group: "Navigation",
  props: {
    offer1Title: props.Text({
      name: "Offer 1 — title",
      defaultValue: "Carte Visa Business",
    }),
    offer1Value: props.Text({
      name: "Offer 1 — value",
      tooltip:
        "Slug used to match column cells (.{value}-offer) and the card ([data-filter-card=\"{value}\"]).",
      defaultValue: "lbylcl",
    }),
    offer2Title: props.Text({
      name: "Offer 2 — title",
      defaultValue: "Carte Visa personnalisée",
    }),
    offer2Value: props.Text({
      name: "Offer 2 — value",
      defaultValue: "custom",
    }),
    offer3Title: props.Text({
      name: "Offer 3 — title",
      defaultValue: "",
    }),
    offer3Value: props.Text({
      name: "Offer 3 — value",
      defaultValue: "",
    }),
    offer4Title: props.Text({
      name: "Offer 4 — title",
      defaultValue: "",
    }),
    offer4Value: props.Text({
      name: "Offer 4 — value",
      defaultValue: "",
    }),
    defaultValue: props.Text({
      name: "Default selected value",
      tooltip:
        "Slug of the offer selected on first mobile paint. Defaults to Offer 1.",
      defaultValue: "lbylcl",
    }),
    ctaLabel: props.Text({
      name: "CTA — label",
      defaultValue: "Prendre rendez-vous",
    }),
    ctaLink: props.Link({
      name: "CTA — link",
    }),
    imageSrc: props.Image({
      name: "Card image",
    }),
  },
  options: {
    ssr: false,
  },
})
