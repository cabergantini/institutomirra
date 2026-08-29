import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { MapeamentoPdf } from "@/lib/pdf-document";
import type { Mapeamento } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticada." }, { status: 401 });
  }

  const { data: mapeamento } = await supabase
    .from("mapeamentos")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!mapeamento) {
    return NextResponse.json(
      { error: "Mapeamento não encontrado." },
      { status: 404 }
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nome_completo")
    .eq("id", user.id)
    .maybeSingle();

  const nomeAluna = profile?.nome_completo?.trim() || user.email || "Aluna";

  const buffer = await renderToBuffer(
    MapeamentoPdf({ mapeamento: mapeamento as Mapeamento, nomeAluna })
  );

  const nomeArquivo = `mapeamento-vida-apaixonante-${nomeAluna
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${nomeArquivo}"`,
    },
  });
}
