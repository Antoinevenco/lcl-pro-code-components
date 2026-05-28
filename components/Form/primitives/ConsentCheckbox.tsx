import * as RadixCheckbox from "@radix-ui/react-checkbox"
import type { ReactNode } from "react"
import styles from "../styles"
import { CheckIcon } from "./icons/CheckIcon"

export type ConsentCheckboxProps = {
  id: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  onBlur?: () => void
  /** Label content — string or rich markup (e.g. an RGPD link). */
  label: ReactNode
  invalid?: boolean
  error?: string
}

/**
 * RGPD consent checkbox built on Radix Checkbox, restyled. Renders its own
 * label and (optional) error message since it sits outside the standard
 * `Field` label/control rhythm.
 */
export function ConsentCheckbox({
  id,
  checked,
  onCheckedChange,
  onBlur,
  label,
  invalid,
  error,
}: ConsentCheckboxProps) {
  const errorId = `${id}-error`
  return (
    <div className={styles.consent}>
      <div className={styles.consentRow}>
        <RadixCheckbox.Root
          id={id}
          className={styles.checkbox}
          checked={checked}
          onCheckedChange={(state) => onCheckedChange(state === true)}
          onBlur={onBlur}
          data-invalid={invalid ? "true" : undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={error ? errorId : undefined}
        >
          <RadixCheckbox.Indicator className={styles.checkboxIndicator}>
            <CheckIcon size={14} />
          </RadixCheckbox.Indicator>
        </RadixCheckbox.Root>
        <label className={styles.consentLabel} htmlFor={id}>
          {label}
        </label>
      </div>
      {error ? (
        <p className={styles.errorMessage} id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default ConsentCheckbox
