import { props } from "@webflow/data-types"
import { declareComponent } from "@webflow/react"
import type { ReactNode } from "react"
import NavigationMenu from "./NavigationMenu"
import {
  defaultEspaceClient,
  defaultMenu,
  topBarLinks as defaultTopBarLinks,
} from "./data/menu"

type WebflowProps = {
  logoHref: { href: string; target?: string }
  ctaLabel: string
  ctaHref: { href: string; target?: string }
  showSearch: boolean
  asideComptes: ReactNode
  asideSavoirFaire: ReactNode
  asidePourQui: ReactNode
  asidePourquoi: ReactNode
  engagementsPourquoi: ReactNode
  espaceTitle: string
  espaceHeading: string
  espaceProLabel: string
  espaceProHref: { href: string; target?: string }
  espaceComptesLabel: string
  espaceComptesHref: { href: string; target?: string }
}

function NavigationMenuWebflow({
  logoHref,
  ctaLabel,
  ctaHref,
  showSearch,
  asideComptes,
  asideSavoirFaire,
  asidePourQui,
  asidePourquoi,
  engagementsPourquoi,
  espaceTitle,
  espaceHeading,
  espaceProLabel,
  espaceProHref,
  espaceComptesLabel,
  espaceComptesHref,
}: WebflowProps) {
  return (
    <NavigationMenu
      logoHref={logoHref?.href ?? "/"}
      ctaLabel={ctaLabel}
      ctaHref={ctaHref?.href ?? "#"}
      showSearch={showSearch}
      menu={defaultMenu}
      topBarLinks={defaultTopBarLinks}
      espace={{
        title: espaceTitle,
        heading: espaceHeading,
        proLabel: espaceProLabel,
        // props.Link can't carry a defaultValue (Link is in
        // PropTypesWithoutDefaultValue), so fall back to the real LCL URL the
        // label already defaults to — never "#", which would override the
        // defaultEspaceClient href on every render until a designer sets it.
        // Use `||` not `??`: a touched-but-empty Webflow Link control passes
        // { href: "" } (not nullish), which `??` would keep as href="".
        proHref: espaceProHref?.href || defaultEspaceClient.proHref,
        comptesLabel: espaceComptesLabel,
        comptesHref: espaceComptesHref?.href || defaultEspaceClient.comptesHref,
      }}
      asideSlots={{
        "Comptes et Opérations": asideComptes,
        "Nos savoir-faire": asideSavoirFaire,
        "Pour qui ?": asidePourQui,
        "Pourquoi LCL ?": asidePourquoi,
      }}
      engagementsSlots={{
        "Pourquoi LCL ?": engagementsPourquoi,
      }}
    />
  )
}

export default declareComponent(NavigationMenuWebflow, {
  name: "Navigation Menu",
  description:
    "LCL Pro main site navigation. Desktop mega menu + multi-level mobile drawer.",
  group: "Navigation",
  props: {
    logoHref: props.Link({ name: "Logo link" }),
    ctaLabel: props.Text({
      name: "CTA label",
      defaultValue: "Ouvrir un compte",
    }),
    ctaHref: props.Link({ name: "CTA link" }),
    showSearch: props.Boolean({
      name: "Show search",
      defaultValue: true,
      trueLabel: "Visible",
      falseLabel: "Hidden",
    }),
    asideComptes: props.Slot({ name: "Cards · Comptes et Opérations" }),
    asideSavoirFaire: props.Slot({ name: "Cards · Nos savoir-faire" }),
    asidePourQui: props.Slot({ name: "Cards · Pour qui ?" }),
    asidePourquoi: props.Slot({ name: "Cards · Pourquoi LCL ?" }),
    engagementsPourquoi: props.Slot({ name: "Engagements · Pourquoi LCL ?" }),
    espaceTitle: props.Text({
      name: "Espace · header title",
      defaultValue: defaultEspaceClient.title,
    }),
    espaceHeading: props.Text({
      name: "Espace · heading",
      defaultValue: defaultEspaceClient.heading,
    }),
    espaceProLabel: props.Text({
      name: "Espace · Pro label",
      defaultValue: defaultEspaceClient.proLabel,
    }),
    espaceProHref: props.Link({ name: "Espace · Pro link" }),
    espaceComptesLabel: props.Text({
      name: "Espace · Comptes label",
      defaultValue: defaultEspaceClient.comptesLabel,
    }),
    espaceComptesHref: props.Link({ name: "Espace · Comptes link" }),
  },
  options: {
    ssr: true,
  },
})
