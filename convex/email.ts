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
    console.log("[sendLeadEmail] INÍCIO - Recebida solicitação para enviar email do lead:", args.leadId);
    
    try {
      // Validação das variáveis de ambiente
      const resendApiKey = process.env.CONVEX_RESEND_API_KEY;
      if (!resendApiKey) {
        console.error("[sendLeadEmail] ERRO - CONVEX_RESEND_API_KEY não configurada");
        throw new Error("A variável de ambiente CONVEX_RESEND_API_KEY não está configurada.");
      }
      
      const emailDestination = process.env.CONVEX_EMAIL_DESTINATION;
      if (!emailDestination) {
        console.error("[sendLeadEmail] ERRO - CONVEX_EMAIL_DESTINATION não configurada");
        throw new Error("A variável de ambiente CONVEX_EMAIL_DESTINATION não está configurada.");
      }

      const emailFrom = process.env.CONVEX_EMAIL_FROM;
      if (!emailFrom) {
        console.error("[sendLeadEmail] ERRO - CONVEX_EMAIL_FROM não configurada");
        throw new Error("A variável de ambiente CONVEX_EMAIL_FROM não está configurada.");
      }

      console.log("[sendLeadEmail] Variáveis de ambiente validadas com sucesso");
      console.log(`[sendLeadEmail] Destino: ${emailDestination}, Remetente: ${emailFrom}`);

      // Busca os dados do lead no banco
      console.log("[sendLeadEmail] Buscando dados do lead:", args.leadId);
      const lead = await ctx.runQuery(api.leads.getLead, { leadId: args.leadId });
      
      if (!lead) {
        console.error("[sendLeadEmail] ERRO - Lead não encontrado para ID:", args.leadId);
        throw new Error("Lead não encontrado");
      }
      
      console.log("[sendLeadEmail] Dados do lead obtidos com sucesso:", JSON.stringify(lead));

      let dadosEmpresa = null;
      let dadosEmpresaHtml = "";

      // --- BLOCO PRINCIPAL DA MUDANÇA ---
      // Se o lead tiver um CNPJ, tentamos validá-lo e buscar os dados da empresa.
      if (lead.temCnpj && lead.numeroCnpj) {
        try {
          const cleanedCnpj = lead.numeroCnpj.replace(/\D/g, "");
          console.log("[sendLeadEmail] Buscando dados do CNPJ:", cleanedCnpj);
          const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanedCnpj}`);
          if (response.ok) {
            dadosEmpresa = await response.json();
            // Salva os dados da empresa no banco para futuras consultas
            await ctx.runMutation(api.leads.updateLead, {
              leadId: args.leadId,
              dadosEmpresa: dadosEmpresa,
            });
            console.log("[sendLeadEmail] Dados da empresa obtidos e salvos:", dadosEmpresa);
          } else if (lead.dadosEmpresa) {
            // Fallback: usa os dados já salvos no lead
            dadosEmpresa = lead.dadosEmpresa;
            console.log("[sendLeadEmail] Usando dadosEmpresa já salvos no lead.");
          }
        } catch (error) {
          console.error("Falha ao buscar dados do CNPJ na BrasilAPI:", error);
          // Fallback: usa os dados já salvos no lead
          if (lead.dadosEmpresa) {
            dadosEmpresa = lead.dadosEmpresa;
            console.log("[sendLeadEmail] Usando dadosEmpresa já salvos no lead após erro.");
          }
        }
        // Monta o HTML se houver dados da empresa
        if (dadosEmpresa) {
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

      try {
        console.log("[sendLeadEmail] Preparando para enviar e-mail:");
        console.log(`[sendLeadEmail] - De: ${emailFrom}`);
        console.log(`[sendLeadEmail] - Para: ${emailDestination}`);
        console.log(`[sendLeadEmail] - Assunto: 🔥 Lead PME Qualificado: ${lead.nome} ${lead.temCnpj ? `(${dadosEmpresa?.nome_fantasia || lead.numeroCnpj})` : ''}`);
        
        const resend = new Resend(resendApiKey);
        const emailResponse = await resend.emails.send({
          from: emailFrom,
          to: emailDestination,
          subject: `🔥 Lead PME Qualificado: ${lead.nome} ${lead.temCnpj ? `(${dadosEmpresa?.nome_fantasia || lead.numeroCnpj})` : ''}`,
          html: emailContent,
        });
        
        console.log("[sendLeadEmail] Resposta do serviço de e-mail:", JSON.stringify(emailResponse));
        console.log("[sendLeadEmail] E-mail enviado com sucesso para lead:", args.leadId);
        
        // Atualização final do status do lead
        await ctx.runMutation(api.leads.updateLead, {
          leadId: args.leadId,
          status: "enviado",
        });
        
        console.log("[sendLeadEmail] Status do lead atualizado para 'enviado'");
        
        return { success: true };
      } catch (error) {
        console.error("[sendLeadEmail] ERRO ao enviar e-mail:", error);
        
        // Tentar registrar informações detalhadas sobre o erro
        if (error instanceof Error) {
          console.error("[sendLeadEmail] Mensagem de erro:", error.message);
          console.error("[sendLeadEmail] Stack trace:", error.stack);
        } else {
          console.error("[sendLeadEmail] Erro não é uma instância de Error:", error);
        }
        
        // Atualizar o status do lead para indicar falha no envio
        try {
          await ctx.runMutation(api.leads.updateLead, {
            leadId: args.leadId,
            status: "erro_email",
          });
          console.log("[sendLeadEmail] Status do lead atualizado para 'erro_email'");
        } catch (updateError) {
          console.error("[sendLeadEmail] Erro ao atualizar status do lead:", updateError);
        }
        
        throw error;
      }
      // Atualização final do status do lead
      await ctx.runMutation(api.leads.updateLead, {
        leadId: args.leadId,
        status: "enviado",
      });

      console.log("[sendLeadEmail] FIM - E-mail processado e lead atualizado:", args.leadId);
      return { success: true };
    } catch (error) {
      console.error("[sendLeadEmail] ERRO - Falha no processamento do envio de e-mail:", error);
      throw error;
    }
  },
});