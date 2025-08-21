import { useEffect, useReducer, useRef } from "react";
import { useAction, useMutation } from "convex/react";
import { toast } from "sonner"; // Importando o toast
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import ChatbotHeader from "./ChatbotHeader";
import ChatbotMessages from "./ChatbotMessages";
import ChatbotInput from "./ChatbotInput";
import ChatbotFinalCTA from "./ChatbotFinalCTA";

// --- INTERFACES E TIPOS ---
interface ChatbotProps {
  onClose: () => void;
  fullPage?: boolean;
}

type ChatStep =
  | "nome"
  | "whatsapp"
  | "plano_atual"
  | "nome_plano"
  | "valor_plano"
  | "dificuldade"
  | "idades_beneficiarios"
  | "numero_cnpj" // Movido para penúltima posição (opcional)
  | "finalizado";

interface ChatData {
  nome: string;
  whatsapp: string;
  email: string; // Campo obrigatório para envio de email
  temCnpj: boolean;
  enquadramentoCnpj: string;
  numeroCnpj: string;
  dadosEmpresa?: any; // Adicionando os dados da empresa
  temPlanoAtual: boolean;
  nomePlanoAtual: string;
  valorPlanoAtual: string;
  maiorDificuldade: string;
  idadesBeneficiarios: string;
  cidade?: string;
  estado?: string;
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
  | { type: "PROCEED_STEP"; payload: { nextStep: ChatStep; newData: Partial<ChatData> } }
  | { type: "SET_LOCATION"; payload: { cidade: string; estado: string } };

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
    case "SET_LOCATION":
      return {
        ...state,
        chatData: {
          ...state.chatData,
          cidade: action.payload.cidade,
          estado: action.payload.estado,
        },
      };
    default:
      return state;
  }
}

export default function Chatbot({ onClose, fullPage = false }: ChatbotProps) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { step, input, leadId, chatData, messages, isTyping } = state;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const createLead = useMutation(api.leads.createLead);
  const updateLead = useMutation(api.leads.updateLead);
  const sendEmail = useAction(api.email.sendLeadEmail);

  // Função para enviar lead morno quando o chatbot for fechado
  const handleClose = () => {
    // Só envia o lead morno se há um lead, nome, whatsapp e não foi finalizado
    if (leadId && chatData.nome && chatData.whatsapp && step !== "finalizado") {
      console.log(`[Chatbot Close] Enviando lead morno: ${leadId}`);
      
      // Dispara o e-mail sem esperar pela conclusão
      sendEmail({ leadId, isWarmLead: true }).catch(error => {
        console.error("Erro ao enviar lead morno no fechamento:", error);
      });
    }
    
    // Chama a função de fechamento original
    onClose();
  };
  
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

    const fetchLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (!response.ok) {
          throw new Error("Falha ao buscar localização");
        }
        const data = await response.json();
        const { city, region_code } = data;
        if (city && region_code) {
          dispatch({ type: "SET_LOCATION", payload: { cidade: city, estado: region_code } });
          // Tracking via Facebook Pixel removido
        }
      } catch (error) {
        console.error("Erro ao buscar localização:", error);
      }
    };

    void fetchLocation();
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
      case "whatsapp": return "plano_atual";
      case "plano_atual": return data.temPlanoAtual ? "nome_plano" : "dificuldade";
      case "nome_plano": return "valor_plano";
      case "valor_plano": return "dificuldade";
      case "dificuldade": return "idades_beneficiarios";
      case "idades_beneficiarios": return "numero_cnpj";
      case "numero_cnpj": return "finalizado";
      default: return "finalizado";
    }
  };
  const getBotMessage = (step: ChatStep, data: Partial<ChatData>): { text: string; options?: string[] } => {
  switch (step) {
    case "whatsapp": 
      return { text: `Perfeito, ${data.nome}! 📱 Agora preciso do seu WhatsApp para nosso consultor entrar em contato:` };
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
    case "idades_beneficiarios":
      return { text: "👨‍👩‍👧‍👦 Para calcular a cotação, preciso saber as idades dos beneficiários que utilizarão o plano. Digite as idades separadas por vírgula (Ex: 32, 28, 5, 2):" };
    case "numero_cnpj":
      return { text: "🏢 Para finalizar, qual é o CNPJ da sua empresa? (Opcional - pode pular se preferir)" };
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
      case "idades_beneficiarios": {
        // Valida se contém apenas números, vírgulas e espaços
        const agesPattern = /^(\d+)(\s*,\s*\d+)*$/;
        return agesPattern.test(value.trim());
      }
      case "numero_cnpj": {
        // CNPJ é opcional agora, sempre retorna true
        return true;
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
        case "idades_beneficiarios": return "Ex: 32, 28, 5, 2";
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
    if (!value.trim() && step !== "numero_cnpj") return; // Permite valor vazio apenas para CNPJ

    if (!validateInput(step, value)) {
      toast.error("Por favor, verifique o formato da informação inserida.");
      return;
    }

    const newData = { ...chatData };

    dispatch({ type: "ADD_MESSAGE", payload: { type: "user", text: value || "Pular esta etapa" } });

    switch (step) {
      case "nome": newData.nome = value; break;
      case "whatsapp": newData.whatsapp = value; break;
      case "plano_atual": newData.temPlanoAtual = value.toLowerCase() === "sim"; break;
      case "nome_plano": newData.nomePlanoAtual = value; break;
      case "valor_plano": newData.valorPlanoAtual = value; break;
      case "dificuldade": newData.maiorDificuldade = value; break;
      case "idades_beneficiarios": newData.idadesBeneficiarios = value; break;
      case "numero_cnpj": newData.numeroCnpj = value; break; // Armazena CNPJ sem validação
    }

    const nextStep = getNextStep(step, newData);
    dispatch({ type: "PROCEED_STEP", payload: { nextStep, newData } });

    // ... (O restante da função handleSubmit, com a lógica de salvar e enviar e-mail, permanece igual)
    let currentLeadId = leadId;
    try {
      // Criamos o lead quando tivermos os dados básicos de contato (nome e whatsapp)
      if (step === "whatsapp" && newData.nome && newData.whatsapp) {
        // Geramos um email fictício baseado no número de WhatsApp para mantermos compatibilidade
        const whatsappEmail = `${newData.whatsapp.replace(/\D/g, "")}@whatsapp.cliente`;
        
        console.log("Criando novo lead com dados básicos:", {
          nome: newData.nome,
          whatsapp: newData.whatsapp,
          email: whatsappEmail
        });
        
        const id = await createLead({
          nome: newData.nome,
          whatsapp: newData.whatsapp,
          email: whatsappEmail,
          temCnpj: true, // Como agora perguntamos diretamente o CNPJ, assumimos que tem CNPJ
        });
        
        console.log("Lead criado com ID:", id);
        dispatch({ type: "SET_LEAD_ID", payload: id });
        currentLeadId = id; 
      } else if (leadId) {
        // Para as atualizações subsequentes
        console.log("Atualizando lead:", leadId, "com dados:", {
          numeroCnpj: newData.numeroCnpj,
          temCnpj: newData.numeroCnpj ? true : false,
          dadosEmpresa: newData.dadosEmpresa, // Incluindo dados da empresa
          temPlanoAtual: newData.temPlanoAtual,
          nomePlanoAtual: newData.nomePlanoAtual,
          valorPlanoAtual: newData.valorPlanoAtual,
          maiorDificuldade: newData.maiorDificuldade,
          idadesBeneficiarios: newData.idadesBeneficiarios,
          cidade: newData.cidade,
          estado: newData.estado,
          status: step === "numero_cnpj" ? "completo" : "em_andamento",
        });
        
        await updateLead({
          leadId,
          numeroCnpj: newData.numeroCnpj,
          temCnpj: newData.numeroCnpj ? true : false,
          dadosEmpresa: newData.dadosEmpresa, // Incluindo dados da empresa
          temPlanoAtual: newData.temPlanoAtual,
          nomePlanoAtual: newData.nomePlanoAtual,
          valorPlanoAtual: newData.valorPlanoAtual,
          maiorDificuldade: newData.maiorDificuldade,
          idadesBeneficiarios: newData.idadesBeneficiarios,
          cidade: newData.cidade,
          estado: newData.estado,
          status: step === "numero_cnpj" ? "completo" : "em_andamento",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
      toast.error("Houve um problema ao salvar suas informações.");
    }
    
    if (nextStep === "finalizado" && currentLeadId) {
      try {
        // Garantimos que todas as informações estejam atualizadas antes de enviar o email
        console.log("Finalizando fluxo do chatbot com leadId:", currentLeadId);
        await updateLead({
          leadId: currentLeadId,
          status: "completo",
          // Garantimos que todas as informações estejam atualizadas
          enquadramentoCnpj: newData.enquadramentoCnpj,
          numeroCnpj: newData.numeroCnpj,
          temPlanoAtual: newData.temPlanoAtual,
          nomePlanoAtual: newData.nomePlanoAtual,
          valorPlanoAtual: newData.valorPlanoAtual,
          maiorDificuldade: newData.maiorDificuldade,
          idadesBeneficiarios: newData.idadesBeneficiarios,
          cidade: newData.cidade,
          estado: newData.estado,
        });
        
        // Adicionamos um pequeno delay para garantir que a atualização foi concluída
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Enviamos o email
        console.log("Enviando email para leadId:", currentLeadId);
        toast.loading("Enviando suas informações...");
        
        try {
          const emailResult = await sendEmail({ leadId: currentLeadId });
          console.log("Resultado do envio de email:", emailResult);
          
          if (emailResult.success) {
            // Tracking via Facebook Pixel removido
            
            toast.success("✅ Informações enviadas com sucesso! Em breve nosso consultor entrará em contato.");
          } else {
            throw new Error("Falha ao enviar e-mail");
          }
        } catch (emailError: any) {
          console.error("Erro ao enviar e-mail:", emailError);
          toast.error(`❌ Erro ao enviar e-mail: ${emailError.message || "Erro desconhecido"}`);
          
          // Tentamos enviar novamente após 3 segundos
          const finalLeadId = currentLeadId; // Capturamos o ID do lead para usar no setTimeout
          setTimeout(() => {
            sendEmail({ leadId: finalLeadId })
              .then(retryResult => {
                if (retryResult.success) {
                  // Tracking via Facebook Pixel removido
                  
                  toast.success("✅ E-mail enviado com sucesso na segunda tentativa!");
                } else {
                  toast.error("❌ Não foi possível enviar o e-mail. Nossa equipe foi notificada e entrará em contato em breve.");
                }
              })
              .catch(retryError => {
                console.error("Erro na segunda tentativa de envio:", retryError);
                toast.error("❌ Não foi possível enviar o e-mail. Nossa equipe foi notificada e entrará em contato em breve.");
              });
          }, 3000);
        }
      } catch (error) {
        console.error("Erro ao finalizar processo:", error);
        toast.error("❌ Seus dados foram salvos, mas ocorreu um erro ao processá-los. Nossa equipe entrará em contato em breve!");
      }
    }

    const botResponse = getBotMessage(nextStep, newData);
    addBotMessage(botResponse.text, botResponse.options);
  };
    const handleSkip = () => {
    // Simula envio com valor vazio para CNPJ
    void handleSubmit(null, "");
  };

  const getStepIcon = (step: string): string => {
    switch (step) {
      case "nome": return "👤";
      case "whatsapp": return "📱";
      case "numero_cnpj": return "🏢";
      case "plano_atual": return "🏥";
      case "nome_plano": return "📝";
      case "valor_plano": return "💰";
      case "dificuldade": return "🤔";
      case "idades_beneficiarios": return "👨‍👩‍👧‍👦";
      case "finalizado": return "🎉";
      default: return "💬";
    }
  };

  const getProgressPercentage = () => {
    const steps = ["nome", "whatsapp", "plano_atual", "nome_plano", "valor_plano", "dificuldade", "idades_beneficiarios", "numero_cnpj", "finalizado"];
    const currentIndex = steps.indexOf(step);
    return Math.round((currentIndex / (steps.length - 1)) * 100);
  };
  
    return (
    <div className={fullPage 
      ? "h-full bg-white flex flex-col" 
      : "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    }>
      <div className={fullPage 
        ? "h-full flex flex-col" 
        : "bg-white rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-md h-[70vh] max-h-[90vh] flex flex-col shadow-2xl fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300"
      }
        style={!fullPage ? {width: '100%', maxWidth: '350px'} : {}}>
        {/* Header */}
        {!fullPage && <ChatbotHeader onClose={handleClose} progress={getProgressPercentage()} />}
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
            handleSubmit={(e) => { void handleSubmit(e); }}
            handleSkip={handleSkip}
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