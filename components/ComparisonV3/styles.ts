/**
 * CSS Module bridge — Webflow's bundler exposes CSS Modules as named exports
 * only; Vite exposes both. Re-export the namespace as default so consumer code
 * is identical across both build tools.
 */
import * as classes from "./ComparisonV3.module.css"

const styles = classes as unknown as Record<string, string>

export default styles
