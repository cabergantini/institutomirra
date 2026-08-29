import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Entrar</h1>
      <p className="mt-1 mb-6 text-sm text-ink-soft">
        Acesse o Mapeamento de Vida Apaixonante.
      </p>

      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
