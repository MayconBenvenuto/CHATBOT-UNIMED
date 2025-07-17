import BenefitsSection from "./BenefitsSection";
import DifferentialsSection from "./DifferentialsSection";
import TestimonialsSection from "./TestimonialsSection";
import CTASection from "./CTASection";
import Footer from "./Footer";
import { CheckCircle } from "lucide-react";

interface LandingPageProps {
  onOpenChatbot: () => void;
  trackEvent?: (eventName: string, parameters?: any) => void;
  trackCustomEvent?: (eventName: string, parameters?: any) => void;
}

export default function LandingPage({ onOpenChatbot, trackEvent, trackCustomEvent }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex flex-wrap justify-between items-center h-auto min-h-[4rem] gap-2">
            <div className="flex items-center min-w-0">
              <img src="/logo-unimed.png" alt="Logo Unimed" className="w-32 h-12 object-contain" />
              <span className="ml-2 text-base sm:text-xl font-bold text-gray-900 truncate">Planos de Saúde Empresas</span>
            </div>
            <nav className="hidden md:flex flex-wrap space-x-4 sm:space-x-8 mt-2 md:mt-0">
              <a href="#beneficios" className="text-gray-700 hover:text-unimed-green text-sm sm:text-base">Benefícios</a>
              <a href="#diferenciais" className="text-gray-700 hover:text-unimed-green text-sm sm:text-base">Diferenciais</a>
              <a href="#depoimentos" className="text-gray-700 hover:text-unimed-green text-sm sm:text-base">Depoimentos</a>
              <a href="#contato" className="text-gray-700 hover:text-unimed-green text-sm sm:text-base">Contato</a>
            </nav>
            <button
              onClick={onOpenChatbot}
              className="bg-unimed-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold w-full md:w-auto text-sm sm:text-base"
            >
              Solicitar Cotação
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[url('/hospital-unimed-recife.jpg')] bg-cover bg-center bg-no-repeat relative text-white py-12 sm:py-20">
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6">
                Planos de Saúde Empresas <br />
                <span className="block text-green-200">Unimed Recife</span>
              </h1>
              <p className="text-base sm:text-xl mb-6 sm:mb-8 text-green-100">
                Proteja sua empresa e seus colaboradores com o melhor plano de saúde do mercado. 
                Cobertura completa, atendimento humanizado e economia garantida.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    trackEvent?.('Lead', {
                      value: 10,
                      currency: 'BRL',
                      content_name: 'Solicitar Cotação Gratuita',
                      content_category: 'cta_button',
                      source: 'hero_section'
                    });
                    onOpenChatbot();
                  }}
                  className="bg-white text-unimed-green px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-base sm:text-lg"
                >
                  Solicitar Cotação Gratuita
                </button>
                <button
                  onClick={() => {
                    trackCustomEvent?.('ViewContent', {
                      content_name: 'Saiba Mais Button',
                      content_category: 'information',
                      source: 'hero_section'
                    });
                    onOpenChatbot();
                  }}
                  className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-white hover:text-unimed-green transition-colors font-semibold text-base sm:text-lg"
                >
                  Saiba Mais
                </button>
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-8">
                <h3 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6">Por que escolher a Unimed Recife?</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-200 mr-2 sm:mr-3" />
                    <span className="text-sm sm:text-base">Maior rede médica do Brasil</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-200 mr-2 sm:mr-3" />
                    <span className="text-sm sm:text-base">Atendimento 24h em emergências</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-200 mr-2 sm:mr-3" />
                    <span className="text-sm sm:text-base">Ampla cobertura com hospital de referência</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-200 mr-2 sm:mr-3" />
                    <span className="text-sm sm:text-base">Planos personalizados para PEQUENAS, MÉDIAS E GRANDES EMPRESAS - A PARTIR DE 1 VIDA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <BenefitsSection />

      {/* Diferenciais */}
      <DifferentialsSection />

      {/* Depoimentos */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection onOpenChatbot={() => {
        trackEvent?.('Lead', {
          value: 15,
          currency: 'BRL',
          content_name: 'CTA Section',
          content_category: 'cta_button',
          source: 'bottom_cta'
        });
        onOpenChatbot();
      }} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
