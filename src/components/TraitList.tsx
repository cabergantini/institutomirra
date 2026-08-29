import { nanoid } from 'nanoid'
import type { Trait } from '../gurps/types'
import { Button, IconButton } from './ui'

export function TraitList({
  title,
  traits,
  onChange,
  pointsHint,
  addLabel,
}: {
  title: string
  traits: Trait[]
  onChange: (traits: Trait[]) => void
  pointsHint: string
  addLabel: string
}) {
  const total = traits.reduce((sum, t) => sum + t.points, 0)

  function add() {
    onChange([...traits, { id: nanoid(), name: '', points: 0 }])
  }

  function update(id: string, patch: Partial<Trait>) {
    onChange(traits.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }

  function remove(id: string) {
    onChange(traits.filter((t) => t.id !== id))
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-700">{title}</h3>
        <span className="text-sm font-semibold tabular-nums text-amber-900">
          {total >= 0 ? '+' : ''}
          {total} pts
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {traits.map((t) => (
          <div key={t.id} className="flex items-center gap-2">
            <input
              className="min-w-0 flex-1 rounded border border-stone-300 bg-white px-2 py-1 text-sm"
              placeholder={addLabel}
              value={t.name}
              onChange={(e) => update(t.id, { name: e.target.value })}
            />
            <input
              type="number"
              className="w-16 rounded border border-stone-300 bg-white px-1 py-1 text-right text-sm tabular-nums"
              value={t.points}
              title={pointsHint}
              onChange={(e) => update(t.id, { points: e.target.valueAsNumber || 0 })}
            />
            <IconButton title="Remover" onClick={() => remove(t.id)}>
              ✕
            </IconButton>
          </div>
        ))}
        {traits.length === 0 && <p className="text-sm italic text-stone-400">Nenhum item.</p>}
      </div>
      <Button variant="ghost" onClick={add} className="mt-2">
        + Adicionar
      </Button>
    </div>
  )
}
