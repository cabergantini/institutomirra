import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { deriveStats, pointsSummary } from '../gurps/calculations'
import { AttributesPanel } from '../components/AttributesPanel'
import { CharacterHeaderPanel } from '../components/CharacterHeaderPanel'
import { CombatPanel } from '../components/CombatPanel'
import { EquipmentPanel } from '../components/EquipmentPanel'
import { PointsSummaryPanel } from '../components/PointsSummaryPanel'
import { SecondaryPanel } from '../components/SecondaryPanel'
import { SkillsPanel } from '../components/SkillsPanel'
import { SpellsPanel } from '../components/SpellsPanel'
import { TraitList } from '../components/TraitList'
import { XpHistoryPanel } from '../components/XpHistoryPanel'
import { Panel } from '../components/ui'
import { listXpGrants, type XpGrant } from '../data/charactersApi'
import { useCharacterStore } from '../store/characterStore'
import type { Character } from '../gurps/types'

export function CharacterSheetPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const character = useCharacterStore((s) => s.characters.find((c) => c.id === id))
  const loading = useCharacterStore((s) => s.loading)
  const fetchAll = useCharacterStore((s) => s.fetchAll)
  const updateCharacter = useCharacterStore((s) => s.updateCharacter)
  const flush = useCharacterStore((s) => s.flush)
  const [xpGrants, setXpGrants] = useState<XpGrant[]>([])

  useEffect(() => {
    if (!character && !loading) fetchAll()
  }, [character, loading, fetchAll])

  useEffect(() => {
    if (!id) return
    return () => {
      flush(id)
    }
  }, [id, flush])

  useEffect(() => {
    if (!id) return
    listXpGrants(id).then(setXpGrants).catch(() => {})
  }, [id, character?.totalPoints])

  if (!character) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-lg text-stone-600">{loading ? 'Carregando ficha…' : 'Ficha não encontrada.'}</p>
        {!loading && (
          <button
            onClick={() => navigate('/')}
            className="mt-4 rounded bg-amber-800 px-4 py-2 font-medium text-amber-50 hover:bg-amber-900"
          >
            Voltar para a lista
          </button>
        )}
      </div>
    )
  }

  const canEditPoints = profile?.role === 'narrador'

  function patch(p: Partial<Character>) {
    updateCharacter(character!.id, p)
  }

  const stats = deriveStats(character)
  const summary = pointsSummary(character)

  function exportJson() {
    const blob = new Blob([JSON.stringify(character, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${character!.name || 'ficha'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="parchment min-h-screen pb-16">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => {
              flush(character.id)
              navigate('/')
            }}
            className="text-sm font-medium text-amber-900 hover:underline"
          >
            ← Todas as fichas
          </button>
          <div className="flex gap-2">
            <button
              onClick={exportJson}
              className="rounded border border-amber-900/30 px-3 py-1.5 text-sm text-amber-900 hover:bg-amber-900/10"
            >
              Exportar JSON
            </button>
            <button
              onClick={() => window.print()}
              className="rounded border border-amber-900/30 px-3 py-1.5 text-sm text-amber-900 hover:bg-amber-900/10"
            >
              Imprimir
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_260px]">
          <div className="flex flex-col gap-4">
            <CharacterHeaderPanel character={character} canEditPoints={canEditPoints} onChange={patch} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <AttributesPanel attributes={character.attributes} onChange={(attributes) => patch({ attributes })} />
              <SecondaryPanel
                attributes={character.attributes}
                secondary={character.secondary}
                stats={stats}
                onChange={(secondary) => patch({ secondary })}
              />
            </div>

            <Panel title="Vantagens, Desvantagens, Perks e Peculiaridades">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TraitList
                  title="Vantagens"
                  traits={character.advantages}
                  onChange={(advantages) => patch({ advantages })}
                  addLabel="Nome da vantagem"
                  pointsHint="Custo em pontos (positivo)"
                />
                <TraitList
                  title="Desvantagens"
                  traits={character.disadvantages}
                  onChange={(disadvantages) => patch({ disadvantages })}
                  addLabel="Nome da desvantagem"
                  pointsHint="Custo em pontos (negativo)"
                />
                <TraitList
                  title="Perks"
                  traits={character.perks}
                  onChange={(perks) => patch({ perks })}
                  addLabel="Nome do perk"
                  pointsHint="Geralmente 1 ponto"
                />
                <TraitList
                  title="Peculiaridades"
                  traits={character.quirks}
                  onChange={(quirks) => patch({ quirks })}
                  addLabel="Nome da peculiaridade"
                  pointsHint="Geralmente -1 ponto"
                />
              </div>
            </Panel>

            <SkillsPanel character={character} onChange={(skills) => patch({ skills })} />
            <SpellsPanel character={character} onChange={(spells) => patch({ spells })} />
            <CombatPanel character={character} stats={stats} onChange={(weapons) => patch({ weapons })} />
            <EquipmentPanel
              character={character}
              stats={stats}
              onChange={(equipment) => patch({ equipment })}
              onCashChange={(cash) => patch({ cash })}
            />

            <Panel title="Anotações">
              <textarea
                className="w-full rounded border border-stone-300 bg-white p-2 text-sm"
                rows={5}
                value={character.notes}
                onChange={(e) => patch({ notes: e.target.value })}
                placeholder="Histórico, ganchos de aventura, contatos, observações do mestre..."
              />
            </Panel>

            <XpHistoryPanel grants={xpGrants} />
          </div>

          <div className="flex flex-col gap-4">
            <PointsSummaryPanel summary={summary} />
          </div>
        </div>
      </div>
    </div>
  )
}
