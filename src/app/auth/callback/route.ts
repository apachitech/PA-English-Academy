import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Route de rappel OAuth pour Supabase & Google
 * Échange le code d'autorisation contre une session utilisateur active
 */
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

        // Redirection vers la destination avec les paramètres d'hydratation locale
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

  // En cas d'erreur ou d'annulation, rediriger vers connexion
  return NextResponse.redirect(`${origin}/connexion?error=google_auth_failed`);
}

