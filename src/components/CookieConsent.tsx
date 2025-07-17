import { useCookieConsent } from "../hooks/useFacebookPixel";
import { Shield, X, Settings } from 'lucide-react';
import { useState } from 'react';

export default function CookieConsent() {
  const { showConsent, acceptCookies, rejectCookies } = useCookieConsent();
  const [showDetails, setShowDetails] = useState(false);

  const handleSettings = () => {
    setShowDetails(!showDetails);
  };

  if (!showConsent) return null;

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
              🍪 Este site usa cookies para melhorar sua experiência e para análises de marketing. 
              Utilizamos o Facebook Pixel para medir a eficácia de nossos anúncios e entender como você 
              interage com nossos serviços. Ao continuar navegando, você concorda com nossa política de privacidade.
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
                onClick={acceptCookies}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Aceitar Todos
              </button>
              
              <button
                onClick={rejectCookies}
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
            onClick={rejectCookies}
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
