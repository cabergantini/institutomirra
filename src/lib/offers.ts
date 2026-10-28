import { supabase } from "@/lib/supabase"
import type { Lead, LeadObjectionCategory, Sale, SolutionOffer, SolutionOfferStatus } from "@/lib/supabase"

export const OFFER_STATUS_LABELS: Record<SolutionOfferStatus, string> = {
  active: "Ativa",
  closed: "Inativa",
}

export function formatBRL(value: number | null | undefined) {
  if (value === null || value === undefined) return "Sob consulta"
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

/** Texto curto para listas: "Lançamento — R$ 37,00". */
export function offerLabel(o: Pick<SolutionOffer, "name" | "price">) {
  return o.price === null ? o.name : `${o.name} — ${formatBRL(o.price)}`
}

export type OfferStats = {
  offer: SolutionOffer
  leads: number
  sales: number
  /** vendas ÷ leads; null quando ainda não há leads nessa oferta */
  conversion: number | null
  revenue: number
}

/** Leads (todos) e vendas (só as confirmadas) ligados a cada oferta. */
export function calcOfferStats(offers: SolutionOffer[], leads: Lead[], sales: Sale[]): OfferStats[] {
  return offers.map((offer) => {
    const l = leads.filter((x) => x.offer_id === offer.id).length
    const s = sales.filter((x) => x.offer_id === offer.id && x.status === "confirmed")
    return {
      offer,
      leads: l,
      sales: s.length,
      conversion: l > 0 ? s.length / l : null,
      revenue: s.reduce((sum, x) => sum + x.final_value, 0),
    }
  })
}

export type OfferObjectionCount = { category: LeadObjectionCategory; count: number }

/** Objeções registradas nos leads que receberam uma oferta, da mais citada para a menos citada. */
export async function loadOfferObjections(leadIds: string[]): Promise<OfferObjectionCount[]> {
  if (leadIds.length === 0) return []
  const { data } = await supabase.from("lead_objections").select("category").in("lead_id", leadIds)
  const counts = new Map<LeadObjectionCategory, number>()
  for (const row of (data as { category: LeadObjectionCategory }[]) ?? []) {
    counts.set(row.category, (counts.get(row.category) ?? 0) + 1)
  }
  return Array.from(counts, ([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count)
}
