import { useEffect, useRef, useState, type CSSProperties } from "react"
import { motion, type PanInfo } from "framer-motion"
import type { CardComparisonData, CardDef } from "./CardComparison.types"
import { CARD_COMPARISON_DATA } from "./data"
import styles from "./styles"

/**
 * LCL card comparison table.
 *
 * Desktop: an aligned CSS grid (1 label column + N card columns) with a header
 * row of card boxes and a section bar. Mobile (<860px): a horizontal
 * scroll-snap carousel showing ~2 cards at a time, each value preceded by its
 * label, with dot indicators. Both layouts render from the same data; CSS
 * (not JS) decides which one shows, so the right layout paints before hydration.
 *
 * Hybrid data model: the table structure + values are baked in (./data.ts);
 * the editable bits — shared RDV link, section title, availability note — are
 * props so they can be set in the Webflow Designer.
 */

export interface CardComparisonProps {
  /** Shared button link/label — the default for every card's button.
   *  Overridden per card by `CardDef.ctaHref` / `CardDef.ctaLabel`. */
  rdvUrl?: string
  rdvLabel?: string
  sectionTitle?: string
  data?: CardComparisonData
  /** Per-column visibility — hiddenColumns[i] === true hides card column i. */
  hiddenColumns?: boolean[]
}

function valClass(text: string): string {
  const t = text.trim()
  if (t === "-" || t === "- €") return styles.valNone
  if (t === "Inclus") return styles.valIncluded
  return ""
}

function CardChip({ card }: { card: CardDef }) {
  return (
    <span className={styles.chip} data-theme={card.theme} aria-hidden="true">
      <span className={styles.chipTop}>
        <span className={styles.chipEmv} />
        <span className={styles.chipTier}>{card.tier}</span>
      </span>
      {card.network ? <span className={styles.chipNet}>{card.network}</span> : null}
    </span>
  )
}

function CardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M3 9.5h18" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CardComparison({
  rdvUrl = "#",
  rdvLabel = "Prendre rendez-vous",
  sectionTitle = "Compte pro et cartes",
  data = CARD_COMPARISON_DATA,
  hiddenColumns = [],
}: CardComparisonProps) {
  // Drop hidden columns from the card list AND every row's values, so the
  // desktop grid and the mobile carousel adapt to the visible count for free.
  const visibleIdx = data.cards.map((_, i) => i).filter((i) => !hiddenColumns[i])
  const cards = visibleIdx.map((i) => data.cards[i])
  const rows = data.rows.map((r) => ({
    ...r,
    values: visibleIdx.map((i) => r.values[i]),
  }))

  // Mobile carousel: framer-motion drag, controlled by `index` (leftmost card).
  // ~2 cards visible, step by one. `stride` (card width + gap) is measured from
  // the first card so the snap maths track the real layout across breakpoints.
  const CARDS_VISIBLE = 2
  const GAP = 12
  const viewportRef = useRef<HTMLDivElement>(null)
  const firstCardRef = useRef<HTMLDivElement>(null)
  const [stride, setStride] = useState(0)
  const [index, setIndex] = useState(0)
  const maxIndex = Math.max(0, cards.length - CARDS_VISIBLE)
  const clampedIndex = Math.min(index, maxIndex)

  // Floating bottom nav uses position:fixed (robust vs an ancestor overflow that
  // silently disables position:sticky in some host sections); show it only while
  // the mobile carousel is on screen. Mobile-only since it lives in .mobileView.
  const mobileRef = useRef<HTMLDivElement>(null)
  const [navInView, setNavInView] = useState(false)

  useEffect(() => {
    const el = mobileRef.current
    if (!el || typeof IntersectionObserver === "undefined") return
    const io = new IntersectionObserver(
      ([entry]) => setNavInView(entry.isIntersecting),
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const measure = () => {
      const card = firstCardRef.current
      if (card) setStride(card.offsetWidth + GAP)
    }
    measure()
    const vp = viewportRef.current
    if (!vp || typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(measure)
    ro.observe(vp)
    return () => ro.disconnect()
  }, [])

  const onDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = stride / 3 || 60
    if ((info.offset.x < -threshold || info.velocity.x < -400) && index < maxIndex) {
      setIndex(clampedIndex + 1)
    } else if ((info.offset.x > threshold || info.velocity.x > 400) && index > 0) {
      setIndex(clampedIndex - 1)
    }
  }

  const gridCols = `minmax(190px, 1.25fr) repeat(${cards.length}, minmax(0, 1fr))`

  const sectionHeader = (
    <span className={styles.sectionTitle}>
      <span className={styles.sectionIcon}>
        <CardIcon />
      </span>
      {sectionTitle}
    </span>
  )

  return (
    <section
      className={styles.root}
      style={{ ["--cc-grid" as string]: gridCols } as CSSProperties}
      aria-label={sectionTitle}
    >
      {/* ---------- Desktop ---------- */}
      <div className={styles.desktopView}>
        <div className={styles.cardsHeader}>
          <div className={styles.corner} aria-hidden="true" />
          {cards.map((card, i) => (
            <div className={styles.cardBox} key={i}>
              <CardChip card={card} />
              <span className={styles.cardName}>{card.name}</span>
              <a className={styles.rdvBtn} href={card.ctaHref ?? rdvUrl}>
                {card.ctaLabel ?? rdvLabel}
              </a>
            </div>
          ))}
        </div>

        <div className={styles.table} role="table" aria-label={sectionTitle}>
          <div className={styles.sectionBar}>
            <div className={styles.sectionTitleCell}>{sectionHeader}</div>
            {cards.map((card, i) => (
              <div className={styles.noteCell} key={i}>
                {card.note ? <span className={styles.note}>{card.note}</span> : null}
              </div>
            ))}
          </div>

          {rows.map((row, ri) => (
            <div className={styles.rowGroup} role="row" key={ri}>
              <div className={styles.rowLabel} role="rowheader">
                {row.label}
              </div>
              {row.values.map((v, ci) => (
                <div className={styles.cell} role="cell" key={ci}>
                  <span className={`${styles.cellMain} ${valClass(v.text)}`}>{v.text}</span>
                  {v.sub ? <span className={styles.cellSub}>{v.sub}</span> : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Mobile ---------- */}
      <div className={styles.mobileView} ref={mobileRef}>
        <div className={styles.mobileHead}>{sectionHeader}</div>

        <div className={styles.viewport} ref={viewportRef}>
          <motion.div
            className={styles.track}
            drag="x"
            dragConstraints={{ left: -maxIndex * stride, right: 0 }}
            dragElastic={0.12}
            animate={{ x: -clampedIndex * stride }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            onDragEnd={onDragEnd}
          >
            {cards.map((card, ci) => (
              <div className={styles.mCard} key={ci} ref={ci === 0 ? firstCardRef : undefined}>
                <div className={styles.mCardHead}>
                  <CardChip card={card} />
                  <span className={styles.cardName}>{card.name}</span>
                  <a className={styles.rdvBtn} href={card.ctaHref ?? rdvUrl} draggable={false}>
                    {card.ctaLabel ?? rdvLabel}
                  </a>
                  {card.note ? <span className={styles.mCardNote}>{card.note}</span> : null}
                </div>
                {rows.map((row, ri) => {
                  const v = row.values[ci]
                  if (!v) return null
                  return (
                    <div className={styles.mRow} key={ri}>
                      <div className={styles.mLabel}>{row.label}</div>
                      <div className={`${styles.mVal} ${valClass(v.text)}`}>
                        {v.text}
                        {v.sub ? <span className={styles.mSub}>{v.sub}</span> : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </motion.div>
        </div>

        <div className={`${styles.mNav} ${navInView ? "" : styles.mNavHidden}`}>
          <button
            type="button"
            className={styles.navArrow}
            aria-label="Cartes précédentes"
            disabled={clampedIndex === 0}
            onClick={() => setIndex(Math.max(0, clampedIndex - 1))}
          >
            <Chevron dir="left" />
          </button>

          <div className={styles.dots} role="tablist" aria-label="Navigation cartes">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.dot} ${i === clampedIndex ? styles.dotActive : ""}`}
                aria-label={`Position ${i + 1} sur ${maxIndex + 1}`}
                aria-selected={i === clampedIndex}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>

          <button
            type="button"
            className={styles.navArrow}
            aria-label="Cartes suivantes"
            disabled={clampedIndex === maxIndex}
            onClick={() => setIndex(Math.min(maxIndex, clampedIndex + 1))}
          >
            <Chevron dir="right" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default CardComparison
