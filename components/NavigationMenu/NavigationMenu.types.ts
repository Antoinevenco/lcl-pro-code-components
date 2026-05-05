export type MenuLeaf = {
  label: string
  href: string
  description?: string
  icon?: string
}

export type MenuSectionVariant = "primary" | "list"
export type MenuSection = {
  label: string
  items: MenuLeaf[]
  variant?: MenuSectionVariant
  ctaLabel?: string
  ctaHref?: string
}

export type MenuTab = {
  label: string
  sections: MenuSection[]
}

export type FeatureCard = {
  title: string
  body: string
  ctaLabel: string
  ctaHref: string
  icon?: string
  iconBg?: "yellow" | "white"
}

export type MenuEntry = {
  label: string
  href?: string
  sections?: MenuSection[]
  tabs?: MenuTab[]
  /** Designer-provided slot for the right-aside column (Webflow card components). */
  aside?: import("react").ReactNode
  /** Fallback aside content used when no `aside` slot is supplied (e.g. previews). */
  featureCards?: FeatureCard[]
  ctaLabel?: string
  ctaHref?: string
}

export type MenuTree = MenuEntry[]

export type TopBarLink = {
  label: string
  href: string
  current?: boolean
}
