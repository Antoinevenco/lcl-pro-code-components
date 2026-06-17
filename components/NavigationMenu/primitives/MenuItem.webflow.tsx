import { declareComponent } from "@webflow/react"
import { props } from "@webflow/data-types"
import MenuItem from "./MenuItem"

/**
 * Not registered in the v1 bundle (see webflow.json).
 * Lives here so we can expose this primitive later without restructuring.
 */
type WebflowProps = {
  label: string
  href: { href: string; target?: string }
  description?: string
  variant?: "primary" | "list"
}

function MenuItemWebflow({ label, href, description, variant }: WebflowProps) {
  return (
    <MenuItem
      item={{ label, href: href?.href ?? "#", description }}
      variant={variant}
    />
  )
}

export default declareComponent(MenuItemWebflow, {
  name: "Menu Item",
  description: "A single link inside a NavigationMenu column.",
  props: {
    label: props.Text({
      name: "Label",
      defaultValue: "Menu item",
    }),
    href: props.Link({ name: "Link" }),
    description: props.Text({
      name: "Description",
      defaultValue: "",
    }),
    variant: props.Variant({
      name: "Variant",
      options: ["primary", "list"],
      defaultValue: "primary",
    }),
  },
})
