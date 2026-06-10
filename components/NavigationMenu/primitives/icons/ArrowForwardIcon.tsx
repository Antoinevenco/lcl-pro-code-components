import type { IconProps } from "./Icon.types"

export function ArrowForwardIcon({ size = 24, className, title }: IconProps) {
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
        d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default ArrowForwardIcon
