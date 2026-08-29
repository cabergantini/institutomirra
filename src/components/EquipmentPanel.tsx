import { nanoid } from 'nanoid'
import { encumberedMove, type DerivedStats } from '../gurps/calculations'
import type { Character, EquipmentItem } from '../gurps/types'
import { Button, IconButton, Panel } from './ui'

export function EquipmentPanel({
  character,
  stats,
  onChange,
  onCashChange,
}: {
  character: Character
  stats: DerivedStats
  onChange: (items: EquipmentItem[]) => void
  onCashChange: (cash: number) => void
}) {
  const items = character.equipment
  const totalCost = items.reduce((sum, i) => sum + i.qty * i.unitCost, 0)

  function add() {
    onChange([...items, { id: nanoid(), name: '', qty: 1, unitWeight: 0, unitCost: 0, carried: true }])
  }
  function update(id: string, patch: Partial<EquipmentItem>) {
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)))
  }
  function remove(id: string) {
    onChange(items.filter((i) => i.id !== id))
  }

  return (
    <Panel title="Equipamento e Carga">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-stone-300 text-left text-[11px] uppercase tracking-wide text-stone-500">
              <th className="w-8 px-1 py-1">Port.</th>
              <th className="py-1 pr-2">Item</th>
              <th className="w-16 px-2 py-1 text-right">Qtd</th>
              <th className="w-20 px-2 py-1 text-right">Peso un.</th>
              <th className="w-20 px-2 py-1 text-right">Custo un.</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-b border-stone-100">
                <td className="px-1 py-1 text-center">
                  <input
                    type="checkbox"
                    checked={i.carried}
                    onChange={(e) => update(i.id, { carried: e.target.checked })}
                  />
                </td>
                <td className="py-1 pr-2">
                  <input
                    className="w-full rounded border border-stone-300 bg-white px-2 py-1"
                    value={i.name}
                    placeholder="Nome do item"
                    onChange={(e) => update(i.id, { name: e.target.value })}
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    min={0}
                    className="w-16 rounded border border-stone-300 bg-white px-1 py-1 text-right tabular-nums"
                    value={i.qty}
                    onChange={(e) => update(i.id, { qty: e.target.valueAsNumber || 0 })}
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    className="w-20 rounded border border-stone-300 bg-white px-1 py-1 text-right tabular-nums"
                    value={i.unitWeight}
                    onChange={(e) => update(i.id, { unitWeight: e.target.valueAsNumber || 0 })}
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    min={0}
                    className="w-20 rounded border border-stone-300 bg-white px-1 py-1 text-right tabular-nums"
                    value={i.unitCost}
                    onChange={(e) => update(i.id, { unitCost: e.target.valueAsNumber || 0 })}
                  />
                </td>
                <td className="px-2 py-1">
                  <IconButton title="Remover" onClick={() => remove(i.id)}>
                    ✕
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <p className="py-2 text-sm italic text-stone-400">Nenhum item.</p>}
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <Button variant="ghost" onClick={add}>
          + Adicionar item
        </Button>
        <label className="flex items-center gap-2 text-sm">
          <span className="font-medium text-stone-700">Dinheiro ($)</span>
          <input
            type="number"
            className="w-24 rounded border border-stone-300 bg-white px-2 py-1 text-right tabular-nums"
            value={character.cash}
            onChange={(e) => onCashChange(e.target.valueAsNumber || 0)}
          />
        </label>
        <span className="text-sm text-stone-500">
          Valor do equipamento: <strong className="text-amber-900">${totalCost}</strong>
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="Carga Básica" value={stats.basicLift} />
        <MiniStat label="Carregado" value={stats.carriedWeight.toFixed(1)} />
        <MiniStat label="Nível de Carga" value={stats.encumbrance.name} />
        <MiniStat label="Deslocamento c/ carga" value={encumberedMove(stats)} />
      </div>
    </Panel>
  )
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center rounded border border-amber-900/20 bg-amber-50 px-2 py-2 text-center">
      <span className="text-[11px] font-medium uppercase tracking-wide text-stone-600">{label}</span>
      <span className="text-lg font-bold tabular-nums text-amber-950">{value}</span>
    </div>
  )
}
