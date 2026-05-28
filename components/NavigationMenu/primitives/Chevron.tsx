import { ChevronRightIcon } from "./icons/ChevronRightIcon"
import type { IconProps } from "./icons/Icon.types"

export type ChevronProps = IconProps & {
  direction?: "right" | "left" | "down" | "up"
}

const rotations: Record<NonNullable<ChevronProps["direction"]>, number> = {
  right: 0,
  down: 90,
  left: 180,
  up: 270,
}

export function Chevron({
  direction = "right",
  size = 24,
  className,
  title,
}: ChevronProps) {
  return (
    <span
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      style={{
        display: "inline-flex",
        flexShrink: 0,
        transform: `rotate(${rotations[direction]}deg)`,
        transition: "transform 300ms ease",
      }}
    >
      <ChevronRightIcon size={size} title={title} />
    </span>
  )
}

export default Chevron
