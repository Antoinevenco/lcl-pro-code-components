/**
 * CSS Module bridge.
 *
 * Webflow's webpack-based bundler only exposes CSS Modules as named exports
 * (no default), while Vite exposes both. Importing the module here as a
 * namespace and re-exporting it as the default keeps consumer code identical
 * across both build tools.
 */
import * as classes from "./Search.module.css"

const styles = classes as unknown as Record<string, string>

export default styles
