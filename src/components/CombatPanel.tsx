import { nanoid } from 'nanoid'
import { encumberedMove, type DerivedStats } from '../gurps/calculations'
import type { Character, Weapon, WeaponType } from '../gurps/types'
import { Button, IconButton, Panel, Stat } from './ui'

const emptyWeapon = (type: WeaponType): Omit<Weapon, 'id'> => ({
  name: '',
  type,
  skillName: '',
  level: 0,
  damage: '',
  reach: '',
  parry: '',
  st: '',
  acc: '',
  range: '',
  rof: '',
  shots: '',
  bulk: '',
  rcl: '',
})

export function CombatPanel({
  character,
  stats,
  onChange,
}: {
  character: Character
  stats: DerivedStats
  onChange: (weapons: Weapon[]) => void
}) {
  const melee = character.weapons.filter((w) => w.type === 'melee')
  const ranged = character.weapons.filter((w) => w.type === 'ranged')

  function add(type: WeaponType) {
    onChange([...character.weapons, { id: nanoid(), ...emptyWeapon(type) }])
  }
  function update(id: string, patch: Partial<Weapon>) {
    onChange(character.weapons.map((w) => (w.id === id ? { ...w, ...patch } : w)))
  }
  function remove(id: string) {
    onChange(character.weapons.filter((w) => w.id !== id))
  }

  return (
    <Panel title="Combate">
      <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
        <Stat label="Aparo (Golpe)" value={stats.thrust} />
        <Stat label="Aparo (Corte)" value={stats.swing} />
        <Stat label="PV" value={stats.hp} />
        <Stat label="PF" value={stats.fp} />
        <Stat label="Esquiva" value={stats.dodgeFinal} />
        <Stat label="Desloc." value={encumberedMove(stats)} />
      </div>

      <WeaponTable
        title="Armas Corpo a Corpo"
        weapons={melee}
        columns={['name', 'skillName', 'level', 'damage', 'reach', 'parry', 'st']}
        onAdd={() => add('melee')}
        onUpdate={update}
        onRemove={remove}
      />

      <div className="mt-4" />

      <WeaponTable
        title="Armas à Distância"
        weapons={ranged}
        columns={['name', 'skillName', 'level', 'damage', 'acc', 'range', 'rof', 'shots', 'bulk', 'rcl', 'st']}
        onAdd={() => add('ranged')}
        onUpdate={update}
        onRemove={remove}
      />
    </Panel>
  )
}

const COLUMN_LABELS: Record<string, string> = {
  name: 'Arma',
  skillName: 'Perícia',
  level: 'NH',
  damage: 'Dano',
  reach: 'Alcance',
  parry: 'Aparar',
  st: 'ST',
  acc: 'Prec.',
  range: 'Alcance',
  rof: 'CdT',
  shots: 'Tiros',
  bulk: 'Vol.',
  rcl: 'Rec.',
}

function WeaponTable({
  title,
  weapons,
  columns,
  onAdd,
  onUpdate,
  onRemove,
}: {
  title: string
  weapons: Weapon[]
  columns: (keyof Weapon)[]
  onAdd: () => void
  onUpdate: (id: string, patch: Partial<Weapon>) => void
  onRemove: (id: string) => void
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-stone-700">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-stone-300 text-left text-[11px] uppercase tracking-wide text-stone-500">
              {columns.map((c) => (
                <th key={c} className="px-1.5 py-1">
                  {COLUMN_LABELS[c]}
                </th>
              ))}
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {weapons.map((w) => (
              <tr key={w.id} className="border-b border-stone-100">
                {columns.map((c) => (
                  <td key={c} className="px-1.5 py-1">
                    <input
                      className="w-20 rounded border border-stone-300 bg-white px-1.5 py-1 text-sm"
                      value={String(w[c] ?? '')}
                      onChange={(e) =>
                        onUpdate(w.id, { [c]: c === 'level' ? Number(e.target.value) || 0 : e.target.value } as Partial<Weapon>)
                      }
                    />
                  </td>
                ))}
                <td className="px-1.5 py-1">
                  <IconButton title="Remover" onClick={() => onRemove(w.id)}>
                    ✕
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {weapons.length === 0 && <p className="py-2 text-sm italic text-stone-400">Nenhuma arma.</p>}
      </div>
      <Button variant="ghost" onClick={onAdd} className="mt-2">
        + Adicionar arma
      </Button>
    </div>
  )
}
