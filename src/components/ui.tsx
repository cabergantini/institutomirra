import type { ReactNode } from 'react'

export function Panel({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg border border-amber-900/20 bg-white/70 shadow-sm ${className}`}>
      <h2 className="border-b border-amber-900/20 bg-amber-900/5 px-4 py-2 text-lg font-semibold tracking-wide text-amber-950">
        {title}
      </h2>
      <div className="p-4">{children}</div>
    </section>
  )
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  hint,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  hint?: string
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-stone-600">{label}</span>
      <input
        type="number"
        className="w-full rounded border border-stone-400 bg-white px-2 py-1 text-right text-lg font-semibold tabular-nums focus:border-amber-700 focus:outline-none"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(e.target.valueAsNumber || 0)}
      />
      {hint && <span className="text-[11px] text-stone-500">{hint}</span>}
    </label>
  )
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-stone-600">{label}</span>
      <input
        type="text"
        className="w-full rounded border border-stone-400 bg-white px-2 py-1 focus:border-amber-700 focus:outline-none"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

export function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: string }) {
  return (
    <div className="flex flex-col items-center rounded border border-amber-900/20 bg-amber-50 px-2 py-2 text-center">
      <span className="text-[11px] font-medium uppercase tracking-wide text-stone-600">{label}</span>
      <span className="text-2xl font-bold tabular-nums text-amber-950">{value}</span>
      {sub && <span className="text-[11px] text-stone-500">{sub}</span>}
    </div>
  )
}

export function Button({
  children,
  onClick,
  variant = 'default',
  type = 'button',
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'default' | 'danger' | 'ghost'
  type?: 'button' | 'submit'
  className?: string
}) {
  const styles: Record<string, string> = {
    default: 'bg-amber-800 text-amber-50 hover:bg-amber-900',
    danger: 'bg-red-700 text-red-50 hover:bg-red-800',
    ghost: 'bg-transparent text-amber-900 hover:bg-amber-900/10 border border-amber-900/30',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export function IconButton({ children, onClick, title }: { children: ReactNode; onClick: () => void; title?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="flex h-7 w-7 items-center justify-center rounded border border-stone-400 text-stone-600 hover:bg-stone-100"
    >
      {children}
    </button>
  )
}
