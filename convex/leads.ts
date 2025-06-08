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
    const leadId = await ctx.db.insert("leads", {
      ...args,
      status: "em_andamento",
    });
    return leadId;
  },
});

export const updateLead = mutation({
  args: {
    leadId: v.id("leads"),
    enquadramentoCnpj: v.optional(v.string()),
    numeroCnpj: v.optional(v.string()),
    temPlanoAtual: v.optional(v.boolean()),
    nomePlanoAtual: v.optional(v.string()),
    valorPlanoAtual: v.optional(v.string()),
    maiorDificuldade: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { leadId, ...updates } = args;
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
