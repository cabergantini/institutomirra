// Mapa psicológico de UMA solução (dores, dúvidas, desejos e objeções), gerado pela Mi.
// Usa a função "mi-chat" (proxy do Gemini) só como gerador de texto, sem ferramentas.

import { supabase } from "@/lib/supabase"
import type { SolutionOffer } from "@/lib/supabase"
import type { EstruturaNegocio } from "@/lib/mentoring-tools/monetiza"

export type Psych = { pains: string[]; doubts: string[]; desires: string[]; objections: string[] }

export const emptyPsych = (): Psych => ({ pains: [], doubts: [], desires: [], objections: [] })

export type PsychContext = {
  nome: string
  tipo: string
  descricao: string
  preco: string
  promessa: string
  problemaPrincipal: string
  transformacao: string
  formato: string
  duracao: string
  publico: string | null
  ofertas: Pick<SolutionOffer, "name" | "price" | "includes" | "deliverables" | "promised_result" | "time_to_result" | "why_buy" | "why_not_buy">[]
  estrutura: EstruturaNegocio
}

const SYSTEM = `Você é a Mi, estrategista de negócios digitais do Instituto Mirra.
Sua tarefa: montar o mapa psicológico do cliente para UMA solução específica, com dores, dúvidas, desejos e objeções.

Regras:
- Escreva do ponto de vista do cliente, em português do Brasil, com frases curtas e concretas (no máximo 100 caracteres cada).
- De 4 a 6 itens por lista. Sem repetir ideias entre as listas.
- Dores: o que incomoda o cliente hoje. Dúvidas: o que ele pergunta antes de comprar. Desejos: o que ele quer alcançar. Objeções: motivos para não comprar agora.
- Use SOMENTE o que está nos dados informados. Não invente resultados, números, depoimentos ou fatos sobre a empresa. Se houver pouca informação, formule hipóteses prudentes.
- Aproveite os campos "por que compraria" e "por que não compraria" das ofertas para desejos e objeções.
- Responda APENAS com um JSON válido, sem texto antes ou depois e sem markdown, neste formato exato:
{"pains":["..."],"doubts":["..."],"desires":["..."],"objections":["..."]}`

const linha = (rotulo: string, valor: string | null | undefined) => (valor && valor.trim() ? `${rotulo}: ${valor.trim()}\n` : "")

function montarPrompt(c: PsychContext): string {
  let t = "DADOS DA SOLUÇÃO\n"
  t += linha("Nome", c.nome) + linha("Tipo", c.tipo) + linha("Descrição", c.descricao) + linha("Preço", c.preco)
  t += linha("Promessa", c.promessa) + linha("Problema principal que resolve", c.problemaPrincipal)
  t += linha("Transformação desejada", c.transformacao) + linha("Formato de entrega", c.formato) + linha("Duração", c.duracao)
  t += linha("Público", c.publico)
  if (c.ofertas.length > 0) {
    t += "\nOFERTAS JÁ CADASTRADAS\n"
    c.ofertas.forEach((o, i) => {
      t += `Oferta ${i + 1}: ${o.name}${o.price !== null ? ` (R$ ${o.price})` : ""}\n`
      t += linha("  Incluso", o.deliverables?.length ? o.deliverables.join("; ") : o.includes) + linha("  Resultado prometido", o.promised_result) + linha("  Tempo para sentir resultado", o.time_to_result)
      t += linha("  Por que compraria", o.why_buy) + linha("  Por que não compraria", o.why_not_buy)
    })
  }
  const e = c.estrutura
  const estrutura =
    linha("O que a empresa vende", e.o_que_vende) +
    linha("Para quem vende", e.para_quem_vende) +
    linha("Posicionamento", e.posicionamento) +
    linha("Dores, dúvidas e desejos do público (visão geral do negócio)", e.dores_duvidas_desejos) +
    linha("Proposta de valor", e.proposta_valor)
  if (estrutura) t += `\nESTRUTURA DO NEGÓCIO (contexto geral)\n${estrutura}`
  return t
}

const limpa = (v: unknown): string[] =>
  Array.isArray(v)
    ? v
        .filter((x): x is string => typeof x === "string")
        .map((x) => x.trim().replace(/^[-•*\d.\s]+/, "").slice(0, 160))
        .filter(Boolean)
        .slice(0, 8)
    : []

/** Extrai o JSON da resposta, mesmo que venha com cercas de markdown ou texto em volta. */
export function lerPsych(texto: string): Psych | null {
  const ini = texto.indexOf("{")
  const fim = texto.lastIndexOf("}")
  if (ini < 0 || fim <= ini) return null
  try {
    const j = JSON.parse(texto.slice(ini, fim + 1)) as Record<string, unknown>
    const p = { pains: limpa(j.pains), doubts: limpa(j.doubts), desires: limpa(j.desires), objections: limpa(j.objections) }
    const total = p.pains.length + p.doubts.length + p.desires.length + p.objections.length
    return total >= 4 ? p : null
  } catch {
    return null
  }
}

export type PsychResult = { ok: true; psych: Psych } | { ok: false; message: string }

export async function gerarMapaPsicologico(ctx: PsychContext): Promise<PsychResult> {
  const { data, error } = await supabase.functions.invoke("mi-chat", {
    body: {
      systemInstruction: SYSTEM,
      contents: [{ role: "user", parts: [{ text: montarPrompt(ctx) }] }],
    },
  })
  if (error || data?.error) {
    // Erros HTTP da função chegam em error.context (a resposta original) com { error } da Google.
    let status = 0
    let detalhe = typeof data?.error === "string" ? data.error : ""
    try {
      const ctx = (error as { context?: Response } | null)?.context
      if (ctx) {
        status = ctx.status
        const body = await ctx.json()
        if (typeof body?.error === "string") detalhe = body.error
      }
    } catch {
      /* segue com o que já temos */
    }
    if (status === 429 || /quota|rate|exhausted/i.test(detalhe)) {
      return { ok: false, message: "O limite de uso da IA foi atingido por agora. Tente de novo em alguns minutos." }
    }
    if (status === 503 || /overloaded|unavailable|sobrecarreg/i.test(detalhe)) {
      return { ok: false, message: "A IA está sobrecarregada neste momento. Tente de novo em instantes." }
    }
    if (status === 404 || /not found|model/i.test(detalhe)) {
      return { ok: false, message: "A Mi está com o modelo de IA indisponível. Avise a administração do app." }
    }
    if (status === 401 || status === 403) {
      return { ok: false, message: "Sua sessão expirou. Saia e entre de novo no app." }
    }
    return { ok: false, message: "A Mi não conseguiu responder agora. Tente de novo em alguns instantes." }
  }
  const parts: { text?: string }[] = data?.candidates?.[0]?.content?.parts ?? []
  const texto = parts.map((p) => p.text ?? "").join("")
  const psych = lerPsych(texto)
  if (!psych) return { ok: false, message: "A Mi não conseguiu montar uma resposta boa desta vez. Tente de novo." }
  return { ok: true, psych }
}
