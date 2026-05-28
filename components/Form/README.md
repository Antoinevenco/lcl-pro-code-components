# Form — LCL Pro contact form

A production code component: a contact form with three sections (**Identité**,
**Société**, **Message**), built with **react-hook-form + Zod** on top of
**Radix** primitives (the shadcn primitive structure), restyled with **CSS
Modules + Webflow design tokens**.

## Why no Tailwind / no raw shadcn classes

shadcn ships its components as Tailwind utility classes. A published Webflow
site does **not** load Tailwind's stylesheet, so those classes would render
unstyled on the live site. We therefore keep shadcn's accessible *structure*
(Radix radio-group / select / label / checkbox + the react-hook-form pattern)
but paint it with CSS Modules, which compile to real CSS that ships with the
component — exactly like `NavigationMenu`.

## Where the styling comes from

All colors, spacing, radii, and typography are `var(--_…)` tokens defined in
`/reference code/variables.css` (bundled globally by the Webflow site). See the
header comment in `Form.module.css` for the Figma → token mapping. Two values
have **no token yet** and are flagged with `TODO` in the CSS:

- the error red (`--form-error`), and
- the eyebrow's Montserrat face (the site only ships Inter).

## `.tsx` vs `.webflow.tsx`

- `Form.tsx` — pure React. Knows nothing about Webflow; runnable in Storybook /
  a Next app / tests. Exports `Form` (named + default) and `FormProps`.
- `Form.webflow.tsx` — the **only** file importing `@webflow/react`. Wraps
  `Form` with `declareComponent`, exposing Designer controls: `eyebrow`,
  `submitLabel`, `actionUrl`, `successMessage`, `errorMessage`, and a rich-text
  `consentLabel`.

## Files

```
Form.tsx               Pure component: useForm + zodResolver, layout, submit
Form.webflow.tsx       Webflow binding (declareComponent + PropTypes)
Form.types.ts          Presentation types (SelectOption, FormStatus)
schema.ts              Zod schema + inferred FormValues (validation source of truth)
Form.module.css        Token-driven styles
styles.ts              CSS-module bridge (webpack/Vite parity)
data/formConfig.ts     Radio + select option lists
primitives/            Field, TextInput, SelectField, RadioCardGroup,
                       TextareaField, ConsentCheckbox, SubmitButton, icons/
```

## Submission

On a valid submit the component:

1. **Primary — Webflow native** (`webflowForms.ts`): on a *published Webflow
   site* it POSTs to Webflow's own form endpoint
   (`https://webflow.com/api/v1/form/<data-wf-site>`, the same one `webflow.js`
   uses) under the `formName`. The submission is stored in **Site Settings →
   Forms** and triggers the **notification email** configured there. This works
   without webflow.js binding to the React form.
2. **Fallback** — if not on a published Webflow site (e.g. local preview) and an
   `actionUrl` is set, POSTs the values as JSON there.
3. Always calls the `onSubmit(values)` callback (pure-React usage).
4. Shows a success/error message in an `aria-live` region; resets on success.

### Getting submissions to an inbox

The component posts to Webflow; **the email destination is set in Webflow**, not
in code: Site Settings → **Forms** → set the notification email (e.g.
`antoine.venco@gmail.com`) and ensure forms send to Webflow. Field values are
sent with human-readable names (e.g. `Nom`, `E-mail`, `Motif de la demande`) and
select/radio values resolved to their labels. This path only runs on the
published site — the local Vite preview falls back to `actionUrl` / `onSubmit`.

## Adding / editing fields

1. Add the field to the Zod object in `schema.ts` (this also extends
   `FormValues`).
2. Add a default value in `defaultValues` in `Form.tsx` (`""` for text/selects,
   `false` for checkboxes, omit enums to start empty).
3. Render it inside the relevant `<fieldset>`: wrap in `<Field>` and use
   `register("name")` for text/textarea, or a `<Controller>` for
   select/radio/checkbox (which are controlled Radix primitives).

## Select options

`data/formConfig.ts` holds the option lists (Fonction, Chiffre d'affaires,
Nombre de salariés, Motif de la demande) as `SelectOption[]` of
`{ value, label }`. `value`s are stable slugs; edit labels/choices there.

## Conditional & special fields

- **Date de création** appears only when "Votre entreprise est-elle créée ?" is
  **Oui**, and is then required (enforced via `superRefine` in `schema.ts`).
- The **Message** textarea caps at `MESSAGE_MAX` (700) and shows a live
  "N caractères restants" counter.
- A required **consent** checkbox carries the privacy-policy notice, and a
  static **reCAPTCHA notice** sits below the submit button. Note: the reCAPTCHA
  notice is text only — actual reCAPTCHA verification is not wired (it would need
  a site key + script and a server-side check).
