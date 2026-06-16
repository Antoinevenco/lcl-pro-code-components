import * as RadixCheckbox from "@radix-ui/react-checkbox"
import styles from "../styles"
import type { SelectOption } from "../RemoteForm.types"
// Reuse the Form check glyph so the multi-checkbox matches the consent checkbox.
import { CheckIcon } from "../../Form/primitives/icons/CheckIcon"

export type CheckboxGroupProps = {
  id: string
  /** Controlled value — the selected option values. */
  value: string[]
  onValueChange: (value: string[]) => void
  onBlur?: () => void
  options: SelectOption[]
  /** Accessible name for the group. */
  ariaLabel: string
  invalid?: boolean
  describedBy?: string
}

/**
 * Multi-select checkbox group built on Radix Checkbox (the same primitive
 * `ConsentCheckbox` uses), restyled with CSS Modules + Webflow tokens to match
 * `RadioCardGroup`'s bordered cards. The value is a `string[]` of the selected
 * option values; toggling a box adds/removes its value.
 */
export function CheckboxGroup({
  id,
  value,
  onValueChange,
  onBlur,
  options,
  ariaLabel,
  invalid,
  describedBy,
}: CheckboxGroupProps) {
  const toggle = (optionValue: string, checked: boolean) => {
    const next = checked
      ? [...value, optionValue]
      : value.filter((v) => v !== optionValue)
    onValueChange(next)
  }

  return (
    <div
      className={styles.checkboxGroup}
      role="group"
      aria-label={ariaLabel}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
    >
      {options.map((option) => {
        const optionId = `${id}-${option.value}`
        const checked = value.includes(option.value)
        return (
          <label
            key={option.value}
            className={styles.checkboxOption}
            htmlFor={optionId}
            data-state={checked ? "checked" : undefined}
            data-invalid={invalid ? "true" : undefined}
          >
            <RadixCheckbox.Root
              id={optionId}
              className={styles.checkboxBox}
              checked={checked}
              onCheckedChange={(state) => toggle(option.value, state === true)}
              onBlur={onBlur}
              data-invalid={invalid ? "true" : undefined}
              aria-invalid={invalid || undefined}
            >
              <RadixCheckbox.Indicator className={styles.checkboxIndicator}>
                <CheckIcon size={14} />
              </RadixCheckbox.Indicator>
            </RadixCheckbox.Root>
            <span className={styles.checkboxOptionLabel}>{option.label}</span>
          </label>
        )
      })}
    </div>
  )
}

export default CheckboxGroup
