import { useState, useEffect } from "react";
import { ArrowLeft, Phone, Video, MoreVertical, Shield } from "lucide-react";
import Chatbot from "./Chatbot";
import CookieConsent from "./CookieConsent";

// ID do Facebook Pixel
const PIXEL_ID = "3691586260972816";

interface ChatPageProps {
  onBack: () => void;
}

export default function ChatPage({ onBack }: ChatPageProps) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [_hasConsent, setHasConsent] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  // Função para carregar o Facebook Pixel
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

  // Funções de consentimento
  const handleAcceptCookies = () => {
    setHasConsent(true);
    setShowCookieConsent(false);
    loadFacebookPixel();
  };

  const handleRejectCookies = () => {
    setShowCookieConsent(false);
    loadFacebookPixel()
    // Não carrega o pixel se rejeitado
  };

  const handleCloseChatbot = () => {
    setIsChatbotOpen(false);
    onBack();
  };

  // Verificar consentimento ao carregar
  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent === 'accepted') {
      setHasConsent(true);
      loadFacebookPixel();
    } else if (!consent) {
      setShowCookieConsent(true);
    }
  }, []);

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
                  Davi Silva
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

      {/* Banner de Consentimento de Cookies */}
      {showCookieConsent && (
        <CookieConsent 
          onAccept={handleAcceptCookies}
          onReject={handleRejectCookies}
        />
      )}
    </div>
  );
}
