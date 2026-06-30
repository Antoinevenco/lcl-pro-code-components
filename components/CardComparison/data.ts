import type { CardComparisonData } from "./CardComparison.types"

/**
 * LCL professional card comparison — content baked in (hybrid model: structure
 * + values here, editable bits like the RDV URL / section title come via props).
 * Mirrors the reference design; "-" means not included, "Inclus" means included.
 */
export const CARD_COMPARISON_DATA: CardComparisonData = {
  cards: [
    {
      name: "Carte Visa\nBusiness",
      theme: "business",
      network: "VISA",
      tier: "BUSINESS",
      ctaLabel: "Découvrir",
      ctaHref:
        "https://www.professionnel.lcl.fr/cartes-bancaires-professionnelles-et-services/carte-visa-business",
    },
    {
      name: "Carte Visa\nGold Business",
      theme: "gold",
      network: "VISA",
      tier: "Gold BUSINESS",
      ctaLabel: "Découvrir",
      ctaHref:
        "https://www.professionnel.lcl.fr/cartes-bancaires-professionnelles-et-services/carte-visa-gold-business",
    },
    {
      name: "Carte\nLCL Excellence",
      theme: "excellence",
      network: "Mastercard",
      tier: "EXCELLENCE",
      ctaLabel: "Découvrir",
      ctaHref:
        "https://www.professionnel.lcl.fr/cartes-bancaires-professionnelles-et-services/carte-lcl-excellence",
    },
    {
      name: "Carte\nL by LCL Platinum",
      theme: "platinum",
      network: "",
      tier: "PLATINUM",
      note: "Uniquement disponible avec un compte L by LCL",
    },
  ],
  rows: [
    {
      label: "Réseau",
      values: [{ text: "CB/Visa" }, { text: "CB/Visa" }, { text: "Mastercard" }, { text: "Lorem ipsum" }],
    },
    {
      label: "Type de débit",
      values: [
        { text: "Immédiat ou différé", sub: "À la fin du mois" },
        { text: "Immédiat ou différé", sub: "À la fin du mois" },
        { text: "Immédiat ou différé", sub: "À la fin du mois" },
        { text: "Lorem ipsum" },
      ],
    },
    {
      label: "Cotisation annuelle",
      values: [{ text: "64 €" }, { text: "146,50 €" }, { text: "259 €" }, { text: "- €" }],
    },
    {
      label: "Plafond de retrait en France / à l'étranger (3 jours glissants)",
      values: [
        { text: "700 € / 500 €" },
        { text: "1 500 € / 1 000 €" },
        { text: "1 500 € / 1 000 €" },
        { text: "- €" },
      ],
    },
    {
      label: "Plafond de paiement mensuel, personnalisable, en France et à l'étranger",
      values: [
        { text: "4 000 €", sub: "Plafond personnalisable jusqu'à 8 000 €" },
        { text: "8 000 €", sub: "Plafond personnalisable jusqu'à 16 000 €" },
        { text: "12 000 €", sub: "Plafond personnalisable jusqu'à 20 000 €" },
        { text: "- €", sub: "Plafond personnalisable jusqu'à - €" },
      ],
    },
    {
      label: "Visuel personnalisé aux couleurs de votre entreprise ou via un catalogue d'images",
      values: [{ text: "Inclus" }, { text: "-" }, { text: "-" }, { text: "-" }],
    },
    {
      label: "Assistance médicale",
      values: [{ text: "Inclus" }, { text: "Inclus" }, { text: "Inclus" }, { text: "-" }],
    },
    {
      label: "Assurance voyage (bagages, retard de transport, véhicule de location…)",
      values: [{ text: "Inclus" }, { text: "Inclus" }, { text: "Inclus" }, { text: "-" }],
    },
    {
      label: "Responsabilité civile à l'étranger",
      values: [{ text: "-" }, { text: "Inclus" }, { text: "Inclus" }, { text: "-" }],
    },
    {
      label: "Assurance achats",
      values: [{ text: "-" }, { text: "Inclus" }, { text: "Inclus" }, { text: "-" }],
    },
    {
      label: "Assistance véhicule professionnel",
      values: [{ text: "-" }, { text: "-" }, { text: "Inclus" }, { text: "-" }],
    },
    {
      label: "Assistant Professionnel et secrétariat de remplacement 48H",
      values: [{ text: "-" }, { text: "-" }, { text: "Inclus" }, { text: "-" }],
    },
    {
      label: "Avantages partenaires",
      values: [
        { text: "Réduction auprès des partenaires Visa", sub: "(voyages, hôtels, location de voiture, équipement de bureau…)" },
        { text: "Réduction auprès des partenaires Visa", sub: "(voyages, hôtels, location de voiture, équipement de bureau…)" },
        { text: "Accès au programme Priceless Paris, réductions auprès des partenaires MasterCard", sub: "(voyages, hôtels, location de voiture, équipement de bureau…)" },
        { text: "Lorem ipsum" },
      ],
    },
  ],
}
