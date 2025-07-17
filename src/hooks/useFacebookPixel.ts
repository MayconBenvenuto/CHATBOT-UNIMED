import { useEffect, useState } from 'react';

// 🆔 CONFIGURAÇÃO: Pixel ID da Unimed
const PIXEL_ID = "1648153312538580";

//  Interface do Hook
interface FacebookPixelHook {
  isLoaded: boolean;
  trackEvent: (eventName: string, parameters?: any) => void;
  trackCustomEvent: (eventName: string, parameters?: any) => void;
}

// 🎯 Hook principal para Facebook Pixel
export const useFacebookPixel = (hasConsent: boolean = false): FacebookPixelHook => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log('🎯 useFacebookPixel - hasConsent:', hasConsent);
    
    if (!hasConsent) {
      console.log('🚫 Pixel não inicializado - sem consentimento');
      setIsLoaded(false);
      return;
    }

    // ✅ Verificar se fbq está disponível (carregado pelo HTML)
    if (typeof (window as any).fbq === 'function') {
      console.log('✅ fbq disponível, inicializando pixel...');
      
      // 🔧 Usar a função de inicialização do HTML
      if (typeof (window as any).initFacebookPixel === 'function') {
        (window as any).initFacebookPixel();
      } else {
        // 🔄 Fallback: inicializar manualmente
        (window as any).fbq('init', PIXEL_ID);
        (window as any).fbq('track', 'PageView');
        console.log('✅ Pixel inicializado manualmente');
      }
      
      setIsLoaded(true);
    } else {
      console.warn('⚠️ fbq não está disponível, aguardando...');
      
      // ⏰ Aguardar carregamento do script
      const checkInterval = setInterval(() => {
        if (typeof (window as any).fbq === 'function') {
          console.log('✅ fbq agora está disponível');
          
          if (typeof (window as any).initFacebookPixel === 'function') {
            (window as any).initFacebookPixel();
          } else {
            (window as any).fbq('init', PIXEL_ID);
            (window as any).fbq('track', 'PageView');
          }
          
          setIsLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);

      // 🚨 Timeout de segurança (5 segundos)
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!isLoaded) {
          console.error('❌ Timeout: fbq não carregou em 5 segundos');
        }
      }, 5000);
    }
  }, [hasConsent, isLoaded]);

  // 📊 Função para eventos padrão do Facebook
  const trackEvent = (eventName: string, parameters?: any) => {
    if (isLoaded && (window as any).fbq && typeof (window as any).fbq === 'function') {
      console.log(`📊 Tracking event: ${eventName}`, parameters);
      (window as any).fbq('track', eventName, parameters);
    } else {
      console.warn(`⚠️ Tentativa de track event '${eventName}' mas pixel não está carregado`);
    }
  };

  // 🎯 Função para eventos customizados
  const trackCustomEvent = (eventName: string, parameters?: any) => {
    if (isLoaded && (window as any).fbq && typeof (window as any).fbq === 'function') {
      console.log(`📊 Tracking custom event: ${eventName}`, parameters);
      (window as any).fbq('trackCustom', eventName, parameters);
    } else {
      console.warn(`⚠️ Tentativa de track custom event '${eventName}' mas pixel não está carregado`);
    }
  };

  return {
    isLoaded,
    trackEvent,
    trackCustomEvent
  };
};

// 🍪 Hook para gerenciar consentimento LGPD
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

  // ✅ Aceitar cookies e inicializar pixel
  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setHasConsent(true);
    setShowConsent(false);
    
    // 🚀 Inicializar pixel imediatamente
    if (typeof (window as any).initFacebookPixel === 'function') {
      (window as any).initFacebookPixel();
      console.log('✅ Pixel inicializado após aceitar cookies');
    }
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
