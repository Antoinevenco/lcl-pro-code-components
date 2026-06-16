# RemoteForm — data-driven LCL Pro form

A code component that renders a form **defined in the LCL form-builder tool**,
fetched at runtime by id. It is the **data-driven counterpart** to the static
[`Form`](../Form/README.md): where `Form` hardcodes the contact fields,
`RemoteForm` fetches a field list from an external API and builds itself from
that — while looking visually identical, because it **reuses the same `Form`
primitives** and the same CSS-Module + Webflow-token styling.

## How it differs from `Form`

| | `Form` | `RemoteForm` |
| --- | --- | --- |
| Fields | Hardcoded (Identité · Société · Message) | Fetched from the form-builder by id |
| Validation | Static Zod schema (`schema.ts`) | Zod schema **built at runtime** (`dynamicSchema.ts`) |
| Submission | Webflow native endpoint / `actionUrl` | The form-builder **relay** (`/submit`) |
| Config | Many Designer props | Just `formId` + `apiBaseUrl` |

It still keeps the visual rhythm (eyebrow, section, field rows, required note,
submit button, `aria-live` status) and the Shadow-DOM Radix-portal fix from
`Form`.

## API contract (the integration spec)

`RemoteForm` talks to two endpoints under `{apiBaseUrl}` (e.g.
`https://your-site.webflow.io/forms`):

### `GET {apiBaseUrl}/api/v1/forms/{formId}/schema`

```jsonc
{
  "id": "…",
  "name": "…",
  "schema": {
    "fields": [
      { "id": "f1", "name": "email", "type": "email", "label": "E-mail", "required": true, "placeholder": "vous@exemple.fr" }
    ],
    "submitLabel": "Envoyer"
  },
  "token": "…" // single-use HMAC token, sent back on submit
}
```

`Field.type` is one of `text | email | tel | textarea | select | radio |
checkbox`. `options` is present for `select`/`radio`, and for `checkbox` when
it is a multi-checkbox group. A `checkbox` **without** `options` is a single
boolean consent-style checkbox.

### `POST {apiBaseUrl}/api/v1/forms/{formId}/submit`

Header `Content-Type: application/json`, body:

```jsonc
{
  "token": "…",      // from the schema response
  "_hp": "",          // honeypot value (always sent; "" for real users)
  "data": { /* { [field.name]: value } */ }
}
```

**Value encoding** (in `relay.ts → buildSubmissionData`):

- single checkbox (no options) → `boolean`
- checkbox **with** options → `string[]` (selected option values)
- everything else → `string`

Empty **optional** fields are omitted (the relay validates with `.strict()`,
and optional fields are `.optional()`). Required fields are always included;
empty required text is sent as `""`. Response is `{ ok: boolean }` — success on
`ok: true`, error otherwise.

## Field type → primitive mapping

| `field.type` | Primitive | Wiring | Submitted value |
| --- | --- | --- | --- |
| `text` / `email` / `tel` | `Form/TextInput` (`type` set) | `register` | string |
| `textarea` | `Form/TextareaField` | `register` | string |
| `select` | `Form/SelectField` | `Controller` | string |
| `radio` | `Form/RadioCardGroup` | `Controller` | string |
| `checkbox` **with** options | `RemoteForm/CheckboxGroup` (new) | `Controller` | string[] |
| `checkbox` **without** options | `Form/ConsentCheckbox` | `Controller` | boolean |

`CheckboxGroup` is the only new primitive — `Form` has no multi-checkbox. It is
built on `@radix-ui/react-checkbox` (like `ConsentCheckbox`) and styled to match
`RadioCardGroup`'s bordered cards, with the same Webflow tokens. The select
placeholder defaults to `field.placeholder ?? "— Choisir —"`.

## Validation (`dynamicSchema.ts`)

Mirrors the form-builder's server-side `lib/form-schema.ts`:

- text: required → `string().min(1).max(500)`, else `.max(500)`
- textarea: required → `min(1).max(5000)`, else `.max(5000)`
- email: `string().email().max(254)`
- tel: `string().regex(/^[+0-9 ().-]{6,20}$/)`
- select / radio: `enum(options)`
- checkbox **with** options: `array(enum(options))`, required → `.min(1)`
- checkbox **without** options: required → `literal(true)`, else `boolean()`
- non-required → `.optional()` (empty `""` / `[]` mapped to `undefined` first)

Messages are French, consistent with `Form/schema.ts`. The relay re-validates
server-side and is the source of truth; this schema gives instant inline
feedback via `react-hook-form` + `zodResolver`.

## `.tsx` vs `.webflow.tsx`

- `RemoteForm.tsx` — pure React; no Webflow imports. Fetches the schema on
  mount, manages `loading | ready | error | submitting | success`, renders
  fields via `FieldRenderer`, includes the off-screen honeypot, pins Radix
  portals to the form root.
- `RemoteForm.webflow.tsx` — the **only** file importing `@webflow/react`.

## Props (Designer controls)

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `formId` | Text | `""` | Id of the published form in the tool |
| `apiBaseUrl` | Text | `""` | e.g. `https://your-site.webflow.io/forms` |
| `eyebrow` | Text | `""` | Optional uppercase tagline |
| `successMessage` | Text | "Merci, votre demande a bien été envoyée." | |
| `errorMessage` | Text | "Une erreur est survenue. Veuillez réessayer." | |

## Files

```
RemoteForm.tsx           Pure component: fetch + lifecycle + form shell + honeypot
RemoteForm.webflow.tsx   Webflow binding (declareComponent + PropTypes)
RemoteForm.types.ts      API-contract types (Field, FormSchema, status, …)
dynamicSchema.ts         Runtime Zod schema builder + default values
FieldRenderer.tsx        field.type → existing primitive mapping
relay.ts                 fetch schema / build payload / POST submit
RemoteForm.module.css    Token-driven shell + checkbox-group + loading/error styles
styles.ts                CSS-module bridge (webpack/Vite parity)
primitives/
  CheckboxGroup.tsx       Multi-checkbox group (new; Form has no equivalent)
```

The text/select/radio/textarea/consent primitives and icons are **reused from
`../Form/primitives/`** — not duplicated — so both components stay in visual
lockstep.

## Integration requirements

For `RemoteForm` to work on a published Webflow site:

1. **The form-builder app must be deployed and reachable at `apiBaseUrl`.**
   Set `apiBaseUrl` to wherever the tool serves its `/api/v1/forms/...` routes
   (e.g. the Webflow Cloud mount path or a custom domain).
2. **CORS** — the Webflow site's origin must be listed in the form-builder's
   `ALLOWED_EMBED_ORIGINS` environment variable, or the browser will block the
   schema fetch and the submit POST.
3. **The form must be published in the tool** — the schema endpoint only
   returns forms whose status is `published` (a draft returns 404, surfaced as
   the component's "could not load" state).
4. The form-builder's destination URL (where it forwards submissions) must be
   on its own destination allowlist; otherwise the relay returns a non-`ok`
   response and the component shows `errorMessage`.

## Notes

- The relay enforces a single-use HMAC token with a time window, plus a
  honeypot and per-IP rate limits. The component always sends the honeypot
  (`_hp`, normally `""`) at the payload top level — it is **not** part of the
  validated `data` and is excluded from the dynamic Zod schema.
- `ssr: false` because the component fetches and renders on the client.
