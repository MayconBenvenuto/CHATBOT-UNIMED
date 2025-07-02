import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import LandingPage from "./components/LandingPage";
import Chatbot from "./components/Chatbot";
import WhatsAppFloat from "./components/WhatsAppFloat";

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

export default function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Detectar localização do usuário quando o componente carrega
  useEffect(() => {
    if (navigator.geolocation && window.fbq) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Sucesso na obtenção da localização
          window.fbq('trackCustom', 'FindLocation', {
            content_name: 'User Location Found',
            content_category: 'geolocation',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            source: 'automatic_detection'
          });
        },
        (error) => {
          // Erro ou usuário negou permissão
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
    setIsChatbotOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <LandingPage onOpenChatbot={handleOpenChatbot} />
      {isChatbotOpen && (
        <Chatbot onClose={() => setIsChatbotOpen(false)} />
      )}
      <WhatsAppFloat />
      <Toaster />
    </div>
  );
}
