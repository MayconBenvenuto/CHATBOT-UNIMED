# 🔥 Códigos Prontos - Copy/Paste

## 📦 Instalação
```bash
npm install react-router-dom @types/react-router-dom
```

## 📝 App.tsx (Substituir completamente)
```tsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import LandingPage from "./components/LandingPage";
import Chatbot from "./components/Chatbot";
import ChatPage from "./components/ChatPage";
import WhatsAppFloat from "./components/WhatsAppFloat";

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPageRoute />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

function HomePage() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const navigate = useNavigate();

  // Detectar localização do usuário quando o componente carrega
  useEffect(() => {
    if (navigator.geolocation && window.fbq) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          window.fbq('trackCustom', 'FindLocation', {
            content_name: 'User Location Found',
            content_category: 'geolocation',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            source: 'automatic_detection'
          });
        },
        (error) => {
          window.fbq('trackCustom', 'FindLocation', {
            content_name: 'Location Permission Denied',
            content_category: 'geolocation',
            error: error.message,
            source: 'automatic_detection'
          });
        },
        {
          timeout: 10000,
          enableHighAccuracy: false
        }
      );
    }
  }, []);

  const handleOpenChatbot = () => {
    // Disparar evento Lead quando o chatbot é aberto
    if (window.fbq) {
      window.fbq('trackCustom', 'Lead', {
        value: 10,
        currency: 'BRL',
        content_name: 'Chatbot Open',
        content_category: 'interaction',
        source: 'landing_page_button'
      });
    }
    
    // Navegar para a página de chat
    void navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-white">
      <LandingPage onOpenChatbot={handleOpenChatbot} />
      {isChatbotOpen && (
        <Chatbot onClose={() => setIsChatbotOpen(false)} />
      )}
      <WhatsAppFloat />
    </div>
  );
}

function ChatPageRoute() {
  const navigate = useNavigate();

  const handleBack = () => {
    void navigate('/');
  };

  return <ChatPage onBack={handleBack} />;
}
```

## 📱 ChatPage.tsx (Criar novo arquivo)
```tsx
import { useState, useEffect } from "react";
import { ArrowLeft, Phone, Video, MoreVertical, Shield } from "lucide-react";
import Chatbot from "./Chatbot";

interface ChatPageProps {
  onBack: () => void;
}

export default function ChatPage({ onBack }: ChatPageProps) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const handleCloseChatbot = () => {
    setIsChatbotOpen(false);
    onBack();
  };

  // Simular typing indicator ao carregar
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => setIsTyping(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header do Chat - Estilo WhatsApp/Telegram */}
      <header className="bg-unimed-green shadow-lg">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Botão Voltar */}
              <button
                onClick={onBack}
                className="p-1 hover:bg-green-600 rounded-full transition-colors"
                aria-label="Voltar para página inicial"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              
              {/* Foto do Assistente */}
              <div className="flex-shrink-0 relative">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&h=80&q=80"
                  alt="Assistente Unimed"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                />
                {/* Status online */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-300 border-2 border-white rounded-full"></div>
              </div>
              
              {/* Informações do Assistente */}
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-semibold text-white truncate">
                  Lucas Silva
                </h1>
                <p className="text-sm text-green-100 flex items-center">
                  {isTyping ? (
                    <>
                      <span className="inline-flex space-x-1 mr-2">
                        <span className="w-1 h-1 bg-green-300 rounded-full animate-bounce"></span>
                        <span className="w-1 h-1 bg-green-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                        <span className="w-1 h-1 bg-green-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                      </span>
                      digitando...
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 bg-green-300 rounded-full mr-2"></span>
                      Online agora
                    </>
                  )}
                </p>
              </div>
            </div>
            
            {/* Ações do Header */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-green-600/30 rounded-full px-3 py-1 mr-2">
                <Shield className="w-4 h-4 text-white mr-1" />
                <span className="text-xs text-white font-medium">Seguro</span>
              </div>
              <button 
                className="p-2 hover:bg-green-600 rounded-full transition-colors"
                aria-label="Ligação de voz"
              >
                <Phone className="w-5 h-5 text-white" />
              </button>
              <button 
                className="p-2 hover:bg-green-600 rounded-full transition-colors"
                aria-label="Chamada de vídeo"
              >
                <Video className="w-5 h-5 text-white" />
              </button>
              <button 
                className="p-2 hover:bg-green-600 rounded-full transition-colors"
                aria-label="Mais opções"
              >
                <MoreVertical className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Container do Chat */}
      <div className="flex-1 bg-white relative overflow-hidden">
        {/* Área do Chatbot */}
        {isChatbotOpen && (
          <div className="absolute inset-0">
            <Chatbot onClose={handleCloseChatbot} fullPage={true} />
          </div>
        )}
      </div>
      
      {/* Footer sutil */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
        <p className="text-xs text-gray-500 text-center flex items-center justify-center">
          <Shield className="w-3 h-3 mr-1" />
          Suas informações estão protegidas pela LGPD
        </p>
      </div>
    </div>
  );
}
```

## 🤖 Modificações no Chatbot.tsx

### 1. Adicionar na interface (linha ~20):
```tsx
interface ChatbotProps {
  onClose: () => void;
  fullPage?: boolean; // 🆕 Adicionar esta linha
}
```

### 2. Modificar a função (linha ~120):
```tsx
export default function Chatbot({ onClose, fullPage = false }: ChatbotProps) {
```

### 3. Substituir o return (linha ~520):
```tsx
return (
  <div className={fullPage 
    ? "h-full bg-white flex flex-col" 
    : "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  }>
    <div className={fullPage 
      ? "h-full flex flex-col" 
      : "bg-white rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-md h-[70vh] max-h-[90vh] flex flex-col shadow-2xl fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300"
    }
      style={!fullPage ? {width: '100%', maxWidth: '350px'} : {}}>
      {/* Header */}
      {!fullPage && <ChatbotHeader onClose={handleClose} progress={getProgressPercentage()} />}
      <ChatbotMessages
        messages={messages}
        step={step as string}
        isTyping={isTyping}
        getStepIcon={getStepIcon as (step: string) => string}
        handleOptionClick={handleOptionClick}
        messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
      />
      {/* Input */}
      {step !== "finalizado" && !isTyping && (
        <ChatbotInput
          input={input}
          step={step as string}
          isTyping={isTyping}
          inputRef={inputRef as React.RefObject<HTMLInputElement>}
          handleInputChange={handleInputChange}
          handleSubmit={(e) => { void handleSubmit(e); }}
          handleSkip={handleSkip}
          getInputPlaceholder={getInputPlaceholder as (step: string) => string}
        />
      )}

      {/* Final CTA */}
      {step === "finalizado" && (
        <ChatbotFinalCTA onClose={onClose} />
      )}
    </div>
  </div>
);
```

## 🎨 Tailwind Config (tailwind.config.js)
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#009639",
        "primary-hover": "#007a2e",
        secondary: "#6b7280",
        "unimed-green": "#009639", // 🆕 Sua cor principal aqui
      },
    },
  },
  plugins: [],
}
```

## ✅ Teste Rápido
```bash
# 1. Instalar dependências
npm install react-router-dom @types/react-router-dom

# 2. Iniciar servidor
npm run dev

# 3. Testar no navegador
# - Acessar http://localhost:XXXX
# - Clicar em "Solicitar Cotação"
# - Verificar se abre /chat
# - Testar botão voltar
```

## 🎯 Personalizar
- **Foto do assistente**: Trocar URL na linha da imagem
- **Nome**: Alterar "Lucas Silva" 
- **Cor principal**: Modificar `unimed-green` no Tailwind
- **Textos**: Personalizar ARIA labels e mensagens

## 🚀 Pronto!
Com estes códigos você tem tudo funcionando. Tempo total: ~30 minutos.
