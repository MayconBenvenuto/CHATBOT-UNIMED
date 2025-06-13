import { Shield, Users, Heart } from "lucide-react";

export default function BenefitsSection() {
  return (
    <section id="beneficios" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Benefícios Exclusivos para Pequenas, Médias e Grandes Empresas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Desenvolvemos soluções específicas para pequenas, médias e grandes empresas, 
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
  );
}
