import { useMemo, type CSSProperties } from "react"
import CardComparison from "../CardComparison/CardComparison"
import { parseContent, SEED_CONTENT } from "./content"

/**
 * LCL Card Comparison — dynamic (V2).
 *
 * A thin wrapper around the V1 <CardComparison>: it turns two Number props
 * (colCount / rowCount) plus one structured-content prop into a reconciled
 * CardComparisonData, then renders V1 — so the desktop grid, the framer-motion
 * mobile carousel (with sticky arrows + dots) and all styling are reused as-is,
 * with zero duplication and zero regression to V1.
 *
 * Content is authored in ONE field, JSON or delimited (auto-detected, see
 * ./content.ts). Counts are the source of truth for dimensions; the content is
 * padded/truncated to match (reconcile), and an editor-only banner surfaces any
 * mismatch or parse error. The `key` forces a clean remount (carousel index
 * reset) whenever the dimensions change.
 *
 * Pure React (no @webflow import): `editorMode` is supplied by the .webflow
 * binding via useWebflowContext().
 */

export interface CardComparisonFlexProps {
  colCount?: number
  rowCount?: number
  /** Content as JSON (CardComparisonData) OR delimited "paste-from-spreadsheet". */
  contentData?: string
  sectionTitle?: string
  rdvLabel?: string
  rdvUrl?: string
  /** True on the Webflow canvas (non-interactive modes) → show authoring warnings. */
  editorMode?: boolean
}

function clampInt(v: number, min: number, max: number, fallback: number): number {
  const n = Math.round(Number(v))
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, n))
}

const bannerStyle: CSSProperties = {
  margin: "0 0 12px",
  padding: "8px 14px",
  borderRadius: 10,
  background: "#fff4e5",
  border: "1px solid #ffd8a8",
  color: "#8a5a00",
  fontSize: "0.85rem",
  lineHeight: 1.4,
  fontFamily: "system-ui, -apple-system, sans-serif",
}

export function CardComparisonFlex({
  colCount = 4,
  rowCount = 14,
  contentData = SEED_CONTENT,
  sectionTitle = "Compte pro et cartes",
  rdvLabel = "Prendre rendez-vous",
  rdvUrl = "#",
  editorMode = false,
}: CardComparisonFlexProps) {
  const cols = clampInt(colCount, 1, 6, 4)
  const rowsN = clampInt(rowCount, 1, 30, 14)

  const { data, error, warnings } = useMemo(
    () => parseContent(contentData, cols, rowsN),
    [contentData, cols, rowsN],
  )

  return (
    <>
      {editorMode && (error || warnings.length > 0) ? (
        <div style={bannerStyle} role="status">
          <strong>Éditeur · </strong>
          {error ? error + " " : null}
          {warnings.join(" ")}
        </div>
      ) : null}
      <CardComparison
        key={`${cols}x${rowsN}`}
        data={data}
        rdvUrl={rdvUrl}
        rdvLabel={rdvLabel}
        sectionTitle={sectionTitle}
      />
    </>
  )
}

export default CardComparisonFlex
