import { declareComponent, useWebflowContext } from "@webflow/react"
import { props } from "@webflow/data-types"
import CardComparisonFlex from "./CardComparisonFlex"
import { SEED_CONTENT } from "./content"

/**
 * Webflow binding for the dynamic comparison component.
 *
 * colCount/rowCount are clamped Number props (the source of truth for grid
 * dimensions). `contentData` is a props.Text holding JSON (or the delimited
 * format). NB: props.TextNode would crash here — it is delivered as a ReactNode,
 * not a string, so parsing it throws ("Something went wrong"). props.Text is the
 * string-valued prop. We read interactivity via useWebflowContext() (guarded;
 * interactive === false on the canvas) and forward it as `editorMode` so the
 * authoring-warning banner shows only while editing, never on preview/publish.
 * props.Link is unwrapped to its href, like V1.
 */
type WebflowProps = {
  colCount: number
  rowCount: number
  contentData: string
  sectionTitle: string
  rdvLabel: string
  rdvUrl: { href: string; target?: string }
}

function CardComparisonFlexWebflow({
  colCount,
  rowCount,
  contentData,
  sectionTitle,
  rdvLabel,
  rdvUrl,
}: WebflowProps) {
  const ctx = useWebflowContext()
  const editorMode = !(ctx?.interactive ?? true)
  return (
    <CardComparisonFlex
      colCount={colCount}
      rowCount={rowCount}
      contentData={contentData}
      sectionTitle={sectionTitle}
      rdvLabel={rdvLabel}
      rdvUrl={rdvUrl?.href ?? "#"}
      editorMode={editorMode}
    />
  )
}

export default declareComponent(CardComparisonFlexWebflow, {
  name: "LCL Card Comparison (dynamique)",
  description:
    "Tableau de comparaison à nombre de cartes (colonnes) et de lignes variables. Contenu éditable dans un champ unique : JSON (complet) ou format délimité collable depuis un tableur. Réutilise le rendu V1 (grille desktop + carrousel mobile).",
  group: "LCL",
  props: {
    colCount: props.Number({
      name: "Nombre de cartes (colonnes)",
      defaultValue: 4,
      min: 2,
      max: 6,
      decimals: 0,
    }),
    rowCount: props.Number({
      name: "Nombre de lignes",
      defaultValue: 14,
      min: 1,
      max: 30,
      decimals: 0,
    }),
    contentData: props.Text({
      name: "Données (JSON sur une ligne, ou texte délimité)",
      defaultValue: SEED_CONTENT,
    }),
    sectionTitle: props.Text({ name: "Titre de section", defaultValue: "Compte pro et cartes" }),
    rdvLabel: props.Text({ name: "Libellé bouton", defaultValue: "Prendre rendez-vous" }),
    rdvUrl: props.Link({ name: "Lien Prendre rendez-vous" }),
  },
})
