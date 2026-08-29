import { attributeCost } from '../gurps/calculations'
import { ATTRIBUTE_COST_PER_LEVEL } from '../gurps/rules'
import type { Attributes } from '../gurps/types'
import { Panel } from './ui'

const LABELS: Record<keyof Attributes, string> = { st: 'ST', dx: 'DX', iq: 'IQ', ht: 'HT' }
const NAMES: Record<keyof Attributes, string> = {
  st: 'Força',
  dx: 'Destreza',
  iq: 'Inteligência',
  ht: 'Vitalidade',
}

export function AttributesPanel({
  attributes,
  onChange,
}: {
  attributes: Attributes
  onChange: (attrs: Attributes) => void
}) {
  return (
    <Panel title="Atributos Primários">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(Object.keys(LABELS) as (keyof Attributes)[]).map((key) => {
          const value = attributes[key]
          const cost = attributeCost(value, ATTRIBUTE_COST_PER_LEVEL[key])
          return (
            <div key={key} className="flex flex-col items-center gap-1 rounded border border-amber-900/20 bg-amber-50 p-2">
              <span className="text-xs font-medium uppercase tracking-wide text-stone-600" title={NAMES[key]}>
                {LABELS[key]}
              </span>
              <input
                type="number"
                className="w-16 rounded border border-stone-400 bg-white px-1 py-1 text-center text-xl font-bold tabular-nums focus:border-amber-700 focus:outline-none"
                value={value}
                min={1}
                onChange={(e) => onChange({ ...attributes, [key]: e.target.valueAsNumber || 1 })}
              />
              <span className="text-[11px] tabular-nums text-stone-500">
                {cost >= 0 ? '+' : ''}
                {cost} pts
              </span>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
