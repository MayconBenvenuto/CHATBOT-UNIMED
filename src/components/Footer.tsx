import { Heart, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contato" className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-unimed-green rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold">Unimed Recife</span>
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
                <span className="text-gray-400">81 98824-2023</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-unimed-green mr-3" />
                <span className="text-gray-400">brleao@gmail.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-unimed-green mr-3" />
                <span className="text-gray-400">Recife, PE</span>
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
              <li>
                <a href="https://www.unimedrecife.com.br/institucional" target="_blank" rel="noopener noreferrer" className="hover:underline">Sobre a Unimed Recife</a>
              </li>
              <li>
                <a href="https://www.unimedrecife.com.br/rede-credenciada" target="_blank" rel="noopener noreferrer" className="hover:underline">Rede Credenciada</a>
              </li>
              <li>
                <a href="https://www.unimedrecife.com.br/sustentabilidade" target="_blank" rel="noopener noreferrer" className="hover:underline">Sustentabilidade</a>
              </li>
              <li>
                <a href="https://www.unimedrecife.com.br/trabalhe-conosco" target="_blank" rel="noopener noreferrer" className="hover:underline">Trabalhe Conosco</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Unimed. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
