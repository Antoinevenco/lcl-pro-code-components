import * as Tabs from "@radix-ui/react-tabs"
import styles from "../styles"
import { Chevron } from "../primitives/Chevron"
import type { MenuTab } from "../NavigationMenu.types"

export type MenuTabRailProps = {
  tabs: MenuTab[]
  value: string
  onValueChange: (value: string) => void
}

export function MenuTabRail({ tabs, value, onValueChange }: MenuTabRailProps) {
  return (
    <Tabs.List
      aria-label="Menu sections"
      aria-orientation="vertical"
      className={`${styles.panelColumn} ${styles.panelColumnRail} ${styles.tabList}`}
    >
      {tabs.map((tab) => (
        <Tabs.Trigger
          key={tab.label}
          value={tab.label}
          data-state={value === tab.label ? "active" : "inactive"}
          className={styles.tab}
          onMouseEnter={() => onValueChange(tab.label)}
          onFocus={() => onValueChange(tab.label)}
        >
          <span>{tab.label}</span>
          <Chevron className={styles.tabChevron} />
        </Tabs.Trigger>
      ))}
    </Tabs.List>
  )
}

export default MenuTabRail
