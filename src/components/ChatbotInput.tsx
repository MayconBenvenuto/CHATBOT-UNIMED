import { Send, SkipForward } from "lucide-react";

interface ChatbotInputProps {
  input: string;
  step: string;
  isTyping: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleSkip?: () => void;
  getInputPlaceholder: (step: string) => string;
}

export default function ChatbotInput({ input, step, isTyping, inputRef, handleInputChange, handleSubmit, handleSkip, getInputPlaceholder }: ChatbotInputProps) {
  return (
    <div className="bg-white border-t border-gray-200">
      {/* Botão de pular para CNPJ */}
      {step === "numero_cnpj" && handleSkip && (
        <div className="px-4 pt-3 pb-2">
          <button
            onClick={handleSkip}
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
            type="button"
          >
            <SkipForward className="w-4 h-4" />
            Pular esta etapa
          </button>
        </div>
      )}
      
      <form onSubmit={e => { void handleSubmit(e); }} className="p-4 relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              void handleSubmit(e as any);
            }
          }}
          placeholder={getInputPlaceholder(step)}
          className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-unimed-green transition-shadow text-sm"
          disabled={isTyping}
          maxLength={step === 'numero_cnpj' ? 18 : undefined}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="absolute right-5 top-1/2 -translate-y-1/2 bg-unimed-green text-white p-2 rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Enviar mensagem"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
