import { createClient } from "@/lib/supabase/server";
import { getOrCreateMapeamento } from "@/lib/mapeamento";
import {
  DIAS_SEMANA,
  DIA_LABEL,
  PERIODOS,
  PERIODO_LABEL,
} from "@/lib/types";
import { RevisaoActions } from "@/components/revisao-actions";

export default async function RevisaoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const mapeamento = await getOrCreateMapeamento(supabase, user!.id);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Revisão</h1>
      <p className="mt-2 max-w-xl text-ink-soft">
        Confira tudo antes de gerar seu PDF. Você pode voltar e editar
        qualquer etapa a qualquer momento.
      </p>

      <section className="mt-8 rounded-2xl border border-line bg-white p-6">
        <h2 className="font-display text-lg text-ink">
          Negociáveis &amp; Inegociáveis
        </h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-terracotta">
              Estou disposta a negociar
            </h3>
            {mapeamento.negociaveis.length === 0 ? (
              <p className="mt-2 text-sm italic text-ink-soft/70">
                Nenhum item registrado.
              </p>
            ) : (
              <ul className="mt-2 space-y-1.5 text-sm text-ink">
                {mapeamento.negociaveis.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-plum">
              Não negocio de jeito nenhum
            </h3>
            {mapeamento.inegociaveis.length === 0 ? (
              <p className="mt-2 text-sm italic text-ink-soft/70">
                Nenhum item registrado.
              </p>
            ) : (
              <ul className="mt-2 space-y-1.5 text-sm text-ink">
                {mapeamento.inegociaveis.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-plum" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-line bg-white p-6">
        <h2 className="font-display text-lg text-ink">
          Rotina da vida apaixonante
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-28 border-b border-line px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-ink-soft">
                  Dia
                </th>
                {PERIODOS.map((p) => (
                  <th
                    key={p}
                    className="border-b border-l border-line px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-ink-soft"
                  >
                    {PERIODO_LABEL[p]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DIAS_SEMANA.map((dia) => (
                <tr key={dia}>
                  <th className="border-b border-line px-3 py-2 text-left align-top font-medium text-ink">
                    {DIA_LABEL[dia]}
                  </th>
                  {PERIODOS.map((p) => (
                    <td
                      key={p}
                      className="border-b border-l border-line px-3 py-2 align-top text-ink-soft"
                    >
                      {mapeamento.rotina[dia]?.[p]?.trim() || "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <RevisaoActions />
    </div>
  );
}
