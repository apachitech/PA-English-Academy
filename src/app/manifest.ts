import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PA³ English Academy",
    short_name: "PA³ Academy",
    description: "Parler Anglais Avec Assurance — Apprentissage interactif en RDC",
    start_url: "/",
    display: "standalone",
    background_color: "#0B1F42",
    theme_color: "#0B1F42",
    orientation: "portrait",
    lang: "fr",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/pa3-logo.jpg",
        sizes: "1024x571",
        type: "image/jpeg",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
