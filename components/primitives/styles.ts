/**
 * CSS Module bridge — same pattern as NavigationMenu/styles.ts and
 * OfferFilter/styles.ts: Webflow's webpack exposes CSS Modules only as named
 * exports while Vite exposes both, so we re-export the namespace as default to
 * keep import sites identical across build tools.
 */
import * as classes from "./CtaButton.module.css"

const styles = classes as unknown as Record<string, string>

export default styles
