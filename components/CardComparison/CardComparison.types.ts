/** Visual theme of a card chip — drives the CSS-drawn mini-card colours. */
export type CardTheme = "business" | "gold" | "excellence" | "platinum"

export interface CardDef {
  /** Display name; use \n to force a line break (e.g. "Carte Visa\nBusiness"). */
  name: string
  theme: CardTheme
  /** Network label printed on the chip (e.g. "VISA", "Mastercard"). */
  network: string
  /** Tier label printed on the chip (e.g. "BUSINESS", "EXCELLENCE"). */
  tier: string
  /** Optional per-card caveat shown above this card's column AND inside its
   *  mobile card (e.g. Platinum's "Uniquement disponible avec un compte L by LCL").
   *  Travels with the card, so it follows reorders and hides with the column. */
  note?: string
}

export interface CardValue {
  /** Main value: "Inclus", "-", a price, or free text. */
  text: string
  /** Optional grey sub-line shown under the value. */
  sub?: string
}

export interface CardFeatureRow {
  label: string
  /** One value per card, in the same order as `cards`. */
  values: CardValue[]
}

export interface CardComparisonData {
  cards: CardDef[]
  rows: CardFeatureRow[]
}
