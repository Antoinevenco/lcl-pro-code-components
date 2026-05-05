import { declareComponent } from "@webflow/react"
import { props } from "@webflow/data-types"
import MenuItem from "./MenuItem"

/**
 * Not registered in the v1 bundle (see webflow.json).
 * Lives here so we can expose this primitive later without restructuring.
 */
export default declareComponent(MenuItem, {
  name: "Menu Item",
  description: "A single link inside a NavigationMenu column.",
  props: {
    variant: props.Variant({
      name: "Variant",
      options: ["primary", "list"],
      defaultValue: "primary",
    }),
  },
})
