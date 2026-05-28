import clsx from "clsx"
import styles from "../styles"
import { MenuItem } from "../primitives/MenuItem"
import type { MenuSection } from "../NavigationMenu.types"

export type MenuColumnProps = {
  section: MenuSection
  showTitle?: boolean
  className?: string
}

export function MenuColumn({ section, showTitle = true, className }: MenuColumnProps) {
  const variant = section.variant ?? "primary"
  return (
    <div
      className={clsx(
        styles.panelColumn,
        variant === "primary" ? styles.panelColumnPrimary : styles.panelColumnList,
        className,
      )}
    >
      {showTitle ? <h3 className={styles.columnTitle}>{section.label}</h3> : null}
      <ul
        className={clsx(
          styles.itemList,
          variant === "list" && styles.itemListCompact,
        )}
      >
        {section.items.map((item) => (
          <li key={item.label}>
            <MenuItem item={item} variant={variant} />
          </li>
        ))}
      </ul>
      {section.ctaLabel && section.ctaHref ? (
        <a className={styles.columnCta} href={section.ctaHref}>
          {section.ctaLabel}
        </a>
      ) : null}
    </div>
  )
}

export default MenuColumn
