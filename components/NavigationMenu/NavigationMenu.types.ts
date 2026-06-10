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
  /** Designer-provided slot for the right-aside column when this tab is active. */
  aside?: import("react").ReactNode
  /** Fallback aside content used when no `aside` slot is supplied. */
  featureCards?: FeatureCard[]
}

export type FeatureCard = {
  title: string
  body: string
  ctaLabel: string
  ctaHref: string
  icon?: string
  iconBg?: "yellow" | "white"
}

export type EngagementCard = {
  title: string
  ctaLabel: string
  ctaHref: string
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
  /** Designer-provided slot for the mid "Nos engagements" column. */
  engagements?: import("react").ReactNode
  /** Heading rendered above the engagements column when present. */
  engagementsLabel?: string
  /** Fallback engagements content used when no `engagements` slot is supplied. */
  engagementCards?: EngagementCard[]
  ctaLabel?: string
  ctaHref?: string
}

export type MenuTree = MenuEntry[]

export type TopBarLink = {
  label: string
  href: string
  current?: boolean
}

/** Content of the "Espace client en ligne" modal/drawer opened from the user icon. */
export type EspaceClientConfig = {
  /** Title shown in the coloured header bar. */
  title: string
  /** Heading shown above the action buttons. */
  heading: string
  proLabel: string
  proHref: string
  comptesLabel: string
  comptesHref: string
}
