import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateMapeamento, calcularProgresso } from "@/lib/mapeamento";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("nome_completo")
    .eq("id", user!.id)
    .maybeSingle();

  const mapeamento = await getOrCreateMapeamento(supabase, user!.id);
  const progresso = calcularProgresso(mapeamento);
  const iniciado = progresso > 0;

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <AppHeader nome={profile?.nome_completo} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 md:px-0">
        <span className="text-xs font-medium uppercase tracking-widest text-plum">
          Mentoria Bússola
        </span>
        <h1 className="mt-2 font-display text-3xl text-ink">
          Mapeamento de Vida Apaixonante
        </h1>
        <p className="mt-3 max-w-xl text-ink-soft">
          Desenhe primeiro como quer que a sua vida pessoal seja no futuro.
          Depois, use esse desenho para entender a estrutura de negócio que
          serve a essa vida.
        </p>

        <div className="mt-10 rounded-2xl border border-line bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-ink">Seu progresso</h2>
            <span className="text-sm font-medium text-terracotta">
              {progresso}%
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-cream-soft">
            <div
              className="h-full rounded-full bg-terracotta transition-all"
              style={{ width: `${progresso}%` }}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/mapeamento/negociaveis" className="flex-1">
              <Button className="w-full">
                {iniciado ? "Continuar mapeamento" : "Iniciar mapeamento"}
              </Button>
            </Link>
            {progresso === 100 && (
              <Link href="/mapeamento/revisao" className="flex-1">
                <Button variant="secondary" className="w-full">
                  Revisar e gerar PDF
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-6">
            <h3 className="font-display text-base text-ink">
              1. Negociáveis &amp; Inegociáveis
            </h3>
            <p className="mt-1.5 text-sm text-ink-soft">
              {mapeamento.negociaveis.length + mapeamento.inegociaveis.length >
              0
                ? "Preenchido — você pode revisar a qualquer momento."
                : "Ainda não preenchido."}
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-6">
            <h3 className="font-display text-base text-ink">
              2. Rotina da vida apaixonante
            </h3>
            <p className="mt-1.5 text-sm text-ink-soft">
              {Object.values(mapeamento.rotina).some((dia) =>
                Object.values(dia).some((v) => v.trim())
              )
                ? "Preenchido — você pode revisar a qualquer momento."
                : "Ainda não preenchido."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
