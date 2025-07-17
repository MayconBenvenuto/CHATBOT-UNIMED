import { useState, useEffect } from 'react';
import { Shield, X, Settings } from 'lucide-react';

interface CookieConsentProps {
  onAccept: () => void;
  onReject: () => void;
}

export default function CookieConsent({ onAccept, onReject }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Verifica se já há consentimento salvo
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    } else if (consent === 'accepted') {
      onAccept();
    }
  }, [onAccept]);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
    onAccept();
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setIsVisible(false);
    onReject();
  };

  const handleSettings = () => {
    setShowDetails(!showDetails);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <div className="flex items-center mb-2">
              <Shield className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Política de Cookies e Privacidade
              </h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              Utilizamos cookies e tecnologias similares para melhorar sua experiência, 
              personalizar conteúdo e analisar o tráfego do site. Alguns cookies são essenciais 
              para o funcionamento do site, enquanto outros nos ajudam a entender como você 
              interage com nossos serviços.
            </p>

            {showDetails && (
              <div className="bg-gray-50 p-3 rounded-lg mb-3 text-sm">
                <h4 className="font-semibold mb-2">Tipos de cookies utilizados:</h4>
                <ul className="space-y-1">
                  <li><strong>Essenciais:</strong> Necessários para o funcionamento básico do site</li>
                  <li><strong>Analíticos:</strong> Facebook Pixel para análise de tráfego e conversões</li>
                  <li><strong>Marketing:</strong> Para personalização de anúncios e remarketing</li>
                </ul>
                <p className="mt-2 text-xs text-gray-500">
                  Seus dados são tratados conforme nossa Política de Privacidade e a LGPD (Lei Geral de Proteção de Dados).
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleAccept}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Aceitar Todos
              </button>
              
              <button
                onClick={handleReject}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
              >
                Rejeitar Opcionais
              </button>
              
              <button
                onClick={handleSettings}
                className="flex items-center bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <Settings className="w-4 h-4 mr-1" />
                {showDetails ? 'Ocultar' : 'Detalhes'}
              </button>
            </div>
          </div>
          
          <button
            onClick={handleReject}
            className="p-1 text-gray-400 hover:text-gray-600"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
