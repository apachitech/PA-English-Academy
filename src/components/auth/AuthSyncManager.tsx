'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { loginLearnerWithGoogle, isLearnerAuthenticated } from '@/lib/auth-learner';
import { isSupabaseConfigured, env } from '@/lib/env';
import { createClient } from '@/lib/supabase/client';

/**
 * Composant de synchronisation d'authentification globale
 * Hydrate automatiquement la session apprenant lors du retour OAuth Google
 * et écoute les changements d'état de session Supabase.
 */
export function AuthSyncManager() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Détection des paramètres d'authentification Google retournés par /auth/callback
    const params = new URLSearchParams(window.location.search);
    const authProvider = params.get('auth_provider');
    const authEmail = params.get('auth_email');

    if (authProvider === 'google' && authEmail) {
      const authName = params.get('auth_name') || authEmail.split('@')[0] || 'Apprenant';
      const authAvatar = params.get('auth_avatar') || undefined;

      // Synchroniser le compte apprenant dans le stockage local
      loginLearnerWithGoogle({
        email: authEmail,
        name: authName,
        avatarUrl: authAvatar,
      });

      toast.success(`Bienvenue ${authName} ! Connexion Google réussie.`);

      // Nettoyer les paramètres de l'URL pour une navigation propre
      params.delete('auth_provider');
      params.delete('auth_email');
      params.delete('auth_name');
      params.delete('auth_avatar');

      const remainingQuery = params.toString();
      const newUrl = `${window.location.pathname}${remainingQuery ? `?${remainingQuery}` : ''}${window.location.hash}`;
      window.history.replaceState({}, '', newUrl);
    }

    // 2. Écouteur d'état Supabase Auth si configuré avec des clés réelles
    if (
      isSupabaseConfigured &&
      env.NEXT_PUBLIC_SUPABASE_URL &&
      !env.NEXT_PUBLIC_SUPABASE_URL.includes('demo-pa3')
    ) {
      try {
        const supabase = createClient();

        // Récupérer la session active existante
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user?.email && !isLearnerAuthenticated()) {
            const user = session.user;
            const name =
              user.user_metadata?.full_name ||
              user.user_metadata?.name ||
              user.email?.split('@')[0] ||
              'Apprenant';
            const avatarUrl =
              user.user_metadata?.avatar_url ||
              user.user_metadata?.picture ||
              undefined;

            loginLearnerWithGoogle({
              email: user.email!,
              name,
              avatarUrl,
            });
          }
        });

        // Écouter les transitions d'état
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (event === 'SIGNED_IN' && session?.user?.email) {
              const user = session.user;
              const name =
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                user.email?.split('@')[0] ||
                'Apprenant';
              const avatarUrl =
                user.user_metadata?.avatar_url ||
                user.user_metadata?.picture ||
                undefined;

              loginLearnerWithGoogle({
                email: user.email!,
                name,
                avatarUrl,
              });
            }
          }
        );

        return () => {
          authListener?.subscription.unsubscribe();
        };
      } catch (err) {
        console.error('[AUTH SYNC MANAGER ERROR]', err);
      }
    }
  }, []);

  return null;
}

