import type { DerivedStats } from '../gurps/calculations'
import { SECONDARY_COST_PER_LEVEL } from '../gurps/rules'
import type { SecondaryAdjustments } from '../gurps/types'
import { Panel } from './ui'

function Row({
  label,
  base,
  adj,
  final,
  costPerLevel,
  step = 1,
  onAdjChange,
}: {
  label: string
  base: number
  adj: number
  final: number | string
  costPerLevel: number
  step?: number
  onAdjChange: (v: number) => void
}) {
  const cost = adj * costPerLevel * (step === 0.25 ? 4 : 1)
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2 border-b border-stone-200 py-1.5 text-sm last:border-0">
      <span className="font-medium text-stone-700">{label}</span>
      <span className="w-10 text-right text-stone-400 tabular-nums">{base}</span>
      <input
        type="number"
        step={step}
        className="w-16 rounded border border-stone-300 bg-white px-1 py-0.5 text-right tabular-nums"
        value={adj}
        onChange={(e) => onAdjChange(e.target.valueAsNumber || 0)}
      />
      <span className="w-14 text-right text-lg font-bold tabular-nums text-amber-950">{final}</span>
      <span className="w-16 text-right text-[11px] text-stone-500 tabular-nums">
        {cost >= 0 ? '+' : ''}
        {cost} pts
      </span>
    </div>
  )
}

export function SecondaryPanel({
  attributes,
  secondary,
  stats,
  onChange,
}: {
  attributes: { st: number; dx: number; iq: number; ht: number }
  secondary: SecondaryAdjustments
  stats: DerivedStats
  onChange: (s: SecondaryAdjustments) => void
}) {
  return (
    <Panel title="Características Secundárias">
      <div className="mb-1 grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 text-[11px] font-medium uppercase tracking-wide text-stone-500">
        <span />
        <span className="w-10 text-right">Base</span>
        <span className="w-16 text-right">Ajuste</span>
        <span className="w-14 text-right">Final</span>
        <span className="w-16 text-right">Custo</span>
      </div>
      <Row
        label="PV (Pontos de Vida)"
        base={attributes.st}
        adj={secondary.hp}
        final={stats.hp}
        costPerLevel={SECONDARY_COST_PER_LEVEL.hp}
        onAdjChange={(v) => onChange({ ...secondary, hp: v })}
      />
      <Row
        label="Vontade"
        base={attributes.iq}
        adj={secondary.will}
        final={stats.will}
        costPerLevel={SECONDARY_COST_PER_LEVEL.will}
        onAdjChange={(v) => onChange({ ...secondary, will: v })}
      />
      <Row
        label="Percepção"
        base={attributes.iq}
        adj={secondary.per}
        final={stats.per}
        costPerLevel={SECONDARY_COST_PER_LEVEL.per}
        onAdjChange={(v) => onChange({ ...secondary, per: v })}
      />
      <Row
        label="PF (Pontos de Fadiga)"
        base={attributes.ht}
        adj={secondary.fp}
        final={stats.fp}
        costPerLevel={SECONDARY_COST_PER_LEVEL.fp}
        onAdjChange={(v) => onChange({ ...secondary, fp: v })}
      />
      <Row
        label="Velocidade Básica"
        base={(attributes.dx + attributes.ht) / 4}
        adj={secondary.speedSteps * 0.25}
        final={stats.basicSpeed}
        costPerLevel={SECONDARY_COST_PER_LEVEL.speedStep}
        step={0.25}
        onAdjChange={(v) => onChange({ ...secondary, speedSteps: Math.round(v * 4) })}
      />
      <Row
        label="Deslocamento Básico"
        base={Math.floor(stats.basicSpeed)}
        adj={secondary.move}
        final={stats.basicMove}
        costPerLevel={SECONDARY_COST_PER_LEVEL.move}
        onAdjChange={(v) => onChange({ ...secondary, move: v })}
      />
      <div className="mt-2 flex items-center justify-between rounded bg-amber-900/5 px-2 py-1.5 text-sm">
        <span className="font-medium text-stone-700">Esquiva</span>
        <span className="text-lg font-bold tabular-nums text-amber-950">{stats.dodgeFinal}</span>
      </div>
    </Panel>
  )
}
