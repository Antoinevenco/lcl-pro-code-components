import { useState, type ReactNode } from "react"
import styles from "./styles"
import type { RowVariant } from "./types"

/**
 * A comparison row — three layouts (props.Variant on the binding):
 *   classic         — label + 2 values (+ optional sub-lines).
 *   dropdown-split  — + chevron → one RichText panel under EACH offer column.
 *   dropdown-merged — + chevron → one RichText panel spanning both columns.
 *
 * RichText props are rendered (ReactNode), never parsed. On the Webflow canvas
 * (editorMode), dropdowns are force-open so their RichText is editable.
 * Value/panel cells carry data-cv3-col so the parent's data-cv3-active can hide
 * the inactive offer on mobile (pure CSS, see the module).
 */
export interface ComparisonRowProps {
  variant?: RowVariant
  label?: string
  value1?: string
  sub1?: string
  value2?: string
  sub2?: string
  richCol1?: ReactNode
  richCol2?: ReactNode
  richMerged?: ReactNode
  mergedIntro?: string
  editorMode?: boolean
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ComparisonRow({
  variant = "classic",
  label,
  value1,
  sub1,
  value2,
  sub2,
  richCol1,
  richCol2,
  richMerged,
  mergedIntro,
  editorMode = false,
}: ComparisonRowProps) {
  const isDropdown = variant === "dropdown-split" || variant === "dropdown-merged"
  const [userOpen, setUserOpen] = useState(false)
  const open = editorMode || userOpen

  return (
    <div className={styles.row}>
      <div className={styles.rowMain}>
        {isDropdown ? (
          <button
            type="button"
            className={styles.rowLabel}
            aria-expanded={open}
            onClick={() => setUserOpen((o) => !o)}
          >
            {label}
            <Chevron open={open} />
          </button>
        ) : (
          <div className={styles.rowLabel}>{label}</div>
        )}

        <div className={styles.cell} data-cv3-col="0">
          {value1 ? <span className={styles.cellMain}>{value1}</span> : null}
          {sub1 ? <span className={styles.cellSub}>{sub1}</span> : null}
        </div>
        <div className={styles.cell} data-cv3-col="1">
          {value2 ? <span className={styles.cellMain}>{value2}</span> : null}
          {sub2 ? <span className={styles.cellSub}>{sub2}</span> : null}
        </div>
      </div>

      {isDropdown && open ? (
        variant === "dropdown-split" ? (
          <div className={styles.dropdownSplit}>
            <div className={styles.spacer} aria-hidden="true" />
            <div className={styles.panel} data-cv3-col="0">
              {richCol1}
            </div>
            <div className={styles.panel} data-cv3-col="1">
              {richCol2}
            </div>
          </div>
        ) : (
          <div className={styles.dropdownMerged}>
            <div className={styles.spacer} aria-hidden="true" />
            <div className={styles.mergedPanel}>
              {mergedIntro ? <p className={styles.mergedIntro}>{mergedIntro}</p> : null}
              {richMerged}
            </div>
          </div>
        )
      ) : null}
    </div>
  )
}

export default ComparisonRow
