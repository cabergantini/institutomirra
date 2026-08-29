"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn, type AuthState } from "@/app/auth/actions";
import { Label, Input } from "@/components/ui/field";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage } from "@/components/form-message";

const initialState: AuthState = {};

export function LoginForm() {
  const [state, formAction] = useActionState(signIn, initialState);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  return (
    <>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <FormMessage error={state.error} message={state.message} />

        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link
              href="/esqueci-senha"
              className="mb-1.5 text-xs text-terracotta hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>

        <SubmitButton pendingText="Entrando...">Entrar</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="text-terracotta hover:underline">
          Cadastre-se
        </Link>
      </p>
    </>
  );
}
