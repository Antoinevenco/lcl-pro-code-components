import { Controller } from "react-hook-form"
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form"

import type { Field as FieldDef, SelectOption } from "./RemoteForm.types"
import type { RemoteFormValues } from "./dynamicSchema"

// Reuse the existing Form primitives so RemoteForm is visually identical.
import { Field } from "../Form/primitives/Field"
import { TextInput } from "../Form/primitives/TextInput"
import { SelectField } from "../Form/primitives/SelectField"
import { RadioCardGroup } from "../Form/primitives/RadioCardGroup"
import { TextareaField } from "../Form/primitives/TextareaField"
import { ConsentCheckbox } from "../Form/primitives/ConsentCheckbox"
// New multi-checkbox primitive (lives in RemoteForm — no Form equivalent).
import { CheckboxGroup } from "./primitives/CheckboxGroup"

/** Max characters for a dynamic textarea — mirrors `dynamicSchema` (textarea). */
const TEXTAREA_MAX = 5000

export type FieldRendererProps = {
  field: FieldDef
  control: Control<RemoteFormValues>
  register: UseFormRegister<RemoteFormValues>
  errors: FieldErrors<RemoteFormValues>
  /** Current textarea length (from react-hook-form `watch`) for the counter. */
  valueLength?: number
  /** Radix Portal target — the form root inside the Shadow DOM (see RemoteForm). */
  portalContainer: HTMLElement | null
}

/** Map a string option to the `{ value, label }` shape the primitives expect. */
const toOptions = (options?: string[]): SelectOption[] =>
  (options ?? []).map((o) => ({ value: o, label: o }))

/**
 * Render one fetched field with the appropriate existing primitive, wired to
 * react-hook-form exactly like `Form.tsx`:
 * - text/email/tel → `TextInput` via `register`
 * - textarea       → `TextareaField` via `register`
 * - select         → `SelectField` via `Controller`
 * - radio          → `RadioCardGroup` via `Controller`
 * - checkbox+opts  → `CheckboxGroup` via `Controller` (value is string[])
 * - checkbox       → `ConsentCheckbox` via `Controller` (value is boolean)
 */
export function FieldRenderer({
  field,
  control,
  register,
  errors,
  valueLength = 0,
  portalContainer,
}: FieldRendererProps) {
  const { name, label, required, placeholder } = field
  const error = errors[name]?.message as string | undefined
  const invalid = !!errors[name]
  const describedBy = error ? `${name}-error` : undefined

  switch (field.type) {
    case "text":
    case "email":
    case "tel":
      return (
        <Field label={label} htmlFor={name} required={required} error={error}>
          <TextInput
            id={name}
            type={field.type}
            placeholder={placeholder}
            invalid={invalid}
            aria-describedby={describedBy}
            {...register(name)}
          />
        </Field>
      )

    case "textarea":
      return (
        <Field label={label} htmlFor={name} required={required} error={error}>
          <TextareaField
            id={name}
            charLimit={TEXTAREA_MAX}
            valueLength={valueLength}
            placeholder={placeholder}
            invalid={invalid}
            aria-describedby={describedBy}
            {...register(name)}
          />
        </Field>
      )

    case "select":
      return (
        <Field label={label} htmlFor={name} required={required} error={error}>
          <Controller
            control={control}
            name={name}
            render={({ field: f }) => (
              <SelectField
                id={name}
                value={(f.value as string) ?? ""}
                onValueChange={f.onChange}
                onBlur={f.onBlur}
                options={toOptions(field.options)}
                placeholder={placeholder ?? "— Choisir —"}
                invalid={invalid}
                describedBy={describedBy}
                portalContainer={portalContainer}
              />
            )}
          />
        </Field>
      )

    case "radio":
      return (
        <Field label={label} htmlFor={name} required={required} error={error}>
          <Controller
            control={control}
            name={name}
            render={({ field: f }) => (
              <RadioCardGroup
                value={(f.value as string) ?? ""}
                onValueChange={f.onChange}
                onBlur={f.onBlur}
                options={toOptions(field.options)}
                ariaLabel={label}
                invalid={invalid}
                describedBy={describedBy}
              />
            )}
          />
        </Field>
      )

    case "checkbox":
      // A checkbox WITH options is a multi-select group (value = string[]).
      if (field.options) {
        return (
          <Field label={label} htmlFor={name} required={required} error={error}>
            <Controller
              control={control}
              name={name}
              render={({ field: f }) => (
                <CheckboxGroup
                  id={name}
                  value={(f.value as string[]) ?? []}
                  onValueChange={f.onChange}
                  onBlur={f.onBlur}
                  options={toOptions(field.options)}
                  ariaLabel={label}
                  invalid={invalid}
                  describedBy={describedBy}
                />
              )}
            />
          </Field>
        )
      }
      // A checkbox WITHOUT options is a single boolean consent-style checkbox.
      return (
        <Controller
          control={control}
          name={name}
          render={({ field: f }) => (
            <ConsentCheckbox
              id={name}
              checked={f.value === true}
              onCheckedChange={f.onChange}
              onBlur={f.onBlur}
              label={label}
              invalid={invalid}
              error={error}
            />
          )}
        />
      )

    default:
      return null
  }
}

export default FieldRenderer
