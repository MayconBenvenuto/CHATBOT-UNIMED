export default function CTASection({ onOpenChatbot }: { onOpenChatbot: () => void }) {
  return (
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
  );
}
