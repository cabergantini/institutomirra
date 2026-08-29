import { nanoid } from 'nanoid'
import { computeSkillLevel, skillCost } from '../gurps/calculations'
import { DIFFICULTY_LABEL } from '../gurps/rules'
import type { AttributeKey, Character, Difficulty, Skill } from '../gurps/types'
import { Button, IconButton, Panel } from './ui'

const ATTR_OPTIONS: AttributeKey[] = ['st', 'dx', 'iq', 'ht']
const DIFF_OPTIONS: Difficulty[] = ['E', 'A', 'H', 'VH']

export function SkillsPanel({ character, onChange }: { character: Character; onChange: (skills: Skill[]) => void }) {
  const skills = character.skills

  function add() {
    onChange([...skills, { id: nanoid(), name: '', attribute: 'dx', difficulty: 'A', points: 1 }])
  }
  function update(id: string, patch: Partial<Skill>) {
    onChange(skills.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }
  function remove(id: string) {
    onChange(skills.filter((s) => s.id !== id))
  }

  return (
    <Panel title="Perícias">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-stone-300 text-left text-[11px] uppercase tracking-wide text-stone-500">
              <th className="py-1 pr-2">Perícia</th>
              <th className="px-2 py-1">Atrib.</th>
              <th className="px-2 py-1">Dif.</th>
              <th className="px-2 py-1 text-right">Pontos</th>
              <th className="px-2 py-1 text-right">NH</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {skills.map((s) => (
              <tr key={s.id} className="border-b border-stone-100">
                <td className="py-1 pr-2">
                  <input
                    className="w-full rounded border border-stone-300 bg-white px-2 py-1"
                    value={s.name}
                    placeholder="Nome da perícia"
                    onChange={(e) => update(s.id, { name: e.target.value })}
                  />
                </td>
                <td className="px-2 py-1">
                  <select
                    className="rounded border border-stone-300 bg-white px-1 py-1 uppercase"
                    value={s.attribute}
                    onChange={(e) => update(s.id, { attribute: e.target.value as AttributeKey })}
                  >
                    {ATTR_OPTIONS.map((a) => (
                      <option key={a} value={a}>
                        {a.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-1">
                  <select
                    className="rounded border border-stone-300 bg-white px-1 py-1"
                    value={s.difficulty}
                    onChange={(e) => update(s.id, { difficulty: e.target.value as Difficulty })}
                    title={DIFFICULTY_LABEL[s.difficulty]}
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
                  {computeSkillLevel(character, s)}
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
        {skills.length === 0 && <p className="py-2 text-sm italic text-stone-400">Nenhuma perícia.</p>}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <Button variant="ghost" onClick={add}>
          + Adicionar perícia
        </Button>
        <span className="text-sm font-semibold tabular-nums text-amber-900">{skillCost(skills)} pts</span>
      </div>
    </Panel>
  )
}
