import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { pointsSummary } from '../gurps/calculations'
import type { Character } from '../gurps/types'
import { useCharacterStore } from '../store/characterStore'
import { Button } from '../components/ui'

export function CharacterListPage() {
  const { profile, signOut } = useAuth()
  const characters = useCharacterStore((s) => s.characters)
  const loading = useCharacterStore((s) => s.loading)
  const error = useCharacterStore((s) => s.error)
  const fetchAll = useCharacterStore((s) => s.fetchAll)
  const createCharacter = useCharacterStore((s) => s.createCharacter)
  const duplicateCharacter = useCharacterStore((s) => s.duplicateCharacter)
  const deleteCharacter = useCharacterStore((s) => s.deleteCharacter)
  const importCharacter = useCharacterStore((s) => s.importCharacter)
  const grantXp = useCharacterStore((s) => s.grantXp)
  const navigate = useNavigate()
  const [xpFormId, setXpFormId] = useState<string | null>(null)

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  if (!profile) return null

  const isNarrador = profile.role === 'narrador'

  async function handleCreate() {
    const c = await createCharacter(profile!.id)
    navigate(`/ficha/${c.id}`)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result))
        importCharacter(profile!.id, data)
      } catch {
        alert('Arquivo inválido. Selecione um JSON de ficha exportado por este app.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="parchment min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex w-full items-center justify-between">
            <span className="text-sm text-stone-600">
              {profile.displayName || profile.email} ·{' '}
              <span className="font-semibold text-amber-900">{isNarrador ? 'Narrador' : 'Jogador'}</span>
            </span>
            <button onClick={() => signOut()} className="text-sm font-medium text-amber-900 hover:underline">
              Sair
            </button>
          </div>
          <h1 className="text-4xl font-bold tracking-wide text-amber-950">Fichas de GURPS Fantasy</h1>
          <p className="mt-1 text-stone-600">
            {isNarrador ? 'Todas as fichas da campanha.' : 'Suas fichas de personagem, com cálculos automáticos.'}
          </p>
        </header>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleCreate}
            className="rounded bg-amber-800 px-4 py-2 font-medium text-amber-50 hover:bg-amber-900"
          >
            + Nova Ficha
          </button>
          <label className="cursor-pointer rounded border border-amber-900/30 px-4 py-2 font-medium text-amber-900 hover:bg-amber-900/10">
            Importar JSON
            <input type="file" accept="application/json" className="hidden" onChange={handleImport} />
          </label>
        </div>

        {error && <p className="mb-4 text-center text-sm text-red-700">{error}</p>}
        {loading && characters.length === 0 ? (
          <p className="text-center text-stone-500">Carregando fichas…</p>
        ) : characters.length === 0 ? (
          <p className="text-center italic text-stone-500">Nenhuma ficha ainda. Crie a primeira acima.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {characters.map((c) => (
              <CharacterCard
                key={c.id}
                character={c}
                isNarrador={isNarrador}
                isOwner={c.ownerId === profile.id}
                xpOpen={xpFormId === c.id}
                onOpenXp={() => setXpFormId(xpFormId === c.id ? null : c.id)}
                onGrantXp={async (amount, reason) => {
                  await grantXp(c.id, profile.id, amount, reason)
                  setXpFormId(null)
                }}
                onOpen={() => navigate(`/ficha/${c.id}`)}
                onDuplicate={() => duplicateCharacter(c.id)}
                onDelete={() => {
                  if (confirm(`Excluir a ficha "${c.name}"? Essa ação não pode ser desfeita.`)) deleteCharacter(c.id)
                }}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function CharacterCard({
  character: c,
  isNarrador,
  isOwner,
  xpOpen,
  onOpenXp,
  onGrantXp,
  onOpen,
  onDuplicate,
  onDelete,
}: {
  character: Character
  isNarrador: boolean
  isOwner: boolean
  xpOpen: boolean
  onOpenXp: () => void
  onGrantXp: (amount: number, reason: string) => void
  onOpen: () => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  const summary = pointsSummary(c)
  const [amount, setAmount] = useState(5)
  const [reason, setReason] = useState('')

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-amber-900/20 bg-white/70 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="cursor-pointer" onClick={onOpen}>
          <p className="text-lg font-semibold text-amber-950">{c.name || 'Sem nome'}</p>
          <p className="text-sm text-stone-500">
            {c.race || 'Raça não definida'} · {summary.total}/{summary.available} pts
            {!isOwner && isNarrador && c.player ? ` · Jogador: ${c.player}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={onOpen}>
            Abrir
          </Button>
          {isOwner && (
            <Button variant="ghost" onClick={onDuplicate}>
              Duplicar
            </Button>
          )}
          {isNarrador && (
            <Button variant="ghost" onClick={onOpenXp}>
              Conceder XP
            </Button>
          )}
          {(isOwner || isNarrador) && (
            <Button variant="danger" onClick={onDelete}>
              Excluir
            </Button>
          )}
        </div>
      </div>

      {xpOpen && (
        <div className="flex flex-wrap items-end gap-2 rounded border border-amber-900/20 bg-amber-50 p-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-stone-600">Pontos</span>
            <input
              type="number"
              className="w-24 rounded border border-stone-400 bg-white px-2 py-1 text-right"
              value={amount}
              onChange={(e) => setAmount(e.target.valueAsNumber || 0)}
            />
          </label>
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-stone-600">Motivo (opcional)</span>
            <input
              type="text"
              className="w-full rounded border border-stone-400 bg-white px-2 py-1"
              value={reason}
              placeholder="Fim da sessão 12, ..."
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
          <Button onClick={() => onGrantXp(amount, reason)}>Confirmar</Button>
        </div>
      )}
    </li>
  )
}
