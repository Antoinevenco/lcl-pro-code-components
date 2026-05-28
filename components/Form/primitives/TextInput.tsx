import { forwardRef } from "react"
import type { InputHTMLAttributes } from "react"
import clsx from "clsx"
import styles from "../styles"

export type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
}

/**
 * Single-line text/email/tel input. `forwardRef` so react-hook-form's
 * `register` can attach its ref. Styling lives in CSS Modules.
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ invalid, className, type = "text", ...rest }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        className={clsx(styles.input, className)}
        data-invalid={invalid ? "true" : undefined}
        aria-invalid={invalid || undefined}
        {...rest}
      />
    )
  },
)

export default TextInput
