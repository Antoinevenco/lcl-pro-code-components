/**
 * Build a Zod schema at runtime from a fetched `Field[]`.
 *
 * This mirrors the validation rules of the form-builder tool's server-side
 * `lib/form-schema.ts` (`fieldValidator`), so the client rejects the same
 * inputs the relay would. Messages are in French to match the LCL Pro UI
 * (consistent with `Form/schema.ts`).
 *
 * The relay re-validates server-side and is the source of truth; this schema
 * exists for instant inline feedback via react-hook-form + zodResolver.
 */
import { z } from "zod"
import type { Field } from "./RemoteForm.types"

/** Max lengths — kept identical to the tool's `fieldValidator`. */
const TEXT_MAX = 500
const TEXTAREA_MAX = 5000
const EMAIL_MAX = 254

/** Lenient phone pattern — identical to the tool's `tel` rule. */
const TEL_REGEX = /^[+0-9 ().-]{6,20}$/

/** The react-hook-form value for one field, before submission encoding. */
export type FieldValue = string | string[] | boolean | undefined

/** A flat map of `{ [field.name]: value }`, as react-hook-form holds it. */
export type RemoteFormValues = Record<string, FieldValue>

/**
 * Per-field Zod validator. Required fields are validated as-is; optional ones
 * are wrapped in `.optional()` so empty values pass and can be omitted from the
 * payload.
 */
function fieldValidator(field: Field): z.ZodTypeAny {
  const { label } = field
  let validator: z.ZodTypeAny

  switch (field.type) {
    case "text":
      validator = field.required
        ? z
            .string()
            .min(1, `${label} est requis`)
            .max(TEXT_MAX, `${label} ne doit pas dépasser ${TEXT_MAX} caractères`)
        : z.string().max(TEXT_MAX, `${label} ne doit pas dépasser ${TEXT_MAX} caractères`)
      break

    case "textarea":
      validator = field.required
        ? z
            .string()
            .min(1, `${label} est requis`)
            .max(TEXTAREA_MAX, `${label} ne doit pas dépasser ${TEXTAREA_MAX} caractères`)
        : z.string().max(TEXTAREA_MAX, `${label} ne doit pas dépasser ${TEXTAREA_MAX} caractères`)
      break

    case "email":
      validator = z
        .string()
        .email("Adresse email invalide")
        .max(EMAIL_MAX, `${label} ne doit pas dépasser ${EMAIL_MAX} caractères`)
      break

    case "tel":
      validator = z.string().regex(TEL_REGEX, "Numéro de téléphone invalide")
      break

    case "select":
    case "radio":
      validator = z.enum((field.options ?? []) as [string, ...string[]], {
        error: `Veuillez sélectionner une option pour « ${label} »`,
      })
      break

    case "checkbox":
      if (field.options) {
        // Multi-checkbox group → array of selected option values.
        const arr = z.array(
          z.enum((field.options ?? []) as [string, ...string[]]),
        )
        validator = field.required
          ? arr.min(1, `Veuillez sélectionner au moins une option pour « ${label} »`)
          : arr
      } else {
        // Single boolean consent-style checkbox.
        validator = field.required
          ? z.literal(true, {
              error: `Vous devez cocher « ${label} »`,
            })
          : z.boolean()
      }
      break
  }

  if (field.required) return validator

  // Optional field: an empty string (text/email/tel/select/radio) or empty
  // array (checkbox group) means "not filled in". `.optional()` only accepts
  // `undefined`, so map empties to `undefined` before the strict validator —
  // otherwise an untouched optional email/tel/select/radio (seeded with "")
  // would fail validation and silently block the whole form from submitting.
  return z.preprocess(
    (v) => (v === "" || (Array.isArray(v) && v.length === 0) ? undefined : v),
    validator.optional(),
  )
}

/**
 * Compose a `z.object(shape)` keyed by each field's `name`. The honeypot is
 * NOT part of this schema — it is submitted separately at the payload's top
 * level (`_hp`), exactly like the relay expects.
 */
export function buildDynamicSchema(fields: Field[]) {
  const shape: Record<string, z.ZodTypeAny> = {}
  for (const field of fields) {
    shape[field.name] = fieldValidator(field)
  }
  return z.object(shape)
}

/**
 * Default react-hook-form values for a field set: empty string for
 * text-like/select/radio, `[]` for multi-checkbox groups, `false` for single
 * checkboxes. Selects/radios start at `""` (no selection) like `Form.tsx`.
 */
export function buildDefaultValues(fields: Field[]): RemoteFormValues {
  const values: RemoteFormValues = {}
  for (const field of fields) {
    if (field.type === "checkbox") {
      values[field.name] = field.options ? [] : false
    } else {
      values[field.name] = ""
    }
  }
  return values
}
