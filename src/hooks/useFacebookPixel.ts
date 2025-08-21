import { useEffect, useState } from 'react';

// Interface mínima para manter compatibilidade sem Pixel
interface FacebookPixelHook {
  isLoaded: boolean;
  trackEvent: (eventName: string, parameters?: any) => void;
  trackCustomEvent: (eventName: string, parameters?: any) => void;
}

// Hook no-op: remove qualquer integração com Facebook Pixel
export const useFacebookPixel = (_hasConsent: boolean = false): FacebookPixelHook => {
  return {
    isLoaded: false,
    trackEvent: () => {},
    trackCustomEvent: () => {},
  };
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

  // ✅ Aceitar cookies (sem inicializar pixel)
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
