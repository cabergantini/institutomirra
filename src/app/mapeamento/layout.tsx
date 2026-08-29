import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";
import { StepNav } from "@/components/step-nav";

export default async function MapeamentoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("nome_completo")
    .eq("id", user!.id)
    .maybeSingle();

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <AppHeader nome={profile?.nome_completo} />
      <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 md:px-0">
        <StepNav />
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
