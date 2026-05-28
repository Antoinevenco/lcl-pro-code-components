import type { ButtonHTMLAttributes } from "react"
import clsx from "clsx"
import styles from "../styles"

export type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
}

/**
 * Primary, fully-rounded submit button matching the Figma CTA. Disabled and
 * `aria-busy` while submitting.
 */
export function SubmitButton({
  loading,
  disabled,
  children,
  className,
  type = "submit",
  ...rest
}: SubmitButtonProps) {
  return (
    <button
      type={type}
      className={clsx(styles.submit, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {children}
    </button>
  )
}

export default SubmitButton
