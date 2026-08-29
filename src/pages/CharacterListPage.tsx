import { useNavigate } from 'react-router-dom'
import { pointsSummary } from '../gurps/calculations'
import { useCharacterStore } from '../store/characterStore'

export function CharacterListPage() {
  const characters = useCharacterStore((s) => s.characters)
  const createCharacter = useCharacterStore((s) => s.createCharacter)
  const duplicateCharacter = useCharacterStore((s) => s.duplicateCharacter)
  const deleteCharacter = useCharacterStore((s) => s.deleteCharacter)
  const importCharacter = useCharacterStore((s) => s.importCharacter)
  const navigate = useNavigate()

  function handleCreate() {
    const c = createCharacter()
    navigate(`/ficha/${c.id}`)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result))
        importCharacter(data)
      } catch {
        alert('Arquivo inválido. Selecione um JSON de ficha exportado por este app.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-wide text-amber-950">Fichas de GURPS Fantasy</h1>
        <p className="mt-1 text-stone-600">Crie e gerencie fichas de personagem com cálculos automáticos.</p>
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

      {characters.length === 0 ? (
        <p className="text-center italic text-stone-500">Nenhuma ficha ainda. Crie a primeira acima.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {characters.map((c) => {
            const summary = pointsSummary(c)
            return (
              <li
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-900/20 bg-white/70 p-4 shadow-sm"
              >
                <div className="cursor-pointer" onClick={() => navigate(`/ficha/${c.id}`)}>
                  <p className="text-lg font-semibold text-amber-950">{c.name || 'Sem nome'}</p>
                  <p className="text-sm text-stone-500">
                    {c.race || 'Raça não definida'} · {summary.total}/{summary.available} pts
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/ficha/${c.id}`)}
                    className="rounded border border-amber-900/30 px-3 py-1.5 text-sm text-amber-900 hover:bg-amber-900/10"
                  >
                    Abrir
                  </button>
                  <button
                    onClick={() => duplicateCharacter(c.id)}
                    className="rounded border border-amber-900/30 px-3 py-1.5 text-sm text-amber-900 hover:bg-amber-900/10"
                  >
                    Duplicar
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Excluir a ficha "${c.name}"? Essa ação não pode ser desfeita.`)) {
                        deleteCharacter(c.id)
                      }
                    }}
                    className="rounded border border-red-700/30 px-3 py-1.5 text-sm text-red-700 hover:bg-red-700/10"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
