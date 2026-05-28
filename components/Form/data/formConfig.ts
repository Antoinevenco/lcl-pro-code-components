/**
 * Typed default content for the contact form.
 *
 * Radio choices are fixed by the schema enums. Select option `value`s are
 * stable slugs (independent of the displayed label); the schema validates them
 * as non-empty strings. Same "ship a typed default constant" pattern as
 * `NavigationMenu/data/menu.ts`, so these can later be exposed as Webflow
 * props/slots or wired to CMS without touching components.
 */
import type { SelectOption } from "../Form.types"

/** Civilité radio — values match the `civilite` enum in schema.ts. */
export const civiliteOptions: SelectOption[] = [
  { value: "madame", label: "Madame" },
  { value: "monsieur", label: "Monsieur" },
]

/** "Votre entreprise est-elle créée ?" radio — values match `entrepriseCreee`. */
export const entrepriseCreeeOptions: SelectOption[] = [
  { value: "oui", label: "Oui" },
  { value: "non", label: "Non" },
]

export const fonctionOptions: SelectOption[] = [
  { value: "president", label: "Président" },
  { value: "directeur-general", label: "Directeur Général" },
  { value: "gerant", label: "Gérant" },
  { value: "entrepreneur-individuel", label: "Entrepreneur individuel" },
  { value: "daf", label: "Directeur administratif et financier" },
]

export const chiffreAffairesOptions: SelectOption[] = [
  { value: "0-1.5m", label: "Entre 0 et 1,5 millions d’euros" },
  { value: "1.5-7m", label: "De 1,5 à 7 millions d'euros" },
]

export const nombreSalariesOptions: SelectOption[] = [
  { value: "0", label: "0 salarié" },
  { value: "1-5", label: "1 à 5 salariés" },
  { value: "6-10", label: "6 à 10 salariés" },
  { value: "11-20", label: "11 à 20 salariés" },
  { value: "21-50", label: "21 à 50 salariés" },
  { value: "50+", label: "+ 50 salariés" },
]

export const motifOptions: SelectOption[] = [
  { value: "devenir-client", label: "Devenir client" },
  { value: "essentiel-pro", label: "Essentiel Pro : Besoins complémentaires" },
  { value: "encaissement-paiement", label: "Solutions d’encaissement et de paiement" },
  { value: "tresorerie", label: "Besoin de trésorerie" },
  { value: "financement-investissements", label: "Besoin de financement des investissements" },
  { value: "acquisition-immobiliere", label: "Acquisition immobilière" },
]
