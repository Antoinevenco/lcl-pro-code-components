/**
 * Shared types for the OfferFilter component.
 *
 * An `Offer` is the user-facing label (`title`) paired with the slug
 * (`value`) the page DOM uses to mark its column cells (`.{value}-offer`)
 * and matching card (`[data-filter-card="{value}"]`).
 */

export type Offer = {
  title: string
  value: string
}
