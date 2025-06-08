import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  leads: defineTable({
    nome: v.string(),
    whatsapp: v.string(),
    email: v.string(),
    temCnpj: v.boolean(),
    enquadramentoCnpj: v.optional(v.string()),
    numeroCnpj: v.optional(v.string()),
    temPlanoAtual: v.optional(v.boolean()),
    nomePlanoAtual: v.optional(v.string()),
    valorPlanoAtual: v.optional(v.string()),
    maiorDificuldade: v.optional(v.string()),
    status: v.string(), // "em_andamento", "completo", "enviado"
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
