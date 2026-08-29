"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AuthState {
  error?: string;
  message?: string;
}

export async function signIn(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/dashboard");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "E-mail ou senha incorretos." };
  }

  redirect(redirectTo || "/dashboard");
}

export async function signUp(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (password.length < 6) {
    return { error: "A senha precisa ter pelo menos 6 caracteres." };
  }

  const supabase = await createClient();
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nome_completo: nome } },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "Este e-mail já está cadastrado. Faça login." };
    }
    return { error: "Não foi possível criar sua conta. Tente novamente." };
  }

  if (!data.session) {
    return {
      message:
        "Cadastro realizado! Verifique seu e-mail para confirmar a conta antes de entrar.",
    };
  }

  redirect("/dashboard");
}

export async function requestPasswordReset(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/redefinir-senha`,
  });

  return {
    message:
      "Se esse e-mail estiver cadastrado, enviamos um link para redefinir a senha.",
  };
}

export async function updatePassword(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");

  if (password.length < 6) {
    return { error: "A senha precisa ter pelo menos 6 caracteres." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "Não foi possível atualizar sua senha. Tente novamente." };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
