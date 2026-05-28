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
}: SelectFieldProps) {
  return (
    <RadixSelect.Root value={value || undefined} onValueChange={onValueChange}>
      <RadixSelect.Trigger
        id={id}
        className={styles.select}
        data-invalid={invalid ? "true" : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onBlur={onBlur}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon className={styles.selectIcon}>
          <ChevronDownIcon size={16} />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal container={portalContainer ?? undefined}>
        <RadixSelect.Content
          className={styles.selectContent}
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
