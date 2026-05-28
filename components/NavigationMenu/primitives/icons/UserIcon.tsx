import type { IconProps } from "./Icon.types"

export function UserIcon({ size = 24, className, title }: IconProps) {
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
        d="M15 6.5C15 8.15685 13.6569 9.5 12 9.5C10.3431 9.5 9 8.15685 9 6.5C9 4.84315 10.3431 3.5 12 3.5C13.6569 3.5 15 4.84315 15 6.5ZM17 6.5C17 9.26142 14.7614 11.5 12 11.5C9.23858 11.5 7 9.26142 7 6.5C7 3.73858 9.23858 1.5 12 1.5C14.7614 1.5 17 3.73858 17 6.5ZM4 18.5C4 16.8431 5.34315 15.5 7 15.5H17C18.6569 15.5 20 16.8431 20 18.5V20.5H4V18.5ZM2 18.5C2 15.7386 4.23858 13.5 7 13.5H17C19.7614 13.5 22 15.7386 22 18.5V21.5C22 22.0523 21.5523 22.5 21 22.5H3C2.44772 22.5 2 22.0523 2 21.5V18.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default UserIcon
