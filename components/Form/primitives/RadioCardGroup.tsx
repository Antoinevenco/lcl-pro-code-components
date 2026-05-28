import * as RadixRadioGroup from "@radix-ui/react-radio-group"
import styles from "../styles"
import type { SelectOption } from "../Form.types"

export type RadioCardGroupProps = {
  /** Controlled value ("" when nothing chosen). */
  value: string
  onValueChange: (value: string) => void
  onBlur?: () => void
  options: SelectOption[]
  /** Accessible name for the group (no visible legend in the design). */
  ariaLabel: string
  invalid?: boolean
  describedBy?: string
}

/**
 * Horizontal radio group rendered as the bordered "cards" from the Figma
 * (Madame/Monsieur, Oui/Non). Built on Radix RadioGroup for roving-tabindex
 * arrow-key navigation; each item is the full card with a circular indicator.
 */
export function RadioCardGroup({
  value,
  onValueChange,
  onBlur,
  options,
  ariaLabel,
  invalid,
  describedBy,
}: RadioCardGroupProps) {
  return (
    <RadixRadioGroup.Root
      className={styles.radioGroup}
      value={value || undefined}
      onValueChange={onValueChange}
      onBlur={onBlur}
      aria-label={ariaLabel}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      orientation="horizontal"
      loop
    >
      {options.map((option) => (
        <RadixRadioGroup.Item
          key={option.value}
          value={option.value}
          className={styles.radioCard}
          data-invalid={invalid ? "true" : undefined}
        >
          <span className={styles.radioCircle} aria-hidden="true">
            <RadixRadioGroup.Indicator className={styles.radioDot} />
          </span>
          <span className={styles.radioLabel}>{option.label}</span>
        </RadixRadioGroup.Item>
      ))}
    </RadixRadioGroup.Root>
  )
}

export default RadioCardGroup
