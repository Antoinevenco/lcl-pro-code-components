/**
 * CSS Module bridge — Webflow's bundler exposes CSS Modules as named exports
 * only (no default), Vite exposes both. Re-export the namespace as default so
 * consumer code stays identical across both build tools.
 */
import * as classes from "./CardComparison.module.css"

const styles = classes as unknown as Record<string, string>

export default styles
