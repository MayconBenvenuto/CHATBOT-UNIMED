import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import LandingPage from "./components/LandingPage";
import Chatbot from "./components/Chatbot";
import ChatPage from "./components/ChatPage";
import WhatsAppFloat from "./components/WhatsAppFloat";
import CookieConsent from "./components/CookieConsent";
import { useCookieConsent } from "./hooks/useFacebookPixel";

export default function App() {
  // Mantém o banner de consentimento funcionando
  useCookieConsent();

  return (
    <Router>
      <Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/chat" element={<ChatPageRoute />} />
      </Routes>
      <Toaster position="top-right" />
      <CookieConsent />
    </Router>
  );
}

function HomePage() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const navigate = useNavigate();

  // Detectar localização do usuário quando o componente carrega
  useEffect(() => {
    // Tracking removido
  }, []);

  const handleOpenChatbot = () => {
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
