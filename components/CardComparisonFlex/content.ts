import type {
  CardComparisonData,
  CardDef,
  CardTheme,
  CardValue,
} from "../CardComparison/CardComparison.types"
import { CARD_COMPARISON_DATA } from "../CardComparison/data"

/**
 * Content layer for the dynamic comparison component (V2).
 *
 * The Designer authors content in ONE prop, in either of two formats
 * (auto-detected):
 *   • JSON — the full CardComparisonData shape (expressive: themes, network,
 *     tier, per-cell sub-lines).
 *   • Delimited "paste-from-spreadsheet" — first line = card names (| separated),
 *     each following line = "Libellé | cellule1 | cellule2 | …"; a cell sub-line
 *     is written "valeur // sous-ligne". Card themes are auto-assigned by column.
 *
 * `parseContent` is PURE and DETERMINISTIC (no Date/Math.random, stable key
 * order) — it runs on the server during Webflow SSR, so any non-determinism
 * would cause a React hydration mismatch. It NEVER throws: a bad edit falls back
 * to the seed and reports an error string for the editor-only banner.
 */

/** Seed = V1's baked data, so the default render is identical to V1.
 *  Single-line JSON: props.Text in the Webflow panel may collapse newlines, so
 *  a minified default is robust there (the parser still accepts pretty JSON). */
export const SEED_DATA: CardComparisonData = CARD_COMPARISON_DATA
export const SEED_CONTENT: string = JSON.stringify(CARD_COMPARISON_DATA)

const THEMES: CardTheme[] = ["business", "gold", "excellence", "platinum"]
const themeForIndex = (i: number): CardTheme => THEMES[i % THEMES.length]

export interface ParseResult {
  data: CardComparisonData
  /** Set when the content could not be parsed (fell back to seed). */
  error?: string
  /** Editor-only notes about what was auto-corrected (count mismatches). */
  warnings: string[]
}

function defaultCard(i: number): CardDef {
  return { name: `Carte ${i + 1}`, theme: themeForIndex(i), network: "", tier: "" }
}

/** Clamp/pad an array to exactly `n` items using `pad(index)` for missing ones. */
function fit<T>(arr: T[], n: number, pad: (i: number) => T): T[] {
  const out = arr.slice(0, n)
  for (let i = out.length; i < n; i++) out.push(pad(i))
  return out
}

/** Force a parsed (possibly ragged/loose) structure into a colCount×rowCount grid. */
function reconcile(
  raw: { cards: CardDef[]; rows: { label: string; values: CardValue[] }[] },
  colCount: number,
  rowCount: number,
  warnings: string[],
): CardComparisonData {
  if (raw.cards.length !== colCount) {
    warnings.push(`Contenu : ${raw.cards.length} carte(s) mais "Nombre de cartes" = ${colCount} → ajusté.`)
  }
  if (raw.rows.length !== rowCount) {
    warnings.push(`Contenu : ${raw.rows.length} ligne(s) mais "Nombre de lignes" = ${rowCount} → ajusté.`)
  }
  const cards = fit(raw.cards, colCount, (i) => (SEED_DATA.cards[i] ? { ...SEED_DATA.cards[i] } : defaultCard(i)))
  const rows = fit(raw.rows, rowCount, () => ({ label: "", values: [] })).map((r) => ({
    label: r.label ?? "",
    values: fit(r.values ?? [], colCount, () => ({ text: "-" })),
  }))
  return { cards, rows }
}

/** Coerce an unknown JSON value into the CardComparisonData shape (defensive). */
function coerceJson(parsed: unknown): { cards: CardDef[]; rows: { label: string; values: CardValue[] }[] } {
  const obj = (parsed ?? {}) as Record<string, unknown>
  const rawCards = Array.isArray(obj.cards) ? obj.cards : []
  const rawRows = Array.isArray(obj.rows) ? obj.rows : []
  const cards: CardDef[] = rawCards.map((c, i) => {
    const o = (c ?? {}) as Record<string, unknown>
    const theme = THEMES.includes(o.theme as CardTheme) ? (o.theme as CardTheme) : themeForIndex(i)
    const card: CardDef = {
      name: String(o.name ?? `Carte ${i + 1}`),
      theme,
      network: String(o.network ?? ""),
      tier: String(o.tier ?? ""),
    }
    if (o.note != null && String(o.note).length > 0) card.note = String(o.note)
    return card
  })
  const rows = rawRows.map((r) => {
    const o = (r ?? {}) as Record<string, unknown>
    const rawValues = Array.isArray(o.values) ? o.values : []
    const values: CardValue[] = rawValues.map((v) => {
      const vo = (v ?? {}) as Record<string, unknown>
      const sub = vo.sub != null ? String(vo.sub) : undefined
      return sub ? { text: String(vo.text ?? ""), sub } : { text: String(vo.text ?? "") }
    })
    return { label: String(o.label ?? ""), values }
  })
  return { cards, rows }
}

/** Parse the delimited "paste-from-spreadsheet" format. */
function parseDelimited(raw: string): { cards: CardDef[]; rows: { label: string; values: CardValue[] }[] } {
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0)
  if (lines.length === 0) return { cards: [], rows: [] }
  const cardNames = lines[0].split("|").map((s) => s.trim()).filter((s) => s.length > 0)
  const cards: CardDef[] = cardNames.map((name, i) => ({ name, theme: themeForIndex(i), network: "", tier: "" }))
  const rows = lines.slice(1).map((line) => {
    const cells = line.split("|").map((s) => s.trim())
    const label = cells.shift() ?? ""
    const values: CardValue[] = cells.map((cell) => {
      const [text, sub] = cell.split("//").map((s) => s.trim())
      return sub ? { text, sub } : { text }
    })
    return { label, values }
  })
  return { cards, rows }
}

export function parseContent(raw: unknown, colCount: number, rowCount: number): ParseResult {
  const warnings: string[] = []
  // Coerce to string defensively: some Webflow prop types deliver a non-string
  // (e.g. a ReactNode), which would throw on .trim().
  const trimmed = String(raw ?? "").trim()

  // Empty → seed (default render = V1).
  if (!trimmed) {
    return { data: reconcile(coerceJson(SEED_DATA), colCount, rowCount, warnings), warnings }
  }

  // Auto-detect: JSON if it starts with { or [, else delimited.
  if (trimmed[0] === "{" || trimmed[0] === "[") {
    try {
      const structured = coerceJson(JSON.parse(trimmed))
      return { data: reconcile(structured, colCount, rowCount, warnings), warnings }
    } catch {
      return {
        data: reconcile(coerceJson(SEED_DATA), colCount, rowCount, warnings),
        error: "JSON invalide — affichage du contenu par défaut. Vérifie la syntaxe (virgules, guillemets).",
        warnings,
      }
    }
  }

  const delimited = parseDelimited(trimmed)
  return { data: reconcile(delimited, colCount, rowCount, warnings), warnings }
}
