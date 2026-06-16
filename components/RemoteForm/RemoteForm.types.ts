/**
 * Shared types for the RemoteForm component.
 *
 * Unlike the static `Form` (whose field set is hardcoded), `RemoteForm` is
 * data-driven: it fetches a form definition from the LCL form-builder tool and
 * renders it. These types mirror the form-builder's public API contract
 * (`GET /api/v1/forms/{id}/schema`). The runtime Zod schema used for client
 * validation is built dynamically in `dynamicSchema.ts`.
 */

/** Supported field types — mirrors the form-builder's `fieldSchema` union. */
export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"

/**
 * One field of a fetched form definition.
 *
 * `options` is present for `select`/`radio`, and for `checkbox` when it is a
 * multi-checkbox group. A `checkbox` *without* `options` is a single boolean
 * consent-style checkbox.
 */
export type Field = {
  id: string
  /** Stable machine name; the key under which the value is submitted. */
  name: string
  type: FieldType
  label: string
  required: boolean
  placeholder?: string
  options?: string[]
}

/** The `schema` object returned by the schema endpoint. */
export type FormSchema = {
  fields: Field[]
  submitLabel: string
}

/** Full payload of `GET /api/v1/forms/{id}/schema`. */
export type FormSchemaResponse = {
  id: string
  name: string
  schema: FormSchema
  /** Single-use HMAC token to send back with the submission. */
  token: string
}

/** Response of `POST /api/v1/forms/{id}/submit`. */
export type SubmitResponse = {
  ok: boolean
}

/**
 * Component lifecycle:
 * - `loading`    — fetching the schema on mount
 * - `ready`      — schema loaded, form is interactive
 * - `error`      — schema fetch failed (form cannot be rendered)
 * - `submitting` — a valid submission is in flight
 * - `success`    — the relay accepted the submission (`{ ok: true }`)
 */
export type RemoteFormStatus =
  | "loading"
  | "ready"
  | "error"
  | "submitting"
  | "success"

/** A single choice in a select / radio / checkbox-group control. */
export type SelectOption = {
  value: string
  label: string
}
