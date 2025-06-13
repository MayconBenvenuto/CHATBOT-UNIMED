import { Heart, X } from "lucide-react";

interface ChatbotHeaderProps {
  onClose: () => void;
  progress: number;
}

export default function ChatbotHeader({ onClose, progress }: ChatbotHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-unimed-green to-green-600 text-white p-4 rounded-t-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">Davi - Assistente Unimed</h3>
            <p className="text-sm text-green-100">Online agora</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors p-1"
          aria-label="Fechar chatbot"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      {/* Progress Bar */}
      <div className="w-full bg-white/20 rounded-full h-2">
        <div 
          className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-xs text-green-100 mt-1">{progress}% concluído</p>
    </div>
  );
}
