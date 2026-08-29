import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink">
      <header className="flex items-center justify-between px-6 py-6 md:px-12">
        <Logo />
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-ink-soft hover:text-ink"
          >
            Entrar
          </Link>
          <Link href="/cadastro">
            <Button>Começar</Button>
          </Link>
        </nav>
      </header>

      <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16 text-center md:px-12">
        <span className="mb-4 rounded-full bg-plum/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-plum">
          Mentoria Bússola
        </span>
        <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">
          Mapeamento de Vida Apaixonante
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ink-soft">
          Antes de desenhar o negócio, desenhe a vida. Nesta ferramenta você
          define como quer viver sua vida pessoal no futuro — e, a partir
          dela, entende que estrutura de negócio precisa construir para
          servir essa vida apaixonante.
        </p>

        <div className="mt-10 grid gap-4 text-left sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="font-display text-lg text-ink">
              Negociáveis &amp; Inegociáveis
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              O que você está disposta a negociar nas suas tarefas e rotinas
              — e o que não abre mão de jeito nenhum.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="font-display text-lg text-ink">
              Rotina da vida apaixonante
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Uma semana inteira, manhã, tarde e noite: como você quer viver
              cada bloco do seu dia.
            </p>
          </div>
        </div>

        <Link href="/cadastro" className="mt-10">
          <Button className="px-8 py-3 text-base">
            Iniciar meu mapeamento
          </Button>
        </Link>
      </main>

      <footer className="px-6 py-8 text-center text-xs text-ink-soft/70 md:px-12">
        Instituto Mirra — Mentoria Bússola
      </footer>
    </div>
  );
}
