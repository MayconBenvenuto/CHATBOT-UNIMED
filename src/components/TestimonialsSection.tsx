import { Star } from "lucide-react";

interface Testimonial {
  text: string;
  name: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    text: "A Unimed Recife sempre nos atendeu com muita agilidade e atenção. O suporte durante internações e consultas foi fundamental para o bem-estar dos nossos colaboradores.",
    name: "Patrícia Andrade",
    role: "Gestora de RH, Grupo Real",
  },
  {
    text: "Tivemos uma redução significativa nos custos com saúde e nossos funcionários elogiam muito a rede credenciada e o atendimento humanizado. Recomendo a Unimed Recife.",
    name: "Carlos Menezes",
    role: "Diretor, Construtora Nova Era",
  },
  {
    text: "O programa de medicina preventiva da Unimed Recife fez toda diferença para a saúde dos nossos colaboradores. Atendimento rápido e eficiente em todas as demandas.",
    name: "Fernanda Lima",
    role: "Supervisora, Tech Solutions",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="depoimentos" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-xl text-gray-600">
            Empresas que confiam na Unimed Recife para cuidar da saúde de seus colaboradores
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">{`"${t.text}"`}</p>
              <div className="flex items-center">
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-gray-600">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
