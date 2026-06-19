import { declareComponent } from "@webflow/react"
import { props } from "@webflow/data-types"
import RotatingHeadline from "./RotatingHeadline"

/**
 * Webflow passes Text props as plain strings and Number props as numbers.
 * This wire-shape type mirrors that; the pure `RotatingHeadlineProps` keeps its
 * fields optional with defaults.
 */
type WebflowProps = {
  text: string
  values: string
  intervalMs: number
}

// This file pairs a wrapper component with a `declareComponent(...)` default
// export (the Webflow binding), so the file legitimately has a non-component
// export. react-refresh/only-export-components is disabled for *.webflow.tsx
// in eslint.config.js (Fast Refresh doesn't apply to the Webflow build).
function RotatingHeadlineWebflow({ text, values, intervalMs }: WebflowProps) {
  return <RotatingHeadline text={text} values={values} intervalMs={intervalMs} />
}

export default declareComponent(RotatingHeadlineWebflow, {
  name: "Rotating Headline",
  description:
    "An H1 headline with a static lead phrase followed by a word that cycles through a comma-separated list. Each word rises in from the bottom and fades, the previous lifts up and fades out (300ms ease-out). Uses the site's u-text-style-h1 typography.",
  group: "LCL",
  props: {
    text: props.Text({
      name: "Lead text",
      defaultValue: "la banque de tous les",
    }),
    values: props.Text({
      name: "Rotating words (comma-separated)",
      defaultValue: "entrepreneurs, pro, entrepreneuses, artisans, freelances",
    }),
    intervalMs: props.Number({
      name: "Word duration (ms)",
      defaultValue: 2200,
    }),
  },
  options: {
    // Animation + interval are browser-only; render the first word statically
    // on the server, hydrate to start rotating. SSR is safe here, so leave it on.
  },
})
