/**
 * Form-builder relay client.
 *
 * Talks to the LCL form-builder tool's public API:
 *   GET  {apiBaseUrl}/api/v1/forms/{formId}/schema   → fetch the definition
 *   POST {apiBaseUrl}/api/v1/forms/{formId}/submit    → relay a submission
 *
 * The relay re-validates server-side and is the source of truth; the client
 * builds the same shape it expects. See the form-builder's
 * `app/api/v1/forms/[id]/{schema,submit}/route.ts`.
 */
import type {
  Field,
  FormSchemaResponse,
  SubmitResponse,
} from "./RemoteForm.types"
import type { RemoteFormValues } from "./dynamicSchema"

/** Trim a trailing slash so `${base}/api/...` never doubles up. */
const normalizeBase = (base: string) => base.replace(/\/+$/, "")

/** Fetch a published form's definition + a single-use submission token. */
export async function fetchFormSchema(
  apiBaseUrl: string,
  formId: string,
  signal?: AbortSignal,
): Promise<FormSchemaResponse> {
  const url = `${normalizeBase(apiBaseUrl)}/api/v1/forms/${encodeURIComponent(formId)}/schema`
  const res = await fetch(url, { signal })
  if (!res.ok) {
    throw new Error(`Schema fetch failed (HTTP ${res.status})`)
  }
  return (await res.json()) as FormSchemaResponse
}

/**
 * Build the `data` payload from react-hook-form values, encoding each value by
 * its field type:
 * - single checkbox (no options) → boolean
 * - checkbox WITH options        → string[] (selected option values)
 * - everything else              → string
 *
 * Empty *optional* fields are omitted (the relay validates with `.strict()`,
 * and optional fields are `.optional()`, so omission is correct). Required
 * fields are always included — empty required text is sent as "" (the relay
 * rejects it, mirroring client validation).
 */
export function buildSubmissionData(
  fields: Field[],
  values: RemoteFormValues,
): Record<string, string | string[] | boolean> {
  const data: Record<string, string | string[] | boolean> = {}

  for (const field of fields) {
    const raw = values[field.name]

    if (field.type === "checkbox" && field.options) {
      const arr = Array.isArray(raw) ? raw : []
      if (field.required || arr.length > 0) data[field.name] = arr
      continue
    }

    if (field.type === "checkbox") {
      const bool = raw === true
      if (field.required || bool) data[field.name] = bool
      continue
    }

    // text / email / tel / textarea / select / radio → string.
    const str = typeof raw === "string" ? raw : ""
    if (field.required || str.length > 0) data[field.name] = str
  }

  return data
}

/**
 * POST a submission to the relay. Always sends the honeypot value (`_hp`,
 * normally "") at the top level alongside the `token` and `data`. Returns the
 * `{ ok }` flag; a non-2xx response is treated as `{ ok: false }`.
 */
export async function submitToRelay(
  apiBaseUrl: string,
  formId: string,
  payload: {
    token: string
    honeypot: string
    data: Record<string, string | string[] | boolean>
  },
): Promise<SubmitResponse> {
  const url = `${normalizeBase(apiBaseUrl)}/api/v1/forms/${encodeURIComponent(formId)}/submit`
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: payload.token,
      _hp: payload.honeypot,
      data: payload.data,
    }),
  })
  const json = (await res.json().catch(() => null)) as SubmitResponse | null
  return { ok: res.ok && json?.ok === true }
}
