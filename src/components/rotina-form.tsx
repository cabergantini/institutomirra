"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { salvarRotina } from "@/app/mapeamento/actions";
import {
  DIAS_SEMANA,
  DIA_LABEL,
  PERIODOS,
  PERIODO_LABEL,
  type Rotina,
} from "@/lib/types";

export function RotinaForm({ rotinaInicial }: { rotinaInicial: Rotina }) {
  const [rotina, setRotina] = useState(rotinaInicial);
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  function atualizar(dia: (typeof DIAS_SEMANA)[number], periodo: (typeof PERIODOS)[number], valor: string) {
    setRotina((atual) => ({
      ...atual,
      [dia]: { ...atual[dia], [periodo]: valor },
    }));
  }

  function salvarEContinuar() {
    setErro(null);
    startTransition(async () => {
      try {
        await salvarRotina(rotina);
        router.push("/mapeamento/revisao");
      } catch {
        setErro("Não foi possível salvar agora. Tente novamente.");
      }
    });
  }

  return (
    <div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-28 border-b border-line bg-cream-soft px-4 py-3 text-left font-display font-normal text-ink">
                Dia
              </th>
              {PERIODOS.map((periodo) => (
                <th
                  key={periodo}
                  className="border-b border-l border-line bg-cream-soft px-4 py-3 text-left font-display font-normal text-ink"
                >
                  {PERIODO_LABEL[periodo]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DIAS_SEMANA.map((dia) => (
              <tr key={dia}>
                <th className="sticky left-0 z-10 border-b border-line bg-white px-4 py-3 text-left align-top font-medium text-ink">
                  {DIA_LABEL[dia]}
                </th>
                {PERIODOS.map((periodo) => (
                  <td
                    key={periodo}
                    className="border-b border-l border-line p-2 align-top"
                  >
                    <Textarea
                      value={rotina[dia][periodo]}
                      onChange={(e) => atualizar(dia, periodo, e.target.value)}
                      placeholder="O que você quer viver aqui?"
                      rows={3}
                      className="min-w-[180px] resize-none bg-cream-soft/40"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {erro && <p className="mt-4 text-sm text-terracotta-dark">{erro}</p>}

      <div className="mt-8 flex justify-between">
        <Button variant="secondary" onClick={() => router.push("/mapeamento/negociaveis")}>
          Voltar
        </Button>
        <Button onClick={salvarEContinuar} disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar e continuar"}
        </Button>
      </div>
    </div>
  );
}
