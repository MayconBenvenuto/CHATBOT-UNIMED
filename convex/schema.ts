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
    temFuncionarios: v.optional(v.boolean()),
    temPlanoAtual: v.optional(v.boolean()),
    nomePlanoAtual: v.optional(v.string()),
    valorPlanoAtual: v.optional(v.string()),
    maiorDificuldade: v.optional(v.string()),
    status: v.string(), // "em_andamento", "completo", "enviado"
    
    // --- MUDANÇA AQUI ---
    // Adicionamos um campo para armazenar os dados da empresa validados pela API.
    // Usamos v.any() por simplicidade, pois a resposta da API pode ter muitos campos.
    dadosEmpresa: v.optional(v.any()),
  })
  // Sugestão: Adicione índices para consultas futuras
  // .index('by_email', ['email'])
  // .index('by_numeroCnpj', ['numeroCnpj'])
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
