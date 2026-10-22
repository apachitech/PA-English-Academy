import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { PwaManager } from "@/components/pwa/PwaManager";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "PA³ English Academy — Parler Anglais Avec Assurance (RDC)",
  description:
    "La plateforme d'apprentissage de l'anglais conçue pour les francophones en République Démocratique du Congo. Cours interactifs style Duolingo, tests adaptatifs, vidéos, examens certifiés et coaching avec Coach David Liandja à Kinshasa.",
  keywords: [
    "Anglais RDC",
    "Apprendre l'anglais Kinshasa",
    "PA3 English Academy",
    "Parler Anglais Avec Assurance",
    "Cours anglais Lubumbashi",
    "Anglais professionnel RDC",
    "M-Pesa cours anglais",
  ],
  authors: [{ name: "Coach David Liandja - PA³ English Academy" }],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico?v=2" },
      { url: "/favicon-32x32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png?v=2", sizes: "16x16", type: "image/png" },
      { url: "/icon.png?v=2", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: [
      { url: "/apple-icon.png?v=2", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "PA³ English Academy — Parler Anglais Avec Assurance",
    description:
      "Boostez votre carrière et débloquez de nouvelles opportunités avec PA³ English Academy en RDC.",
    images: [{ url: "/images/pa3-logo.jpg", width: 800, height: 600, alt: "PA3 Logo" }],
    locale: "fr_CD",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1F42",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-amber-400 selection:text-navy font-sans">
        <PwaManager />
        {children}
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            style: {
              borderRadius: "1rem",
              fontFamily: "var(--font-geist-sans)",
            },
          }}
        />
      </body>
    </html>
  );
}
