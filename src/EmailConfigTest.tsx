import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

export function EmailConfigTest() {  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sendTestEmail = useAction(api.email_test.sendTestEmail);
    const runTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const testResult = await sendTestEmail();
      setResult(testResult);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Teste de Envio de E-mail</h2>      <button 
        onClick={() => { runTest().catch(console.error); }}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg mb-6"
      >
        {loading ? "Enviando e-mail de teste..." : "Enviar E-mail de Teste"}
      </button>
      
      {error && (
        <div className="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p><strong>Erro:</strong> {error}</p>
        </div>
      )}
      
      {result && (
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Resultado do teste:</h3>
          <pre className="whitespace-pre-wrap bg-gray-200 p-3 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
