import type { IconProps } from "./Icon.types"

export function ArrowExternalIcon({ size = 24, className, title }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      className={className}
      style={{ display: "block", flexShrink: 0 }}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M15.4222 13.0374H4.59766V10.9624H15.4222L10.5287 6.06893L12.0009 4.59668L19.4042 11.9999L12.0009 19.4032L10.5287 17.9309L15.4222 13.0374Z"
        fill="currentColor"
        transform="rotate(-45 12 12)"
      />
    </svg>
  )
}

export default ArrowExternalIcon
