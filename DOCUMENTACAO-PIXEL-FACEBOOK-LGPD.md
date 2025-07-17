# 📋 Documentação: Implementação do Facebook Pixel com Conformidade LGPD

## 🎯 Objetivo
Implementar o Facebook Pixel apenas na página do chatbot, respeitando a LGPD com banner de consentimento de cookies.

---

## 📁 Estrutura de Arquivos

### Arquivos que você precisa criar/modificar:

1. **Componente de Consentimento**: `src/components/CookieConsent.tsx`
2. **Página do Chatbot**: `src/components/ChatPage.tsx` (modificar)
3. **HTML Principal**: `index.html` (remover pixel se existir)

---

## 🛠️ Implementação Passo a Passo

### **PASSO 1: Remover Pixel do HTML Principal**

Se o pixel estiver no `index.html`, remova completamente:

```html
<!-- REMOVER ESTE BLOCO INTEIRO -->
<!-- Meta Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'SEU_PIXEL_ID');
  fbq('track', 'PageView');
</script>
<!-- End Meta Pixel Code -->

<!-- REMOVER TAMBÉM O NOSCRIPT -->
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=SEU_PIXEL_ID&ev=PageView&noscript=1"
/></noscript>
```

### **PASSO 2: Criar Componente de Consentimento**

Crie o arquivo `src/components/CookieConsent.tsx`:

```tsx
import { useState, useEffect } from 'react';
import { Shield, X, Settings } from 'lucide-react';

interface CookieConsentProps {
  onAccept: () => void;
  onReject: () => void;
}

export default function CookieConsent({ onAccept, onReject }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Verifica se já há consentimento salvo
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    } else if (consent === 'accepted') {
      onAccept();
    }
  }, [onAccept]);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
    onAccept();
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setIsVisible(false);
    onReject();
  };

  const handleSettings = () => {
    setShowDetails(!showDetails);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <div className="flex items-center mb-2">
              <Shield className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Política de Cookies e Privacidade
              </h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              Utilizamos cookies e tecnologias similares para melhorar sua experiência, 
              personalizar conteúdo e analisar o tráfego do site. Alguns cookies são essenciais 
              para o funcionamento do site, enquanto outros nos ajudam a entender como você 
              interage com nossos serviços.
            </p>

            {showDetails && (
              <div className="bg-gray-50 p-3 rounded-lg mb-3 text-sm">
                <h4 className="font-semibold mb-2">Tipos de cookies utilizados:</h4>
                <ul className="space-y-1">
                  <li><strong>Essenciais:</strong> Necessários para o funcionamento básico do site</li>
                  <li><strong>Analíticos:</strong> Facebook Pixel para análise de tráfego e conversões</li>
                  <li><strong>Marketing:</strong> Para personalização de anúncios e remarketing</li>
                </ul>
                <p className="mt-2 text-xs text-gray-500">
                  Seus dados são tratados conforme nossa Política de Privacidade e a LGPD (Lei Geral de Proteção de Dados).
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleAccept}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Aceitar Todos
              </button>
              
              <button
                onClick={handleReject}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
              >
                Rejeitar Opcionais
              </button>
              
              <button
                onClick={handleSettings}
                className="flex items-center bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <Settings className="w-4 h-4 mr-1" />
                {showDetails ? 'Ocultar' : 'Detalhes'}
              </button>
            </div>
          </div>
          
          <button
            onClick={handleReject}
            className="p-1 text-gray-400 hover:text-gray-600"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

### **PASSO 3: Modificar a Página do Chatbot**

No arquivo `src/components/ChatPage.tsx`, faça as seguintes alterações:

#### **3.1 - Adicionar Imports**
```tsx
import { useState, useEffect } from "react";
import { ArrowLeft, Phone, Video, MoreVertical, Shield } from "lucide-react";
import Chatbot from "./Chatbot";
import CookieConsent from "./CookieConsent"; // ADICIONAR ESTA LINHA

// SUBSTITUIR SEU_PIXEL_ID pelo ID real
const PIXEL_ID = "SEU_PIXEL_ID"; // Ex: "1648153312538580"
```

#### **3.2 - Adicionar Estados no Componente**
```tsx
export default function ChatPage({ onBack }: ChatPageProps) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  // ADICIONAR ESTAS LINHAS:
  const [hasConsent, setHasConsent] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
```

#### **3.3 - Adicionar Função para Carregar Pixel**
```tsx
// ADICIONAR ESTA FUNÇÃO:
const loadFacebookPixel = () => {
  if (!(window as any).fbq) {
    // Cria o script do pixel
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);

    // Inicializa o fbq
    (window as any).fbq = function (...args: any[]) {
      ((window as any).fbq.q = (window as any).fbq.q || []).push(args);
    };
    (window as any).fbq.l = +new Date();
    (window as any).fbq('init', PIXEL_ID);
    (window as any).fbq('track', 'PageView');
  } else {
    (window as any).fbq('track', 'PageView');
  }
};
```

#### **3.4 - Verificar Consentimento ao Carregar**
```tsx
// ADICIONAR ESTE useEffect:
useEffect(() => {
  const consent = localStorage.getItem('cookie-consent');
  if (consent === 'accepted') {
    setHasConsent(true);
    loadFacebookPixel();
  } else if (!consent) {
    setShowCookieConsent(true);
  }
}, []);
```

#### **3.5 - Funções de Consentimento**
```tsx
// ADICIONAR ESTAS FUNÇÕES:
const handleAcceptCookies = () => {
  setHasConsent(true);
  setShowCookieConsent(false);
  loadFacebookPixel();
};

const handleRejectCookies = () => {
  setShowCookieConsent(false);
  // Não carrega o pixel se rejeitado
};
```

#### **3.6 - Adicionar Banner no JSX**
```tsx
return (
  <div className="min-h-screen bg-blue-100 flex flex-col">
    {/* ... todo o conteúdo existente ... */}
    
    {/* ADICIONAR ANTES DO FECHAMENTO DA DIV PRINCIPAL: */}
    {showCookieConsent && (
      <CookieConsent 
        onAccept={handleAcceptCookies}
        onReject={handleRejectCookies}
      />
    )}
  </div>
);
```

---

## 🔧 Configuração Específica

### **ID do Pixel**
Substitua `SEU_PIXEL_ID` pelo ID real do Facebook Pixel:
```tsx
const PIXEL_ID = "1648153312538580"; // Seu ID aqui
```

### **Personalização do Banner**
Você pode personalizar:
- **Cores**: Altere as classes `bg-blue-600`, `text-blue-600`, etc.
- **Textos**: Modifique os textos conforme sua marca
- **Posição**: Altere `bottom-0` para `top-0` se quiser no topo

---

## ✅ Checklist de Implementação

- [ ] **Remover pixel do index.html**
- [ ] **Criar CookieConsent.tsx**
- [ ] **Importar CookieConsent no ChatPage.tsx**
- [ ] **Adicionar estados (hasConsent, showCookieConsent)**
- [ ] **Adicionar função loadFacebookPixel()**
- [ ] **Adicionar useEffect para verificar consentimento**
- [ ] **Adicionar handleAcceptCookies() e handleRejectCookies()**
- [ ] **Adicionar componente no JSX**
- [ ] **Substituir PIXEL_ID pelo ID real**
- [ ] **Testar funcionamento**

---

## 🧪 Como Testar

1. **Limpar localStorage**: `localStorage.clear()` no console do navegador
2. **Acessar página do chatbot**: Banner deve aparecer
3. **Aceitar cookies**: Pixel deve carregar, banner desaparece
4. **Recarregar página**: Banner não deve aparecer novamente
5. **Limpar e rejeitar**: Pixel não deve carregar

---

## ⚖️ Conformidade LGPD

Esta implementação garante:

✅ **Consentimento prévio específico**  
✅ **Informação transparente sobre cookies**  
✅ **Direito de recusa**  
✅ **Controle do usuário**  
✅ **Persistência da escolha**  
✅ **Não carregamento automático de trackers**

---

## 🚀 Próximos Passos

Após implementar em outros sites, considere:

1. **Política de Privacidade**: Link para política detalhada
2. **Eventos Customizados**: Adicionar outros eventos do pixel
3. **Analytics**: Implementar Google Analytics com mesmo padrão
4. **Auditoria**: Revisar periodicamente a conformidade

---

## 📞 Suporte

Para dúvidas sobre implementação:
- Revise esta documentação
- Teste passo a passo
- Verifique console do navegador para erros

**Data da documentação**: 17 de julho de 2025  
**Versão**: 1.0  
**Conformidade**: LGPD (Lei 13.709/2018)
