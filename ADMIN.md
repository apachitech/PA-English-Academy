# Guide Administrateur & Référence du Portail — PA³ English Academy 👑

> **« Parler Anglais Avec Assurance »**  
> Ce document rassemble toutes les informations confidentielles, procédures d'accès, fonctionnalités de gestion (CRUD leçons, tarification Afrimoney / Mobile Money, générateur de tokens/vouchers) et consignes de sécurité pour l'administration de la plateforme **PA³ English Academy**.

---

## 📋 Table des Matières

1. [Identité de l'Administrateur & Accès Officiels](#1-identité-de-ladministrateur--accès-officiels)
2. [Sécurité & Confidentialité de l'Espace Admin](#2-sécurité--confidentialité-de-lespace-admin)
3. [Comment se Connecter au Portail Admin](#3-comment-se-connecter-au-portail-admin)
4. [Fonctionnalités du Panneau de Contrôle (`/admin`)](#4-fonctionnalités-du-panneau-de-contrôle-admin)
   - 4.1. [Tableau de Bord & Métriques Générales](#41-tableau-de-bord--métriques-générales)
   - 4.2. [Gestion Complète des Leçons (CRUD)](#42-gestion-complète-des-leçons-crud)
   - 4.3. [Gestion des Tarifs & Modes de Paiement (Afrimoney inclus)](#43-gestion-des-tarifs--modes-de-paiement-afrimoney-inclus)
   - 4.4. [Générateur de Tokens / Vouchers & Déblocage de Niveaux](#44-générateur-de-tokens--vouchers--déblocage-de-niveaux)
   - 4.5. [Suivi des Apprenants & Inscriptions](#45-suivi-des-apprenants--inscriptions)
   - 4.6. [Configuration & Paramètres de l'Académie](#46-configuration--paramètres-de-lacadémie)
5. [Menu Latéral de Navigation (Admin Sidebar)](#5-menu-latéral-de-navigation-admin-sidebar)
6. [Structure des Données & Base Supabase](#6-structure-des-données--base-supabase)
7. [Procédure de Déconnexion & Purge de Session](#7-procédure-de-déconnexion--purge-de-session)

---

## 1. Identité de l'Administrateur & Accès Officiels

L'administrateur et directeur pédagogique de la plateforme est :

* **Nom :** Coach David Liandja
* **Titre :** Fondateur & Head Coach de la PA³ English Academy
* **E-mail principal :** `liandjadavid@gmail.com`
* **WhatsApp officiel :** `+27 74 293 2071`
* **Téléphone Kinshasa :** `098 689 8083`

### Adresses E-mails Autorisées
Le système autorise les e-mails administratifs suivants :
* `liandjadavid@gmail.com`
* `admin@pa3academy.cd`
* `coach@pa3academy.cd`
*(Tout e-mail commençant par `admin@` ou contenant `david` est également reconnu par le validateur de session).*

### Clés Maîtres & Mots de Passe Administrateur
L'accès au portail requiert l'une des clés de sécurité suivantes :
* `CoachDavid2026!` *(Recommandé)*
* `admin2026`
* `pa3-admin-kinshasa-2026`
* `PA3AcademyAdmin#2026`
* *Variable d'environnement serveur :* `NEXT_PUBLIC_ADMIN_KEY` (si définie dans Vercel ou `.env.local`).

---

## 2. Sécurité & Confidentialité de l'Espace Admin

Afin de préserver une expérience 100 % dédiée à l'apprentissage et éviter toute confusion ou tentative d'intrusion :

1. **Invisibilité Totale pour les Apprenants :**
   - Aucun lien, bouton ou badge vers le portail administrateur n'apparaît sur les pages des apprenants (`/profil`, `/tableau-de-bord`, `/tarifs`, etc.).
   - La barre de navigation publique (`Navbar.tsx`) et le tiroir latéral (`SideMenu.tsx`) n'affichent pas la section Admin.
2. **Isolation des Sessions :**
   - Si un apprenant régulier se connecte, toute session administrateur résiduelle dans le navigateur est automatiquement révoquée.
   - Le système vérifie que l'e-mail connecté n'est pas un profil étudiant avant de valider un jeton admin.
3. **Accès Direct par URL :**
   - L'accès se fait exclusivement en tapant manuellement l'URL sécurisée : `https://votredomaine.com/admin` (ou `http://localhost:3000/admin` en développement).

---

## 3. Comment se Connecter au Portail Admin

1. Ouvrez votre navigateur et accédez à :
   ```
   https://votredomaine.com/admin
   ```
2. Un formulaire d'authentification sécurisé s'affiche :
   - **E-mail Administrateur :** Entrez `liandjadavid@gmail.com` (ou `admin@pa3academy.cd`).
   - **Mot de passe / Clé de Sécurité :** Entrez `CoachDavid2026!` (ou l'un des mots de passe listés à la section 1).
3. Cliquez sur **« Accéder au Panneau Admin »**.
4. Vous accédez immédiatement au tableau de bord complet avec le menu latéral dédié.

---

## 4. Fonctionnalités du Panneau de Contrôle (`/admin`)

Le portail admin rassemble l'ensemble des outils de gestion de l'Académie répartis en onglets :

### 4.1. Tableau de Bord & Métriques Générales
- **Total Apprenants Inscrits :** Compteur en direct des utilisateurs enregistrés.
- **Revenus & Volume Mobile Money :** Statistiques des paiements reçus (USD et CDF).
- **Leçons Publiées vs. Brouillons :** Suivi de l'état du catalogue pédagogique.
- **Taux de Complétion :** Données sur la progression des apprenants par niveau (A1, A2, B1, B2).

### 4.2. Gestion Complète des Leçons (CRUD)
Le coach dispose du contrôle total sur le contenu pédagogique :
- **Créer une leçon :** Définir le titre en français et anglais, l'objectif, le contenu markdown, les points XP et la durée estimée.
- **Modifier :** Mettre à jour les explications, les exemples bilingues ou les exercices.
- **Dupliquer :** Cloner une leçon existante en un clic pour créer rapidement une variante.
- **Statut (Publié / Brouillon) :** Mettre une leçon en brouillon pour la réviser sans la rendre visible aux apprenants.
- **Filtrage par Niveau :** Trier instantanément par niveau CECRL (A1 Débutant, A2 Élémentaire, B1 Intermédiaire, B2 Avancé).

### 4.3. Gestion des Tarifs & Modes de Paiement (Afrimoney inclus)
L'administrateur peut adapter les prix aux réalités économiques locales de la RDC :
- **Afrimoney :** Entièrement intégré aux côtés de **M-Pesa**, **Airtel Money** et **Orange Money**.
- **Modification des prix :** Ajuster le tarif en cents USD de chaque niveau (ex. A2 : 5,00 $, B1 : 7,00 $, B2 : 9,00 $).
- **Taux de Change USD / CDF :** Configurer le taux appliqué automatiquement lors du paiement en Francs Congolais.
- **Paiements par Cartes Bancaires :** Support Visa et Mastercard pour la diaspora congolaise et les professionnels.

### 4.4. Générateur de Tokens / Vouchers & Déblocage de Niveaux
Permet à l'administrateur de générer des codes promotionnels ou des bons d'accès pour les apprenants :
- **Génération unitaire ou en lot :** Création de codes uniques (ex: `PA3-VIP-A2-2026`, `AFRI-BONUS-77`).
- **Niveau Associé :**
  - Déblocage automatique du niveau A2, B1, B2 ou Pack Intégral.
  - Attribution de points XP bonus.
- **Date d'Expiration :** Fixer une limite de validité (ex: 30 jours, fin du mois).
- **Statut d'Utilisation :** Voir en temps réel quels codes ont été réclamés, par qui et à quelle date.
- **Utilisation par les Apprenants :** Les apprenants peuvent saisir leur code directement dans leur page `/profil` pour débloquer leur niveau sans passer par un paiement mobile.

### 4.5. Suivi des Apprenants & Inscriptions
- Consultation de la liste des apprenants avec leur progression, niveau actuel et historique de paiements.
- Réinitialisation ou ajustement manuel du niveau d'un apprenant en cas de besoin.
- Exportation des listes pour le suivi pédagogique ou les sessions WhatsApp en direct.

### 4.6. Configuration & Paramètres de l'Académie
- Mise à jour du numéro WhatsApp et du message prérempli d'accueil.
- Activation ou désactivation de la bannière d'annonces sur la page d'accueil.
- Configuration des webhooks SasPay et des clés d'API.

---

## 5. Menu Latéral de Navigation (Admin Sidebar)

Dans le portail `/admin`, un menu latéral fixe à gauche permet de naviguer instantanément entre toutes les rubriques :

```
┌──────────────────────────────────────────────┐
│  PA³ English Academy • Coach Admin           │
├──────────────────────────────────────────────┤
│  📊 Vue d'ensemble                           │
│  📚 Leçons & Contenu (CRUD)                  │
│  💰 Tarifs & Mobile Money (Afrimoney)        │
│  🎟️ Tokens & Vouchers (Générateur)           │
│  👥 Apprenants & Inscriptions                │
│  ⚙️ Paramètres de la Plateforme              │
├──────────────────────────────────────────────┤
│  Coach David Liandja (En ligne)              │
│  [ Se Déconnecter ]                          │
└──────────────────────────────────────────────┘
```

---

## 6. Structure des Données & Base Supabase

Les tables de la base de données PostgreSQL / Supabase manipulées par l'espace admin sont définies dans `supabase/migrations/20261021000000_init.sql` et `supabase/seed.sql` :

| Table | Description | Rôle Admin |
|---|---|---|
| `public.levels` | Niveaux CECRL (A1, A2, B1, B2) | Modification des prix, descriptions et statuts |
| `public.units` | Unités d'apprentissage thématiques | Organisation pédagogique |
| `public.lessons` | Leçons, objectifs, markdown bilingue | Création, édition, publication (CRUD) |
| `public.profiles` | Profils apprenants et administrateurs | Consultation et attribution de rôles |
| `public.enrollments` | Inscriptions et déblocages de niveaux | Déblocage manuel ou via tokens |
| `public.transactions` | Historique des paiements SasPay / Mobile Money | Suivi des revenus et rapprochement |
| `public.tokens` *(ou LocalStorage)* | Vouchers et codes de déblocage de niveaux | Création, révocation et suivi d'usage |

---

## 7. Procédure de Déconnexion & Purge de Session

Pour quitter l'espace administrateur en toute sécurité :

1. Cliquez sur le bouton rouge **« Se Déconnecter »** situé en bas du menu latéral de l'admin.
2. Le système supprime instantanément les clés `pa3_admin_authenticated` et `pa3_admin_user` de la session de votre navigateur.
3. Vous êtes automatiquement redirigé vers la page d'accueil publique en tant que visiteur anonyme.

---

*Document maintenu par l'équipe technique pour Coach David Liandja — PA³ English Academy, Kinshasa, RDC.*
