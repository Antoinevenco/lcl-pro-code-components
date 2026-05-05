import styles from "../styles"
import type { FeatureCard as FeatureCardData } from "../NavigationMenu.types"

export type FeatureCardProps = { card: FeatureCardData }

export function FeatureCard({ card }: FeatureCardProps) {
  return (
    <article className={styles.featureCard}>
      <header className={styles.featureCardHead}>
        <span className={styles.featureCardIcon} data-bg={card.iconBg ?? "white"} aria-hidden="true">
          {card.icon ?? <DefaultIcon variant={card.iconBg} />}
        </span>
        <h3 className={styles.featureCardTitle}>{card.title}</h3>
      </header>
      <p className={styles.featureCardBody}>{card.body}</p>
      <a className={styles.featureCardCta} href={card.ctaHref}>
        {card.ctaLabel}
      </a>
    </article>
  )
}

function DefaultIcon({ variant }: { variant?: "yellow" | "white" }) {
  if (variant === "yellow") {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 9h2v2H5z" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M16 11.5a5 5 0 0 1-5.5 5A8 8 0 0 1 4 9.5 5 5 0 0 1 9 4l1.5 3-1.5 1a6.5 6.5 0 0 0 3 3l1-1.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default FeatureCard
