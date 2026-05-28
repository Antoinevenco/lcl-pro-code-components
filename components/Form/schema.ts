/**
 * Zod schema — the source of truth for the contact form's values and
 * validation. `FormValues` is inferred from it and consumed by react-hook-form
 * (via `@hookform/resolvers/zod`) and the submit handler.
 *
 * Messages are in French to match the LCL Pro UI.
 */
import { z } from "zod"

/** Max length of the free-text message, mirrored in the textarea counter. */
export const MESSAGE_MAX = 700

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} est requis`)

export const contactFormSchema = z.object({
  // Identité
  civilite: z.enum(["madame", "monsieur"], {
    error: "Veuillez sélectionner une civilité",
  }),
  nom: requiredText("Le nom"),
  prenom: requiredText("Le prénom"),
  email: z.email("Adresse email invalide"),
  telephone: z
    .string()
    .trim()
    .min(1, "Le téléphone est requis")
    // Lenient: digits, spaces, +, -, ., (), 8–20 chars.
    .regex(/^[+()\d][\d\s.\-()]{7,19}$/, "Numéro de téléphone invalide"),
  fonction: requiredText("La fonction"),

  // Société
  entrepriseCreee: z.enum(["oui", "non"], {
    error: "Veuillez répondre à cette question",
  }),
  // Conditionally required: only when entrepriseCreee === "oui" (see refine below).
  dateCreation: z.string().optional(),
  raisonSociale: requiredText("La raison sociale"),
  siren: z
    .string()
    .trim()
    .regex(/^\d{9}$/, "Le SIREN doit comporter 9 chiffres"),
  codePostal: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "Le code postal doit comporter 5 chiffres"),
  codeNaf: z
    .string()
    .trim()
    .regex(/^\d{4}[A-Za-z]$/, "Code NAF invalide (ex. 6201Z)"),
  activite: requiredText("L'activité"),
  chiffreAffaires: requiredText("Le chiffre d'affaires"),
  nombreSalaries: z.string().optional(),

  // Message
  motif: requiredText("Le motif de la demande"),
  message: z
    .string()
    .trim()
    .min(1, "Le message est requis")
    .max(MESSAGE_MAX, `Le message ne doit pas dépasser ${MESSAGE_MAX} caractères`),
  consent: z.literal(true, {
    error: "Vous devez accepter le traitement de vos données",
  }),
}).superRefine((values, ctx) => {
  // "Date de création" is required only if the company already exists.
  if (values.entrepriseCreee === "oui" && !values.dateCreation?.trim()) {
    ctx.addIssue({
      code: "custom",
      path: ["dateCreation"],
      message: "La date de création est requise",
    })
  }
})

export type FormValues = z.infer<typeof contactFormSchema>
