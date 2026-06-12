import type { ReactNode } from "react"
import styles from "./styles"

export type CtaButtonProps = {
  href: string
  label: ReactNode
  /** Primary = filled, secondary = outline. Defaults to primary. */
  variant?: "primary" | "secondary"
  /**
   * Optional trailing icon (e.g. an arrow). Omit for no icon — this is how the
   * arrow is "disablable per call". Pass the icon element directly so the button
   * stays decoupled from any one icon set; size it ~1.5rem to match the layout
   * (the wrapper trims its height contribution, see `.ctaArrow`).
   */
  arrow?: ReactNode
  /** Stretch to fill the container width (stacked modal actions, cards). */
  block?: boolean
  target?: string
  rel?: string
  className?: string
}

/**
 * The single CTA button shared across components so they stay visually
 * identical. Typography and leading-trim live in `.cta*`
 * (primitives/CtaButton.module.css); see the comment there for why the label is
 * wrapped and trimmed. Framework-agnostic — knows nothing about Webflow.
 */
export function CtaButton({
  href,
  label,
  variant = "primary",
  arrow,
  block = false,
  target,
  rel,
  className,
}: CtaButtonProps) {
  const classes = [
    styles.cta,
    variant === "secondary" ? styles.ctaSecondary : styles.ctaPrimary,
    block ? styles.ctaBlock : null,
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <a className={classes} href={href} target={target} rel={rel}>
      <span className={styles.ctaLabel}>{label}</span>
      {arrow ? (
        <span className={styles.ctaArrow} aria-hidden="true">
          {arrow}
        </span>
      ) : null}
    </a>
  )
}

export default CtaButton
