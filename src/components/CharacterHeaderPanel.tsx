import type { Character } from '../gurps/types'
import { NumberField, Panel, TextField } from './ui'

export function CharacterHeaderPanel({
  character,
  canEditPoints,
  onChange,
}: {
  character: Character
  canEditPoints: boolean
  onChange: (patch: Partial<Character>) => void
}) {
  return (
    <Panel title="Identidade">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <TextField label="Nome" value={character.name} onChange={(v) => onChange({ name: v })} />
        <TextField label="Jogador" value={character.player} onChange={(v) => onChange({ player: v })} />
        <TextField label="Raça" value={character.race} onChange={(v) => onChange({ race: v })} />
        <TextField label="Terra Natal" value={character.homeland} onChange={(v) => onChange({ homeland: v })} />
        <TextField label="Altura" value={character.height} onChange={(v) => onChange({ height: v })} />
        <TextField label="Peso" value={character.weight} onChange={(v) => onChange({ weight: v })} />
        <TextField label="Idade" value={character.age} onChange={(v) => onChange({ age: v })} />
        <TextField label="Gênero" value={character.gender} onChange={(v) => onChange({ gender: v })} />
        {canEditPoints ? (
          <NumberField
            label="Pontos totais"
            value={character.totalPoints}
            onChange={(v) => onChange({ totalPoints: v })}
            hint="Só o narrador ajusta o total base."
          />
        ) : (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-stone-600">Pontos totais</span>
            <div className="w-full rounded border border-stone-300 bg-stone-100 px-2 py-1 text-right text-lg font-semibold tabular-nums text-stone-700">
              {character.totalPoints}
            </div>
            <span className="text-[11px] text-stone-500">Definido pelo narrador via XP concedida.</span>
          </div>
        )}
      </div>
      <div className="mt-3">
        <TextField
          label="Aparência"
          value={character.appearance}
          onChange={(v) => onChange({ appearance: v })}
          placeholder="Descrição física, trajes, marcas..."
        />
      </div>
    </Panel>
  )
}
