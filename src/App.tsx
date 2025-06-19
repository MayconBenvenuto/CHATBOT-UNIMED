import { useState } from "react";
import { Toaster } from "sonner";
import LandingPage from "./components/LandingPage";
import Chatbot from "./components/Chatbot";
import WhatsAppFloat from "./components/WhatsAppFloat";

export default function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <LandingPage onOpenChatbot={() => setIsChatbotOpen(true)} />
      {isChatbotOpen && (
        <Chatbot onClose={() => setIsChatbotOpen(false)} />
      )}
      <WhatsAppFloat />
      <Toaster />
    </div>
  );
}
