import styles from "../styles"
import { Chevron } from "./Chevron"
import { isActiveHref, useActivePath } from "../hooks/useCurrentPath"
import type { MenuLeaf } from "../NavigationMenu.types"

export type MenuItemProps = {
  item: MenuLeaf
  variant?: "primary" | "list"
}

export function MenuItem({ item, variant = "primary" }: MenuItemProps) {
  const active = isActiveHref(item.href, useActivePath())

  if (variant === "list") {
    return (
      <a
        className={styles.itemRow}
        href={item.href}
        aria-current={active ? "page" : undefined}
      >
        <span>{item.label}</span>
        <Chevron className={styles.chevron} />
      </a>
    )
  }
  return (
    <a
      className={styles.item}
      href={item.href}
      aria-current={active ? "page" : undefined}
    >
      <span className={styles.itemLabel}>{item.label}</span>
      {item.description ? (
        <span className={styles.itemDescription}>{item.description}</span>
      ) : null}
    </a>
  )
}

export default MenuItem
