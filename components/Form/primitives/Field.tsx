import type { ReactNode } from "react"
import clsx from "clsx"
import styles from "../styles"

export type FieldProps = {
  /** Visible label text. */
  label: string
  /** Must match the `id` of the control rendered as `children`. */
  htmlFor: string
  /** Appends a "*" affordance and is announced as required by the control. */
  required?: boolean
  /** Validation message; when set, the label + control switch to error styling. */
  error?: string
  /** The single form control (input, select trigger, textarea, …). */
  children: ReactNode
  className?: string
}

/**
 * Label + control + error message wrapper — the shadcn `FormItem` / `FormLabel`
 * / `FormMessage` trio, restyled with CSS Modules. The control wires its own
 * `aria-invalid` / `aria-describedby`; the error node id is `${htmlFor}-error`.
 */
export function Field({
  label,
  htmlFor,
  required,
  error,
  children,
  className,
}: FieldProps) {
  return (
    <div className={clsx(styles.field, className)}>
      <label
        className={styles.label}
        htmlFor={htmlFor}
        data-error={error ? "true" : undefined}
      >
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p className={styles.errorMessage} id={`${htmlFor}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default Field
