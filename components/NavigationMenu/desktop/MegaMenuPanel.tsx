import { useState } from "react"
import * as Tabs from "@radix-ui/react-tabs"
import clsx from "clsx"
import styles from "../styles"
import { MenuColumn } from "./MenuColumn"
import { MenuTabRail } from "./MenuTabRail"
import { FeatureCard } from "../primitives/FeatureCard"
import type { MenuEntry, MenuSection } from "../NavigationMenu.types"

export type MegaMenuPanelProps = {
  entry: MenuEntry
}

export function MegaMenuPanel({ entry }: MegaMenuPanelProps) {
  const hasTabs = !!entry.tabs?.length
  return hasTabs ? <ThreeLevelPanel entry={entry} /> : <TwoLevelPanel entry={entry} />
}

function TwoLevelPanel({ entry }: { entry: MenuEntry }) {
  const sections = entry.sections ?? []
  const [primary, list] = pickSections(sections)
  return (
    <div className={styles.panel}>
      {primary ? <MenuColumn section={primary} /> : null}
      {list ? <MenuColumn section={list} /> : <div className={styles.panelColumn} />}
      <AsidePanel entry={entry} />
    </div>
  )
}

function ThreeLevelPanel({ entry }: { entry: MenuEntry }) {
  const tabs = entry.tabs ?? []
  const [active, setActive] = useState(tabs[0]?.label ?? "")
  const activeTab = tabs.find((t) => t.label === active) ?? tabs[0]
  const [primary, list] = pickSections(activeTab?.sections ?? [])

  return (
    <Tabs.Root
      value={active}
      onValueChange={setActive}
      orientation="vertical"
      className={clsx(styles.panel, styles.panelWithRail)}
    >
      <MenuTabRail tabs={tabs} value={active} onValueChange={setActive} />
      {primary ? <MenuColumn section={primary} /> : null}
      {list ? <MenuColumn section={list} /> : <div className={styles.panelColumn} />}
      <AsidePanel entry={entry} />
    </Tabs.Root>
  )
}

function AsidePanel({ entry }: { entry: MenuEntry }) {
  return (
    <div className={`${styles.panelColumn} ${styles.panelColumnAside}`}>
      <div className={styles.asideSlot}>
        {entry.aside ??
          (entry.featureCards ?? []).map((card) => (
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
