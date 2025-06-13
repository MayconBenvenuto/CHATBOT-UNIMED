import { CheckCircle } from "lucide-react";

export default function DifferentialsSection() {
  return (
    <section id="diferenciais" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Os Diferenciais da Unimed Recife
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
                <div className="text-3xl font-bold mb-2">180.000+</div>
                <div className="text-green-200">Beneficiários</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">2.000+</div>
                <div className="text-green-200">Médicos Cooperados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">200+</div>
                <div className="text-green-200">Cidades Atendidas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
