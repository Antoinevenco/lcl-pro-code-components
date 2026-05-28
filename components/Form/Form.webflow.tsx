import { declareComponent } from "@webflow/react"
import { props } from "@webflow/data-types"
import type { ReactNode } from "react"
import Form from "./Form"

type WebflowProps = {
  eyebrow: string
  submitLabel: string
  formName: string
  actionUrl: string
  successMessage: string
  errorMessage: string
  consentLabel: ReactNode
}

function FormWebflow({
  eyebrow,
  submitLabel,
  formName,
  actionUrl,
  successMessage,
  errorMessage,
  consentLabel,
}: WebflowProps) {
  return (
    <Form
      eyebrow={eyebrow}
      submitLabel={submitLabel}
      formName={formName}
      actionUrl={actionUrl || undefined}
      successMessage={successMessage}
      errorMessage={errorMessage}
      consentLabel={consentLabel}
    />
  )
}

export default declareComponent(FormWebflow, {
  name: "Contact Form",
  description:
    "LCL Pro contact form (Identité · Société · Message). Validated with Zod, posts to a configurable action URL.",
  group: "Forms",
  props: {
    eyebrow: props.Text({
      name: "Eyebrow",
      defaultValue: "Formulaire de contact",
    }),
    submitLabel: props.Text({
      name: "Submit label",
      defaultValue: "Envoyer le formulaire",
    }),
    formName: props.Text({
      name: "Form name (Webflow)",
      defaultValue: "Formulaire de contact",
    }),
    actionUrl: props.Text({
      name: "Custom action URL (fallback)",
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
    consentLabel: props.RichText({
      name: "Consent label",
    }),
  },
  options: {
    ssr: false,
  },
})
