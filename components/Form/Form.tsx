import { useRef, useState } from "react"
import type { ReactNode } from "react"
import { useForm, Controller } from "react-hook-form"
import type { DefaultValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { contactFormSchema, MESSAGE_MAX } from "./schema"
import type { FormValues } from "./schema"
import type { FormStatus } from "./Form.types"
import {
  civiliteOptions,
  entrepriseCreeeOptions,
  fonctionOptions,
  chiffreAffairesOptions,
  nombreSalariesOptions,
  motifOptions,
} from "./data/formConfig"
import { Field } from "./primitives/Field"
import { TextInput } from "./primitives/TextInput"
import { SelectField } from "./primitives/SelectField"
import { RadioCardGroup } from "./primitives/RadioCardGroup"
import { TextareaField } from "./primitives/TextareaField"
import { ConsentCheckbox } from "./primitives/ConsentCheckbox"
import { SubmitButton } from "./primitives/SubmitButton"
import { submitToWebflow } from "./webflowForms"
import styles from "./styles"

export type FormProps = {
  /** Small uppercase tagline above the form. */
  eyebrow?: string
  /** Submit button label. */
  submitLabel?: string
  /**
   * Form name recorded in Webflow (Site Settings → Forms). On a published
   * Webflow site, submissions post to Webflow's native endpoint under this
   * name and trigger the configured notification email.
   */
  formName?: string
  /** Fallback when not on a published Webflow site: POST values as JSON here. */
  actionUrl?: string
  /** Called with validated values, after the primary submission path. */
  onSubmit?: (values: FormValues) => void | Promise<void>
  /** Shown after a successful submission. */
  successMessage?: string
  /** Shown when submission fails. */
  errorMessage?: string
  /** RGPD consent label — string or rich markup (e.g. a privacy-policy link). */
  consentLabel?: ReactNode
}

const defaultValues = {
  civilite: undefined,
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  fonction: "",
  entrepriseCreee: undefined,
  dateCreation: "",
  raisonSociale: "",
  siren: "",
  codePostal: "",
  codeNaf: "",
  activite: "",
  chiffreAffaires: "",
  nombreSalaries: "",
  motif: "",
  message: "",
  consent: false,
} as unknown as DefaultValues<FormValues>

export function Form({
  eyebrow = "Formulaire de contact",
  submitLabel = "Envoyer le formulaire",
  formName = "Formulaire de contact",
  actionUrl,
  onSubmit,
  successMessage = "Merci, votre demande a bien été envoyée.",
  errorMessage = "Une erreur est survenue. Veuillez réessayer.",
  consentLabel = "La politique de protection des données personnelles, incluse dans les Dispositions Générales de Banque, est disponible sur la page d'accueil du site.",
}: FormProps) {
  const [status, setStatus] = useState<FormStatus>("idle")
  /**
   * Webflow code components mount inside a Shadow DOM. Radix's default Portal
   * target (`document.body`) escapes that shadow root, so the portaled content
   * either renders unstyled (CSS lives in the shadow) or doesn't render where
   * we can query it from the page. We pin every Radix Portal to this form
   * root, which sits inside the same shadow root as the bundled stylesheet.
   * `.root` has no overflow:hidden, so the dropdown isn't clipped.
   */
  const formRef = useRef<HTMLFormElement | null>(null)
  // Tracks the resolved DOM node so a re-render fires after mount (refs alone
  // don't trigger one, and Radix reads `container` lazily but only when the
  // Portal opens — passing `null` on first paint is fine; this is belt + braces
  // so children that capture the container at render time also see it).
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
    defaultValues,
  })

  /** aria-describedby target for a field's error message, or undefined. */
  const describedBy = (name: keyof FormValues) =>
    errors[name] ? `${name}-error` : undefined

  const messageLength = (watch("message") ?? "").length
  const entrepriseCreee = watch("entrepriseCreee")
  const submitting = isSubmitting || status === "submitting"

  const onValid = async (values: FormValues) => {
    setStatus("submitting")
    try {
      // Primary path: Webflow's native form endpoint (published site only).
      const sentToWebflow = await submitToWebflow(values, formName)
      // Fallback path: a custom endpoint, when not on a published Webflow site.
      if (!sentToWebflow && actionUrl) {
        const res = await fetch(actionUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
      }
      await onSubmit?.(values)
      setStatus("success")
      reset()
    } catch (err) {
      console.error("Form submission failed:", err)
      setStatus("error")
    }
  }

  return (
    <form
      ref={(node) => {
        formRef.current = node
        setPortalContainer(node)
      }}
      className={styles.root}
      onSubmit={handleSubmit(onValid)}
      noValidate
    >
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}

      {/* ── Identité ─────────────────────────────────────────────── */}
      <fieldset className={styles.section}>
        <legend className={styles.sectionTitle}>Identité</legend>

        <div className={styles.rowFirst}>
          <Field label="Civilité" htmlFor="civilite" required error={errors.civilite?.message}>
            <Controller
              control={control}
              name="civilite"
              render={({ field }) => (
                <RadioCardGroup
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  options={civiliteOptions}
                  ariaLabel="Civilité"
                  invalid={!!errors.civilite}
                  describedBy={describedBy("civilite")}
                />
              )}
            />
          </Field>
        </div>

        <div className={styles.row}>
          <Field label="Nom" htmlFor="nom" required error={errors.nom?.message}>
            <TextInput
              id="nom"
              placeholder="Votre nom"
              autoComplete="family-name"
              invalid={!!errors.nom}
              aria-describedby={describedBy("nom")}
              {...register("nom")}
            />
          </Field>
          <Field label="Prénom" htmlFor="prenom" required error={errors.prenom?.message}>
            <TextInput
              id="prenom"
              placeholder="Votre prénom"
              autoComplete="given-name"
              invalid={!!errors.prenom}
              aria-describedby={describedBy("prenom")}
              {...register("prenom")}
            />
          </Field>
        </div>

        <div className={styles.row}>
          <Field label="E-mail" htmlFor="email" required error={errors.email?.message}>
            <TextInput
              id="email"
              type="email"
              placeholder="vous@exemple.fr"
              autoComplete="email"
              invalid={!!errors.email}
              aria-describedby={describedBy("email")}
              {...register("email")}
            />
          </Field>
          <Field label="Numéro de téléphone" htmlFor="telephone" required error={errors.telephone?.message}>
            <TextInput
              id="telephone"
              type="tel"
              placeholder="06 12 34 56 78"
              autoComplete="tel"
              invalid={!!errors.telephone}
              aria-describedby={describedBy("telephone")}
              {...register("telephone")}
            />
          </Field>
        </div>

        <div className={styles.row}>
          <Field label="Fonction" htmlFor="fonction" required error={errors.fonction?.message}>
            <Controller
              control={control}
              name="fonction"
              render={({ field }) => (
                <SelectField
                  id="fonction"
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  options={fonctionOptions}
                  placeholder="Sélectionner une fonction"
                  invalid={!!errors.fonction}
                  describedBy={describedBy("fonction")}
                  portalContainer={portalContainer}
                />
              )}
            />
          </Field>
        </div>
      </fieldset>

      {/* ── Société ──────────────────────────────────────────────── */}
      <fieldset className={styles.section}>
        <legend className={styles.sectionTitle}>Société</legend>

        <div className={styles.rowFirst}>
          <Field
            label="Votre entreprise est-elle créée ?"
            htmlFor="entrepriseCreee"
            required
            error={errors.entrepriseCreee?.message}
          >
            <Controller
              control={control}
              name="entrepriseCreee"
              render={({ field }) => (
                <RadioCardGroup
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  options={entrepriseCreeeOptions}
                  ariaLabel="Votre entreprise est-elle créée ?"
                  invalid={!!errors.entrepriseCreee}
                  describedBy={describedBy("entrepriseCreee")}
                />
              )}
            />
          </Field>
        </div>

        {entrepriseCreee === "oui" ? (
          <div className={styles.row}>
            <Field
              label="Date de création"
              htmlFor="dateCreation"
              required
              error={errors.dateCreation?.message}
            >
              <TextInput
                id="dateCreation"
                type="date"
                invalid={!!errors.dateCreation}
                aria-describedby={describedBy("dateCreation")}
                {...register("dateCreation")}
              />
            </Field>
          </div>
        ) : null}

        <div className={styles.row}>
          <Field label="Raison sociale" htmlFor="raisonSociale" required error={errors.raisonSociale?.message}>
            <TextInput
              id="raisonSociale"
              placeholder="Nom de la société"
              autoComplete="organization"
              invalid={!!errors.raisonSociale}
              aria-describedby={describedBy("raisonSociale")}
              {...register("raisonSociale")}
            />
          </Field>
          <Field label="SIREN" htmlFor="siren" required error={errors.siren?.message}>
            <TextInput
              id="siren"
              inputMode="numeric"
              placeholder="123456789"
              invalid={!!errors.siren}
              aria-describedby={describedBy("siren")}
              {...register("siren")}
            />
          </Field>
        </div>

        <div className={styles.row}>
          <Field label="Code postal" htmlFor="codePostal" required error={errors.codePostal?.message}>
            <TextInput
              id="codePostal"
              inputMode="numeric"
              placeholder="75001"
              autoComplete="postal-code"
              invalid={!!errors.codePostal}
              aria-describedby={describedBy("codePostal")}
              {...register("codePostal")}
            />
          </Field>
          <Field label="Code NAF" htmlFor="codeNaf" required error={errors.codeNaf?.message}>
            <TextInput
              id="codeNaf"
              placeholder="6201Z"
              invalid={!!errors.codeNaf}
              aria-describedby={describedBy("codeNaf")}
              {...register("codeNaf")}
            />
          </Field>
        </div>

        <div className={styles.row}>
          <Field label="Activité" htmlFor="activite" required error={errors.activite?.message}>
            <TextInput
              id="activite"
              placeholder="Votre activité"
              invalid={!!errors.activite}
              aria-describedby={describedBy("activite")}
              {...register("activite")}
            />
          </Field>
        </div>

        <div className={styles.row}>
          <Field label="Chiffre d'affaires" htmlFor="chiffreAffaires" required error={errors.chiffreAffaires?.message}>
            <Controller
              control={control}
              name="chiffreAffaires"
              render={({ field }) => (
                <SelectField
                  id="chiffreAffaires"
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  options={chiffreAffairesOptions}
                  placeholder="Sélectionner une tranche"
                  invalid={!!errors.chiffreAffaires}
                  describedBy={describedBy("chiffreAffaires")}
                  portalContainer={portalContainer}
                />
              )}
            />
          </Field>
        </div>

        <div className={styles.row}>
          <Field label="Nombre de salariés" htmlFor="nombreSalaries" error={errors.nombreSalaries?.message}>
            <Controller
              control={control}
              name="nombreSalaries"
              render={({ field }) => (
                <SelectField
                  id="nombreSalaries"
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  options={nombreSalariesOptions}
                  placeholder="Sélectionner un effectif"
                  invalid={!!errors.nombreSalaries}
                  describedBy={describedBy("nombreSalaries")}
                  portalContainer={portalContainer}
                />
              )}
            />
          </Field>
        </div>
      </fieldset>

      {/* ── Message ──────────────────────────────────────────────── */}
      <fieldset className={styles.section}>
        <legend className={styles.sectionTitle}>Message</legend>

        <div className={styles.row}>
          <Field label="Motif de la demande" htmlFor="motif" required error={errors.motif?.message}>
            <Controller
              control={control}
              name="motif"
              render={({ field }) => (
                <SelectField
                  id="motif"
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  options={motifOptions}
                  placeholder="Sélectionner un motif"
                  invalid={!!errors.motif}
                  describedBy={describedBy("motif")}
                  portalContainer={portalContainer}
                />
              )}
            />
          </Field>
        </div>

        <div className={styles.rowFull}>
          <Field label="Message" htmlFor="message" required error={errors.message?.message}>
            <TextareaField
              id="message"
              charLimit={MESSAGE_MAX}
              valueLength={messageLength}
              placeholder="Votre message"
              invalid={!!errors.message}
              aria-describedby={describedBy("message")}
              {...register("message")}
            />
          </Field>
        </div>

        <Controller
          control={control}
          name="consent"
          render={({ field }) => (
            <ConsentCheckbox
              id="consent"
              checked={field.value === true}
              onCheckedChange={field.onChange}
              onBlur={field.onBlur}
              label={consentLabel}
              invalid={!!errors.consent}
              error={errors.consent?.message}
            />
          )}
        />
      </fieldset>

      <p className={styles.requiredNote}>* Champs obligatoires</p>

      <div className={styles.actions}>
        <SubmitButton loading={submitting}>
          {submitting ? "Envoi en cours…" : submitLabel}
        </SubmitButton>
      </div>

      <div className={styles.status} role="status" aria-live="polite">
        {status === "success" ? (
          <p className={styles.statusSuccess}>{successMessage}</p>
        ) : null}
        {status === "error" ? (
          <p className={styles.statusError}>{errorMessage}</p>
        ) : null}
      </div>

      <p className={styles.recaptchaNote}>
        Ce site est protégé par reCAPTCHA. Les règles de confidentialité et les
        conditions d'utilisation de Google s'appliquent.
      </p>
    </form>
  )
}

export default Form
