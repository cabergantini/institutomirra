"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { marcarConcluido } from "@/app/mapeamento/actions";

export function RevisaoActions() {
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  function concluirEBaixar() {
    setErro(null);
    startTransition(async () => {
      try {
        await marcarConcluido();
        // Full navigation on purpose: /api/pdf streams a file download,
        // not an app route, so router.push() doesn't apply here.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/api/pdf";
      } catch {
        setErro("Não foi possível gerar o PDF agora. Tente novamente.");
      }
    });
  }

  return (
    <div className="mt-8">
      {erro && <p className="mb-4 text-sm text-terracotta-dark">{erro}</p>}
      <div className="flex flex-col justify-between gap-3 sm:flex-row">
        <Button variant="secondary" onClick={() => router.push("/mapeamento/rotina")}>
          Voltar e editar
        </Button>
        <Button onClick={concluirEBaixar} disabled={isPending}>
          <FileDown size={16} />
          {isPending ? "Gerando PDF..." : "Concluir e baixar PDF"}
        </Button>
      </div>
    </div>
  );
}
