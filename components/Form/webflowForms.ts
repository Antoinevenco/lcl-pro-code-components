/**
 * Submit to Webflow's native form endpoint — the same one `webflow.js` posts to
 * (`https://webflow.com/api/v1/form/<data-wf-site>`). This stores the submission
 * in Site Settings → Forms and triggers the form notification email, without
 * relying on webflow.js binding to our client-rendered React form.
 *
 * Only works on a *published Webflow site*, where `<html data-wf-site>` is
 * present. Returns false elsewhere (e.g. local Vite preview) so the caller can
 * fall back to `actionUrl` / `onSubmit`.
 */
import type { FormValues } from "./schema"
import type { SelectOption } from "./Form.types"
import {
  civiliteOptions,
  entrepriseCreeeOptions,
  fonctionOptions,
  chiffreAffairesOptions,
  nombreSalariesOptions,
  motifOptions,
} from "./data/formConfig"

/** Resolve an option's display label from its stored value (for readable emails). */
const labelOf = (options: SelectOption[], value?: string) =>
  options.find((o) => o.value === value)?.label ?? value ?? ""

/** Map form values to human-readable Webflow submission fields. */
function toFields(v: FormValues): Record<string, string> {
  return {
    "Civilité": labelOf(civiliteOptions, v.civilite),
    "Nom": v.nom,
    "Prénom": v.prenom,
    "E-mail": v.email,
    "Numéro de téléphone": v.telephone,
    "Fonction": labelOf(fonctionOptions, v.fonction),
    "Votre entreprise est-elle créée ?": labelOf(entrepriseCreeeOptions, v.entrepriseCreee),
    "Date de création": v.dateCreation ?? "",
    "Raison sociale": v.raisonSociale,
    "SIREN": v.siren,
    "Code postal": v.codePostal,
    "Code NAF": v.codeNaf,
    "Activité": v.activite,
    "Chiffre d'affaires": labelOf(chiffreAffairesOptions, v.chiffreAffaires),
    "Nombre de salariés": labelOf(nombreSalariesOptions, v.nombreSalaries),
    "Motif de la demande": labelOf(motifOptions, v.motif),
    "Message": v.message,
    "Consentement": v.consent ? "Oui" : "Non",
  }
}

export async function submitToWebflow(
  values: FormValues,
  formName: string,
): Promise<boolean> {
  if (typeof document === "undefined") return false
  const html = document.documentElement
  const siteId = html.getAttribute("data-wf-site")
  if (!siteId) return false // not a published Webflow site

  const body = new URLSearchParams()
  body.set("name", formName)
  body.set("pageId", html.getAttribute("data-wf-page") || "")
  body.set("elementId", "")
  body.set("source", window.location.href)
  body.set("test", "false")
  body.set("dolphin", "false")
  for (const [key, val] of Object.entries(toFields(values))) {
    body.set(`fields[${key}]`, val)
  }

  const res = await fetch(`https://webflow.com/api/v1/form/${siteId}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
    body: body.toString(),
  })
  const json = (await res.json().catch(() => null)) as { code?: number } | null
  if (!res.ok || (json && json.code !== 200)) {
    throw new Error(`Webflow form submission failed (HTTP ${res.status})`)
  }
  return true
}
