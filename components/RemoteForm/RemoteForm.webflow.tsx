import { declareComponent } from "@webflow/react"
import { props } from "@webflow/data-types"
import RemoteForm from "./RemoteForm"

type WebflowProps = {
  formId: string
  apiBaseUrl: string
  eyebrow: string
  successMessage: string
  errorMessage: string
}

function RemoteFormWebflow({
  formId,
  apiBaseUrl,
  eyebrow,
  successMessage,
  errorMessage,
}: WebflowProps) {
  return (
    <RemoteForm
      formId={formId}
      apiBaseUrl={apiBaseUrl}
      eyebrow={eyebrow || undefined}
      successMessage={successMessage}
      errorMessage={errorMessage}
    />
  )
}

export default declareComponent(RemoteFormWebflow, {
  name: "Remote Form",
  description:
    "Loads a form created in the LCL form-builder tool by id: fetches its definition from {apiBaseUrl}/api/v1/forms/{formId}/schema, renders it with the LCL Pro field styling, and relays submissions back to the tool. Data-driven counterpart to the static Contact Form.",
  group: "Forms",
  props: {
    formId: props.Text({
      name: "Form id",
      defaultValue: "",
    }),
    apiBaseUrl: props.Text({
      name: "API base URL",
      defaultValue: "",
    }),
    eyebrow: props.Text({
      name: "Eyebrow",
      defaultValue: "",
    }),
    successMessage: props.Text({
      name: "Success message",
      defaultValue: "Merci, votre demande a bien été envoyée.",
    }),
    errorMessage: props.Text({
      name: "Error message",
      defaultValue: "Une erreur est survenue. Veuillez réessayer.",
    }),
  },
  options: {
    ssr: false,
  },
})
