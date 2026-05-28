/**
 * Shared types for the Form component.
 *
 * The Zod schema in `schema.ts` is the source of truth for field *values*
 * (`FormValues`). The types here describe *presentation* config — the option
 * lists fed to selects/radios — kept in `data/formConfig.ts` so labels and
 * choices can be retuned (or later wired to Webflow CMS) without touching the
 * React components.
 */

/** A single choice in a select or radio group. */
export type SelectOption = {
  value: string
  label: string
}

/** Submission lifecycle, surfaced to the user via an aria-live region. */
export type FormStatus = "idle" | "submitting" | "success" | "error"
