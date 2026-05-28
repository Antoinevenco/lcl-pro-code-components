import type { IconProps } from "./Icon.types"

/** "Nous contacter" — sized 16×16 in the design system. */
export function ContactIcon({ size = 16, className, title }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      className={className}
      style={{ display: "block", flexShrink: 0 }}
    >
      {title ? <title>{title}</title> : null}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.99992 1.3335C4.31793 1.3335 1.33325 4.31817 1.33325 8.00016L1.33325 14.0002C1.33325 14.3684 1.63173 14.6668 1.99992 14.6668H7.99992C11.6819 14.6668 14.6666 11.6822 14.6666 8.00016C14.6666 4.31817 11.6819 1.3335 7.99992 1.3335ZM5.33325 6.00016C4.96506 6.00016 4.66659 6.29864 4.66659 6.66683C4.66659 7.03502 4.96506 7.3335 5.33325 7.3335H10.6666C11.0348 7.3335 11.3333 7.03502 11.3333 6.66683C11.3333 6.29864 11.0348 6.00016 10.6666 6.00016H5.33325ZM5.33325 8.66683C4.96506 8.66683 4.66659 8.96531 4.66659 9.3335C4.66659 9.70169 4.96506 10.0002 5.33325 10.0002H7.99992C8.36811 10.0002 8.66658 9.70169 8.66658 9.3335C8.66658 8.96531 8.36811 8.66683 7.99992 8.66683H5.33325Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default ContactIcon
