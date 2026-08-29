"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset, type AuthState } from "@/app/auth/actions";
import { Label, Input } from "@/components/ui/field";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage } from "@/components/form-message";

const initialState: AuthState = {};

export default function EsqueciSenhaPage() {
  const [state, formAction] = useActionState(requestPasswordReset, initialState);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Redefinir senha</h1>
      <p className="mt-1 mb-6 text-sm text-ink-soft">
        Informe seu e-mail e enviaremos um link para você criar uma nova senha.
      </p>

      <form action={formAction} className="space-y-4">
        <FormMessage error={state.error} message={state.message} />

        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>

        <SubmitButton pendingText="Enviando...">Enviar link</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-ink-soft">
        <Link href="/login" className="text-terracotta hover:underline">
          Voltar para o login
        </Link>
      </p>
    </div>
  );
}
