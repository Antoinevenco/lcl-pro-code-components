import * as RadixSelect from "@radix-ui/react-select"
import styles from "../styles"
import type { SelectOption } from "../Form.types"
import { ChevronDownIcon } from "./icons/ChevronDownIcon"
import { CheckIcon } from "./icons/CheckIcon"

export type SelectFieldProps = {
  id: string
  /** Controlled value ("" when nothing chosen). */
  value: string
  onValueChange: (value: string) => void
  onBlur?: () => void
  options: SelectOption[]
  placeholder?: string
  invalid?: boolean
  /** Forwarded to the trigger as aria-describedby for the error message. */
  describedBy?: string
  /**
   * Element to portal the dropdown into. In Webflow code components, the
   * component renders inside a Shadow DOM and the bundled stylesheet is
   * injected into that shadow root — so a Portal targeting `document.body`
   * (Radix's default) escapes the shadow and renders unstyled (or fails to
   * render at all, since the styles are gone). Passing a container that lives
   * inside the same shadow root keeps the dropdown inside the scope where the
   * styles apply. The form root is a safe target: no overflow:hidden.
   */
  portalContainer?: HTMLElement | null
  /**
   * Optional class overrides for the trigger, icon wrapper, and content
   * surface. When provided, these REPLACE the default Form-bound classes —
   * the consumer takes full ownership of that element's look. Used by
   * `OfferFilter`, which composes this dropdown but paints the trigger to
   * match its card-selection design. Backward-compatible: omit to keep the
   * Form styling.
   */
  triggerClassName?: string
  iconClassName?: string
  contentClassName?: string
  /** Aria-label fallback when no visible <label> is wired via `id`. */
  ariaLabel?: string
}

/**
 * Accessible single-select built on Radix Select (shadcn's underlying
 * primitive), restyled with CSS Modules + Webflow tokens. The chevron and the
 * selected-item check reuse the local icon primitives.
 */
export function SelectField({
  id,
  value,
  onValueChange,
  onBlur,
  options,
  placeholder = "Sélectionner",
  invalid,
  describedBy,
  portalContainer,
  triggerClassName,
  iconClassName,
  contentClassName,
  ariaLabel,
}: SelectFieldProps) {
  return (
    <RadixSelect.Root value={value || undefined} onValueChange={onValueChange}>
      <RadixSelect.Trigger
        id={id}
        className={triggerClassName ?? styles.select}
        data-invalid={invalid ? "true" : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        onBlur={onBlur}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon className={iconClassName ?? styles.selectIcon}>
          <ChevronDownIcon size={16} />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal container={portalContainer ?? undefined}>
        <RadixSelect.Content
          className={contentClassName ?? styles.selectContent}
          position="popper"
          sideOffset={4}
        >
          <RadixSelect.Viewport className={styles.selectViewport}>
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                className={styles.selectItem}
              >
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator className={styles.selectItemIndicator}>
                  <CheckIcon size={16} />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}

export default SelectField
