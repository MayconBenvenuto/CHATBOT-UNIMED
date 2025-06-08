// convex/email.ts

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
    // Validação das variáveis de ambiente
    const resendApiKey = process.env.CONVEX_RESEND_API_KEY;
    if (!resendApiKey) throw new Error("A variável de ambiente CONVEX_RESEND_API_KEY não está configurada.");
    
    const emailDestination = process.env.CONVEX_EMAIL_DESTINATION;
    if (!emailDestination) throw new Error("A variável de ambiente CONVEX_EMAIL_DESTINATION não está configurada.");

    const emailFrom = process.env.CONVEX_EMAIL_FROM;
    if (!emailFrom) throw new Error("A variável de ambiente CONVEX_EMAIL_FROM não está configurada.");

    // Busca os dados do lead no banco
    const lead = await ctx.runQuery(api.leads.getLead, { leadId: args.leadId });
    if (!lead) throw new Error("Lead não encontrado");

    let dadosEmpresa = null;
    let dadosEmpresaHtml = "";

    // --- BLOCO PRINCIPAL DA MUDANÇA ---
    // Se o lead tiver um CNPJ, tentamos validá-lo e buscar os dados da empresa.
    if (lead.temCnpj && lead.numeroCnpj) {
      try {
        const cleanedCnpj = lead.numeroCnpj.replace(/\D/g, "");
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanedCnpj}`);
        
        if (response.ok) {
          dadosEmpresa = await response.json();
          // Salva os dados da empresa no banco para futuras consultas
          await ctx.runMutation(api.leads.updateLead, {
            leadId: args.leadId,
            dadosEmpresa: dadosEmpresa,
          });

          // Formata a seção de HTML com os dados da empresa
          dadosEmpresaHtml = `
            <div class="section">
              <h3>🏢 Dados da Empresa (Validados)</h3>
              <div class="info-item"><strong>Razão Social:</strong> ${dadosEmpresa.razao_social || 'N/A'}</div>
              <div class="info-item"><strong>Nome Fantasia:</strong> ${dadosEmpresa.nome_fantasia || 'N/A'}</div>
              <div class="info-item"><strong>Situação Cadastral:</strong> ${dadosEmpresa.descricao_situacao_cadastral || 'N/A'}</div>
              <div class="info-item"><strong>Atividade Principal:</strong> ${dadosEmpresa.cnae_fiscal_descricao || 'N/A'}</div>
              <div class="info-item"><strong>Endereço:</strong> ${dadosEmpresa.logradouro || ''}, ${dadosEmpresa.numero || ''}, ${dadosEmpresa.bairro || ''} - ${dadosEmpresa.municipio || ''}/${dadosEmpresa.uf || ''}</div>
              <div class="info-item"><strong>CEP:</strong> ${dadosEmpresa.cep || 'N/A'}</div>
              <div class="info-item"><strong>Data de Abertura:</strong> ${dadosEmpresa.data_inicio_atividade || 'N/A'}</div>
            </div>
          `;
        }
      } catch (error) {
        console.error("Falha ao buscar dados do CNPJ na BrasilAPI:", error);
        // A falha na API não impede o envio do e-mail; ele apenas não será enriquecido.
      }
    }

    // Preparação do link do WhatsApp e do conteúdo do e-mail
    const whatsappLink = `https://wa.me/55${lead.whatsapp.replace(/\D/g, "")}`;
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>🔥 NOVO LEAD QUALIFICADO - ${lead.nome}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 700px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #009639, #007a2e); color: white; padding: 25px; text-align: center; border-radius: 8px 8px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .header h2 { margin: 5px 0 0; font-size: 20px; font-weight: normal; }
          .content { padding: 25px; }
          .section { margin-bottom: 25px; background-color: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 5px solid #009639; }
          .section h3 { color: #009639; border-bottom: 2px solid #eeeeee; padding-bottom: 8px; margin-top: 0; font-size: 18px; }
          .info-item { margin-bottom: 10px; font-size: 15px; }
          .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
          .whatsapp-button { text-decoration: none; background-color: #25D366; color: white !important; padding: 10px 18px; border-radius: 25px; font-weight: bold; display: inline-block; margin-left: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔥 NOVO LEAD QUALIFICADO</h1>
            <h2>${lead.nome}</h2>
          </div>
          <div class="content">
            <div class="section">
              <h3>👤 Dados de Contato</h3>
              <div class="info-item"><strong>Nome:</strong> ${lead.nome}</div>
              <div class="info-item"><strong>E-mail:</strong> ${lead.email}</div>
              <div class="info-item" style="display: flex; align-items: center; justify-content: space-between;">
                <span><strong>WhatsApp:</strong> ${lead.whatsapp}</span>
                <a href="${whatsappLink}" target="_blank" class="whatsapp-button">Conversar</a>
              </div>
            </div>
            
            <div class="section">
              <h3>📋 Perfil Inicial</h3>
              <div class="info-item"><strong>Possui CNPJ:</strong> ${lead.temCnpj ? "✅ SIM" : "❌ NÃO"}</div>
              ${lead.numeroCnpj ? `<div class="info-item"><strong>CNPJ:</strong> ${lead.numeroCnpj}</div>` : ""}
              ${lead.enquadramentoCnpj ? `<div class="info-item"><strong>Enquadramento:</strong> ${lead.enquadramentoCnpj}</div>` : ""}
            </div>

            ${dadosEmpresaHtml}
            
            <div class="section">
              <h3>🏥 Situação do Plano de Saúde</h3>
              <div class="info-item"><strong>Possui Plano Atual:</strong> ${lead.temPlanoAtual ? "✅ SIM" : "❌ NÃO"}</div>
              ${lead.nomePlanoAtual ? `<div class="info-item"><strong>Operadora Atual:</strong> ${lead.nomePlanoAtual}</div>` : ""}
              ${lead.valorPlanoAtual ? `<div class="info-item"><strong>Valor Mensal:</strong> ${lead.valorPlanoAtual}</div>` : ""}
              ${lead.maiorDificuldade ? `<div class="info-item"><strong>Principal Dificuldade:</strong> ${lead.maiorDificuldade}</div>` : ""}
            </div>
          </div>
          <div class="footer">
            <p>Lead capturado em: ${new Date(lead._creationTime).toLocaleString("pt-BR", { timeZone: 'America/Sao_Paulo' })}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Envio do e-mail
    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from: emailFrom,
      to: emailDestination,
      subject: `🔥 Lead PME Qualificado: ${lead.nome} ${lead.temCnpj ? `(${dadosEmpresa?.nome_fantasia || lead.numeroCnpj})` : ''}`,
      html: emailContent,
    });

    // Atualização final do status do lead
    await ctx.runMutation(api.leads.updateLead, {
      leadId: args.leadId,
      status: "enviado",
    });

    return { success: true };
  },
});