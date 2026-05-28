import { forwardRef } from "react"
import type { TextareaHTMLAttributes } from "react"
import clsx from "clsx"
import styles from "../styles"

export type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean
  /** Max characters; drives both the hard cap and the counter denominator. */
  charLimit: number
  /** Current value length, supplied by the parent (react-hook-form `watch`). */
  valueLength: number
}

/**
 * Multi-line input matching the Figma "InputGroup + addon" — a bordered group
 * wrapping the textarea and a footer with a live character counter
 * ("0/280 characters" · "x% used"). `forwardRef` for `register`.
 */
export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  function TextareaField({ invalid, charLimit, valueLength, className, ...rest }, ref) {
    const remaining = Math.max(charLimit - valueLength, 0)
    return (
      <div className={styles.textareaGroup} data-invalid={invalid ? "true" : undefined}>
        <textarea
          ref={ref}
          maxLength={charLimit}
          className={clsx(styles.textarea, className)}
          data-invalid={invalid ? "true" : undefined}
          aria-invalid={invalid || undefined}
          {...rest}
        />
        <div className={styles.textareaFooter}>
          <span>
            {remaining} caractère{remaining > 1 ? "s" : ""} restant
            {remaining > 1 ? "s" : ""}
          </span>
        </div>
      </div>
    )
  },
)

export default TextareaField
