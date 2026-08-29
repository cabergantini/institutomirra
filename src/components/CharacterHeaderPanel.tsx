import type { Character } from '../gurps/types'
import { NumberField, Panel, TextField } from './ui'

export function CharacterHeaderPanel({
  character,
  onChange,
}: {
  character: Character
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
        <NumberField
          label="Pontos totais"
          value={character.totalPoints}
          onChange={(v) => onChange({ totalPoints: v })}
        />
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
