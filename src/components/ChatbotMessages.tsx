interface Message {
  type: "user" | "bot";
  text: string;
  options?: string[];
}

interface ChatbotMessagesProps {
  messages: Message[];
  step: string;
  isTyping: boolean;
  getStepIcon: (step: string) => string;
  handleOptionClick: (option: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export default function ChatbotMessages({ messages, step, isTyping, getStepIcon, handleOptionClick, messagesEndRef }: ChatbotMessagesProps) {
  return (
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
  );
}
