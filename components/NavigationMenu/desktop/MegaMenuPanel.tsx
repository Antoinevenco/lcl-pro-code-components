import { useState, type ReactNode } from "react"
import * as Tabs from "@radix-ui/react-tabs"
import clsx from "clsx"
import styles from "../styles"
import { MenuColumn } from "./MenuColumn"
import { MenuTabRail } from "./MenuTabRail"
import { FeatureCard } from "../primitives/FeatureCard"
import { EngagementCard } from "../primitives/EngagementCard"
import type {
  FeatureCard as FeatureCardType,
  MenuEntry,
  MenuSection,
} from "../NavigationMenu.types"

export type MegaMenuPanelProps = {
  entry: MenuEntry
}

export function MegaMenuPanel({ entry }: MegaMenuPanelProps) {
  const hasTabs = !!entry.tabs?.length
  return hasTabs ? <ThreeLevelPanel entry={entry} /> : <TwoLevelPanel entry={entry} />
}

function TwoLevelPanel({ entry }: { entry: MenuEntry }) {
  const sections = entry.sections ?? []
  const primaries = sections.filter((s) => (s.variant ?? "primary") === "primary")
  const list = sections.find((s) => s.variant === "list")
  const hasEngagements = !!(entry.engagements || entry.engagementCards?.length)
  // Single primary spans the first two grid columns; multiple primaries each
  // take one column so the 4-col grid still aligns with list + aside.
  const span = primaries.length <= 1
  return (
    <div className={styles.panel}>
      {primaries.length > 0 ? (
        primaries.map((section, i) => (
          <MenuColumn
            key={section.label + i}
            section={section}
            className={span ? styles.panelPrimarySpan : undefined}
          />
        ))
      ) : (
        <div className={clsx(styles.panelColumn, styles.panelPrimarySpan)} />
      )}
      {hasEngagements ? (
        <EngagementsPanel entry={entry} />
      ) : list ? (
        <MenuColumn section={list} />
      ) : (
        <div className={styles.panelColumn} />
      )}
      <AsidePanel aside={entry.aside} featureCards={entry.featureCards} />
    </div>
  )
}

function ThreeLevelPanel({ entry }: { entry: MenuEntry }) {
  const tabs = entry.tabs ?? []
  const [active, setActive] = useState(tabs[0]?.label ?? "")
  const activeTab = tabs.find((t) => t.label === active) ?? tabs[0]
  const [primary, list] = pickSections(activeTab?.sections ?? [])
  const tabAside = activeTab?.aside ?? entry.aside
  const tabFeatureCards = activeTab?.featureCards ?? entry.featureCards

  return (
    <Tabs.Root
      value={active}
      onValueChange={setActive}
      orientation="vertical"
      className={styles.panel}
    >
      <MenuTabRail tabs={tabs} value={active} onValueChange={setActive} />
      {primary ? <MenuColumn section={primary} /> : <div className={styles.panelColumn} />}
      {list ? <MenuColumn section={list} /> : <div className={styles.panelColumn} />}
      <AsidePanel aside={tabAside} featureCards={tabFeatureCards} />
    </Tabs.Root>
  )
}

function EngagementsPanel({ entry }: { entry: MenuEntry }) {
  return (
    <div className={`${styles.panelColumn} ${styles.panelColumnEngagements}`}>
      {entry.engagementsLabel ? (
        <h3 className={styles.columnTitle}>{entry.engagementsLabel}</h3>
      ) : null}
      <div className={styles.engagementsSlot}>
        {entry.engagements ??
          (entry.engagementCards ?? []).map((card) => (
            <EngagementCard key={card.title} card={card} />
          ))}
      </div>
    </div>
  )
}

function AsidePanel({
  aside,
  featureCards,
}: {
  aside?: ReactNode
  featureCards?: FeatureCardType[]
}) {
  return (
    <div className={`${styles.panelColumn} ${styles.panelColumnAside}`}>
      <div className={styles.asideSlot}>
        {aside ??
          (featureCards ?? []).map((card) => (
            <FeatureCard key={card.title} card={card} />
          ))}
      </div>
    </div>
  )
}

function pickSections(sections: MenuSection[]): [MenuSection | undefined, MenuSection | undefined] {
  const primary = sections.find((s) => (s.variant ?? "primary") === "primary") ?? sections[0]
  const list = sections.find((s) => s.variant === "list") ?? sections[1]
  return [primary, list]
}

export default MegaMenuPanel
