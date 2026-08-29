import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { rotinaVazia, type Mapeamento } from "@/lib/types";

export async function getOrCreateMapeamento(
  supabase: SupabaseClient,
  userId: string
): Promise<Mapeamento> {
  const { data: existing } = await supabase
    .from("mapeamentos")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) return existing as Mapeamento;

  const { data: created, error } = await supabase
    .from("mapeamentos")
    .insert({
      user_id: userId,
      negociaveis: [],
      inegociaveis: [],
      rotina: rotinaVazia(),
    })
    .select("*")
    .single();

  if (error || !created) {
    throw new Error(error?.message ?? "Não foi possível criar o mapeamento.");
  }

  return created as Mapeamento;
}

export function calcularProgresso(mapeamento: Mapeamento): number {
  let etapas = 0;
  let concluidas = 0;

  etapas += 1;
  if (mapeamento.negociaveis.length > 0 || mapeamento.inegociaveis.length > 0) {
    concluidas += 1;
  }

  etapas += 1;
  const blocosPreenchidos = Object.values(mapeamento.rotina).reduce(
    (total, dia) =>
      total + Object.values(dia).filter((v) => v.trim().length > 0).length,
    0
  );
  if (blocosPreenchidos > 0) concluidas += 1;

  return Math.round((concluidas / etapas) * 100);
}
