import { nanoid } from 'nanoid'
import { computeSpellLevel, spellCost } from '../gurps/calculations'
import type { Character, Difficulty, Spell } from '../gurps/types'
import { Button, IconButton, Panel } from './ui'

const DIFF_OPTIONS: Difficulty[] = ['H', 'VH']

export function SpellsPanel({ character, onChange }: { character: Character; onChange: (spells: Spell[]) => void }) {
  const spells = character.spells

  function add() {
    onChange([...spells, { id: nanoid(), name: '', college: '', difficulty: 'VH', points: 1 }])
  }
  function update(id: string, patch: Partial<Spell>) {
    onChange(spells.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }
  function remove(id: string) {
    onChange(spells.filter((s) => s.id !== id))
  }

  return (
    <Panel title="Magias">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-stone-300 text-left text-[11px] uppercase tracking-wide text-stone-500">
              <th className="py-1 pr-2">Magia</th>
              <th className="px-2 py-1">Colégio</th>
              <th className="px-2 py-1">Dif.</th>
              <th className="px-2 py-1 text-right">Pontos</th>
              <th className="px-2 py-1 text-right">NH</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {spells.map((s) => (
              <tr key={s.id} className="border-b border-stone-100">
                <td className="py-1 pr-2">
                  <input
                    className="w-full rounded border border-stone-300 bg-white px-2 py-1"
                    value={s.name}
                    placeholder="Nome da magia"
                    onChange={(e) => update(s.id, { name: e.target.value })}
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    className="w-28 rounded border border-stone-300 bg-white px-2 py-1"
                    value={s.college ?? ''}
                    placeholder="Colégio"
                    onChange={(e) => update(s.id, { college: e.target.value })}
                  />
                </td>
                <td className="px-2 py-1">
                  <select
                    className="rounded border border-stone-300 bg-white px-1 py-1"
                    value={s.difficulty}
                    onChange={(e) => update(s.id, { difficulty: e.target.value as Difficulty })}
                  >
                    {DIFF_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-1 text-right">
                  <input
                    type="number"
                    min={0}
                    className="w-16 rounded border border-stone-300 bg-white px-1 py-1 text-right tabular-nums"
                    value={s.points}
                    onChange={(e) => update(s.id, { points: e.target.valueAsNumber || 0 })}
                  />
                </td>
                <td className="px-2 py-1 text-right text-lg font-bold tabular-nums text-amber-950">
                  {computeSpellLevel(character, s)}
                </td>
                <td className="px-2 py-1">
                  <IconButton title="Remover" onClick={() => remove(s.id)}>
                    ✕
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {spells.length === 0 && <p className="py-2 text-sm italic text-stone-400">Nenhuma magia.</p>}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <Button variant="ghost" onClick={add}>
          + Adicionar magia
        </Button>
        <span className="text-sm font-semibold tabular-nums text-amber-900">{spellCost(spells)} pts</span>
      </div>
    </Panel>
  )
}
