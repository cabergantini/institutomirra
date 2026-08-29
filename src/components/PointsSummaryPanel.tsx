import type { PointsSummary } from '../gurps/calculations'

const ROWS: { key: keyof PointsSummary; label: string }[] = [
  { key: 'attributes', label: 'Atributos' },
  { key: 'secondary', label: 'Secundários' },
  { key: 'advantages', label: 'Vantagens' },
  { key: 'disadvantages', label: 'Desvantagens' },
  { key: 'perks', label: 'Perks' },
  { key: 'quirks', label: 'Peculiaridades' },
  { key: 'skills', label: 'Perícias' },
  { key: 'spells', label: 'Magias' },
]

export function PointsSummaryPanel({ summary }: { summary: PointsSummary }) {
  const over = summary.remaining < 0
  return (
    <section className="sticky top-2 rounded-lg border border-amber-900/20 bg-white/80 p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold tracking-wide text-amber-950">Pontos</h2>
      <div className="flex flex-col gap-0.5 text-sm">
        {ROWS.map((r) => (
          <div key={r.key} className="flex justify-between text-stone-600">
            <span>{r.label}</span>
            <span className="tabular-nums">{summary[r.key]}</span>
          </div>
        ))}
      </div>
      <div className="my-2 border-t border-stone-300" />
      <div className="flex justify-between text-sm font-medium text-stone-700">
        <span>Total gasto</span>
        <span className="tabular-nums">{summary.total}</span>
      </div>
      <div className="flex justify-between text-sm font-medium text-stone-700">
        <span>Disponível</span>
        <span className="tabular-nums">{summary.available}</span>
      </div>
      <div
        className={`mt-2 flex items-center justify-between rounded px-2 py-1.5 text-base font-bold ${
          over ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
        }`}
      >
        <span>{over ? 'Acima do limite' : 'Restante'}</span>
        <span className="tabular-nums">{summary.remaining}</span>
      </div>
    </section>
  )
}
