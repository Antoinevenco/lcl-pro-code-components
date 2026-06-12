import { useEffect, useRef, useState } from "react"

import { CtaButton } from "../primitives/CtaButton"
import { SelectField } from "../Form/primitives/SelectField"
import type { Offer } from "./OfferFilter.types"
import styles from "./styles"

/**
 * Selectors and conventions for the *outside* DOM this component drives.
 * Hoisted so a future rename only touches one place.
 *
 *   CELL_SELECTOR        — every comparison-table cell the filter can hide
 *   ALWAYS_VISIBLE_CLASSES — cells that must never be hidden (titles, shared rows)
 *   cellClassForValue(v) — the class added to a column's cells (e.g. `lbylcl-offer`)
 *   CARD_SELECTOR        — every offer card on mobile
 *   cardSelectorForValue(v) — pinpoint a specific offer card
 *   COMPACT_QUERY        — breakpoint at/under which the page collapses
 *                          to a single column + a single card (mobile)
 */
const CELL_SELECTOR = ".offer-table-cell_wrap"
const ALWAYS_VISIBLE_CLASSES = ["header", "common"]
const cellClassForValue = (value: string) => `${value}-offer`
const CARD_SELECTOR = "[data-filter-card]"
const cardSelectorForValue = (value: string) => `[data-filter-card="${value}"]`
const COMPACT_QUERY = "(max-width: 479px)"

export type OfferFilterProps = {
  /** Selectable offers, in display order. */
  offers: Offer[]
  /** Slug of the offer selected on first mobile paint. Falls back to offers[0]. */
  defaultValue?: string
  /** Primary CTA label rendered under the dropdown. */
  ctaLabel?: string
  /** Primary CTA destination. */
  ctaHref?: string
  /** `target` for the CTA (defaults to `_self`). */
  ctaTarget?: string
  /** Optional card-top illustration. */
  imageSrc?: string
  imageAlt?: string
}

export function OfferFilter({
  offers,
  defaultValue,
  ctaLabel = "Prendre rendez-vous",
  ctaHref = "#",
  ctaTarget,
  imageSrc,
  imageAlt = "",
}: OfferFilterProps) {
  // Bail out of every effect (and the dropdown itself) when no offers are
  // configured — the component should be inert on a misconfigured page.
  const fallback = offers[0]?.value ?? ""
  const initial = defaultValue && offers.some((o) => o.value === defaultValue)
    ? defaultValue
    : fallback

  const [value, setValue] = useState<string>(initial)

  /**
   * Shadow-DOM-safe Portal target. Radix Select portals to `document.body`
   * by default, which lives *outside* this component's shadow root and would
   * render the dropdown menu unstyled (the stylesheet is bundled into the
   * shadow). We pin the Portal to the component root instead — same pattern
   * as the Form component.
   */
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

  /**
   * Drive the *outside* DOM. Runs only on the client (component is rendered
   * with `ssr: false` in the Webflow binding), but we still guard with a
   * mounted-effect pattern so the file remains safe to render in a pure-React
   * SSR test harness later.
   *
   * Logic mirrors the brief's filtering contract:
   *   - desktop  → reset every inline `display` we set (let site CSS win)
   *   - compact  → show the matching card + its column cells + always-visible
   */
  useEffect(() => {
    if (offers.length === 0) return
    if (typeof window === "undefined" || typeof document === "undefined") return

    const mql = window.matchMedia(COMPACT_QUERY)
    const cellsCache = new Set<HTMLElement>()
    const cardsCache = new Set<HTMLElement>()

    const collect = () => {
      document
        .querySelectorAll<HTMLElement>(CELL_SELECTOR)
        .forEach((el) => cellsCache.add(el))
      document
        .querySelectorAll<HTMLElement>(CARD_SELECTOR)
        .forEach((el) => cardsCache.add(el))
    }

    const apply = () => {
      collect()

      if (!mql.matches) {
        // Desktop: clear anything we previously hid. Setting display to "" lets
        // the site's own CSS take over — do not hardcode block/flex.
        cellsCache.forEach((el) => {
          el.style.display = ""
        })
        cardsCache.forEach((el) => {
          el.style.display = ""
        })
        return
      }

      // Compact: only one card + (always-visible | active offer's column) cells.
      const activeCardSelector = cardSelectorForValue(value)
      const activeCellClass = cellClassForValue(value)

      cardsCache.forEach((el) => {
        el.style.display = el.matches(activeCardSelector) ? "" : "none"
      })
      cellsCache.forEach((el) => {
        const keep =
          ALWAYS_VISIBLE_CLASSES.some((c) => el.classList.contains(c)) ||
          el.classList.contains(activeCellClass)
        el.style.display = keep ? "" : "none"
      })
    }

    apply()
    mql.addEventListener("change", apply)
    return () => {
      mql.removeEventListener("change", apply)
      // Restore display on unmount so a remount doesn't inherit stale state.
      cellsCache.forEach((el) => {
        el.style.display = ""
      })
      cardsCache.forEach((el) => {
        el.style.display = ""
      })
    }
  }, [value, offers.length])

  if (offers.length === 0) return null

  const selectOptions = offers.map((o) => ({ value: o.value, label: o.title }))

  return (
    <div
      ref={(node) => {
        rootRef.current = node
        setPortalContainer(node)
      }}
      className={styles.root}
    >
      {imageSrc ? (
        <img className={styles.media} src={imageSrc} alt={imageAlt} />
      ) : null}

      <SelectField
        id="offer-filter"
        value={value}
        onValueChange={setValue}
        options={selectOptions}
        ariaLabel="Sélection de carte"
        portalContainer={portalContainer}
        triggerClassName={styles.trigger}
        iconClassName={styles.icon}
        contentClassName={styles.content}
      />

      <CtaButton
        href={ctaHref}
        label={ctaLabel}
        target={ctaTarget}
        rel={ctaTarget === "_blank" ? "noopener noreferrer" : undefined}
        block
      />
    </div>
  )
}

export default OfferFilter
