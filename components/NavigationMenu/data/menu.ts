import type {
  EngagementCard,
  FeatureCard,
  MenuTree,
  TopBarLink,
} from "../NavigationMenu.types"

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

const pourquoiEngagementCards: EngagementCard[] = [
  {
    title: "LCL Partenaire du Tour de France",
    ctaLabel: "En savoir plus",
    ctaHref: "#",
  },
  {
    title: "Nos labélisations",
    ctaLabel: "En savoir plus",
    ctaHref: "#",
  },
]

const pourquoiFeatureCards: FeatureCard[] = [
  {
    title: "Les cahiers de l'energie d'entreprendre",
    body: "Un ensemble d'actions pensées pour être aux côtés des entrepreneurs au quotidien.",
    ctaLabel: "Bouton",
    ctaHref: "#",
    iconBg: "white",
  },
  {
    title: "Ouvrir un compte",
    body: "Ouvrez votre compte pro en ligne en moins de 10 minutes ou prenez rendez-vous en agence pour rencontrer l'un de nos conseillers",
    ctaLabel: "Bouton",
    ctaHref: "#",
    iconBg: "white",
  },
]

const savoirFaireEssentielsCards: FeatureCard[] = [
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

const savoirFaireDifferenciantsCards: FeatureCard[] = [
  {
    title: "Care Entrepreneurs",
    body: "Un accompagnement humain et partenarial unique sur le marché bancaire.",
    ctaLabel: "Bouton",
    ctaHref: "#",
    iconBg: "white",
  },
  {
    title: "Portail Entrepreneur LCL",
    body: "Tous les outils, simulateurs, partenaires et conseils pour créer et gérer votre entreprise.",
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
    tabs: [
      {
        label: "Nos essentiels",
        featureCards: savoirFaireEssentielsCards,
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
        featureCards: savoirFaireDifferenciantsCards,
        sections: [
          {
            label: "Ce qui nous distingue",
            variant: "primary",
            ctaLabel: "Tout nos savoir-faire",
            ctaHref: "#",
            items: [
              {
                label: "Fidéliser ses salariés",
                href: "#",
                description:
                  "Épargne salariale, intéressement et participation, assurance collective …",
              },
              {
                label: "Libérer votre esprit d'entreprendre",
                href: "#",
                description:
                  "Care entrepreneur, un programme innovant permettant d'alléger la charge mentale des entrepreneurs",
              },
              {
                label: "Accompagner vos transitions",
                href: "#",
                description:
                  "Transition écologique, mobilité douce, accompagnement à la reprise/cession d'entreprise via e-RIS, etc.",
              },
            ],
          },
          {
            label: "Simuler",
            variant: "list",
            items: [
              { label: "Simuler votre cessation d'activité", href: "#" },
              { label: "Simuler votre coût à l'embauche", href: "#" },
            ],
          },
        ],
      },
    ],
  },
  {
    label: "Pour qui ?",
    featureCards: [
      {
        title: "Professions de santé",
        body: "Offre dédiée médecins, kinés, infirmières, dentistes — TierSanté, gestion tiers-payant PAYMED, 3XCB.",
        ctaLabel: "Bouton",
        ctaHref: "#",
        iconBg: "white",
      },
    ],
    sections: [
      {
        label: "Profil",
        variant: "primary",
        items: [
          { label: "Créateur / indépendant", href: "#" },
          { label: "TPE", href: "#" },
          { label: "PME / ETI", href: "#" },
          { label: "Start-up", href: "#" },
          { label: "Associations et fondations", href: "#" },
        ],
      },
      {
        label: "Métiers",
        variant: "primary",
        items: [
          { label: "Santé", href: "#" },
          { label: "Droit, chiffre et conseil", href: "#" },
          { label: "Artisans et commerçants", href: "#" },
          { label: "Services", href: "#" },
          { label: "Franchise", href: "#" },
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
    label: "Pourquoi LCL ?",
    ctaLabel: "Tout savoir sur LCL",
    ctaHref: "#",
    sections: [
      {
        label: "LCL, Pour aller de l'avant.",
        variant: "primary",
        ctaLabel: "Tout savoir sur LCL",
        ctaHref: "#",
        items: [
          {
            label: "Une histoire de confiance",
            href: "#",
            description: "En agence ou 100% en ligne avec L by LCL",
          },
          {
            label: "L'Energie d'entreprendre",
            href: "#",
            description:
              "Innover et co-construire des offres qui résonnent sur le marché",
          },
          {
            label: "Une banque omnicanale",
            href: "#",
            description:
              "Une banque présente au plus proche des clients de leurs projets",
          },
          {
            label: "Une proximité relationnelle",
            href: "#",
            description:
              "Des espaces dédiés aux professionnels dans nos 1 600 agences, un service client humain élu Service Client de l'Année 2026",
          },
        ],
      },
    ],
    engagementsLabel: "Nos engagements",
    engagementCards: pourquoiEngagementCards,
    featureCards: pourquoiFeatureCards,
  },
]
