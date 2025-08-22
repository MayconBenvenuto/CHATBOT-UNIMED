import { useEffect, useState } from 'react';

// Pixel agora é carregado diretamente em index.html

interface FacebookPixelHook {
  isLoaded: boolean;
  trackEvent: (eventName: string, parameters?: Record<string, any>) => void;
  trackCustomEvent: (eventName: string, parameters?: Record<string, any>) => void;
}

// Removida função de injeção (feito no HTML)

export const useFacebookPixel = (_hasConsent: boolean = false): FacebookPixelHook => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Considera carregado quando fbq global disponível
    if ((window as any).fbq) {
      setIsLoaded(true);
    }
  }, []);

  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (!(window as any).fbq) return;
    try {
      (window as any).fbq('track', eventName, parameters);
  } catch {
      // Falha silenciosa
    }
  };

  const trackCustomEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (!(window as any).fbq) return;
    try {
      (window as any).fbq('trackCustom', eventName, parameters);
  } catch {
      // Falha silenciosa
    }
  };

  return { isLoaded, trackEvent, trackCustomEvent };
};

// 🍪 Hook para gerenciar consentimento LGPD (mantido para o banner)
export const useCookieConsent = () => {
  const [hasConsent, setHasConsent] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent === 'accepted') {
      setHasConsent(true);
    } else if (!consent) {
      setShowConsent(true);
    }
  }, []);

  // ✅ Aceitar cookies (agora sem impacto no carregamento do pixel)
  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setHasConsent(true);
    setShowConsent(false);
  };

  // ❌ Rejeitar cookies
  const rejectCookies = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShowConsent(false);
  };

  return {
    hasConsent,
    showConsent,
    acceptCookies,
    rejectCookies
  };
};
