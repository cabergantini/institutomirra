import type { XpGrant } from '../data/charactersApi'
import { Panel } from './ui'

export function XpHistoryPanel({ grants }: { grants: XpGrant[] }) {
  return (
    <Panel title="Histórico de XP">
      {grants.length === 0 ? (
        <p className="text-sm italic text-stone-400">Nenhuma concessão de XP ainda.</p>
      ) : (
        <ul className="flex flex-col gap-1.5 text-sm">
          {grants.map((g) => (
            <li key={g.id} className="flex items-center justify-between gap-3 border-b border-stone-200 pb-1.5 last:border-0">
              <span className="text-stone-600">
                {new Date(g.createdAt).toLocaleDateString('pt-BR')}
                {g.reason ? ` · ${g.reason}` : ''}
              </span>
              <span className={`font-semibold tabular-nums ${g.amount >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {g.amount >= 0 ? '+' : ''}
                {g.amount} pts
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}
