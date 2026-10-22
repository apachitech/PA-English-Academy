# PA³ English Academy — Guide Complet de Connexion & Authentification 🔐

> **« Parler Anglais Avec Assurance » — SpeakUp Congo**  
> Ce document détaille l'ensemble des procédures d'authentification pour les **Apprenants** et pour l'**Administration Pédagogique (Coach David Liandja)** de PA³ English Academy.

---

## 📌 1. Liens d'Accès Rapide

| Espace | URL | Public Cible | Statut d'Accès |
|---|---|---|---|
| **Connexion Apprenant** | [/connexion](http://localhost:3000/connexion) | Tous les apprenants | Libre / Compte existant |
| **Inscription Gratuite** | [/inscription](http://localhost:3000/inscription) | Nouveaux apprenants | Libre / Inscription immédiate |
| **Tableau de Bord Personnel** | [/tableau-de-bord](http://localhost:3000/tableau-de-bord) | Apprenants connectés | Espace d'apprentissage |
| **Portail Administration CRUD** | [/admin](http://localhost:3000/admin) | **Coach David Liandja & Admins** | 🔒 **Verrouillé & Réservé** |
| **Test de Niveau CECRL** | [/test-de-niveau](http://localhost:3000/test-de-niveau) | Tous visiteurs | 100 % Gratuit & sans prérequis |
| **Vidéos à la Demande (VOD)** | [/vod](http://localhost:3000/vod) | Tous apprenants | Capsules HD & Mode 3G Éco |

---

## 🛡️ 2. Accès Sécurisé au Portail Administrateur (`/admin`)

L'accès au panneau d'administration est **strictement protégé** par une barrière d'authentification dédiée. Les visiteurs non accrédités ne peuvent ni voir ni modifier les données pédagogiques et apprenants.

### 2.1 Écran de Verrouillage (`Admin Security Lock Screen`)
Lorsque vous naviguez vers `http://localhost:3000/admin` sans être connecté en tant qu'administrateur :
1. Un écran de haute sécurité sombre et or s'affiche : **« Portail Administration PA³ — Accès Restreint & Sécurisé »**.
2. Aucun contenu pédagogique ni liste d'apprenants n'est envoyé dans le code source HTML (protection anti-fuite SSR).
3. Vous êtes invité à renseigner votre **Email Administrateur** et votre **Mot de passe ou Clé Maître**.

### 2.2 Identifiants Administrateurs Autorisés
Pour déverrouiller le portail, utilisez l'un des comptes certifiés ci-dessous :

#### 👑 Compte Directeur Pédagogique (Coach David Liandja) :
- **Email :** `liandjadavid@gmail.com`
- **Mot de passe :** `CoachDavid2026!` *(ou `admin2026`)*
- **Clé de secours :** `pa3-admin-kinshasa-2026`

#### 🛡️ Autres Emails Autorisés :
- `admin@pa3academy.cd`
- `coach@pa3academy.cd`

#### 🔑 Configuration Clé Personnalisée (Production) :
Vous pouvez définir votre propre clé maîtresse dans `.env.local` :
```env
NEXT_PUBLIC_ADMIN_KEY=VotreCleSecreteAdmin2026!
```

### 2.3 Fonctionnalités Déverrouillées une fois Connecté
Une fois authentifié avec succès, le Coach David Liandja accède à l'ensemble des modules CRUD :
- 📚 **CRUD des Leçons :** Créer, éditer, supprimer et publier des leçons interactives (avec intégration YouTube ou Cloudinary).
- 🌱 **CRUD des Paliers & Niveaux :** Configurer les paliers CECRL (A1 Débutant, A2 Élémentaire, B1 Intermédiaire, B2 Autonome), seuils de score, XP requis et badges.
- 🎬 **CRUD Vidéos à la Demande (VOD) :** Ajouter des masterclasses et capsules vidéo, avec support optimisé Cloudinary (transcodage 3G Éco, posters auto et flux audio ultra-léger).
- 🧠 **CRUD Test de Niveau :** Gérer les 40 questions du test de placement adaptatif par compétence (Vocabulaire, Grammaire, Compréhension orale, Compréhension écrite).
- 👥 **Gestion des Apprenants :** Suivi en temps réel des élèves de Kinshasa et provinces, gestion des rôles, statuts (actif/suspendu) et export CSV complet.

### 2.4 Fermeture de Session (`Déconnexion Sécurisée`)
Pour quitter l'espace administrateur en toute sécurité :
- Cliquez sur le bouton rouge **« 🔒 Déconnexion »** situé en haut à droite de l'en-tête admin.
- Les jetons de session locaux sont immédiatement détruits.
- L'écran de verrouillage se réactive instantanément.

---

## 🎓 3. Connexion Apprenant (`/connexion`)

Pour accéder à vos cours, séries de révision et progression quotidienne :

1. Rendez-vous sur **[http://localhost:3000/connexion](http://localhost:3000/connexion)**.
2. Entrez votre adresse email et mot de passe.
   - *Mode Démonstration / Hors-ligne :* Vous pouvez tester avec `apprenant@pa3.cd` et n'importe quel mot de passe (ex. `123456`).
3. Cliquez sur le bouton doré 3D **« Se connecter »** ou sur **« Continuer avec Google »**.
4. Vous êtes redirigé vers votre **Tableau de Bord** avec votre niveau actuel, vos XP et vos leçons du jour.

---

## 📝 4. Inscription d'un Nouvel Apprenant (`/inscription`)

Pour créer un compte gratuit sans carte bancaire :

1. Rendez-vous sur **[http://localhost:3000/inscription](http://localhost:3000/inscription)**.
2. Remplissez les informations demandées :
   - **Nom complet :** Ex. *Grace Mwamba*
   - **Adresse email :** Ex. *grace.m@gmail.com*
   - **Mot de passe :** Minimum 6 caractères
   - **Ville de résidence en RDC :** Sélectionnez parmi *Kinshasa, Lubumbashi, Goma, Bukavu, Matadi, Kisangani, etc.*
   - **Objectif quotidien :** 
     - ⚡ *Découverte :* 5 minutes / jour
     - 🎯 *Régulier (Recommandé) :* 15 minutes / jour
     - 🔥 *Intensif :* 30 minutes / jour
3. Cliquez sur **« Créer mon compte gratuit »**.
4. Le Palier Débutant A1 (100 % gratuit) est automatiquement activé sur votre profil.

---

## 💳 5. Paiement Mobile Money & Déblocage de Cours via SasPay (`sapay.me`)

### 5.1 Connexion Obligatoire avant le Paiement 🔐
Conformément aux règles de gestion de l'académie, **tout apprenant doit être authentifié avant de pouvoir finaliser une transaction** :
- **Pourquoi ?** Le pass souscrit et les certificats officiels doivent être rattachés de manière permanente à son profil personnel pour lui garantir un accès illimité à vie.
- **Comment ça se passe ?** 
  - Si un visiteur non connecté clique sur un pass payant (A2, Tout Accès B1/B2, etc.), le modal affiche automatiquement l'écran : **« 🔐 Connexion requise avant le paiement »**.
  - Deux modes rapides s'offrent à lui directement dans le modal :
    1. **« J'ai déjà un compte » :** Connexion immédiate par email et mot de passe.
    2. **« Nouveau compte (30s) » :** Inscription rapide avec nom complet, email et mot de passe.
  - Il peut également cliquer sur les liens vers les pages complètes `/connexion` ou `/inscription` qui le redirigeront automatiquement vers son panier après validation.
  - Dès qu'il est connecté, ses coordonnées (nom et email) sont **automatiquement pré-remplies** et il accède à l'écran de règlement SasPay.

### 5.2 Options de Règlement SasPay (sapay.me)
La passerelle officielle **SasPay** propose 2 modes de règlement adaptés à la RDC :
1. **Mode Checkout Hébergé (Recommandé) :** Redirection sécurisée vers la page `pay.saspay.me` avec choix automatique du réseau (🔴 M-Pesa Vodacom, ⚪ Airtel Money, 🟠 Orange Money, 💳 Visa/Mastercard).
2. **Mode Push Direct (Softpay USSD) :** Entrez votre numéro de téléphone (normalisé automatiquement au format international `+243...`) pour recevoir instantanément une invite USSD sur votre écran demandant votre code PIN secret.
3. Une fois validé, votre accès est instantanément activé et vous recevez votre reçu de transaction avec bandeau de confirmation.

---

## 🧭 6. Règles d'Affichage dans la Navigation

Pour préserver une interface épurée et protéger la confidentialité du portail d'administration :
- **Barre supérieure (Navbar) :** Le bouton raccourci doré `Admin` est **masqué pour les visiteurs publics**. Il n'apparaît que si une session administrateur valide est déjà active sur le navigateur.
- **Menu Latéral (Side Menu) :** Le lien vers le portail administrateur est classé dans la section *« Administration & Enseignement »* avec la mention claire **`🔒 Réservé`** (*« Réservé Coach David Liandja & Équipe de gestion »*).

---

## ⚙️ 6. Variables d'Environnement & Configuration Supabase (Production)

Pour déployer en production avec persistance sur base de données **Cloud Supabase** :

Fichier : `.env.local`
```env
# Clés API Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# URL Publique du Site
NEXT_PUBLIC_SITE_URL=https://pa3academy.cd

# Clé Maître Administrateur (Optionnel, priorité haute)
NEXT_PUBLIC_ADMIN_KEY=CoachDavid2026!

# Options d'Authentification
NEXT_PUBLIC_FEATURE_PHONE_OTP=false
```

### Modes d'authentification pris en charge par Supabase :
- **Email + Mot de passe sécurisé** (chiffré via bcrypt).
- **Magic Link** : Connexion en 1 clic via lien temporaire envoyé par email.
- **Google OAuth** : Authentification fédérée Google Workspace.
- **Téléphone / SMS OTP** : Connexion par code SMS (adapté aux réseaux Airtel, Vodacom, Orange RDC).

---

## ❓ 7. Questions Fréquentes & Assistance

### 1. Que faire si j'obtiens « Accès refusé » sur `/admin` ?
Vérifiez que vous utilisez bien l'email `liandjadavid@gmail.com` et le mot de passe `CoachDavid2026!` (respectez les majuscules et le point d'exclamation).

### 2. Comment changer le mot de passe administrateur ?
Vous pouvez définir une nouvelle clé dans le fichier `.env.local` via la variable `NEXT_PUBLIC_ADMIN_KEY=VotreNouveauMotDePasse` ou modifier la liste des clés autorisées dans [src/lib/auth-admin.ts](file:///c:/Users/XPRISTO/Desktop/PA3-english/speakup-congo/src/lib/auth-admin.ts).

### 3. Mes modifications de leçons ou paliers sont-elles sauvegardées ?
Oui. En environnement local / démo, toutes les modifications CRUD sont persistées dans le `localStorage` de votre navigateur. En production, elles sont enregistrées directement dans Supabase PostgreSQL.

### 4. Contact d'urgence pédagogique :
- **Coach David Liandja (Fondateur & Directeur Pédagogique) :**
  - 📱 WhatsApp : **`+27 74 293 2071`**
  - 📞 Téléphone direct Kinshasa : **`098 689 8083`**
  - ✉️ Email : **`liandjadavid@gmail.com`**
