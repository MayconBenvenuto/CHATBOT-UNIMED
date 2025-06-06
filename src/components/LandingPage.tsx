import { CheckCircle, Users, Shield, Heart, Star, Phone, Mail, MapPin } from "lucide-react";

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
              <div className="w-8 h-8 bg-unimed-green rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Unimed</span>
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
      <section className="bg-gradient-to-br from-unimed-green to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Planos de Saúde PME
                <span className="block text-green-200">Unimed</span>
              </h1>
              <p className="text-xl mb-8 text-green-100">
                Proteja sua empresa e seus colaboradores com os melhores planos de saúde do mercado. 
                Cobertura completa, atendimento humanizado e economia garantida.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onOpenChatbot}
                  className="bg-white text-unimed-green px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
                >
                  Solicitar Cotação Gratuita
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-unimed-green transition-colors font-semibold">
                  Saiba Mais
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Por que escolher a Unimed?</h3>
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
                    <span>Cobertura nacional</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-200 mr-3" />
                    <span>Planos personalizados para PME</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Benefícios Exclusivos para PME
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desenvolvemos soluções específicas para pequenas e médias empresas, 
              oferecendo o melhor custo-benefício do mercado.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-unimed-green rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cobertura Abrangente</h3>
              <p className="text-gray-600">
                Consultas, exames, internações, cirurgias e muito mais. 
                Cobertura completa para todos os colaboradores.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-unimed-green rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Atendimento Personalizado</h3>
              <p className="text-gray-600">
                Consultores especializados em PME para atender suas necessidades 
                específicas com agilidade e eficiência.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-unimed-green rounded-lg flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Economia Garantida</h3>
              <p className="text-gray-600">
                Planos com preços competitivos e condições especiais para empresas. 
                Invista na saúde sem comprometer o orçamento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section id="diferenciais" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Os Diferenciais da Unimed
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-unimed-green rounded-full flex items-center justify-center mr-4 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Maior Rede Médica do Brasil
                    </h3>
                    <p className="text-gray-600">
                      Mais de 100.000 médicos cooperados em todo o país, garantindo 
                      atendimento de qualidade onde você estiver.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-unimed-green rounded-full flex items-center justify-center mr-4 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Tecnologia e Inovação
                    </h3>
                    <p className="text-gray-600">
                      App exclusivo, telemedicina, agendamento online e muito mais 
                      para facilitar o acesso aos serviços de saúde.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 bg-unimed-green rounded-full flex items-center justify-center mr-4 mt-1">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Medicina Preventiva
                    </h3>
                    <p className="text-gray-600">
                      Programas de prevenção e promoção da saúde para manter 
                      seus colaboradores sempre saudáveis e produtivos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-unimed-green to-green-700 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Números que Impressionam</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">50+</div>
                  <div className="text-green-200">Anos de Experiência</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">18M+</div>
                  <div className="text-green-200">Beneficiários</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">100K+</div>
                  <div className="text-green-200">Médicos Cooperados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">350+</div>
                  <div className="text-green-200">Cidades Atendidas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-gray-600">
              Empresas que confiam na Unimed para cuidar da saúde de seus colaboradores
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "A Unimed transformou a gestão de saúde da nossa empresa. 
                Atendimento excepcional e economia real no orçamento."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold text-gray-900">Maria Silva</div>
                  <div className="text-gray-600">CEO, TechStart</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "Nossos funcionários estão muito satisfeitos com a qualidade 
                do atendimento e a facilidade de acesso aos serviços."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold text-gray-900">João Santos</div>
                  <div className="text-gray-600">Diretor, Inovação Ltda</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "Migrar para a Unimed foi a melhor decisão. Reduzimos custos 
                e aumentamos a satisfação da equipe."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold text-gray-900">Ana Costa</div>
                  <div className="text-gray-600">RH, Crescer Empresa</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-unimed-green">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para Transformar a Saúde da sua Empresa?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Solicite uma cotação personalizada e descubra como a Unimed pode 
            oferecer o melhor plano de saúde para sua PME.
          </p>
          <button
            onClick={onOpenChatbot}
            className="bg-white text-unimed-green px-12 py-4 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg"
          >
            Solicitar Cotação Gratuita
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-unimed-green rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">Unimed</span>
              </div>
              <p className="text-gray-400">
                Cuidando da saúde das empresas brasileiras há mais de 50 anos.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contato</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-unimed-green mr-3" />
                  <span className="text-gray-400">0800 123 4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-unimed-green mr-3" />
                  <span className="text-gray-400">pme@unimed.com.br</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-unimed-green mr-3" />
                  <span className="text-gray-400">São Paulo, SP</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Serviços</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Planos PME</li>
                <li>Medicina Preventiva</li>
                <li>Telemedicina</li>
                <li>Consultoria em Saúde</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Institucional</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre a Unimed</li>
                <li>Rede Credenciada</li>
                <li>Sustentabilidade</li>
                <li>Trabalhe Conosco</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Unimed. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
