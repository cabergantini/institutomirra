import { nanoid } from 'nanoid'
import type { Character } from './types'

export function newCharacter(name = 'Novo Aventureiro'): Character {
  const now = Date.now()
  return {
    id: nanoid(),
    name,
    player: '',
    race: 'Humano',
    homeland: '',
    height: '',
    weight: '',
    age: '',
    gender: '',
    appearance: '',

    totalPoints: 150,

    attributes: { st: 10, dx: 10, iq: 10, ht: 10 },
    secondary: { hp: 0, will: 0, per: 0, fp: 0, speedSteps: 0, move: 0 },

    advantages: [],
    disadvantages: [],
    perks: [],
    quirks: [],

    skills: [],
    spells: [],

    equipment: [],
    weapons: [],
    cash: 0,

    notes: '',

    createdAt: now,
    updatedAt: now,
  }
}
