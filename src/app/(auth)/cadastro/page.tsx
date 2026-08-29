"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type AuthState } from "@/app/auth/actions";
import { Label, Input } from "@/components/ui/field";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage } from "@/components/form-message";

const initialState: AuthState = {};

export default function CadastroPage() {
  const [state, formAction] = useActionState(signUp, initialState);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Criar conta</h1>
      <p className="mt-1 mb-6 text-sm text-ink-soft">
        Comece o seu Mapeamento de Vida Apaixonante.
      </p>

      <form action={formAction} className="space-y-4">
        <FormMessage error={state.error} message={state.message} />

        <div>
          <Label htmlFor="nome">Nome completo</Label>
          <Input id="nome" name="nome" type="text" required autoComplete="name" />
        </div>

        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>

        <div>
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        <SubmitButton pendingText="Criando conta...">Criar conta</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Já tem conta?{" "}
        <Link href="/login" className="text-terracotta hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
