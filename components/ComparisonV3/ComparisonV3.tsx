import { useRef, useState, type ReactNode } from "react"
import styles from "./styles"

/**
 * 2-offer comparator (parent). Header = two offer cards (one optionally
 * "Recommandé") + a slot for ComparisonSection children.
 *
 * Mobile: the header is a sticky scroll-snap carousel of the two cards (with a
 * peek of the other so swiping is discoverable) plus a switcher. Swiping the
 * header, clicking the peeked card, or tapping a switcher tab sets the active
 * offer (data-cv3-active on the root). The CSS module then shows only that
 * offer's [data-cv3-col] cells across every nested row — labels stay put, only
 * the values change. No React context (attribute selectors aren't scoped), so
 * it works across the slotted rows with no SSR flash.
 */
export interface ComparisonV3Props {
  offer1Name?: string
  offer1CtaLabel?: string
  offer1CtaHref?: string
  offer1Recommended?: boolean
  offer2Name?: string
  offer2CtaLabel?: string
  offer2CtaHref?: string
  offer2Recommended?: boolean
  /** Sections slot. */
  children?: ReactNode
}

interface OfferProps {
  col: "0" | "1"
  name: string
  ctaLabel: string
  ctaHref: string
  recommended: boolean
  onSelect: () => void
}

function OfferCard({ col, name, ctaLabel, ctaHref, recommended, onSelect }: OfferProps) {
  return (
    <div
      className={`${styles.offer} ${recommended ? styles.offerRecommended : ""}`}
      data-cv3-col={col}
      onClick={onSelect}
    >
      {recommended ? <span className={styles.badge}>Recommandé</span> : null}
      <span className={styles.offerName}>{name}</span>
      <a
        className={`${styles.cta} ${recommended ? styles.ctaPrimary : styles.ctaOutline}`}
        href={ctaHref}
        onClick={(e) => e.stopPropagation()}
      >
        {ctaLabel}
      </a>
    </div>
  )
}

export function ComparisonV3({
  offer1Name = "L by LCL Pro",
  offer1CtaLabel = "Ouvrir un compte",
  offer1CtaHref = "#",
  offer1Recommended = true,
  offer2Name = "LCL À la carte PRO",
  offer2CtaLabel = "Prendre rendez-vous",
  offer2CtaHref = "#",
  offer2Recommended = false,
  children,
}: ComparisonV3Props) {
  const [active, setActive] = useState<"0" | "1">("0")
  const headerRef = useRef<HTMLDivElement>(null)

  // Mobile: the header carousel scroll position is the source of truth for the
  // active offer (snaps to card 0 or 1). Desktop header is a grid (not
  // scrollable) so this never fires there.
  const onHeaderScroll = () => {
    const el = headerRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setActive(maxScroll > 0 && el.scrollLeft > maxScroll / 2 ? "1" : "0")
  }

  const selectOffer = (i: "0" | "1") => {
    setActive(i)
    const el = headerRef.current
    if (el && el.scrollWidth > el.clientWidth) {
      const maxScroll = el.scrollWidth - el.clientWidth
      el.scrollTo({ left: i === "1" ? maxScroll : 0, behavior: "smooth" })
    }
  }

  return (
    <section className={styles.root} data-cv3-active={active}>
      <div className={styles.mobileBar}>
        <div className={styles.header} ref={headerRef} onScroll={onHeaderScroll}>
          <div className={styles.headerSpacer} aria-hidden="true" />
          <OfferCard
            col="0"
            name={offer1Name}
            ctaLabel={offer1CtaLabel}
            ctaHref={offer1CtaHref}
            recommended={offer1Recommended}
            onSelect={() => selectOffer("0")}
          />
          <OfferCard
            col="1"
            name={offer2Name}
            ctaLabel={offer2CtaLabel}
            ctaHref={offer2CtaHref}
            recommended={offer2Recommended}
            onSelect={() => selectOffer("1")}
          />
        </div>

        <div className={styles.tabs} role="tablist" aria-label="Choisir une offre">
          <button
            type="button"
            className={`${styles.tab} ${active === "0" ? styles.tabActive : ""}`}
            aria-selected={active === "0"}
            onClick={() => selectOffer("0")}
          >
            {offer1Name}
          </button>
          <button
            type="button"
            className={`${styles.tab} ${active === "1" ? styles.tabActive : ""}`}
            aria-selected={active === "1"}
            onClick={() => selectOffer("1")}
          >
            {offer2Name}
          </button>
        </div>
      </div>

      {children}
    </section>
  )
}

export default ComparisonV3
