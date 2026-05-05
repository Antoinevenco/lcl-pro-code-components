import type { FeatureCard, MenuTree, TopBarLink } from "../NavigationMenu.types"

export const topBarLinks: TopBarLink[] = [
  { label: "Particulier", href: "https://www.lcl.fr/" },
  { label: "Banque privée", href: "https://www.lcl.fr/banque-privee" },
  { label: "Professionnels", href: "/", current: true },
  { label: "Entreprises", href: "https://www.lcl.fr/entreprise" },
]

const comptesCards: FeatureCard[] = [
  {
    title: "L BY LCL PRO : UN Compte 100% digital",
    body: "Ouvrez votre compte en ligne en moins de 10 minutes. 9€/mois (gratuite pour les clients LCL particuliers).",
    ctaLabel: "Bouton",
    ctaHref: "#",
    iconBg: "yellow",
  },
  {
    title: "Besoin d'un conseiller ?",
    body: "Rendez-vous dans l'une de nos 1600 agences, à domicile ou en visio pour nous rencontrer",
    ctaLabel: "Bouton",
    ctaHref: "#",
    iconBg: "white",
  },
]

const savoirFaireCards: FeatureCard[] = [
  {
    title: "Prêt Professionnel Express",
    body: "Financez vos investissements avec un déblocage des fonds en 48h.",
    ctaLabel: "Bouton",
    ctaHref: "#",
    iconBg: "white",
  },
  {
    title: "Besoin de conseils ?",
    body: "Votre conseiller LCL vous présentera des solutions adaptées à votre développement.",
    ctaLabel: "Bouton",
    ctaHref: "#",
    iconBg: "white",
  },
]

export const defaultMenu: MenuTree = [
  {
    label: "Comptes et Opérations",
    ctaLabel: "Tout savoir sur nos comptes pro",
    ctaHref: "#",
    featureCards: comptesCards,
    sections: [
      {
        label: "Nos offres du quotidien",
        variant: "primary",
        ctaLabel: "Tout savoir sur nos comptes pro",
        ctaHref: "#",
        items: [
          {
            label: "Choisir votre façon d'ouvrir un compte pro",
            href: "#",
            description: "En agence ou 100% en ligne avec L by LCL",
          },
          {
            label: "Trouver la carte bancaire Pro qui vous correspond",
            href: "#",
            description: "Cartes Visa Business, Gold ou Excellence",
          },
          {
            label: "Encaisser en magasin, en mobilité ou à distance",
            href: "#",
            description: "TPE, Tap to Pay … des solutions adaptées à votre activité",
          },
          {
            label: "Simplifier votre gestion administrative et comptable",
            href: "#",
            description: "Gérer devis, factures et trésorerie en toute simplicité avec Kolecto",
          },
          {
            label: "Créer votre entreprise",
            href: "#",
            description: "Accompagnement complet avec notre partenaire LegalPlace",
          },
        ],
      },
      {
        label: "Simuler",
        variant: "list",
        items: [
          { label: "Comparateur de compte professionnel", href: "#" },
          { label: "Comparateur de carte", href: "#" },
          { label: "Simulateur de statut juridique", href: "#" },
          { label: "Construire mon Business Plan", href: "#" },
        ],
      },
    ],
  },
  {
    label: "Nos savoir-faire",
    ctaLabel: "Tout nos savoir-faire",
    ctaHref: "#",
    featureCards: savoirFaireCards,
    tabs: [
      {
        label: "Nos essentiels",
        sections: [
          {
            label: "Nos essentiels",
            variant: "primary",
            ctaLabel: "Tout nos savoir-faire",
            ctaHref: "#",
            items: [
              {
                label: "Se financer",
                href: "#",
                description:
                  "Crédits professionnels, Facilité de caisses, affacturage, leasing, financement de fonds de commerce et locaux …",
              },
              {
                label: "Épargner et Placer",
                href: "#",
                description: "Optimiser sa trésorerie, préparer sa retraite",
              },
              {
                label: "S'assurer",
                href: "#",
                description:
                  "Responsabilité Civile Pro, Multirisque Pro, Prévoyance, Assurance Cyber …",
              },
            ],
          },
          {
            label: "Simuler",
            variant: "list",
            items: [
              { label: "Simulateur prêt professionnel", href: "#" },
              { label: "MAPi : Simulateur aides publiques", href: "#" },
            ],
          },
        ],
      },
      {
        label: "Nos différenciants",
        sections: [
          {
            label: "Nos différenciants",
            variant: "primary",
            ctaLabel: "Tout nos savoir-faire",
            ctaHref: "#",
            items: [
              {
                label: "Banque internationale",
                href: "#",
                description: "Solutions pour vos opérations à l'international",
              },
              {
                label: "Banque d'affaires",
                href: "#",
                description: "Accompagnement haut de bilan et grandes opérations",
              },
            ],
          },
          {
            label: "Simuler",
            variant: "list",
            items: [{ label: "Simulateur prêt professionnel", href: "#" }],
          },
        ],
      },
    ],
  },
  {
    label: "Pour qui ?",
    featureCards: savoirFaireCards,
    tabs: [
      {
        label: "Profil",
        sections: [
          {
            label: "Vous êtes",
            variant: "primary",
            items: [
              {
                label: "Indépendant",
                href: "#",
                description: "Auto-entrepreneur, profession libérale, freelance",
              },
              {
                label: "Artisan ou commerçant",
                href: "#",
                description: "TPE, boutique, atelier",
              },
              {
                label: "Dirigeant de TPE / PME",
                href: "#",
                description: "Société, holding, groupe",
              },
              {
                label: "Créateur ou repreneur",
                href: "#",
                description: "Lancement, reprise d'entreprise",
              },
            ],
          },
          {
            label: "Simuler",
            variant: "list",
            items: [
              { label: "Simulateur prêt professionnel", href: "#" },
              { label: "MAPi : Simulateur aides publiques", href: "#" },
            ],
          },
        ],
      },
      {
        label: "Métiers",
        sections: [
          {
            label: "Votre activité",
            variant: "primary",
            items: [
              {
                label: "Santé",
                href: "#",
                description: "Médecins, infirmiers, pharmaciens",
              },
              { label: "Juridique", href: "#", description: "Avocats, notaires, huissiers" },
              { label: "Conseil", href: "#", description: "Consultants, experts-comptables" },
              {
                label: "Commerce et artisanat",
                href: "#",
                description: "Restauration, BTP, services",
              },
              {
                label: "Agriculture",
                href: "#",
                description: "Exploitations, viticulteurs",
              },
            ],
          },
          {
            label: "Simuler",
            variant: "list",
            items: [
              { label: "Simulateur prêt professionnel", href: "#" },
              { label: "Comparateur de carte", href: "#" },
            ],
          },
        ],
      },
    ],
  },
  {
    label: "Pourquoi LCL ?",
    featureCards: savoirFaireCards,
    tabs: [
      {
        label: "Notre engagement",
        sections: [
          {
            label: "Proximité",
            variant: "primary",
            items: [
              { label: "Réseau d'agences", href: "#", description: "1600 agences en France" },
              { label: "Conseiller dédié", href: "#", description: "Un interlocuteur unique" },
            ],
          },
          {
            label: "Nos engagements",
            variant: "list",
            items: [
              { label: "Engagement RSE", href: "#" },
              { label: "Charte qualité", href: "#" },
              { label: "Diversité et inclusion", href: "#" },
            ],
          },
        ],
      },
      {
        label: "Nos expertises",
        sections: [
          {
            label: "Métiers",
            variant: "primary",
            items: [
              {
                label: "Banque d'affaires",
                href: "#",
                description: "Conseil et financement",
              },
              {
                label: "International",
                href: "#",
                description: "Présence dans 70 pays",
              },
            ],
          },
          {
            label: "Nos engagements",
            variant: "list",
            items: [
              { label: "Finance durable", href: "#" },
              { label: "Innovation", href: "#" },
            ],
          },
        ],
      },
    ],
  },
]
