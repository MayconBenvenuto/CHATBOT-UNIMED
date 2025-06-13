import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createLead = mutation({
  args: {
    nome: v.string(),
    whatsapp: v.string(),
    email: v.string(),
    temCnpj: v.boolean(),
  },
  handler: async (ctx, args) => {
    console.log("[createLead] Novo lead recebido:", args);
    const leadId = await ctx.db.insert("leads", {
      ...args,
      status: "em_andamento",
    });
    console.log("[createLead] Lead criado com ID:", leadId);
    return leadId;
  },
});

export const updateLead = mutation({
  args: {
    leadId: v.id("leads"),
    enquadramentoCnpj: v.optional(v.string()),
    numeroCnpj: v.optional(v.string()),
    temCnpj: v.optional(v.boolean()),
    temPlanoAtual: v.optional(v.boolean()),
    nomePlanoAtual: v.optional(v.string()),
    valorPlanoAtual: v.optional(v.string()),
    maiorDificuldade: v.optional(v.string()),
    status: v.optional(v.string()),
    dadosEmpresa: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { leadId, ...updates } = args;
    console.log("[updateLead] Atualizando lead:", leadId, updates);
    await ctx.db.patch(leadId, updates);
    return leadId;
  },
});

export const getLead = query({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.leadId);
  },
});
