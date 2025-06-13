import { useState } from "react";
import { Toaster } from "sonner";
import LandingPage from "./components/LandingPage";
import Chatbot from "./components/Chatbot";
import { EmailConfigTest } from "./EmailConfigTest";

export default function App() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [showEmailTest, setShowEmailTest] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <button 
        onClick={() => setShowEmailTest(!showEmailTest)}
        className="fixed z-50 bottom-4 right-4 bg-blue-500 text-white p-2 rounded-md text-sm"
      >
        {showEmailTest ? "Esconder Teste" : "Testar Email Config"}
      </button>
      
      {showEmailTest && <EmailConfigTest />}
      
      <LandingPage onOpenChatbot={() => setIsChatbotOpen(true)} />
      {isChatbotOpen && (
        <Chatbot onClose={() => setIsChatbotOpen(false)} />
      )}
      <Toaster />
    </div>
  );
}
