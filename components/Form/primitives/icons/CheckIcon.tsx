import type { IconProps } from "./Icon.types"

export function CheckIcon({ size = 16, className, title }: IconProps) {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.7071 6.29289C21.0976 6.68342 21.0976 7.31658 20.7071 7.70711L10.7071 17.7071C10.3166 18.0976 9.68342 18.0976 9.29289 17.7071L4.29289 12.7071C3.90237 12.3166 3.90237 11.6834 4.29289 11.2929C4.68342 10.9024 5.31658 10.9024 5.70711 11.2929L10 15.5858L19.2929 6.29289C19.6834 5.90237 20.3166 5.90237 20.7071 6.29289Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default CheckIcon
