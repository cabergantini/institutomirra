import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { Button, TextField } from '../components/ui'

export function LoginPage() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!isSupabaseConfigured) {
    return (
      <div className="parchment flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md rounded-lg border border-amber-900/20 bg-white/80 p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-amber-950">Supabase não configurado</h1>
          <p className="mt-2 text-sm text-stone-600">
            Defina <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> no arquivo <code>.env</code> (veja{' '}
            <code>.env.example</code> e <code>supabase/schema.sql</code>) para habilitar login e contas.
          </p>
        </div>
      </div>
    )
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setBusy(true)
    if (mode === 'signin') {
      const { error } = await signIn(email, password)
      if (error) setError(error)
    } else {
      const { error } = await signUp(email, password, displayName)
      if (error) setError(error)
      else setInfo('Conta criada. Se a confirmação por e-mail estiver ativa, verifique sua caixa de entrada antes de entrar.')
    }
    setBusy(false)
  }

  return (
    <div className="parchment flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-lg border border-amber-900/20 bg-white/80 p-6 shadow-sm">
        <h1 className="text-center text-2xl font-bold tracking-wide text-amber-950">Ficha GURPS Fantasy</h1>
        <p className="mt-1 text-center text-sm text-stone-600">
          {mode === 'signin' ? 'Entre com sua conta de campanha.' : 'Crie sua conta de jogador.'}
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {mode === 'signup' && (
            <TextField label="Nome de exibição" value={displayName} onChange={setDisplayName} placeholder="Como o narrador vai te ver" />
          )}
          <TextField label="E-mail" value={email} onChange={setEmail} placeholder="voce@exemplo.com" />
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-stone-600">Senha</span>
            <input
              type="password"
              required
              minLength={6}
              className="w-full rounded border border-stone-400 bg-white px-2 py-1 focus:border-amber-700 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>

        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        {info && <p className="mt-3 text-sm text-emerald-700">{info}</p>}

        <Button type="submit" className="mt-4 w-full justify-center" variant="default">
          {busy ? 'Aguarde...' : mode === 'signin' ? 'Entrar' : 'Criar conta'}
        </Button>

        <button
          type="button"
          className="mt-3 w-full text-center text-sm text-amber-900 hover:underline"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError(null)
            setInfo(null)
          }}
        >
          {mode === 'signin' ? 'Não tem conta? Criar uma' : 'Já tem conta? Entrar'}
        </button>
      </form>
    </div>
  )
}
