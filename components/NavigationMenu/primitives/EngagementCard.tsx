import styles from "../styles"
import type { EngagementCard as EngagementCardData } from "../NavigationMenu.types"

export type EngagementCardProps = { card: EngagementCardData }

export function EngagementCard({ card }: EngagementCardProps) {
  return (
    <article className={styles.engagementCard}>
      <h4 className={styles.engagementCardTitle}>{card.title}</h4>
      <a className={styles.engagementCardCta} href={card.ctaHref}>
        {card.ctaLabel}
      </a>
    </article>
  )
}

export default EngagementCard
