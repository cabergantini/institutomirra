import Link from "next/link";
import { Logo } from "@/components/logo";
import { signOut } from "@/app/auth/actions";

export function AppHeader({ nome }: { nome?: string }) {
  return (
    <header className="flex items-center justify-between border-b border-line px-6 py-4 md:px-12">
      <Link href="/dashboard" className="text-plum">
        <Logo />
      </Link>
      <div className="flex items-center gap-4">
        {nome && (
          <span className="hidden text-sm text-ink-soft sm:inline">
            Olá, {nome.split(" ")[0]}
          </span>
        )}
        <form action={signOut}>
          <button
            type="submit"
            className="text-sm font-medium text-ink-soft hover:text-terracotta cursor-pointer"
          >
            Sair
          </button>
        </form>
      </div>
    </header>
  );
}
