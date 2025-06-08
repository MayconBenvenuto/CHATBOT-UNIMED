"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { Resend } from "resend";

export const sendLeadEmail = action({
  args: {
    leadId: v.id("leads"),
  },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.CONVEX_RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error(
        "A variável de ambiente CONVEX_RESEND_API_KEY não está configurada. Por favor, adicione-a no dashboard do Convex."
      );
    }

    const emailDestination = process.env.CONVEX_EMAIL_DESTINATION;
    if (!emailDestination) {
      throw new Error(
        "A variável de ambiente CONVEX_EMAIL_DESTINATION não está configurada. Por favor, adicione-a no dashboard do Convex."
      );
    }
    const emailFrom = process.env.CONVEX_EMAIL_FROM;
    if (!emailFrom) {
      throw new Error(
        "A variável de ambiente CONVEX_EMAIL_FROM não está configurada. Por favor, adicione-a no dashboard do Convex."
      );
    }
    const lead = await ctx.runQuery(api.leads.getLead, { leadId: args.leadId });

    if (!lead) {
      throw new Error("Lead não encontrado");
    }

    // --- NOVO: Prepara o link do WhatsApp ---
    // Remove caracteres não numéricos e adiciona o código do Brasil (55)
    const whatsappNumber = `55${lead.whatsapp.replace(/\D/g, "")}`;
    const whatsappLink = `https://wa.me/${whatsappNumber}`;

    // Preparar o conteúdo do e-mail para o consultor
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>🔥 NOVO LEAD QUALIFICADO - ${lead.nome}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 700px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #009639, #007a2e); color: white; padding: 25px; text-align: center; border-radius: 8px 8px 0 0; }
          .urgent { background-color: #ff4444; color: white; padding: 10px; text-align: center; font-weight: bold; }
          .content { padding: 25px; background-color: #f9f9f9; }
          .section { margin-bottom: 25px; }
          .section h3 { color: #009639; border-bottom: 2px solid #009639; padding-bottom: 8px; margin-bottom: 15px; }
          .info-item { margin: 8px 0; padding: 12px; background-color: white; border-radius: 6px; border-left: 4px solid #009639; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background-color: #e9e9e9; border-radius: 0 0 8px 8px; }
          .contact-priority { background-color: #d4edda; padding: 15px; border-radius: 8px; border: 2px solid #28a745; margin: 15px 0; }
          .status-badge { display: inline-block; padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: bold; }
          .cnpj-sim { background-color: #28a745; color: white; }
          .cnpj-nao { background-color: #ffc107; color: #333; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="urgent">
            ⚡ AÇÃO IMEDIATA NECESSÁRIA - LEAD QUENTE ⚡
          </div>
          
          <div class="header">
            <h1>🔥 NOVO LEAD QUALIFICADO</h1>
            <h2>${lead.nome}</h2>
            <p>Interessado em Plano PME Unimed</p>
            <span class="status-badge ${lead.temCnpj ? "cnpj-sim" : "cnpj-nao"}">
              ${lead.temCnpj ? "✅ COM CNPJ" : "⚠️ SEM CNPJ"}
            </span>
          </div>
          
          <div class="content">
            <div class="contact-priority">
              <h3>📞 CONTATO PRIORITÁRIO</h3>
              <p style="display: flex; align-items: center; justify-content: space-between;">
                <span><strong>WhatsApp:</strong> ${lead.whatsapp}</span>
                <a href="${whatsappLink}" target="_blank" style="text-decoration: none; background-color: #25D366; color: white; padding: 8px 15px; border-radius: 20px; font-weight: bold; margin-left: 10px;">
                    Conversar no WhatsApp
                </a>
              </p>
              <p><strong>E-mail:</strong> ${lead.email}</p>
            </div>
            
            <div class="section">
              <h3>👤 Dados do Prospect</h3>
              <div class="info-item"><strong>Nome:</strong> ${lead.nome}</div>
              <div class="info-item"><strong>WhatsApp:</strong> ${lead.whatsapp}</div>
              <div class="info-item"><strong>E-mail:</strong> ${lead.email}</div>
            </div>
            
            <div class="section">
              <h3>🏢 Perfil da Empresa</h3>
              <div class="info-item"><strong>Possui CNPJ:</strong> ${lead.temCnpj ? "✅ SIM" : "❌ NÃO"}</div>
              ${lead.enquadramentoCnpj ? `<div class="info-item"><strong>Enquadramento:</strong> ${lead.enquadramentoCnpj}</div>` : ""}
              ${lead.numeroCnpj ? `<div class="info-item"><strong>CNPJ:</strong> ${lead.numeroCnpj}</div>` : ""}
            </div>
            
            <div class="section">
              <h3>🏥 Situação Atual</h3>
              ${lead.temPlanoAtual !== undefined ? `<div class="info-item"><strong>Plano Atual:</strong> ${lead.temPlanoAtual ? "✅ POSSUI" : "❌ NÃO POSSUI"}</div>` : ""}
              ${lead.nomePlanoAtual ? `<div class="info-item"><strong>Operadora Atual:</strong> ${lead.nomePlanoAtual}</div>` : ""}
              ${lead.valorPlanoAtual ? `<div class="info-item"><strong>Valor Atual:</strong> ${lead.valorPlanoAtual}</div>` : ""}
              ${lead.maiorDificuldade ? `<div class="info-item"><strong>Principal Dificuldade:</strong> ${lead.maiorDificuldade}</div>` : ""}
            </div>

            </div>
          
          <div class="footer">
            <p><strong>Lead capturado em:</strong> ${new Date(lead._creationTime).toLocaleString("pt-BR")}</p>
            <p>Sistema de Captação de Leads - Unimed PME</p>
            <p>⚡ AÇÃO IMEDIATA NECESSÁRIA - CONTATAR HOJE ⚡</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Enviar e-mail para o consultor
    try {
      const resend = new Resend(resendApiKey);

      const { data, error } = await resend.emails.send({
        from: emailFrom,
        to: emailDestination, // Email do consultor de seguros
        subject: `🔥 NOVO LEAD QUALIFICADO: ${lead.nome} - ${lead.temCnpj ? "COM CNPJ" : "SEM CNPJ"}`,
        html: emailContent,
      });

      if (error) {
        console.error("Erro ao enviar e-mail:", error);
        throw new Error(`Falha ao enviar e-mail: ${JSON.stringify(error)}`);
      }

      console.log("E-mail enviado com sucesso para o consultor:", data);

      // Atualizar status do lead
      await ctx.runMutation(api.leads.updateLead, {
        leadId: args.leadId,
        status: "enviado",
      });

      return { success: true, message: "E-mail enviado para o consultor!", data };
    } catch (error) {
      console.error("Erro no envio do e-mail:", error);
      throw new Error(
        `Erro ao enviar e-mail: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  },
});