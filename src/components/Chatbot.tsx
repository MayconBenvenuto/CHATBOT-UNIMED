import { useEffect, useReducer, useRef } from "react";
import { useAction, useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import ChatbotHeader from "./ChatbotHeader";
import ChatbotMessages from "./ChatbotMessages";
import ChatbotInput from "./ChatbotInput";
import ChatbotFinalCTA from "./ChatbotFinalCTA";

// --- INTERFACES E TIPOS ---
interface ChatbotProps {
  onClose: () => void;
}

type ChatStep =
  | "nome"
  | "whatsapp"
  | "cnpj"
  | "plano_atual"
  | "nome_plano"
  | "valor_plano"
  | "dificuldade"
  | "finalizado";

interface ChatData {
  nome: string;
  whatsapp: string;
  cnpj: string;
  temPlanoAtual: boolean;
  nomePlanoAtual: string;
  valorPlanoAtual: string;
  maiorDificuldade: string;
}

interface Message {
  type: "user" | "bot";
  text: string;
  options?: string[];
}

// --- LÓGICA DO REDUCER ---
interface ChatState {
  step: ChatStep;
  input: string;
  leadId: Id<"leads"> | null;
  chatData: Partial<ChatData>;
  messages: Message[];
  isTyping: boolean; // Usaremos para indicar validação também
}

type ChatAction =
  | { type: "SET_INPUT"; payload: string }
  | { type: "SET_IS_TYPING"; payload: boolean }
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_LEAD_ID"; payload: Id<"leads"> }
  | { type: "PROCEED_STEP"; payload: { nextStep: ChatStep; newData: Partial<ChatData> } };

const initialState: ChatState = {
  step: "nome",
  input: "",
  leadId: null,
  chatData: {},
  messages: [
    {
      type: "bot",
      text: "👋 Olá! Sou o Davi, assistente virtual da Unimed. Vou te ajudar a encontrar o melhor plano PME para sua empresa!",
    },
  ],
  isTyping: false,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, input: action.payload };
    case "SET_IS_TYPING":
      return { ...state, isTyping: action.payload };
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SET_LEAD_ID":
      return { ...state, leadId: action.payload };
    case "PROCEED_STEP":
      return {
        ...state,
        step: action.payload.nextStep,
        chatData: action.payload.newData,
        input: "",
      };
    default:
      return state;
  }
}

// !!! MUDANÇA AQUI: Nova função para validar CNPJ com a BrasilAPI !!!
async function validateCnpjWithAPI(cnpj: string): Promise<boolean> {
  const cleanedCnpj = cnpj.replace(/\D/g, ""); // Remove pontos, traços e barras
  if (cleanedCnpj.length !== 14) {
    return false;
  }

  try {
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanedCnpj}`);
    if (response.ok) {
      // response.ok é true para status 200-299
      const data = await response.json();
      console.log("CNPJ Válido:", data); // Opcional: ver dados da empresa no console
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro ao validar CNPJ:", error);
    // Se a API falhar, não bloqueamos o usuário, mas avisamos do problema.
    toast.error("Não foi possível validar o CNPJ no momento. Tente novamente.");
    return false;
  }
}

export default function Chatbot({ onClose }: ChatbotProps) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { step, input, leadId, chatData, messages, isTyping } = state;

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

  const addBotMessage = (text: string, options?: string[]) => {
    dispatch({ type: "SET_IS_TYPING", payload: true });
    setTimeout(() => {
      dispatch({ type: "SET_IS_TYPING", payload: false });
      dispatch({ type: "ADD_MESSAGE", payload: { type: "bot", text, options } });
    }, 1500);
  };
  
  useEffect(() => {
    setTimeout(() => {
      addBotMessage("Para começar, qual é o seu nome? 😊");
    }, 1000);
  }, []);

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
          .replace(/\D/g, "")
          .slice(0, 14)
          .replace(/(\d{2})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d)/, "$1.$2")
          .replace(/(\d{3})(\d)/, "$1/$2")
          .replace(/(\d{4})(\d)/, "$1-$2");
        break;
      case "valor_plano":
        value = value.replace(/\D/g, "");
        if (value) {
          const numberValue = parseInt(value, 10) / 100;
          value = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(numberValue);
        } else {
          value = "";
        }
        break;
    }
    dispatch({ type: "SET_INPUT", payload: value });
  };

  const getNextStep = (currentStep: ChatStep, data: Partial<ChatData>): ChatStep => {
    switch (currentStep) {
      case "nome": return "whatsapp";
      case "whatsapp": return "cnpj";
      case "cnpj": return "plano_atual";
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
    case "cnpj": 
      return { text: "🏢 QUAL O SEU CNPJ?" };
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
      case "whatsapp": {
        const cleanPhone = value.replace(/\D/g, "");
        return cleanPhone.length >= 10 && cleanPhone.length <= 11;
      }
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case "numero_cnpj": {
        const cleanCnpj = value.replace(/\D/g, "");
        return cleanCnpj.length === 14;
      }
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
    dispatch({ type: "SET_INPUT", payload: option });
    setTimeout(() => { void handleSubmit(null, option); }, 100);
  };

  const handleSubmit = async (e: React.FormEvent | null, optionValue?: string) => {
    if (e) e.preventDefault();

    const value = optionValue || input;
    if (!value.trim()) return;

    if (!validateInput(step, value)) {
      toast.error("Por favor, verifique o formato da informação inserida.");
      return;
    }

    // !!! MUDANÇA AQUI: Lógica de validação do CNPJ antes de prosseguir !!!
    if (step === "numero_cnpj") {
      dispatch({ type: "SET_IS_TYPING", payload: true }); // Mostra feedback de "validando"
      const isCnpjValid = await validateCnpjWithAPI(value);
      dispatch({ type: "SET_IS_TYPING", payload: false }); // Esconde feedback

      if (!isCnpjValid) {
        toast.error("❌ CNPJ inválido ou não encontrado. Por favor, verifique o número digitado.");
        return; // Interrompe a execução se o CNPJ for inválido
      }
    }

    dispatch({ type: "ADD_MESSAGE", payload: { type: "user", text: value } });

    const newData = { ...chatData };
    switch (step) {
      case "nome": newData.nome = value; break;
      case "whatsapp": newData.whatsapp = value; break;
      case "email": newData.email = value; break;
      case "cnpj": newData.cnpj = value; break;
      case "plano_atual": newData.temPlanoAtual = value.toLowerCase() === "sim"; break;
      case "nome_plano": newData.nomePlanoAtual = value; break;
      case "valor_plano": newData.valorPlanoAtual = value; break;
      case "dificuldade": newData.maiorDificuldade = value; break;
    }

    const nextStep = getNextStep(step, newData);
    dispatch({ type: "PROCEED_STEP", payload: { nextStep, newData } });

    // ... (O restante da função handleSubmit, com a lógica de salvar e enviar e-mail, permanece igual)
    let currentLeadId = leadId;
    try {
      if (step === "cnpj" && newData.nome && newData.whatsapp && newData.email) {
        const id = await createLead({
          nome: newData.nome,
          whatsapp: newData.whatsapp,
          email: newData.email,
          temCnpj: newData.temCnpj || false,
        });
        dispatch({ type: "SET_LEAD_ID", payload: id });
        currentLeadId = id; 
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
      toast.error("Houve um problema ao salvar suas informações.");
    }
    
    if (nextStep === "finalizado" && currentLeadId) {
      try {
        // Busca e salva os dados da empresa ANTES de enviar o e-mail
        if (newData.numeroCnpj) {
          const cleanedCnpj = newData.numeroCnpj.replace(/\D/g, "");
          try {
            const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanedCnpj}`);
            if (response.ok) {
              const dadosEmpresa = await response.json();
              await updateLead({
                leadId: currentLeadId,
                dadosEmpresa,
              });
            }
          } catch {
            // Não bloqueia o fluxo se a API falhar
          }
        }
        // Garante que todos os dados estejam salvos antes de enviar o e-mail
        await updateLead({
          leadId: currentLeadId,
          enquadramentoCnpj: newData.enquadramentoCnpj,
          numeroCnpj: newData.numeroCnpj,
          temPlanoAtual: newData.temPlanoAtual,
          nomePlanoAtual: newData.nomePlanoAtual,
          valorPlanoAtual: newData.valorPlanoAtual,
          maiorDificuldade: newData.maiorDificuldade,
          status: "completo",
        });
        await new Promise(resolve => setTimeout(resolve, 500));
        await sendEmail({ leadId: currentLeadId });
        toast.success("✅ Informações enviadas! Em breve nosso consultor entrará em contato.");
      } catch (error) {
        console.error("Falha ao enviar e-mail de notificação:", error);
        toast.error("❌ Ops! Seus dados foram salvos, mas não conseguimos notificar nosso time. Entraremos em contato assim que possível!");
      }
    }

    const botResponse = getBotMessage(nextStep, newData);
    addBotMessage(botResponse.text, botResponse.options);
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
        <ChatbotHeader onClose={onClose} progress={getProgressPercentage()} />
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
            handleSubmit={handleSubmit as (e: React.FormEvent) => void}
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
}