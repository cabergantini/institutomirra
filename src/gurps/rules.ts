import type { Difficulty } from './types'

/** Custo em pontos por nível acima/abaixo de 10, para personagens (GURPS 4e Basic Set). */
export const ATTRIBUTE_COST_PER_LEVEL = {
  st: 10,
  dx: 20,
  iq: 20,
  ht: 10,
} as const

export const SECONDARY_COST_PER_LEVEL = {
  hp: 2,
  will: 5,
  per: 5,
  fp: 3,
  /** Custo por incremento de 0.25 na Velocidade Básica. */
  speedStep: 5,
  move: 5,
} as const

export const DEFAULT_ATTRIBUTE = 10

/** Deslocamento do nível de perícia em relação ao atributo, com 1 ponto investido. */
const DIFFICULTY_BASE_AT_1PT: Record<Difficulty, number> = {
  E: 0,
  A: -1,
  H: -2,
  VH: -3,
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  E: 'Fácil',
  A: 'Médio',
  H: 'Difícil',
  VH: 'Muito Difícil',
}

/** Nível de uma perícia (ou magia) a partir do atributo base, dificuldade e pontos investidos. */
export function skillLevelFromPoints(attributeValue: number, difficulty: Difficulty, points: number): number {
  if (points <= 0) return 0
  const base = attributeValue + DIFFICULTY_BASE_AT_1PT[difficulty]
  if (points === 1) return base
  if (points === 2) return base + 1
  if (points === 3) return base + 1
  return base + 2 + Math.floor((points - 4) / 4)
}

/** Pontos "canônicos" (1, 2, 4, 8, 12, ...) mais próximos, para exibir referência de custo. */
export const SKILL_POINT_STEPS = [1, 2, 4, 8, 12, 16, 20, 24]

export interface EncumbranceLevel {
  level: number
  name: string
  bmMultiplier: number
  dodgePenalty: number
  liftMultiplier: number
}

export const ENCUMBRANCE_LEVELS: EncumbranceLevel[] = [
  { level: 0, name: 'Nenhuma', bmMultiplier: 1, dodgePenalty: 0, liftMultiplier: 1 },
  { level: 1, name: 'Leve', bmMultiplier: 0.8, dodgePenalty: -1, liftMultiplier: 2 },
  { level: 2, name: 'Média', bmMultiplier: 0.6, dodgePenalty: -2, liftMultiplier: 3 },
  { level: 3, name: 'Pesada', bmMultiplier: 0.4, dodgePenalty: -3, liftMultiplier: 6 },
  { level: 4, name: 'Muito Pesada', bmMultiplier: 0.2, dodgePenalty: -4, liftMultiplier: 10 },
]

/** Dado + modificador, ex: {dice: 2, mod: -1} => "2d-1". */
export interface DiceRoll {
  dice: number
  mod: number
}

export function formatDice(d: DiceRoll): string {
  if (d.dice <= 0) return `${d.mod}`
  if (d.mod === 0) return `${d.dice}d`
  return `${d.dice}d${d.mod > 0 ? '+' : ''}${d.mod}`
}

/**
 * Tabela oficial de dano por ST (Basic Set p.16) para ST 1-20.
 * Acima de 20, a progressão de cada coluna é extrapolada mantendo o
 * cadenciamento observado nela mesma no topo da tabela oficial
 * (Aparo: +1d a cada 8 ST; Arremesso: +1d a cada 4 ST) — aproximação
 * para criaturas muito fortes (ogros, trolls, gigantes), sinalizada na UI.
 */
const THRUST_TABLE: DiceRoll[] = [
  { dice: 1, mod: -6 }, { dice: 1, mod: -6 }, { dice: 1, mod: -5 }, { dice: 1, mod: -5 },
  { dice: 1, mod: -4 }, { dice: 1, mod: -4 }, { dice: 1, mod: -3 }, { dice: 1, mod: -3 },
  { dice: 1, mod: -2 }, { dice: 1, mod: -2 }, { dice: 1, mod: -1 }, { dice: 1, mod: -1 },
  { dice: 1, mod: 0 }, { dice: 1, mod: 0 }, { dice: 1, mod: 1 }, { dice: 1, mod: 1 },
  { dice: 1, mod: 2 }, { dice: 1, mod: 2 }, { dice: 1, mod: 3 }, { dice: 1, mod: 3 },
]

const SWING_TABLE: DiceRoll[] = [
  { dice: 1, mod: -5 }, { dice: 1, mod: -5 }, { dice: 1, mod: -4 }, { dice: 1, mod: -4 },
  { dice: 1, mod: -3 }, { dice: 1, mod: -3 }, { dice: 1, mod: -2 }, { dice: 1, mod: -2 },
  { dice: 1, mod: -1 }, { dice: 1, mod: 0 }, { dice: 1, mod: 1 }, { dice: 1, mod: 2 },
  { dice: 2, mod: -1 }, { dice: 2, mod: 0 }, { dice: 2, mod: 1 }, { dice: 2, mod: 2 },
  { dice: 3, mod: -1 }, { dice: 3, mod: 0 }, { dice: 3, mod: 1 }, { dice: 3, mod: 2 },
]

function nextDie(d: DiceRoll): DiceRoll {
  if (d.mod >= 2) return { dice: d.dice + 1, mod: -1 }
  return { dice: d.dice, mod: d.mod + 1 }
}

/** Aplica um "bump" de dado a cada `everyStPoints` de ST acima de 20. */
function extrapolate(table: DiceRoll[], st: number, everyStPoints: number): DiceRoll {
  let d = table[19]
  for (let s = 21; s <= st; s++) {
    if ((s - 21) % everyStPoints === 0) d = nextDie(d)
  }
  return d
}

export function thrustDamage(st: number): DiceRoll {
  const clamped = Math.max(1, Math.round(st))
  if (clamped <= 20) return THRUST_TABLE[clamped - 1]
  return extrapolate(THRUST_TABLE, clamped, 2)
}

export function swingDamage(st: number): DiceRoll {
  const clamped = Math.max(1, Math.round(st))
  if (clamped <= 20) return SWING_TABLE[clamped - 1]
  return extrapolate(SWING_TABLE, clamped, 1)
}

/** Carga Básica (Basic Lift), em kg-equivalente (lbs na regra original, mantido em "unidades"). */
export function basicLift(st: number): number {
  return Math.round((st * st) / 5)
}
