'use client';

import React, { useEffect, useState } from 'react';

export function PwaManager() {
  const [isOffline, setIsOffline] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PA3 ServiceWorker] Registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PA3 ServiceWorker] Registration failed:', err);
        });
    }

    // Monitor Online/Offline Status
    const updateOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    setIsOffline(!navigator.onLine);

    // Capture beforeinstallprompt for Android PWA install
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      // Check if user dismissed it earlier
      const dismissed = localStorage.getItem('pa3_install_dismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setInstallPrompt(null);
  };

  const handleDismissInstall = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pa3_install_dismissed', 'true');
  };

  return (
    <>
      {/* Offline Alert Bar */}
      {isOffline && (
        <div className="bg-amber-500 text-navy-dark px-4 py-2 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md sticky top-0 z-50 animate-pulse">
          <span>📡</span>
          <span>Vous êtes hors-ligne. Vos leçons consultées restent accessibles en cache.</span>
        </div>
      )}

      {/* PWA Install Prompt for Android */}
      {showInstallBanner && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md bg-navy text-white p-4 rounded-2xl shadow-2xl border-2 border-gold z-50 flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold flex items-center justify-center text-xl shrink-0">
              📲
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold">Installer l'application PA³</div>
              <div className="text-[11px] text-slate-300">
                Accès direct sur l'écran d'accueil & économie de données 3G/4G.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="bg-gold hover:bg-gold-dark text-navy font-black text-xs px-3 py-2 rounded-xl transition shadow"
            >
              Installer
            </button>
            <button
              onClick={handleDismissInstall}
              className="text-slate-400 hover:text-white text-xs px-2 py-1"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
