# Guide de Déploiement sur Vercel — PA³ English Academy 🚀

> **« Parler Anglais Avec Assurance »**  
> Ce guide détaille pas-à-pas la procédure complète pour déployer l'application **PA³ English Academy** en production sur **Vercel**, avec ou sans GitHub, ainsi que la configuration de Supabase et des noms de domaine personnalisés.

---

## 📋 Table des Matières

1. [Prérequis](#1-prérequis)
2. [Méthode 1 : Déploiement Automatique via GitHub & Vercel (Recommandée)](#2-méthode-1--déploiement-automatique-via-github--vercel-recommandée)
3. [Méthode 2 : Déploiement Direct par la Ligne de Commande (Vercel CLI)](#3-méthode-2--déploiement-direct-par-la-ligne-de-commande-vercel-cli)
4. [Configuration des Variables d'Environnement](#4-configuration-des-variables-denvironnement)
5. [Configuration de la Base de Données Supabase (Cloud)](#5-configuration-de-la-base-de-données-supabase-cloud)
6. [Ajouter un Nom de Domaine Personnalisé](#6-ajouter-un-nom-de-domaine-personnalisé)
7. [Vérifications Post-Déploiement & Checklist](#7-vérifications-post-déploiement--checklist)
8. [Résolution des Erreurs Fréquentes](#8-résolution-des-erreurs-fréquentes)

---

## 1. Prérequis

Avant de commencer, munissez-vous de :
- Un compte gratuit sur [Vercel](https://vercel.com/signup) (connectez-vous idéalement avec votre compte GitHub).
- Un compte gratuit sur [GitHub](https://github.com/join).
- Un compte gratuit sur [Supabase](https://supabase.com) (pour la base de données et l'authentification en ligne).
- **Node.js 20+** ou **22+** installé sur votre machine.

---

## 2. Méthode 1 : Déploiement Automatique via GitHub & Vercel (Recommandée)

Cette méthode est la plus simple et la plus robuste : chaque fois que vous modifiez le code et que vous faites un `git push`, Vercel reconstruit et met à jour votre site automatiquement.

### Étape 2.1 — Initialiser Git et préparer le dépôt local

Ouvrez un terminal PowerShell sur votre machine :

```powershell
# 1. Se placer dans le dossier du projet Next.js
cd c:\Users\XPRISTO\Desktop\PA3-english\speakup-congo

# 2. Initialiser Git (si ce n'est pas déjà fait)
git init

# 3. Ajouter tous les fichiers du projet
git add .

# 4. Créer le premier commit officiel
git commit -m "feat: initial release PA3 English Academy with Next.js 16 and official branding"
```

### Étape 2.2 — Créer le dépôt sur GitHub et pousser le code

1. Allez sur [github.com/new](https://github.com/new).
2. Nommez votre dépôt (par exemple : `pa3-english-academy`).
3. Choisissez **Public** ou **Private** selon vos préférences.
4. Laissez les cases "Add a README" et ".gitignore" décochées (nous les avons déjà).
5. Cliquez sur **« Create repository »**.
6. Copiez et exécutez les commandes affichées par GitHub dans votre terminal :

```powershell
# Remplacer 'VOTRE_UTILISATEUR' par votre nom d'utilisateur GitHub
git remote add origin https://github.com/VOTRE_UTILISATEUR/pa3-english-academy.git
git branch -M main
git push -u origin main
```

---

### Étape 2.3 — Importer le projet sur le Dashboard Vercel

1. Rendez-vous sur votre tableau de bord [vercel.com/dashboard](https://vercel.com/dashboard).
2. Cliquez sur le bouton bleu **« Add New… »** puis sélectionnez **« Project »**.
3. Dans la liste **« Import Git Repository »**, repérez votre dépôt `pa3-english-academy` et cliquez sur **« Import »**.

---

### Étape 2.4 — Configurer le projet sur Vercel (Point Clé ⚠️)

Sur l'écran de configuration du projet Vercel :

1. **Project Name :** `pa3-english-academy` (ou le nom de votre choix).
2. **Framework Preset :** `Next.js` *(détecté automatiquement)*.
3. **Root Directory :** 
   - Si vous avez poussé le dossier `speakup-congo` directement à la racine de votre dépôt Git : laissez `./`.
   - Si vous avez poussé tout le dossier `PA3-english` contenant le sous-dossier `speakup-congo` : cliquez sur **« Edit »** et choisissez `speakup-congo`.
4. **Build and Output Settings :**
   - *Build Command :* `next build` (par défaut)
   - *Output Directory :* `.next` (par défaut)
   - *Install Command :* `npm install` (par défaut, utilise automatiquement notre fichier `.npmrc`).

---

### Étape 2.5 — Renseigner les Variables d'Environnement

Déroulez la section **« Environment Variables »** sur l'écran Vercel et ajoutez les variables suivantes :

| Clé (Key) | Valeur recommandée (Value) | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://pa3-english-academy.vercel.app` | URL finale attribuée par Vercel |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://votre-projet.supabase.co` | URL de votre projet Supabase Cloud |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Clé publique anonyme Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` | Clé secrète de service Supabase |
| `NEXT_PUBLIC_FEATURE_PHONE_OTP` | `false` | Désactivé par défaut (Email & Google actifs) |
| `NEXT_PUBLIC_FEATURE_GOOGLE_AUTH` | `true` | Connexion Google active |
| `CERTIFICATE_SIGNING_SECRET` | *(voir détails ci-dessous)* | Clé privée de signature des certificats QR |
| `NEXT_PUBLIC_ADMIN_KEY` | `CoachDavid2026!` | Clé d'accès administrateur Coach David |
| `PAYMENT_PROVIDER` | `saspay` | Passerelle de paiement Mobile Money & Cartes |
| `SASPAY_API_URL` | `https://api.saspay.me/api/v1` | URL API officielle SasPay |
| `SASPAY_SECRET_KEY` | `sk_live_...` | Clé secrète marchand SasPay (sapay.me) |
| `NEXT_PUBLIC_SASPAY_PUBLIC_KEY` | `pk_live_...` | Clé publique marchand SasPay |
| `SASPAY_WEBHOOK_SECRET` | `whsec_...` | Secret webhook de signature SasPay |
| `SASPAY_ENVIRONMENT` | `live` *(ou `sandbox`)* | Environnement de transaction |

#### 💳 Passerelle Mobile Money SasPay (sapay.me)
SasPay est la passerelle officielle agrégée pour encaisser par **M-Pesa (Vodacom)**, **Airtel Money**, **Orange Money** et **cartes bancaires (Visa/Mastercard)** en RDC et en Afrique.
- Pour obtenir vos clés de production : inscrivez-vous sur [saspay.me](https://saspay.me) et créez une clé API dans **Paramètres > Clés API**.
- Pour configurer l'URL de notification (webhook) : renseignez `https://votre-domaine.com/api/payments/saspay/webhook` dans votre tableau de bord SasPay.

#### 🔑 Comment obtenir `CERTIFICATE_SIGNING_SECRET` ?

Cette clé n'est **pas** fournie par un service tiers (comme Google ou Supabase). C'est une **phrase secrète privée que vous générez ou écrivez vous-même** (minimum 32 caractères).

- **À quoi sert-elle ?** Elle signe cryptographiquement (HMAC-SHA256) chaque certificat d'apprentissage délivré aux apprenants. Lorsqu'un recruteur, une ONG ou une ambassade scanne le QR code, le serveur vérifie cette signature pour attester que le document est 100 % authentique et non falsifié.
- **Comment la créer ? Choisissez l'une de ces 3 options très simples :**

  1. **Option A (Clés prêtes à l'emploi — Copier-Coller direct) :**  
     Copiez directement l'une de ces valeurs dans Vercel :  
     ```text
     pa3_sec_9f82d1c7a4e64b8590c23178e5abdf674201e9a38f7c1256b90d
     ```  
     *(ou bien)*  
     ```text
     pa3_academy_kinshasa_2026_super_secret_signing_key_secure_99
     ```

  2. **Option B (Générer une clé aléatoire via votre terminal) :**  
     Ouvrez PowerShell et exécutez cette commande :  
     ```powershell
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```  
     Copiez la longue chaîne de 64 caractères affichée.

  3. **Option C (Écrire votre propre phrase secrète) :**  
     Inventez une phrase personnalisée d'au moins 32 caractères contenant des lettres, chiffres et tirets, par exemple :  
     ```text
     mon-secret-officiel-pa3-english-academy-kinshasa-2026
     ```

> 💡 **Remarque sur Supabase :** Si vous n'avez pas encore créé votre projet Supabase Cloud, vous pouvez laisser les clés Supabase vides lors du premier déploiement. L'application fonctionnera parfaitement grâce aux données de secours intégrées (*fallback local mock*). Vous pourrez ajouter vos clés Supabase plus tard dans **Settings > Environment Variables** sur Vercel.

---

### Étape 2.6 — Lancer le Déploiement

1. Cliquez sur le bouton bleu **« Deploy »**.
2. Vercel va installer les dépendances, compiler les 25 routes statiques Next.js et générer les certificats SSL.
3. Après environ 1 à 2 minutes, vous verrez s'afficher un écran de célébration avec confettis :  
   🎉 **« Congratulations! You just deployed a new Next.js project to Vercel. »**
4. Cliquez sur l'aperçu pour ouvrir votre site en ligne (ex: `https://pa3-english-academy.vercel.app`) !

---

## 3. Méthode 2 : Déploiement Direct par la Ligne de Commande (Vercel CLI)

Si vous préférez déployer directement depuis votre terminal sans passer par GitHub :

```powershell
# 1. Se placer dans le dossier du projet
cd c:\Users\XPRISTO\Desktop\PA3-english\speakup-congo

# 2. Lancer Vercel CLI (pas besoin d'installation globale)
npx.cmd vercel

# 3. Répondre aux questions interactives :
# ? Set up and deploy "...\speakup-congo"? [Y/n] -> Y
# ? Which scope do you want to deploy to? -> [Votre compte Vercel]
# ? Link to existing project? [y/N] -> N
# ? What's your project's name? -> pa3-english-academy
# ? In which directory is your code located? -> ./
# ? Want to modify these settings? [y/N] -> N

# 4. Déployer en Production :
npx.cmd vercel --prod
```

---

## 5. Configuration de la Base de Données Supabase (Cloud)

Pour que l'authentification et la base de données fonctionnent en ligne de façon permanente :

1. Connectez-vous sur [supabase.com](https://supabase.com) et cliquez sur **« New Project »**.
2. Choisissez un nom (ex : `pa3-english-academy`), un mot de passe sécurisé pour la base Postgres, et sélectionnez la région la plus proche (ex: *Frankfurt* ou *London* pour une latence minimale vers l'Afrique centrale).
3. Une fois le projet prêt :
   - Allez dans **SQL Editor** dans le menu latéral gauche.
   - Cliquez sur **« New Query »**.
   - Ouvrez le fichier [`supabase/migrations/20261021000000_init.sql`](file:///c:/Users/XPRISTO/Desktop/PA3-english/speakup-congo/supabase/migrations/20261021000000_init.sql) sur votre ordinateur, copiez tout son contenu et collez-le dans l'éditeur Supabase. Cliquez sur **« Run »**.
   - Ouvrez ensuite le fichier [`supabase/seed.sql`](file:///c:/Users/XPRISTO/Desktop/PA3-english/speakup-congo/supabase/seed.sql), collez son contenu dans une nouvelle requête et cliquez sur **« Run »**. Cela insère les 4 niveaux, les 4 unités A1, les 3 leçons complètes, les 29 exercices, les 40 questions du test de niveau et les 9 badges officiels.
4. Récupérez vos clés API dans **Project Settings > API** :
   - `Project URL` → copier dans `NEXT_PUBLIC_SUPABASE_URL` sur Vercel.
   - `anon public` → copier dans `NEXT_PUBLIC_SUPABASE_ANON_KEY` sur Vercel.
   - `service_role` (secret) → copier dans `SUPABASE_SERVICE_ROLE_KEY` sur Vercel.
5. Dans Vercel, allez dans **Deployments**, cliquez sur les trois petits points à côté du dernier déploiement et choisissez **« Redeploy »** pour appliquer les nouvelles variables.

---

## 6. Ajouter un Nom de Domaine Personnalisé

Pour connecter un domaine tel que `pa3academy.cd` ou `pa3-english.com` :

1. Sur votre projet Vercel, allez dans **Settings > Domains**.
2. Saisissez votre nom de domaine (ex: `pa3academy.cd` ou `www.pa3academy.cd`) et cliquez sur **« Add »**.
3. Vercel vous affichera les enregistrements DNS à renseigner chez votre registraire de domaine (ex: Gandi, Namecheap, GoDaddy, etc.) :
   - Pour un sous-domaine `www` : un enregistrement **CNAME** pointant vers `cname.vercel-dns.com`.
   - Pour le domaine racine : un enregistrement **A** pointant vers l'adresse IP `76.76.21.21`.
4. Une fois les DNS propagés (généralement en 5 à 15 minutes), Vercel génère automatiquement un certificat SSL HTTPS gratuit via Let's Encrypt.

---

## 7. Vérifications Post-Déploiement & Checklist

Une fois le déploiement terminé, effectuez ces quelques vérifications sur votre URL en production :

- [ ] **Page d'accueil :** Le logo 3D PA³, l'en-tête et les boutons 3D s'affichent correctement.
- [ ] **Section Coach :** La photo officielle du Coach David Liandja s'affiche nettement dans la section `#coach`.
- [ ] **Test de niveau :** Le test adaptatif sur `/test-de-niveau` fonctionne avec l'audio vocal et calcule le niveau CECR à la fin.
- [ ] **Parcours de leçons :** La carte de parcours `/parcours` s'ouvre et permet de lancer `/lecon/a1-salutations`.
- [ ] **Gamification :** Le classement hebdomadaire `/classement` et les badges `/badges` s'affichent avec les ligues et le compte à rebours de Kinshasa.
- [ ] **Certificats officiels :** La page publique de vérification `/verify/PA3-A1-DEMO-2026` affiche le sceau officiel et le QR code scannable.
- [ ] **Portail Enseignant :** La page `/admin` permet de gérer les leçons, les paliers CECRL, les apprenants, les questions du test de niveau et les vidéos VOD (Cloudinary, YouTube, MP4).
- [ ] **Catalogue VOD :** La page `/vod` permet de filtrer, prévisualiser et visionner les masterclasses vidéo avec lecteur optimisé HD et 3G Éco.
- [ ] **Tarifs & Paiement :** Le modal de simulation Mobile Money sur `/tarifs` permet de tester un paiement M-Pesa, Airtel ou Orange Money.
- [ ] **Installation PWA :** Sur téléphone Android (Google Chrome), le menu ou la bannière propose d'installer l'application sur l'écran d'accueil.

---

## 8. Résolution des Erreurs Fréquentes

### 1. `Error: No Next.js package found in directory`
- **Cause :** Le projet a été importé depuis le dossier parent sans spécifier le dossier racine.
- **Solution :** Dans Vercel > **Settings > General > Root Directory**, définissez `speakup-congo` et relancez le déploiement.

### 2. Conflit de dépendances lors de `npm install`
- **Cause :** Différence de versions entre packages optionnels.
- **Solution :** Le fichier `.npmrc` présent dans le projet contient déjà `legacy-peer-deps=true`, ce qui garantit une installation 100 % stable et déterministe sur les serveurs de Vercel.

### 3. Erreur de prerendering sur les routes dynamiques (`/lecon/[slug]`)
- **Cause :** Une fonction dynamique non mise en cache a été appelée pendant la compilation statique.
- **Solution :** Toutes nos routes dynamiques implémentent déjà `generateStaticParams()` et sont validées sans erreur par `npm run build`.

---

🎉 **Félicitations ! Votre plateforme PA³ English Academy est désormais en ligne, ultra-rapide et accessible aux apprenants en République Démocratique du Congo et partout dans le monde.**
