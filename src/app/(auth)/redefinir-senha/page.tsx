"use client";

import { useActionState } from "react";
import { updatePassword, type AuthState } from "@/app/auth/actions";
import { Label, Input } from "@/components/ui/field";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage } from "@/components/form-message";

const initialState: AuthState = {};

export default function RedefinirSenhaPage() {
  const [state, formAction] = useActionState(updatePassword, initialState);

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Nova senha</h1>
      <p className="mt-1 mb-6 text-sm text-ink-soft">
        Escolha uma nova senha para sua conta.
      </p>

      <form action={formAction} className="space-y-4">
        <FormMessage error={state.error} message={state.message} />

        <div>
          <Label htmlFor="password">Nova senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        <SubmitButton pendingText="Salvando...">Salvar nova senha</SubmitButton>
      </form>
    </div>
  );
}
