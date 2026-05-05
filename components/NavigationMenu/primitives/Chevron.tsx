import type { SVGProps } from "react"

export function Chevron({ direction = "right", ...props }: SVGProps<SVGSVGElement> & { direction?: "right" | "left" | "down" }) {
  const rotation = direction === "left" ? 180 : direction === "down" ? 90 : 0
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ transform: `rotate(${rotation}deg)` }}
      {...props}
    >
      <path
        d="M6 3l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
