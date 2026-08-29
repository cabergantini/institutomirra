"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ListaDinamica } from "@/components/lista-dinamica";
import { Button } from "@/components/ui/button";
import { salvarNegociaveis } from "@/app/mapeamento/actions";

export function NegociaveisForm({
  negociaveisIniciais,
  inegociaveisIniciais,
}: {
  negociaveisIniciais: string[];
  inegociaveisIniciais: string[];
}) {
  const [negociaveis, setNegociaveis] = useState(negociaveisIniciais);
  const [inegociaveis, setInegociaveis] = useState(inegociaveisIniciais);
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  function salvarEContinuar() {
    setErro(null);
    startTransition(async () => {
      try {
        await salvarNegociaveis(negociaveis, inegociaveis);
        router.push("/mapeamento/rotina");
      } catch {
        setErro("Não foi possível salvar agora. Tente novamente.");
      }
    });
  }

  return (
    <div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <ListaDinamica
          titulo="Estou disposta a negociar"
          placeholder="Ex: cozinhar todos os dias"
          itens={negociaveis}
          onChange={setNegociaveis}
          corAccent="terracotta"
        />
        <ListaDinamica
          titulo="Não negocio de jeito nenhum"
          placeholder="Ex: dormir 8 horas por noite"
          itens={inegociaveis}
          onChange={setInegociaveis}
          corAccent="plum"
        />
      </div>

      {erro && <p className="mt-4 text-sm text-terracotta-dark">{erro}</p>}

      <div className="mt-8 flex justify-end">
        <Button onClick={salvarEContinuar} disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar e continuar"}
        </Button>
      </div>
    </div>
  );
}
