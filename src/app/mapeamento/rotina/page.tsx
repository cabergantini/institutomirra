import { createClient } from "@/lib/supabase/server";
import { getOrCreateMapeamento } from "@/lib/mapeamento";
import { RotinaForm } from "@/components/rotina-form";

export default async function RotinaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const mapeamento = await getOrCreateMapeamento(supabase, user!.id);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">
        Rotina da vida apaixonante
      </h1>
      <p className="mt-2 max-w-xl text-ink-soft">
        Para cada dia da semana, escreva o que você quer viver em cada
        bloco: as atividades, ações e tarefas que fazem parte da sua rotina
        na vida apaixonante que você está desenhando.
      </p>

      <RotinaForm rotinaInicial={mapeamento.rotina} />
    </div>
  );
}
