import { type ReactNode } from "react"
import styles from "./styles"

/**
 * A category that groups rows (e.g. "Virements et prélèvements"). Header with an
 * optional icon slot (defaults to a generic icon) + a title, then a slot for the
 * ComparisonRow children dropped in by the designer.
 */
export interface ComparisonSectionProps {
  title?: string
  /** Optional icon slot; falls back to a default icon when empty. */
  icon?: ReactNode
  /** Rows slot. */
  children?: ReactNode
}

function DefaultIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M3 9.5h18" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function ComparisonSection({ title, icon, children }: ComparisonSectionProps) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionIcon}>{icon ?? <DefaultIcon />}</span>
        {title}
      </div>
      <div>{children}</div>
    </div>
  )
}

export default ComparisonSection
