import {
  ATTRIBUTE_COST_PER_LEVEL,
  DEFAULT_ATTRIBUTE,
  ENCUMBRANCE_LEVELS,
  SECONDARY_COST_PER_LEVEL,
  basicLift,
  formatDice,
  skillLevelFromPoints,
  swingDamage,
  thrustDamage,
  type EncumbranceLevel,
} from './rules'
import type { Character, Trait } from './types'

export function attributeCost(value: number, perLevel: number): number {
  return (value - DEFAULT_ATTRIBUTE) * perLevel
}

export function attributesCost(c: Character): number {
  return (
    attributeCost(c.attributes.st, ATTRIBUTE_COST_PER_LEVEL.st) +
    attributeCost(c.attributes.dx, ATTRIBUTE_COST_PER_LEVEL.dx) +
    attributeCost(c.attributes.iq, ATTRIBUTE_COST_PER_LEVEL.iq) +
    attributeCost(c.attributes.ht, ATTRIBUTE_COST_PER_LEVEL.ht)
  )
}

export interface DerivedStats {
  hp: number
  will: number
  per: number
  fp: number
  basicSpeed: number
  basicMove: number
  dodgeBase: number
  dodgeFinal: number
  basicLift: number
  thrust: string
  swing: string
  encumbrance: EncumbranceLevel
  carriedWeight: number
}

export function secondaryCost(c: Character): number {
  const s = c.secondary
  return (
    s.hp * SECONDARY_COST_PER_LEVEL.hp +
    s.will * SECONDARY_COST_PER_LEVEL.will +
    s.per * SECONDARY_COST_PER_LEVEL.per +
    s.fp * SECONDARY_COST_PER_LEVEL.fp +
    s.speedSteps * SECONDARY_COST_PER_LEVEL.speedStep +
    s.move * SECONDARY_COST_PER_LEVEL.move
  )
}

export function carriedWeight(c: Character): number {
  return c.equipment.filter((i) => i.carried).reduce((sum, i) => sum + i.qty * i.unitWeight, 0)
}

export function encumbranceFor(bl: number, weight: number): EncumbranceLevel {
  for (const lvl of ENCUMBRANCE_LEVELS) {
    if (weight <= bl * lvl.liftMultiplier) return lvl
  }
  return ENCUMBRANCE_LEVELS[ENCUMBRANCE_LEVELS.length - 1]
}

export function deriveStats(c: Character): DerivedStats {
  const { st, dx, iq, ht } = c.attributes
  const hp = st + c.secondary.hp
  const will = iq + c.secondary.will
  const per = iq + c.secondary.per
  const fp = ht + c.secondary.fp

  const basicSpeed = (dx + ht) / 4 + c.secondary.speedSteps * 0.25
  const basicMoveBase = Math.floor(basicSpeed) + c.secondary.move
  const dodgeBase = Math.floor(basicSpeed) + 3

  const bl = basicLift(st)
  const weight = carriedWeight(c)
  const encumbrance = encumbranceFor(bl, weight)

  const dodgeFinal = Math.max(1, dodgeBase + encumbrance.dodgePenalty)

  return {
    hp,
    will,
    per,
    fp,
    basicSpeed,
    basicMove: basicMoveBase,
    dodgeBase,
    dodgeFinal,
    basicLift: bl,
    thrust: formatDice(thrustDamage(st)),
    swing: formatDice(swingDamage(st)),
    encumbrance,
    carriedWeight: weight,
  }
}

/** Deslocamento já com a penalidade de carga aplicada. */
export function encumberedMove(stats: DerivedStats): number {
  return Math.max(1, Math.floor(stats.basicMove * stats.encumbrance.bmMultiplier))
}

export function traitListCost(traits: Trait[]): number {
  return traits.reduce((sum, t) => sum + t.points, 0)
}

export function skillCost(skills: Character['skills']): number {
  return skills.reduce((sum, s) => sum + s.points, 0)
}

export function spellCost(spells: Character['spells']): number {
  return spells.reduce((sum, s) => sum + s.points, 0)
}

export interface PointsSummary {
  attributes: number
  secondary: number
  advantages: number
  disadvantages: number
  perks: number
  quirks: number
  skills: number
  spells: number
  total: number
  available: number
  remaining: number
}

export function pointsSummary(c: Character): PointsSummary {
  const attributes = attributesCost(c)
  const secondary = secondaryCost(c)
  const advantages = traitListCost(c.advantages)
  const disadvantages = traitListCost(c.disadvantages)
  const perks = traitListCost(c.perks)
  const quirks = traitListCost(c.quirks)
  const skills = skillCost(c.skills)
  const spells = spellCost(c.spells)
  const total = attributes + secondary + advantages + disadvantages + perks + quirks + skills + spells
  return {
    attributes,
    secondary,
    advantages,
    disadvantages,
    perks,
    quirks,
    skills,
    spells,
    total,
    available: c.totalPoints,
    remaining: c.totalPoints - total,
  }
}

export function attributeValue(c: Character, key: 'st' | 'dx' | 'iq' | 'ht'): number {
  return c.attributes[key]
}

export function computeSkillLevel(c: Character, skill: Character['skills'][number]): number {
  return skillLevelFromPoints(attributeValue(c, skill.attribute), skill.difficulty, skill.points)
}

export function computeSpellLevel(c: Character, spell: Character['spells'][number]): number {
  return skillLevelFromPoints(c.attributes.iq, spell.difficulty, spell.points)
}
