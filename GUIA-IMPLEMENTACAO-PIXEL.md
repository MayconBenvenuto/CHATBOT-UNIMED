# 📚 Guia Completo: Implementação de Facebook Pixel com LGPD

## 🎯 Objetivo
Este guia ensina como implementar o Facebook Pixel de forma correta, evitando conflitos e garantindo detecção pelo Meta Pixel Helper, com conformidade LGPD.

---

## 📋 Pré-requisitos

### Tecnologias Suportadas
- ✅ **React** (qualquer versão)
- ✅ **TypeScript** (recomendado)
- ✅ **Vite** / Create React App / Next.js
- ✅ **Qualquer bundler** (Webpack, Rollup, etc.)

### Informações Necessárias
- 🆔 **Pixel ID** do Facebook Ads Manager
- 🌐 **Domínio** onde será implementado
- 📱 **Lista de eventos** que deseja rastrear

---

## 🚀 Implementação Passo a Passo

### **PASSO 1: Adicionar Pixel no HTML**

#### 📁 `index.html` (ou template principal)

```html
<!doctype html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- SEUS OUTROS META TAGS E LINKS -->
    
    <!-- ========================================= -->
    <!-- 🎯 FACEBOOK PIXEL - INÍCIO -->
    <!-- ========================================= -->
    <script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      
      // 🔧 Função para inicializar o pixel quando houver consentimento
      window.initFacebookPixel = function() {
        fbq('init', 'SEU_PIXEL_ID_AQUI'); // 👈 SUBSTITUIR PELO SEU PIXEL ID
        fbq('track', 'PageView');
        console.log('✅ Facebook Pixel inicializado com sucesso!');
      };
      
      // 🔍 Verificar consentimento ao carregar a página
      document.addEventListener('DOMContentLoaded', function() {
        const consent = localStorage.getItem('cookie-consent');
        if (consent === 'accepted') {
          window.initFacebookPixel();
        }
      });
    </script>
    <!-- ========================================= -->
    <!-- 🎯 FACEBOOK PIXEL - FIM -->
    <!-- ========================================= -->
    
  </head>
  <body>
    <!-- 📱 Fallback para usuários sem JavaScript -->
    <noscript>
      <img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=SEU_PIXEL_ID_AQUI&ev=PageView&noscript=1"/>
    </noscript>
    
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**🔧 CONFIGURAÇÃO OBRIGATÓRIA:**
- Substitua `SEU_PIXEL_ID_AQUI` pelo seu Pixel ID (ex: `1648153312538580`)
- Mantenha as duas ocorrências (JavaScript e noscript)

---

### **PASSO 2: Criar Hook Personalizado**

#### 📁 `src/hooks/useFacebookPixel.ts`

```typescript
import { useEffect, useState } from 'react';

// 🆔 CONFIGURAÇÃO: Substitua pelo seu Pixel ID
const PIXEL_ID = "SEU_PIXEL_ID_AQUI";

// 🔧 Tipagem TypeScript para Window
declare global {
  interface Window {
    fbq: {
      (...args: any[]): void;
      q?: any[];
      l?: number;
      loaded?: boolean;
      version?: string;
      queue?: any[];
      callMethod?: (...args: any[]) => void;
    };
    _fbq?: any;
    initFacebookPixel?: () => void;
  }
}

// 📊 Interface do Hook
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
    if (typeof window.fbq === 'function') {
      console.log('✅ fbq disponível, inicializando pixel...');
      
      // 🔧 Usar a função de inicialização do HTML
      if (typeof window.initFacebookPixel === 'function') {
        window.initFacebookPixel();
      } else {
        // 🔄 Fallback: inicializar manualmente
        window.fbq('init', PIXEL_ID);
        window.fbq('track', 'PageView');
        console.log('✅ Pixel inicializado manualmente');
      }
      
      setIsLoaded(true);
    } else {
      console.warn('⚠️ fbq não está disponível, aguardando...');
      
      // ⏰ Aguardar carregamento do script
      const checkInterval = setInterval(() => {
        if (typeof window.fbq === 'function') {
          console.log('✅ fbq agora está disponível');
          
          if (typeof window.initFacebookPixel === 'function') {
            window.initFacebookPixel();
          } else {
            window.fbq('init', PIXEL_ID);
            window.fbq('track', 'PageView');
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
    if (isLoaded && window.fbq && typeof window.fbq === 'function') {
      console.log(`📊 Tracking event: ${eventName}`, parameters);
      window.fbq('track', eventName, parameters);
    } else {
      console.warn(`⚠️ Tentativa de track event '${eventName}' mas pixel não está carregado`);
    }
  };

  // 🎯 Função para eventos customizados
  const trackCustomEvent = (eventName: string, parameters?: any) => {
    if (isLoaded && window.fbq && typeof window.fbq === 'function') {
      console.log(`📊 Tracking custom event: ${eventName}`, parameters);
      window.fbq('trackCustom', eventName, parameters);
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
    if (typeof window.initFacebookPixel === 'function') {
      window.initFacebookPixel();
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
```

**🔧 CONFIGURAÇÃO OBRIGATÓRIA:**
- Substitua `SEU_PIXEL_ID_AQUI` pelo seu Pixel ID

---

### **PASSO 3: Usar nos Componentes**

#### 📁 `src/App.tsx` (ou componente principal)

```typescript
import { useFacebookPixel, useCookieConsent } from "./hooks/useFacebookPixel";

function App() {
  // 🍪 Gerenciar consentimento
  const { hasConsent } = useCookieConsent();
  
  // 🎯 Inicializar pixel
  const { trackEvent, trackCustomEvent } = useFacebookPixel(hasConsent);

  // 📱 Exemplo: Rastrear clique em botão
  const handleButtonClick = () => {
    trackEvent('Purchase', {
      value: 29.99,
      currency: 'BRL'
    });
  };

  // 🎯 Exemplo: Evento customizado
  const handleCustomAction = () => {
    trackCustomEvent('LeadGenerated', {
      source: 'contact_form',
      campaign: 'summer_2024'
    });
  };

  return (
    <div>
      {/* Seu conteúdo aqui */}
      <button onClick={handleButtonClick}>
        Comprar Agora
      </button>
      
      <button onClick={handleCustomAction}>
        Gerar Lead
      </button>
    </div>
  );
}
```

#### 📁 `src/components/LandingPage.tsx` (exemplo)

```typescript
import { useFacebookPixel, useCookieConsent } from "../hooks/useFacebookPixel";

export default function LandingPage() {
  const { hasConsent } = useCookieConsent();
  const { trackEvent } = useFacebookPixel(hasConsent);

  const handleWhatsAppClick = () => {
    // 📊 Rastrear clique no WhatsApp
    trackEvent('Contact', {
      method: 'whatsapp',
      content_name: 'WhatsApp Button'
    });
    
    // 📱 Abrir WhatsApp
    window.open('https://wa.me/5511999999999', '_blank');
  };

  return (
    <div>
      <button onClick={handleWhatsAppClick}>
        Falar no WhatsApp
      </button>
    </div>
  );
}
```

---

### **PASSO 4: Banner de Consentimento LGPD**

#### 📁 `src/components/CookieConsent.tsx`

```typescript
import { useCookieConsent } from "../hooks/useFacebookPixel";

export default function CookieConsent() {
  const { showConsent, acceptCookies, rejectCookies } = useCookieConsent();

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm">
            🍪 Este site usa cookies para melhorar sua experiência e para análises de marketing. 
            Ao continuar navegando, você concorda com nossa política de privacidade.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={rejectCookies}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm"
          >
            Rejeitar
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
```

#### 📁 Usar no App principal:

```typescript
import CookieConsent from "./components/CookieConsent";

function App() {
  return (
    <div>
      {/* Seu conteúdo */}
      
      {/* Banner de consentimento */}
      <CookieConsent />
    </div>
  );
}
```

---

## 🎯 Eventos Comuns do Facebook

### 📊 Eventos Padrão (usar `trackEvent`)

```typescript
// 🛒 Compra
trackEvent('Purchase', {
  value: 99.90,
  currency: 'BRL',
  content_name: 'Produto XYZ'
});

// 🎯 Lead
trackEvent('Lead', {
  value: 50,
  currency: 'BRL',
  content_name: 'Contact Form'
});

// 👀 Visualização de conteúdo
trackEvent('ViewContent', {
  content_name: 'Página de Produto',
  content_category: 'Eletrônicos'
});

// ➕ Adicionar ao carrinho
trackEvent('AddToCart', {
  value: 29.99,
  currency: 'BRL',
  content_name: 'Produto ABC'
});

// 🎯 Iniciar checkout
trackEvent('InitiateCheckout', {
  value: 149.90,
  currency: 'BRL'
});
```

### 🎯 Eventos Customizados (usar `trackCustomEvent`)

```typescript
// 📱 Clique no WhatsApp
trackCustomEvent('WhatsAppClick', {
  button_location: 'header',
  page_name: 'homepage'
});

// 📧 Inscrição newsletter
trackCustomEvent('NewsletterSignup', {
  source: 'footer_form'
});

// ⏰ Tempo na página
trackCustomEvent('TimeOnPage', {
  duration_seconds: 120,
  page_name: 'about'
});
```

---

## 🧪 Como Testar

### 1. **Meta Pixel Helper**
```bash
# 1. Instale a extensão "Meta Pixel Helper" 
# 2. Abra seu site
# 3. Clique na extensão
# 4. Deve mostrar: ✅ Pixel ativo
```

### 2. **Console do Browser**
```javascript
// Verificar se pixel está carregado
console.log('fbq disponível:', typeof window.fbq);

// Verificar consentimento
console.log('Consentimento:', localStorage.getItem('cookie-consent'));

// Testar evento
window.fbq('track', 'TestEvent');
```

### 3. **Meta Events Manager**
```
1. Acesse: business.facebook.com/events_manager2
2. Selecione seu pixel
3. Vá em "Eventos de teste"
4. Digite sua URL
5. Navegue pelo site
6. ✅ Eventos devem aparecer em tempo real
```

---

## 🔧 Configurações Adicionais

### 📱 **Para Next.js**

#### `pages/_document.tsx`:
```typescript
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Pixel Facebook aqui */}
        </Head>
        <body>
          <noscript>
            <img height="1" width="1" style={{display:'none'}}
            src="https://www.facebook.com/tr?id=SEU_PIXEL_ID&ev=PageView&noscript=1"/>
          </noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

### 🌐 **Para múltiplos domínios**

```typescript
// src/config/pixels.ts
export const PIXEL_CONFIG = {
  'meusite1.com': '1111111111111111',
  'meusite2.com': '2222222222222222',
  'localhost': '1648153312538580' // Para desenvolvimento
};

// No hook:
const PIXEL_ID = PIXEL_CONFIG[window.location.hostname] || 'PIXEL_PADRAO';
```

---

## ✅ Checklist de Implementação

### 🔧 **Configuração Inicial**
- [ ] Substituir `SEU_PIXEL_ID_AQUI` pelo ID real
- [ ] Adicionar código no `index.html`
- [ ] Criar hook `useFacebookPixel.ts`
- [ ] Implementar banner de consentimento LGPD

### 🧪 **Testes**
- [ ] Meta Pixel Helper detecta o pixel
- [ ] Console mostra logs de inicialização
- [ ] Eventos são disparados corretamente
- [ ] Conformidade LGPD (só carrega com consentimento)

### 🚀 **Deploy**
- [ ] Testar em staging
- [ ] Validar no Meta Events Manager
- [ ] Deploy em produção
- [ ] Monitorar eventos por 24h

---

## 🆘 Solução de Problemas

### ❌ **"Meta Pixel Helper não detecta"**
- Verifique se o Pixel ID está correto
- Limpe o cache do navegador
- Teste em aba anônima

### ❌ **"Multiple pixels detected"**
- Procure por código duplicado
- Remova scripts antigos do pixel
- Use apenas esta implementação

### ❌ **"Eventos não aparecem"**
- Aceite primeiro os cookies
- Verifique console por erros
- Aguarde alguns minutos (pode haver delay)

---

## 📚 Recursos Adicionais

- 📖 **Documentação oficial**: [developers.facebook.com/docs/facebook-pixel](https://developers.facebook.com/docs/facebook-pixel)
- 🔧 **Meta Events Manager**: [business.facebook.com/events_manager2](https://business.facebook.com/events_manager2)
- 🧪 **Pixel Helper**: [Chrome Web Store](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)

---

**✅ Esta implementação garante um Facebook Pixel funcional, detectável e em conformidade com LGPD!**
