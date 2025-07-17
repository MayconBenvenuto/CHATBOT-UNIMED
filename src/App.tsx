import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import LandingPage from "./components/LandingPage";
import Chatbot from "./components/Chatbot";
import ChatPage from "./components/ChatPage";
import WhatsAppFloat from "./components/WhatsAppFloat";
import CookieConsent from "./components/CookieConsent";
import { useFacebookPixel, useCookieConsent } from "./hooks/useFacebookPixel";

export default function App() {
  const { hasConsent } = useCookieConsent();
  const { trackEvent, trackCustomEvent } = useFacebookPixel(hasConsent);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage trackEvent={trackEvent} trackCustomEvent={trackCustomEvent} />} />
        <Route path="/chat" element={<ChatPageRoute trackEvent={trackEvent} trackCustomEvent={trackCustomEvent} />} />
      </Routes>
      <Toaster position="top-right" />
      <CookieConsent />
    </Router>
  );
}

interface PageProps {
  trackEvent: (eventName: string, parameters?: any) => void;
  trackCustomEvent: (eventName: string, parameters?: any) => void;
}

function HomePage({ trackEvent, trackCustomEvent }: PageProps) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const navigate = useNavigate();

  // Detectar localização do usuário quando o componente carrega
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Sucesso na obtenção da localização
          trackCustomEvent('FindLocation', {
            content_name: 'User Location Found',
            content_category: 'geolocation',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            source: 'automatic_detection'
          });
        },
        (error) => {
          // Erro ou usuário negou permissão
          trackCustomEvent('FindLocation', {
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
  }, [trackCustomEvent]);

  const handleOpenChatbot = () => {
    // Disparar evento Lead quando o chatbot é aberto
    trackEvent('Lead', {
      value: 10,
      currency: 'BRL',
      content_name: 'Chatbot Open',
      content_category: 'interaction',
      source: 'landing_page_button'
    });
    
    // Navegar para a página de chat
    void navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-white">
      <LandingPage onOpenChatbot={handleOpenChatbot} trackEvent={trackEvent} trackCustomEvent={trackCustomEvent} />
      {isChatbotOpen && (
        <Chatbot onClose={() => setIsChatbotOpen(false)} />
      )}
      <WhatsAppFloat trackEvent={trackEvent} trackCustomEvent={trackCustomEvent} />
    </div>
  );
}

function ChatPageRoute({ trackEvent, trackCustomEvent }: PageProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    void navigate('/');
  };

  return <ChatPage onBack={handleBack} trackEvent={trackEvent} trackCustomEvent={trackCustomEvent} />;
}
