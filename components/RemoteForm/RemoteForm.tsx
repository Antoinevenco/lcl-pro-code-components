import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import type { Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import type {
  Field,
  FormSchema,
  RemoteFormStatus,
} from "./RemoteForm.types"
import {
  buildDefaultValues,
  buildDynamicSchema,
  type RemoteFormValues,
} from "./dynamicSchema"
import { FieldRenderer } from "./FieldRenderer"
import { SubmitButton } from "../Form/primitives/SubmitButton"
import {
  fetchFormSchema,
  buildSubmissionData,
  submitToRelay,
} from "./relay"
import styles from "./styles"

export type RemoteFormProps = {
  /** Id of the form created in the LCL form-builder tool. */
  formId: string
  /**
   * Base URL of the form-builder API, e.g. "https://your-site.webflow.io/forms".
   * The component appends "/api/v1/forms/{formId}/{schema,submit}".
   */
  apiBaseUrl: string
  /** Small uppercase tagline above the form. */
  eyebrow?: string
  /** Shown after a successful submission. */
  successMessage?: string
  /** Shown when submission fails. */
  errorMessage?: string
  /** Called with the validated values after a successful relay submission. */
  onSubmit?: (data: RemoteFormValues) => void | Promise<void>
}

export function RemoteForm({
  formId,
  apiBaseUrl,
  eyebrow,
  successMessage = "Merci, votre demande a bien été envoyée.",
  errorMessage = "Une erreur est survenue. Veuillez réessayer.",
  onSubmit,
}: RemoteFormProps) {
  const [status, setStatus] = useState<RemoteFormStatus>("loading")
  const [schema, setSchema] = useState<FormSchema | null>(null)
  // The single-use submission token from the schema endpoint.
  const tokenRef = useRef<string>("")

  /**
   * Radix portals (the Select dropdown) must be pinned inside this component's
   * Shadow DOM, not `document.body`, or they render unstyled. Same pattern as
   * `Form.tsx`: track the form root node in state so a re-render fires after
   * mount and children capture a non-null container.
   */
  const formRef = useRef<HTMLFormElement | null>(null)
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

  const fields: Field[] = useMemo(() => schema?.fields ?? [], [schema])

  // Dynamic Zod schema, rebuilt only when the field set changes. Held in a ref
  // so the (stable) resolver always validates against the current schema even
  // though `useForm` is created before the schema is fetched.
  const zodSchemaRef = useRef(buildDynamicSchema([]))
  useEffect(() => {
    zodSchemaRef.current = buildDynamicSchema(fields)
  }, [fields])

  const resolver = useCallback<Resolver<RemoteFormValues>>(
    (values, context, options) =>
      // The dynamic schema is `z.object<Record<string, ZodTypeAny>>`, so
      // `zodResolver` infers `Resolver<Record<string, unknown>>`. Cast to the
      // form's value type; the runtime shape matches `RemoteFormValues`. We keep
      // the `zodSchemaRef.current` reference inside the callback so the resolver
      // always validates against the latest schema rather than a stale one.
      (zodResolver(zodSchemaRef.current) as Resolver<RemoteFormValues>)(
        values,
        context,
        options,
      ),
    [],
  )

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RemoteFormValues>({
    resolver,
    mode: "onBlur",
    defaultValues: {},
  })

  // Fetch the form definition on mount (and whenever the target changes).
  useEffect(() => {
    if (!formId || !apiBaseUrl) {
      setStatus("error")
      return
    }
    const controller = new AbortController()
    setStatus("loading")
    fetchFormSchema(apiBaseUrl, formId, controller.signal)
      .then((res) => {
        tokenRef.current = res.token
        setSchema(res.schema)
        reset(buildDefaultValues(res.schema.fields))
        setStatus("ready")
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        console.error("RemoteForm: schema fetch failed:", err)
        setStatus("error")
      })
    return () => controller.abort()
  }, [formId, apiBaseUrl, reset])

  const submitting = isSubmitting || status === "submitting"

  const onValid = async (values: RemoteFormValues) => {
    if (!schema) return
    setStatus("submitting")
    try {
      const data = buildSubmissionData(schema.fields, values)
      // `_hp` isn't part of the dynamic Zod schema (so `zodResolver` strips it
      // from `values`); read the raw registered value directly.
      const honeypot = (getValues("_hp") as string | undefined) ?? ""
      const result = await submitToRelay(apiBaseUrl, formId, {
        token: tokenRef.current,
        honeypot,
        data,
      })
      if (!result.ok) {
        setStatus("error")
        return
      }
      await onSubmit?.(values)
      setStatus("success")
      reset(buildDefaultValues(schema.fields))
    } catch (err) {
      console.error("RemoteForm submission failed:", err)
      setStatus("error")
    }
  }

  // Length of the (at most one) textarea, for the live character counter. A
  // dynamic form may have several; the renderer reads per-field below.
  const watchValue = (name: string) => (watch(name) as string | undefined)?.length ?? 0

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

      {/* Honeypot — off-screen, never shown to real users. Always submitted. */}
      <input
        {...register("_hp")}
        type="text"
        className={styles.honeypot}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {status === "loading" ? (
        <div className={styles.state}>
          <span className={styles.spinner} aria-hidden="true" />
          <p className={styles.stateMessage}>Chargement du formulaire…</p>
        </div>
      ) : null}

      {status === "error" && !schema ? (
        <div className={styles.state}>
          <p className={`${styles.stateMessage} ${styles.stateError}`}>
            Le formulaire n'a pas pu être chargé. Vérifiez l'identifiant et
            l'URL, puis réessayez.
          </p>
        </div>
      ) : null}

      {schema ? (
        <>
          <fieldset className={styles.section}>
            {fields.map((field) => {
              // Single boolean checkboxes render their own label/error, so they
              // sit outside the standard full-width field row (like the consent
              // checkbox in Form). Everything else gets the full-width row.
              const isSingleCheckbox =
                field.type === "checkbox" && !field.options
              return (
                <div
                  key={field.id}
                  className={isSingleCheckbox ? undefined : styles.rowFull}
                >
                  <FieldRenderer
                    field={field}
                    control={control}
                    register={register}
                    errors={errors}
                    valueLength={
                      field.type === "textarea" ? watchValue(field.name) : 0
                    }
                    portalContainer={portalContainer}
                  />
                </div>
              )
            })}
          </fieldset>

          <p className={styles.requiredNote}>* Champs obligatoires</p>

          <div className={styles.actions}>
            <SubmitButton loading={submitting}>
              {submitting ? "Envoi en cours…" : schema.submitLabel}
            </SubmitButton>
          </div>
        </>
      ) : null}

      <div className={styles.status} role="status" aria-live="polite">
        {status === "success" ? (
          <p className={styles.statusSuccess}>{successMessage}</p>
        ) : null}
        {status === "error" && schema ? (
          <p className={styles.statusError}>{errorMessage}</p>
        ) : null}
      </div>
    </form>
  )
}

export default RemoteForm
