import BenefitsSection from "./BenefitsSection";
import DifferentialsSection from "./DifferentialsSection";
import TestimonialsSection from "./TestimonialsSection";
import CTASection from "./CTASection";
import Footer from "./Footer";
import { CheckCircle } from "lucide-react";

interface LandingPageProps {
  onOpenChatbot: () => void;
}

export default function LandingPage({ onOpenChatbot }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/logo-unimed.png" alt="Logo Unimed" className="w-[15em] h-[7em] object-contain" />
              <span className="ml-2 text-xl font-bold text-gray-900">Planos de Saúde Empresas</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#beneficios" className="text-gray-700 hover:text-unimed-green">Benefícios</a>
              <a href="#diferenciais" className="text-gray-700 hover:text-unimed-green">Diferenciais</a>
              <a href="#depoimentos" className="text-gray-700 hover:text-unimed-green">Depoimentos</a>
              <a href="#contato" className="text-gray-700 hover:text-unimed-green">Contato</a>
            </nav>
            <button
              onClick={onOpenChatbot}
              className="bg-unimed-green text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Solicitar Cotação
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[url('/hospital-unimed-recife.jpg')] bg-cover bg-center bg-no-repeat relative text-white py-20">
        <div className="absolute inset-0 bg-black opacity-65"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Planos de Saúde Empresas <br />
                <span className="block text-green-200">Unimed Recife</span>
              </h1>
              <p className="text-xl mb-8 text-green-100">
                Proteja sua empresa e seus colaboradores com o melhor plano de saúde do mercado. 
                Cobertura completa, atendimento humanizado e economia garantida.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onOpenChatbot}
                  className="bg-white text-unimed-green px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
                >
                  Solicitar Cotação Gratuita
                </button>
                <button
                  onClick={onOpenChatbot}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-unimed-green transition-colors font-semibold"
                >
                  Saiba Mais
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Por que escolher a Unimed Recife?</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-200 mr-3" />
                    <span>Maior rede médica do Brasil</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-200 mr-3" />
                    <span>Atendimento 24h em emergências</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-200 mr-3" />
                    <span>Ampla cobertura com hospital de referência</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-200 mr-3" />
                    <span>Planos personalizados para PEQUENAS, MÉDIAS E GRANDES EMPRESAS - A PARTIR  DE 1 VIDA</span>
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
      <CTASection onOpenChatbot={onOpenChatbot} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
