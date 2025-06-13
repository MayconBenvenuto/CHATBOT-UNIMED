"use node";

import { action } from "./_generated/server";

// Esta action testa se um e-mail de teste está sendo enviado corretamente
export const sendTestEmail = action({
  args: {},  
  handler: async (_ctx, _args) => {
    try {
      console.log("[sendTestEmail] Testando envio de e-mail");
      
      // Validação das variáveis de ambiente
      const resendApiKey = process.env.CONVEX_RESEND_API_KEY;
      if (!resendApiKey) {
        console.error("[sendTestEmail] CONVEX_RESEND_API_KEY não está configurada");
        return {
          success: false,
          message: "A variável de ambiente CONVEX_RESEND_API_KEY não está configurada."
        };
      }
      
      const emailDestination = process.env.CONVEX_EMAIL_DESTINATION;
      if (!emailDestination) {
        console.error("[sendTestEmail] CONVEX_EMAIL_DESTINATION não está configurada");
        return {
          success: false,
          message: "A variável de ambiente CONVEX_EMAIL_DESTINATION não está configurada."
        };
      }

      const emailFrom = process.env.CONVEX_EMAIL_FROM;
      if (!emailFrom) {
        console.error("[sendTestEmail] CONVEX_EMAIL_FROM não está configurada");
        return {
          success: false,
          message: "A variável de ambiente CONVEX_EMAIL_FROM não está configurada."
        };
      }

      // Importar o Resend para enviar o e-mail
      const { Resend } = await import("resend");
      const resend = new Resend(resendApiKey);
      
      console.log(`[sendTestEmail] Enviando e-mail de teste para ${emailDestination}`);
      
      // Enviar o e-mail
      const emailResult = await resend.emails.send({
        from: emailFrom,
        to: emailDestination,
        subject: "🧪 Teste de e-mail do Chatbot Unimed PME",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Teste de E-mail - Chatbot Unimed PME</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #009639; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; border: 1px solid #ddd; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Teste de E-mail</h1>
              </div>
              <div class="content">
                <p>Este é um e-mail de teste do Chatbot Unimed PME.</p>
                <p>Se você está recebendo este e-mail, significa que a configuração de envio de e-mails está funcionando corretamente.</p>
                <p>Data/Hora do teste: ${new Date().toLocaleString('pt-BR')}</p>
              </div>
              <div class="footer">
                <p>Este é um e-mail automatizado. Por favor, não responda.</p>
              </div>
            </div>
          </body>
          </html>
        `
      });
      
      console.log("[sendTestEmail] E-mail enviado com sucesso:", emailResult);
      
      return {
        success: true,
        message: "E-mail de teste enviado com sucesso!",
        emailResult
      };
    } catch (error: any) {
      console.error("[sendTestEmail] Erro ao enviar e-mail:", error);
      return {
        success: false,
        message: `Erro ao enviar e-mail: ${error.message || "Erro desconhecido"}`,
        error: JSON.stringify(error)
      };
    }
  },
});
