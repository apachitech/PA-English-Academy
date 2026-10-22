/**
 * PA³ English Academy — Brand identity and configuration
 * Slogan: "Parler Anglais Avec Assurance"
 */

export const BRAND = {
  name: "PA³ English Academy",
  shortName: "PA³ Academy",
  acronym: "PA³",
  slogan: "Parler Anglais Avec Assurance",
  englishSlogan: "Succeed in English!",
  subtitle: "Boostez votre carrière et débloquez de nouvelles opportunités.",

  coach: {
    name: "Coach David Liandja",
    title: "Fondateur & Head Coach",
    email: "liandjadavid@gmail.com",
    whatsapp: "+27 74 293 2071",
    whatsappLink: "https://wa.me/27742932071?text=Bonjour%20Coach%20David%2C%20je%20souhaite%20en%20savoir%20plus%20sur%20PA%C2%B3%20English%20Academy",
    phone: "098 689 8083",
    locations: "En ligne & Présentiel (Kinshasa)",
  },

  programs: [
    {
      id: "pro",
      title: "Anglais Professionnel & ONGs",
      description: "Entretiens d'embauche, CV percutant, emails professionnels et animation de réunions.",
      icon: "briefcase",
    },
    {
      id: "fluency",
      title: "Fluidité & Conversation",
      description: "Parlez sans bloquer, améliorez votre prononciation et gagnez une vraie confiance à l'oral.",
      icon: "message-circle",
    },
    {
      id: "travel",
      title: "Préparation aux Voyages & Études",
      description: "Bourses internationales, préparation aux départs, affaires et commerce transfrontalier.",
      icon: "plane",
    },
  ],

  paymentMethods: [
    { name: "M-Pesa", color: "#E60000" },
    { name: "Airtel Money", color: "#FF0000" },
    { name: "Orange Money", color: "#FF7900" },
    { name: "Carte bancaire (Visa / Mastercard)", color: "#1A1F71" },
  ],

  pricing: {
    placementAndFirstLesson: "GRATUITES",
    priceNote: "Prix flexible adapté au pouvoir d'achat en RDC",
  },
} as const;
