"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Rotina } from "@/lib/types";

async function requireUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticada.");
  return { supabase, userId: user.id };
}

export async function salvarNegociaveis(
  negociaveis: string[],
  inegociaveis: string[]
) {
  const { supabase, userId } = await requireUserId();

  const { error } = await supabase
    .from("mapeamentos")
    .update({ negociaveis, inegociaveis })
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  revalidatePath("/mapeamento");
  revalidatePath("/dashboard");
}

export async function salvarRotina(rotina: Rotina) {
  const { supabase, userId } = await requireUserId();

  const { error } = await supabase
    .from("mapeamentos")
    .update({ rotina })
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  revalidatePath("/mapeamento");
  revalidatePath("/dashboard");
}

export async function marcarConcluido() {
  const { supabase, userId } = await requireUserId();

  const { error } = await supabase
    .from("mapeamentos")
    .update({ status: "concluido" })
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  revalidatePath("/mapeamento");
  revalidatePath("/dashboard");
}
