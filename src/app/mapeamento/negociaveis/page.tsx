import { createClient } from "@/lib/supabase/server";
import { getOrCreateMapeamento } from "@/lib/mapeamento";
import { NegociaveisForm } from "@/components/negociaveis-form";

export default async function NegociaveisPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const mapeamento = await getOrCreateMapeamento(supabase, user!.id);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">
        Negociáveis &amp; Inegociáveis
      </h1>
      <p className="mt-2 max-w-xl text-ink-soft">
        Pense nas tarefas, rotinas e situações do dia a dia da sua vida
        pessoal. O que você está disposta a negociar (delegar, ajustar,
        abrir mão em algumas semanas) e o que não negocia de jeito nenhum,
        porque sustenta a vida apaixonante que você quer viver?
      </p>

      <NegociaveisForm
        negociaveisIniciais={mapeamento.negociaveis}
        inegociaveisIniciais={mapeamento.inegociaveis}
      />
    </div>
  );
}
