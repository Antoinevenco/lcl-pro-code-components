import { declareComponent } from "@webflow/react"
import { props } from "@webflow/data-types"
import EspaceClientModal from "./EspaceClientModal"
import { defaultEspaceClient } from "../data/menu"

/**
 * Not registered in the v1 bundle (see webflow.json). The "Espace client"
 * modal ships as part of the Navigation Menu — this binding exists so the
 * primitive can be exposed on its own later without restructuring.
 */
type WebflowProps = {
  title: string
  heading: string
  proLabel: string
  proHref: { href: string; target?: string }
  comptesLabel: string
  comptesHref: { href: string; target?: string }
}

function EspaceClientModalWebflow({
  title,
  heading,
  proLabel,
  proHref,
  comptesLabel,
  comptesHref,
}: WebflowProps) {
  return (
    <EspaceClientModal
      variant="desktop"
      config={{
        title,
        heading,
        proLabel,
        proHref: proHref?.href ?? "#",
        comptesLabel,
        comptesHref: comptesHref?.href ?? "#",
      }}
    />
  )
}

export default declareComponent(EspaceClientModalWebflow, {
  name: "Espace Client Modal",
  description:
    "\"Espace client en ligne\" modal opened from the navigation user icon.",
  props: {
    title: props.Text({
      name: "Header title",
      defaultValue: defaultEspaceClient.title,
    }),
    heading: props.Text({
      name: "Heading",
      defaultValue: defaultEspaceClient.heading,
    }),
    proLabel: props.Text({
      name: "Espace Pro · label",
      defaultValue: defaultEspaceClient.proLabel,
    }),
    proHref: props.Link({ name: "Espace Pro · link" }),
    comptesLabel: props.Text({
      name: "Mes comptes · label",
      defaultValue: defaultEspaceClient.comptesLabel,
    }),
    comptesHref: props.Link({ name: "Mes comptes · link" }),
  },
})
