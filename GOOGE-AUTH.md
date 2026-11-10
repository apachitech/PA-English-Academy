# Guide Complet d'Authentification Google — PA³ English Academy 🔐

> **« Parler Anglais Avec Assurance »**  
> Ce document est le guide de référence exhaustif pour la mise en place, la configuration et le déploiement de **l'Authentification Google (Google OAuth 2.0)** sur la plateforme **PA³ English Academy**, intégrant Next.js 16 (App Router), Supabase Auth et la synchronisation du profil apprenant.

---

## 📋 Table des Matières

1. [Architecture & Fonctionnement du Flux OAuth](#1-architecture--fonctionnement-du-flux-oauth)
2. [Étape 1 : Configuration sur Google Cloud Console](#2-étape-1--configuration-sur-google-cloud-console)
3. [Étape 2 : Configuration sur le Dashboard Supabase](#3-étape-2--configuration-sur-le-dashboard-supabase)
4. [Étape 3 : Configuration des Variables d'Environnement](#4-étape-3--configuration-des-variables-denvironnement)
5. [Étape 4 : Implémentation dans le Code Next.js](#5-étape-4--implémentation-dans-le-code-nextjs)
   - [4.1 La Route de Rappel Serveur (`/auth/callback`)](#41-la-route-de-rappel-serveur-authcallback)
   - [4.2 Le Déclencheur Client (`signInWithGoogle`)](#42-le-déclencheur-client-signinwithgoogle)
   - [4.3 L'Intégration sur les Pages Connexion & Inscription](#43-lintégration-sur-les-pages-connexion--inscription)
   - [4.4 La Synchronisation Automatique du Profil Apprenant](#44-la-synchronisation-automatique-du-profil-apprenant)
6. [Mode Démonstration & Développement Local](#6-mode-démonstration--développement-local)
7. [Guide de Dépannage & Erreurs Fréquentes (FAQ)](#7-guide-de-dépannage--erreurs-fréquentes-faq)
8. [Checklist Finale de Déploiement](#8-checklist-finale-de-déploiement)

---

## 1. Architecture & Fonctionnement du Flux OAuth

L'authentification Google repose sur le protocole **OAuth 2.0 PKCE** géré de manière sécurisée entre Google, Supabase et l'application Next.js :

```text
[Apprenant] 
    │
    ▼ (1) Clic sur "Continuer avec Google" sur /connexion ou /inscription
[Next.js Client] 
    │
    ▼ (2) supabase.auth.signInWithOAuth({ provider: 'google' })
[Google Accounts] 
    │
    ▼ (3) L'utilisateur choisit son compte Google et valide le consentement
[Supabase Auth Server] (https://<id-projet>.supabase.co/auth/v1/callback)
    │
    ▼ (4) Échange sécurisé du code d'autorisation contre un token
[Next.js Route Handler] (/auth/callback?code=...)
    │
    ▼ (5) supabase.auth.exchangeCodeForSession(code) + Création session cookie
[Profil Local Apprenant] 
    │
    ▼ (6) Ingestion du nom complet Google, de l'email et de l'avatar photo
[Tableau de Bord] (/tableau-de-bord)
```

### Avantages pour PA³ English Academy :
- **Inscription en 1 clic :** Plus besoin pour l'étudiant congolais ou international de ressaisir un mot de passe complexe sur smartphone.
- **Récupération automatique de la photo de profil :** L'avatar Google officiel de l'étudiant apparaît immédiatement dans la barre de navigation et sur ses fiches de cours.
- **Sécurité maximale :** Aucun mot de passe n'est stocké en clair ; protection native contre les attaques par force brute.

---

## 2. Étape 1 : Configuration sur Google Cloud Console

Pour que Google accepte d'authentifier les apprenants de PA³ English Academy, vous devez créer un jeu d'identifiants officiel.

### 2.1 Créer ou sélectionner un projet
1. Connectez-vous à la [Console Google Cloud](https://console.cloud.google.com/).
2. En haut à gauche, cliquez sur le sélecteur de projet puis sur **« Nouveau projet »**.
3. Nommez le projet : `PA3-English-Academy` (ou `SpeakUp-Congo`).
4. Cliquez sur **« Créer »**.

---

### 2.2 Configurer l'Écran de consentement OAuth
1. Dans le menu de navigation gauche, allez dans **APIs & Services** > **Écran de consentement OAuth** (OAuth consent screen).
2. Choisissez le type d'utilisateur :
   - Cochez **« Externe »** (Accessible à tout utilisateur possédant un compte Google / Gmail).
   - Cliquez sur **« Créer »**.
3. **Informations sur l'application :**
   - **Nom de l'application :** `PA³ English Academy`
   - **Adresse e-mail d'assistance utilisateur :** votre adresse email (ex. `liandjadavid@gmail.com`).
   - **Logo de l'application :** Téléchargez le logo officiel PA³ (optionnel mais recommandé).
   - **Domaine de l'application :**
     - Page d'accueil : `https://pa-english-academy.vercel.app`
     - Page des règles de confidentialité : `https://pa-english-academy.vercel.app`
     - Conditions d'utilisation : `https://pa-english-academy.vercel.app`
   - **Domaines autorisés :**
     - `vercel.app`
     - `supabase.co`
     - *(Si vous avez un domaine personnalisé comme `pa3academy.cd`, ajoutez-le ici)*.
   - **Coordonnées du développeur :** renseignez votre adresse email de contact.
4. Cliquez sur **« Enregistrer et continuer »**.
5. **Champs d'application (Scopes) :**
   - Cliquez sur **« Ajouter ou supprimer des champs d'application »**.
   - Cochez les 3 scopes standards fondamentaux :
     - `.../auth/userinfo.email` (Voir l'adresse e-mail principale).
     - `.../auth/userinfo.profile` (Voir les informations personnelles du profil, dont le nom et la photo d'avatar).
     - `openid` (Associer les requêtes à votre identité Google).
   - Cliquez sur **« Mettre à jour »** puis sur **« Enregistrer et continuer »**.
6. **Utilisateurs tests :**
   - Vous pouvez ajouter vos propres adresses de test (ex: `liandjadavid@gmail.com`).
   - Cliquez sur **« Enregistrer et continuer »**.
7. Cliquez sur **« Publier l'application »** dès que vous souhaitez que n'importe quel apprenant puisse s'inscrire sans restriction.

---

### 2.3 Créer les Identifiants OAuth 2.0 (Client ID & Secret)
1. Dans le menu gauche, cliquez sur **Identifiants** (Credentials).
2. Cliquez sur **« + Créer des identifiants »** en haut, puis choisissez **« ID client OAuth »**.
3. Sélectionnez le **Type d'application** : **Application Web**.
4. **Nom :** `PA3 Web Client Production`.
5. **Origines JavaScript autorisées :**
   - `http://localhost:3000` *(pour vos tests en local)*
   - `https://pa-english-academy.vercel.app` *(URL officielle de production)*
   - `https://<votre-id-projet>.supabase.co`
6. **URI de redirection autorisés (Étape CRITIQUE ⚠️) :**
   Vous devez inscrire l'adresse de callback de votre projet Supabase :
   ```text
   https://<VOTRE-ID-PROJET-SUPABASE>.supabase.co/auth/v1/callback
   ```
   *(Exemple réel : `https://abcdefghijklm.supabase.co/auth/v1/callback`)*
7. Cliquez sur **« Créer »**.
8. Une fenêtre s'ouvre affichant :
   - **Votre ID client (Client ID) :** chaîne se terminant généralement par `.apps.googleusercontent.com`.
   - **Votre code secret client (Client Secret) :** clé confidentielle alphanumérique.
   - ⚠️ **Copiez précieusement ces deux valeurs.**

---

## 3. Étape 2 : Configuration sur le Dashboard Supabase

1. Connectez-vous à votre [Dashboard Supabase](https://supabase.com/dashboard).
2. Sélectionnez votre projet de production.
3. Dans la barre latérale gauche, cliquez sur **Authentication** (icône de cadenas/bouclier), puis sur **Providers**.
4. Déroulez la section **Google** :
   - Basculez l'interrupteur sur **« Enable Google provider »**.
   - Collez le **Client ID** obtenu à l'étape précédente.
   - Collez le **Client Secret** obtenu à l'étape précédente.
   - Laissez les options avancées par défaut.
   - Cliquez sur **« Save »** (Enregistrer).

### 3.2 Configurer les URLs autorisées dans Supabase
Toujours dans la section **Authentication** de Supabase, cliquez sur **URL Configuration** :
1. **Site URL :**
   ```text
   https://pa-english-academy.vercel.app
   ```
2. **Redirect URLs (Liste blanche des redirections) :**
   Ajoutez les deux URLs suivantes :
   - `http://localhost:3000/auth/callback` *(Développement local)*
   - `https://pa-english-academy.vercel.app/auth/callback` *(Production Vercel)*
3. Cliquez sur **« Save »**.

---

## 4. Étape 3 : Configuration des Variables d'Environnement

Dans votre fichier local `.env.local` et sur le panneau de configuration **Vercel** (`Settings > Environment Variables`), assurez-vous d'avoir renseigné :

```env
# URL officielle publique de votre instance Supabase Cloud
NEXT_PUBLIC_SUPABASE_URL="https://<VOTRE-ID-PROJET>.supabase.co"

# Clé publique anonyme Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsIn..."

# Clé de service secrète (utilisée uniquement par les routes serveur sécurisées)
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsIn..."

# URL racine de l'application
NEXT_PUBLIC_SITE_URL="https://pa-english-academy.vercel.app"

# Activation explicite du bouton Google
NEXT_PUBLIC_FEATURE_GOOGLE_AUTH="true"
```

---

## 5. Étape 4 : Implémentation dans le Code Next.js

### 5.1 La Route de Rappel Serveur (`src/app/auth/callback/route.ts`)

Créez le fichier [`src/app/auth/callback/route.ts`](file:///c:/Users/XPRISTO/Desktop/PA3-english/speakup-congo/src/app/auth/callback/route.ts) :

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirect = searchParams.get('redirect') || '/tableau-de-bord';

  if (code) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data.session?.user) {
        const user = data.session.user;
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          'Apprenant';
        const avatarUrl =
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          '';

        // Redirection avec passage des métadonnées pour hydratation locale immédiate
        const destination = new URL(redirect, origin);
        destination.searchParams.set('auth_provider', 'google');
        destination.searchParams.set('auth_email', user.email || '');
        destination.searchParams.set('auth_name', name);
        if (avatarUrl) {
          destination.searchParams.set('auth_avatar', avatarUrl);
        }

        return NextResponse.redirect(destination.toString());
      }
    } catch (err) {
      console.error('[AUTH CALLBACK ERROR]', err);
    }
  }

  // En cas d'échec, renvoyer l'utilisateur vers la page de connexion avec message
  return NextResponse.redirect(`${origin}/connexion?error=google_auth_failed`);
}
```

---

### 5.2 Le Déclencheur Client (`signInWithGoogle`)

Dans [`src/lib/auth-learner.ts`](file:///c:/Users/XPRISTO/Desktop/PA3-english/speakup-congo/src/lib/auth-learner.ts), ajoutez la méthode d'initiation et de synchronisation Google :

```typescript
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/env';

/**
 * Lance le flux officiel OAuth Google via Supabase
 */
export async function initiateGoogleSignIn(redirectTo: string = '/tableau-de-bord'): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) {
    return { error: 'supabase_not_configured' };
  }

  try {
    const supabase = createClient();
    const callbackUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`
      : `/auth/callback?redirect=${encodeURIComponent(redirectTo)}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      return { error: error.message };
    }
    return {};
  } catch (err: any) {
    return { error: err.message || 'Erreur inattendue lors de la connexion Google' };
  }
}

/**
 * Synchronise et enregistre un utilisateur connecté via Google dans le stockage apprenant
 */
export function loginLearnerWithGoogle(googleUser: {
  email: string;
  name: string;
  avatarUrl?: string;
}): void {
  const cleanEmail = googleUser.email.trim().toLowerCase();
  
  // Enregistrer ou récupérer le compte localement
  loginLearner(cleanEmail);
  
  // Mettre à jour avec le nom officiel Google et sa photo d'avatar réelle
  saveLearnerProfile({
    name: googleUser.name,
    email: cleanEmail,
    avatarUrl: googleUser.avatarUrl || 'emoji:🎓',
    joinedAt: new Date().toISOString(),
  });
}
```

---

### 5.3 L'Intégration sur les Pages Connexion & Inscription

Sur [`src/app/connexion/page.tsx`](file:///c:/Users/XPRISTO/Desktop/PA3-english/speakup-congo/src/app/connexion/page.tsx) et [`src/app/inscription/page.tsx`](file:///c:/Users/XPRISTO/Desktop/PA3-english/speakup-congo/src/app/inscription/page.tsx) :

```tsx
const [isGoogleLoading, setIsGoogleLoading] = useState(false);

const handleGoogleLogin = async () => {
  setIsGoogleLoading(true);
  
  const res = await initiateGoogleSignIn('/tableau-de-bord');
  
  if (res.error === 'supabase_not_configured') {
    // Mode Démo / Fallback élégant en local
    toast.info("Mode Démo local : Connexion Google simulée.");
    loginLearnerWithGoogle({
      email: 'etudiant.google@gmail.com',
      name: 'Apprenant Google (Test)',
      avatarUrl: 'emoji:🇬',
    });
    router.push('/tableau-de-bord');
    return;
  }
  
  if (res.error) {
    toast.error(`Erreur Google : ${res.error}`);
    setIsGoogleLoading(false);
  }
};
```

Bouton JSX standardisé avec logo officiel aux 4 couleurs Google :

```tsx
<button
  type="button"
  disabled={isGoogleLoading}
  onClick={handleGoogleLogin}
  className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2.5 shadow-2xs transition-all active:scale-[0.99] cursor-pointer"
>
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
  <span>{isGoogleLoading ? 'Connexion en cours...' : 'Continuer avec Google'}</span>
</button>
```

---

## 6. Mode Démonstration & Développement Local

Pour permettre à l'équipe de développement de tester toute l'application sans dépendre d'identifiants Google Cloud actifs sur une machine de développement :

1. Si `NEXT_PUBLIC_SUPABASE_URL` pointe vers l'URL factice (`demo-pa3.supabase.co`), le système détecte le mode démo.
2. Le clic sur « Continuer avec Google » génère une session d'apprentissage locale avec profil Google simulé (Nom, photo d'avatar, déverrouillage automatique du niveau A1).
3. Dès que les clés réelles `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont renseignées, l'application bascule automatiquement en mode **OAuth Réel Google Cloud**.

---

## 7. Guide de Dépannage & Erreurs Fréquentes (FAQ)

### ❌ Erreur 1 : `redirect_uri_mismatch`
- **Symptôme :** Google affiche un écran rouge d'erreur indiquant : *« Erreur 400 : redirect_uri_mismatch »*.
- **Cause :** L'URI renseignée dans la console Google Cloud ne correspond pas exactement à l'URI appelée par Supabase.
- **Solution :**
  1. Allez sur [console.cloud.google.com](https://console.cloud.google.com/) > **Identifiants**.
  2. Éditez votre ID client OAuth.
  3. Vérifiez la section **« URI de redirection autorisés »**.
  4. L'URI doit être **exactement** :
     `https://<VOTRE-ID-PROJET>.supabase.co/auth/v1/callback`
     *(Pas de slash `/` à la fin, pas d'espace).*

---

### ❌ Erreur 2 : `Access blocked: This app's request is invalid`
- **Symptôme :** Google refuse d'ouvrir la page de sélection du compte.
- **Cause :** L'écran de consentement OAuth n'est pas encore configuré ou les scopes obligatoires (`email`, `profile`, `openid`) manquent.
- **Solution :** Retournez dans **Écran de consentement OAuth** sur Google Cloud, vérifiez que le type d'utilisateur est **Externe** et que les 3 scopes de base sont ajoutés.

---

### ❌ Erreur 3 : `Google Provider is not enabled`
- **Symptôme :** Erreur retournée par Supabase lors de l'appel.
- **Cause :** L'interrupteur Google est désactivé dans Supabase ou les clés n'ont pas été sauvegardées.
- **Solution :** Rendez-vous dans **Supabase Dashboard > Authentication > Providers > Google**, vérifiez que le switch est vert (Enabled), et collez à nouveau le Client ID et Secret.

---

### ❌ Erreur 4 : La photo de profil Google ne s'affiche pas
- **Cause :** Le champ d'avatar Google peut être nommé `avatar_url` ou `picture` selon le flux OpenID.
- **Solution :** Le code de notre route de rappel prend en compte les deux alias :
  ```typescript
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  ```

---

## 8. Checklist Finale de Déploiement

Avant d'annoncer la fonctionnalité aux étudiants de la PA³ English Academy :

- [ ] Projet Google Cloud créé avec écran de consentement en mode **Externe**.
- [ ] Scopes `email`, `profile` et `openid` activés.
- [ ] URI de redirection Google configurée vers `https://<id-supabase>.supabase.co/auth/v1/callback`.
- [ ] Client ID et Client Secret collés dans Supabase (**Authentication > Providers > Google**).
- [ ] Redirect URLs configurées dans Supabase (`https://pa-english-academy.vercel.app/auth/callback`).
- [ ] Variables d'environnement ajoutées dans les paramètres de production sur Vercel.
- [ ] Test réel effectué depuis un smartphone et un ordinateur avec une adresse Gmail.
- [ ] Vérification que la photo de profil Google s'affiche bien dans la barre de navigation supérieure de PA³.

---

*PA³ English Academy • Kinshasa, RDC © 2026 • Documentation Technique Officielle*
