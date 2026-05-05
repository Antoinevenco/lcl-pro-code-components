import { declareComponent } from "@webflow/react"
import { props } from "@webflow/data-types"
import type { ReactNode } from "react"
import NavigationMenu from "./NavigationMenu"
import { defaultMenu, topBarLinks as defaultTopBarLinks } from "./data/menu"

type WebflowProps = {
  logoHref: { href: string; target?: string }
  ctaLabel: string
  ctaHref: { href: string; target?: string }
  showSearch: boolean
  asideComptes: ReactNode
  asideSavoirFaire: ReactNode
  asidePourQui: ReactNode
  asidePourquoi: ReactNode
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
}: WebflowProps) {
  return (
    <NavigationMenu
      logoHref={logoHref?.href ?? "/"}
      ctaLabel={ctaLabel}
      ctaHref={ctaHref?.href ?? "#"}
      showSearch={showSearch}
      menu={defaultMenu}
      topBarLinks={defaultTopBarLinks}
      asideSlots={{
        "Comptes et Opérations": asideComptes,
        "Nos savoir-faire": asideSavoirFaire,
        "Pour qui ?": asidePourQui,
        "Pourquoi LCL ?": asidePourquoi,
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
    ctaLabel: props.Text({ name: "CTA label", defaultValue: "Ouvrir un compte" }),
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
  },
  options: {
    ssr: false,
  },
})
