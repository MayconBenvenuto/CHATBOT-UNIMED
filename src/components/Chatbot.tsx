import { useState, useEffect, useRef } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { X, MessageCircle, Send, CheckCircle, Phone, Mail, Building, Users, Heart } from "lucide-react";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface ChatbotProps {
  onClose: () => void;
}

type ChatStep = 
  | "nome"
  | "whatsapp" 
  | "email"
  | "cnpj"
  | "enquadramento"
  | "numero_cnpj"
  | "plano_atual"
  | "nome_plano"
  | "valor_plano"
  | "dificuldade"
  | "finalizado";

interface ChatData {
  nome: string;
  whatsapp: string;
  email: string;
  temCnpj: boolean;
  enquadramentoCnpj: string;
  numeroCnpj: string;
  temPlanoAtual: boolean;
  nomePlanoAtual: string;
  valorPlanoAtual: string;
  maiorDificuldade: string;
}

interface Message {
  type: "user" | "bot";
  text: string;
  options?: string[];
  isTyping?: boolean;
}

export default function Chatbot({ onClose }: ChatbotProps) {
  const [step, setStep] = useState<ChatStep>("nome");
  const [input, setInput] = useState("");
  const [leadId, setLeadId] = useState<Id<"leads"> | null>(null);
  const [chatData, setChatData] = useState<Partial<ChatData>>({});
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      text: "👋 Olá! Sou o Davi, assistente virtual da Unimed. Vou te ajudar a encontrar o melhor plano PME para sua empresa!",
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const createLead = useMutation(api.leads.createLead);
  const updateLead = useMutation(api.leads.updateLead);
  const sendEmail = useAction(api.email.sendLeadEmail);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages]);

  useEffect(() => {
    // Iniciar conversa após um pequeno delay
    setTimeout(() => {
      addBotMessage("Para começar, qual é o seu nome? 😊");
    }, 1000);
  }, []);

  const addMessage = (type: "user" | "bot", text: string, options?: string[]) => {
    setMessages(prev => [...prev, { type, text, options }]);
  };

  const addBotMessage = (text: string, options?: string[]) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage("bot", text, options);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    switch (step) {
      case "whatsapp":
        value = value
          .replace(/\D/g, "")
          .slice(0, 11)
          .replace(/^(\d{2})(\d)/g, "($1) $2")
          .replace(/(\d{4,5})(\d{4})/, "$1-$2");
        break;
      case "numero_cnpj":
        value = value
          .replace(/\D/g, '')
          .slice(0, 14)
          .replace(/(\d{2})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1/$2')
          .replace(/(\d{4})(\d)/, '$1-$2');
        break;
      case "valor_plano":
        value = value.replace(/\D/g, '');
        if (value) {
          const numberValue = parseInt(value, 10) / 100;
          value = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(numberValue);
        } else {
          value = '';
        }
        break;
    }
    setInput(value);
  };

  const getNextStep = (currentStep: ChatStep, data: Partial<ChatData>): ChatStep => {
    switch (currentStep) {
      case "nome": return "whatsapp";
      case "whatsapp": return "email";
      case "email": return "cnpj";
      case "cnpj": return data.temCnpj ? "enquadramento" : "plano_atual";
      case "enquadramento": return "numero_cnpj";
      case "numero_cnpj": return "plano_atual";
      case "plano_atual": return data.temPlanoAtual ? "nome_plano" : "dificuldade";
      case "nome_plano": return "valor_plano";
      case "valor_plano": return "dificuldade";
      case "dificuldade": return "finalizado";
      default: return "finalizado";
    }
  };

  const getBotMessage = (step: ChatStep, data: Partial<ChatData>): { text: string; options?: string[] } => {
    switch (step) {
      case "whatsapp": 
        return { text: `Perfeito, ${data.nome}! 📱 Agora preciso do seu WhatsApp para nosso consultor entrar em contato:` };
      case "email": 
        return { text: "Ótimo! 📧 Qual é o seu e-mail?" };
      case "cnpj": 
        return { 
          text: "🏢 Sua empresa possui CNPJ?", 
          options: ["Sim", "Não"] 
        };
      case "enquadramento": 
        return { 
          text: "📋 Qual o enquadramento do seu CNPJ?", 
          options: ["MEI", "Simples Nacional", "Lucro Presumido", "Lucro Real", "Outro"] 
        };
      case "numero_cnpj": 
        return { text: "🔢 Qual é o número do CNPJ da sua empresa?" };
      case "plano_atual": 
        return { 
          text: "🏥 Vocês já possuem algum plano de saúde atualmente?", 
          options: ["Sim", "Não"] 
        };
      case "nome_plano": 
        return { 
          text: "📝 Qual é o nome do plano de saúde atual?",
          options: ["Bradesco Saúde", "SulAmérica", "Amil", "NotreDame", "Hapvida", "Outro"]
        };
      case "valor_plano": 
        return { text: "💰 Quanto vocês pagam mensalmente pelo plano atual? (Ex: R$ 350,00)" };
      case "dificuldade": 
        return { 
          text: "🤔 Qual é a maior dificuldade que vocês enfrentam com planos de saúde?",
          options: [
            "Alto custo",
            "Rede médica limitada", 
            "Demora no atendimento",
            "Cobertura insuficiente",
            "Burocracia excessiva",
            "Outro"
          ]
        };
      case "finalizado": 
        return { text: `🎉 Perfeito, ${data.nome}! Recebi todas as informações. Nossa equipe analisará seu perfil e entrará em contato em até 24 horas com as melhores opções para sua empresa. Obrigada!` };
      default: 
        return { text: "" };
    }
  };

  const validateInput = (step: ChatStep, value: string): boolean => {
    switch (step) {
      case "nome":
        return value.trim().length >= 2;
      case "whatsapp":
        const cleanPhone = value.replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 11;
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case "numero_cnpj":
        const cleanCnpj = value.replace(/\D/g, '');
        return cleanCnpj.length === 14;
      case "valor_plano":
        return /\d+/.test(value);
      default:
        return value.trim().length >= 2;
    }
  };

  const getInputPlaceholder = (step: ChatStep): string => {
    switch (step) {
      case "nome": return "Digite seu nome completo...";
      case "whatsapp": return "(11) 99999-9999";
      case "email": return "seu@email.com";
      case "numero_cnpj": return "00.000.000/0000-00";
      case "valor_plano": return "R$ 0,00";
      default: return "Digite sua resposta...";
    }
  };

  const handleOptionClick = (option: string) => {
    setInput(option);
    setTimeout(() => handleSubmit(null, option), 100);
  };

  const handleSubmit = async (e: React.FormEvent | null, optionValue?: string) => {
    if (e) e.preventDefault();
    
    const value = optionValue || input;
    if (!value.trim()) return;

    if (!validateInput(step, value)) {
      toast.error("Por favor, verifique o formato da informação inserida.");
      return;
    }

    addMessage("user", value);

    const newData = { ...chatData };

    // Processar a entrada baseada no step atual
    switch (step) {
      case "nome":
        newData.nome = value;
        break;
      case "whatsapp":
        newData.whatsapp = value;
        break;
      case "email":
        newData.email = value;
        break;
      case "cnpj":
        newData.temCnpj = value.toLowerCase() === "sim";
        break;
      case "enquadramento":
        newData.enquadramentoCnpj = value;
        break;
      case "numero_cnpj":
        newData.numeroCnpj = value;
        break;
      case "plano_atual":
        newData.temPlanoAtual = value.toLowerCase() === "sim";
        break;
      case "nome_plano":
        newData.nomePlanoAtual = value;
        break;
      case "valor_plano":
        newData.valorPlanoAtual = value;
        break;
      case "dificuldade":
        newData.maiorDificuldade = value;
        break;
    }

    setChatData(newData);

    // Criar ou atualizar lead no banco
    try {
      if (step === "cnpj" && newData.nome && newData.whatsapp && newData.email) {
        const id = await createLead({
          nome: newData.nome,
          whatsapp: newData.whatsapp,
          email: newData.email,
          temCnpj: newData.temCnpj || false,
        });
        setLeadId(id);
      } else if (leadId) {
        await updateLead({
          leadId,
          enquadramentoCnpj: newData.enquadramentoCnpj,
          numeroCnpj: newData.numeroCnpj,
          temPlanoAtual: newData.temPlanoAtual,
          nomePlanoAtual: newData.nomePlanoAtual,
          valorPlanoAtual: newData.valorPlanoAtual,
          maiorDificuldade: newData.maiorDificuldade,
          status: step === "dificuldade" ? "completo" : "em_andamento",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
    }

    const nextStep = getNextStep(step, newData);
    setStep(nextStep);

    // Enviar e-mail quando finalizado
    if (nextStep === "finalizado" && leadId) {
      try {
        await sendEmail({ leadId });
        toast.success("✅ Informações enviadas! Em breve um de nossos consultores entrará em contato com você!");
      } catch (error) {
        
      }
    }

    const botResponse = getBotMessage(nextStep, newData);
    addBotMessage(botResponse.text, botResponse.options);

    setInput("");
  };

  const getStepIcon = (step: ChatStep) => {
    switch (step) {
      case "nome": return "👤";
      case "whatsapp": return "📱";
      case "email": return "📧";
      case "cnpj": return "🏢";
      case "enquadramento": return "📋";
      case "numero_cnpj": return "🔢";
      case "plano_atual": return "🏥";
      case "nome_plano": return "📝";
      case "valor_plano": return "💰";
      case "dificuldade": return "🤔";
      case "finalizado": return "🎉";
      default: return "💬";
    }
  };

  const getProgressPercentage = () => {
    const steps = ["nome", "whatsapp", "email", "cnpj", "enquadramento", "numero_cnpj", "plano_atual", "nome_plano", "valor_plano", "dificuldade", "finalizado"];
    const currentIndex = steps.indexOf(step);
    return Math.round((currentIndex / (steps.length - 1)) * 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-md h-[70vh] max-h-[90vh] flex flex-col shadow-2xl fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300"
        style={{width: '100%', maxWidth: '350px'}}>
        {/* Header */}
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
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <p className="text-xs text-green-100 mt-1">{getProgressPercentage()}% concluído</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] ${message.type === "user" ? "" : "flex items-start space-x-2"}`}>
                {message.type === "bot" && (
                  <div className="w-8 h-8 bg-unimed-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">{getStepIcon(step)}</span>
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl ${
                    message.type === "user"
                      ? "bg-unimed-green text-white rounded-br-md"
                      : "bg-white text-gray-900 shadow-sm border rounded-bl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  
                  {/* Options Buttons */}
                  {message.options && message.type === "bot" && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option, optIndex) => (
                        <button
                          key={optIndex}
                          onClick={() => handleOptionClick(option)}
                          className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-unimed-green hover:text-white transition-colors rounded-lg border border-gray-200"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-unimed-green rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">💭</span>
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm border">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {step !== "finalizado" && !isTyping && (
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    handleSubmit(e as any);
                  }
                }}
                placeholder={getInputPlaceholder(step)}
                className="w-full pl-4 pr-12 py-2 sm:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-unimed-green-300 transition-shadow text-sm sm:text-base"
                disabled={isTyping}
                maxLength={step === 'numero_cnpj' ? 18 : undefined}
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-unimed-green text-white p-2 sm:p-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}

        {/* Final CTA */}
        {step === "finalizado" && (
          <div className="p-4 border-t bg-white rounded-b-2xl">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-unimed-green" />
              </div>
              <p className="text-sm text-gray-600">
                Informações enviadas com sucesso! 
              </p>
              <button
                onClick={onClose}
                className="w-full bg-unimed-green text-white py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold"
              >
                Fechar Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
