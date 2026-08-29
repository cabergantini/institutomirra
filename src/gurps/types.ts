export type Difficulty = 'E' | 'A' | 'H' | 'VH'

export type AttributeKey = 'st' | 'dx' | 'iq' | 'ht'

export interface Attributes {
  st: number
  dx: number
  iq: number
  ht: number
}

/** Ajustes manuais somados aos valores derivados dos atributos primários. */
export interface SecondaryAdjustments {
  hp: number
  will: number
  per: number
  fp: number
  /** Incrementos de 0.25 aplicados à Velocidade Básica. */
  speedSteps: number
  move: number
}

export interface Trait {
  id: string
  name: string
  points: number
  note?: string
}

export interface Skill {
  id: string
  name: string
  attribute: AttributeKey
  difficulty: Difficulty
  points: number
  note?: string
}

export interface Spell {
  id: string
  name: string
  college?: string
  difficulty: Difficulty
  points: number
}

export interface EquipmentItem {
  id: string
  name: string
  qty: number
  unitWeight: number
  unitCost: number
  carried: boolean
  note?: string
}

export type WeaponType = 'melee' | 'ranged'

export interface Weapon {
  id: string
  name: string
  type: WeaponType
  skillName: string
  level: number
  damage: string
  reach: string
  parry: string
  st: string
  acc: string
  range: string
  rof: string
  shots: string
  bulk: string
  rcl: string
}

export interface Character {
  id: string
  name: string
  player: string
  race: string
  homeland: string
  height: string
  weight: string
  age: string
  gender: string
  appearance: string

  totalPoints: number

  attributes: Attributes
  secondary: SecondaryAdjustments

  advantages: Trait[]
  disadvantages: Trait[]
  perks: Trait[]
  quirks: Trait[]

  skills: Skill[]
  spells: Spell[]

  equipment: EquipmentItem[]
  weapons: Weapon[]
  cash: number

  notes: string

  createdAt: number
  updatedAt: number
}
