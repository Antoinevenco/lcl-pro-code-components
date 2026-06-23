import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import styles from "./styles"

/**
 * RotatingHeadline — pure React component (zero `@webflow` imports).
 *
 * Renders a static lead string followed by a single word that cycles through a
 * comma-separated list, e.g.:
 *
 *   text   = "la banque de tous les"
 *   values = "entrepreneurs, pro, entrepreneuses, artisans, freelances"
 *
 *   → "la banque de tous les entrepreneurs"
 *   → "la banque de tous les pro"
 *   → …
 *
 * The whole line carries the Webflow `u-text-style-h1` utility class so it
 * inherits the site's H1 typography tokens. Motion: the entering word rises
 * from the bottom while fading in; the outgoing word lifts up while fading out
 * (300ms ease-out, overlapping). Honors `prefers-reduced-motion`.
 */

export type RotatingHeadlineProps = {
  /** Static lead text shown before the rotating word. */
  text?: string
  /** Comma-separated list of words to cycle through. */
  values?: string
  /** Time each word stays on screen, in milliseconds. */
  intervalMs?: number
}

/** Vertical travel for the in/out transition. Small enough that the fade hides
 *  the word before it intrudes on neighboring lines (so no clipping needed). */
const SLIDE = "0.55em"
/** 300ms ease-out, as specified. ease-out cubic-bezier keeps it framework-agnostic. */
const TRANSITION = { duration: 0.3, ease: [0, 0, 0.2, 1] as const }

function parseValues(values: string): string[] {
  return values
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
}

export function RotatingHeadline({
  text = "la banque de tous les",
  values = "entrepreneurs, pro, entrepreneuses, artisans, freelances",
  intervalMs = 2200,
}: RotatingHeadlineProps) {
  const words = parseValues(values)
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (words.length <= 1) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length)
    }, Math.max(600, intervalMs))
    return () => clearInterval(id)
  }, [words.length, intervalMs])

  // Clamp during render rather than resetting via an effect: if `values`
  // shrinks, `index` can point past the end until the interval next ticks.
  const safeIndex = words.length ? index % words.length : 0
  const current = words[safeIndex] ?? ""
  const offset = reduceMotion ? "0em" : SLIDE

  return (
    <h1 className={`u-text-style-h1 ${styles.root}`}>
      {text ? <span className={styles.lead}>{text} </span> : null}
      <span className={styles.rotator}>
        {/* Invisible sizer reserves the worst-case footprint: every word is
            stacked in the same grid cell, so the box sizes to the widest AND
            tallest (after wrapping) word. The animated words are absolutely
            positioned on top, so the box never collapses or jumps — no shift
            during a word's animation, and none between words either. */}
        <span aria-hidden className={styles.sizer}>
          {words.length ? (
            words.map((w, i) => (
              <span key={i} className={styles.ghost}>
                {w}
              </span>
            ))
          ) : (
            <span className={styles.ghost}>&nbsp;</span>
          )}
        </span>
        <span aria-live="polite" className={styles.live}>
          <AnimatePresence initial={false}>
            <motion.span
              key={safeIndex}
              className={styles.word}
              initial={{ y: offset, opacity: 0 }}
              animate={{ y: "0em", opacity: 1 }}
              exit={{ y: `-${offset}`, opacity: 0 }}
              transition={TRANSITION}
            >
              {current}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </h1>
  )
}

export default RotatingHeadline
