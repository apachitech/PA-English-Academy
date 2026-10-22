# PA³ English Academy — Parler Anglais Avec Assurance 🇨🇩

> **« Succeed in English! Boostez votre carrière et débloquez de nouvelles opportunités. »**  
> Plateforme web d'apprentissage de l'anglais style Duolingo, conçue sur-mesure pour les apprenants francophones en **République Démocratique du Congo** (Kinshasa, Lubumbashi, Goma, Bukavu, Matadi, Kisangani, etc.).

---

## 🌟 Identité Officielle & Contact Pédagogique

- **Nom de la plateforme :** PA³ English Academy (*Parler Anglais Avec Assurance*)
- **Directeur & Coach Principal :** **Coach David Liandja**
- **Promesse Phare :** **Évaluation de niveau + 1ère séance : 100 % GRATUITES !**
- **Coordonnées :**
  - 💬 **WhatsApp :** `+27 74 293 2071`
  - 📞 **Téléphone RDC :** `098 689 8083`
  - ✉️ **Email :** `liandjadavid@gmail.com`
  - 📍 **Modalités :** En ligne & Présentiel (Kinshasa, RD Congo)

---

## 🚀 Fonctionnalités Clés Réalisées

1. **Page d'Accueil & Identité de Marque (`/`)**
   - Palette de couleurs officielle : Bleu marine RDC (`#0B1F42`), Or (`#F5A623`), Vert (`#00A86B`), Rouge (`#E02B20`).
   - Boutons 3D tactiles style Duolingo (`btn-duo`, `btn-duo-secondary`).
   - Présentation des 3 programmes spécialisés :
     1. *Anglais Professionnel & ONGs* (rédaction de rapports, réunions de coordination).
     2. *Fluidité & Conversation* (surmonter le blocage de la prise de parole).
     3. *Préparation aux Voyages & Études* (entretiens d'ambassade, bourses).

2. **Test Diagnostique Adaptatif (`/test-de-niveau`)**
   - Moteur adaptatif en TypeScript pur avec banque de 40 questions étalonnées (A1 à B2).
   - Synthèse vocale audio intégrée (TTS `speechSynthesis`).
   - Bilan détaillé par compétence (Grammaire, Vocabulaire, Écoute, Lecture) et attribution de niveau CECR immédiate.

3. **Tableau de Bord Apprenant (`/tableau-de-bord`)**
   - Suivi du niveau actuel, indicateurs XP, flamme de régularité (streak), anneau d'objectif quotidien.
   - Bouton de reprise directe de la dernière leçon.
   - Mode économie de données (Data-Saver) pour connexions cellulaires 3G/4G lentes.

4. **Parcours d'Apprentissage Interactif (`/parcours`)**
   - Carte visuelle sinueuse style Duolingo avec progression par unité.
   - Déblocage automatique des leçons après obtention d'au moins 70 % de réussite.

5. **Lecteur de Leçon & Exercices Multimodaux (`/lecon/[slug]`)**
   - Composant `VideoPlayer` optimisé avec mode audio seul (économise jusqu'à 85 % de forfait de données mobiles) et sous-titres bilingues WebVTT.
   - 6 types d'exercices interactifs :
     - Choix multiple
     - Remplissage de blanc
     - Association de paires (mots anglais / français)
     - Remise en ordre de mots
     - Écoute audio et sélection
     - Pratique d'expression orale (reconnaissance vocale Web Speech API)

6. **Gamification & Esprit de Communauté (`/classement`, `/badges`)**
   - 5 Ligues hebdomadaires (Bronze, Argent, Or, Saphir, Diamant).
   - Remise à zéro chaque lundi à minuit (heure de Kinshasa GMT+1).
   - 9 Badges officiels (*Premier pas, Élève assidu, Léopard de la RDC 30j, Sans faute, etc.*) avec partage WhatsApp.

7. **Certificats Officiels Vérifiables (`/certificats`, `/verify/[id]`)**
   - Sceau d'authenticité avec signature du Coach David Liandja.
   - QR code de vérification publique en ligne.
   - Impression et export PDF officiel.

8. **Portail Enseignant & Administration (`/admin`)**
   - Tableau de bord pour Coach David et l'équipe pédagogique.
   - Indicateurs de suivi des apprenants par province (Kinshasa, Haut-Katanga, Nord-Kivu, etc.).
   - Exportation de la liste des apprenants au format CSV pour gestion des cours présentiels.
   - Gestion du catalogue de leçons (statuts brouillon / publié).

9. **PWA, Mode Hors Ligne & Économie de Données (`/offline`, `public/sw.js`)**
   - Service Worker avec mise en cache des leçons et des fichiers multimédias.
   - Page dédiée hors-ligne en cas de coupure de réseau Vodacom / Airtel / Orange.
   - Bannière d'installation PWA sur téléphones Android.

10. **Tarifs & Paiement Mobile Money (`/tarifs`)**
    - Niveau A1 Débutant 100 % gratuit.
    - Pass Niveaux A2, B1, B2 à prix accessibles.
    - Simulation de paiement Mobile Money adapté à la RDC : **M-Pesa (Vodacom)**, **Airtel Money**, **Orange Money**, et Carte Bancaire.

---

## 🛠️ Stack Technique

- **Framework :** [Next.js 16](https://nextjs.org) (App Router, Turbopack, React 19)
- **Langage :** TypeScript (mode strict, typage complet)
- **Styles :** Tailwind CSS v4 + Design tokens PA³
- **Base de données & Auth :** Supabase (Postgres, RLS, Fonctions de sécurité, Auth SSR)
- **Tests :** [Vitest](https://vitest.dev) (tests unitaires rapides du moteur de placement et de la gamification)
- **Audio / Voix :** Web Speech API (TTS & SpeechRecognition) avec repli audio

---

## 💻 Démarrage Local

### Prérequis
- Node.js 20+ ou 22+
- npm (sur Windows, utilisez `npm.cmd`)

### Installation
```powershell
# Cloner le dépôt et se placer dans le projet
cd c:\Users\XPRISTO\Desktop\PA3-english\speakup-congo

# Installer les dépendances
npm.cmd install

# Lancer le serveur de développement local
npm.cmd run dev
```

L'application est disponible sur : **`http://localhost:3000`**

### Exécution des Tests
```powershell
npm.cmd test
```

### Compilation pour la Production
```powershell
npm.cmd run build
```

---

## 🗄️ Configuration Supabase

1. Créez un projet gratuit sur [supabase.com](https://supabase.com).
2. Dans le SQL Editor de Supabase, appliquez :
   - `supabase/migrations/20261021000000_init.sql` (schéma, tables, politiques RLS, fonctions)
   - `supabase/seed.sql` (données initiales : niveaux, unités, leçons, 40 questions du test de niveau, 9 badges)
3. Renseignez vos clés dans `.env.local` :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
   SUPABASE_SERVICE_ROLE_KEY=votre-cle-service-role
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_FEATURE_PHONE_OTP=false
   ```

---

## 📄 Licence

Propriété exclusive de **PA³ English Academy** & **Coach David Liandja**. Tous droits réservés (RDC - 2026).
