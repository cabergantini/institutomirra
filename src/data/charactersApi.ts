import { newCharacter } from '../gurps/factory'
import type { Character } from '../gurps/types'
import { supabase } from '../lib/supabaseClient'

export interface XpGrant {
  id: string
  characterId: string
  grantedBy: string
  amount: number
  reason: string
  createdAt: number
}

interface CharacterRow {
  id: string
  owner_id: string
  name: string
  player: string
  race: string
  homeland: string
  height: string
  weight: string
  age: string
  gender: string
  appearance: string
  total_points: number
  attributes: Character['attributes']
  secondary: Character['secondary']
  advantages: Character['advantages']
  disadvantages: Character['disadvantages']
  perks: Character['perks']
  quirks: Character['quirks']
  skills: Character['skills']
  spells: Character['spells']
  equipment: Character['equipment']
  weapons: Character['weapons']
  cash: number
  notes: string
  created_at: string
  updated_at: string
}

function rowToCharacter(row: CharacterRow): Character {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    player: row.player,
    race: row.race,
    homeland: row.homeland,
    height: row.height,
    weight: row.weight,
    age: row.age,
    gender: row.gender,
    appearance: row.appearance,
    totalPoints: row.total_points,
    attributes: row.attributes,
    secondary: row.secondary,
    advantages: row.advantages,
    disadvantages: row.disadvantages,
    perks: row.perks,
    quirks: row.quirks,
    skills: row.skills,
    spells: row.spells,
    equipment: row.equipment,
    weapons: row.weapons,
    cash: Number(row.cash),
    notes: row.notes,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
  }
}

function characterToRow(c: Character) {
  return {
    id: c.id,
    owner_id: c.ownerId,
    name: c.name,
    player: c.player,
    race: c.race,
    homeland: c.homeland,
    height: c.height,
    weight: c.weight,
    age: c.age,
    gender: c.gender,
    appearance: c.appearance,
    total_points: c.totalPoints,
    attributes: c.attributes,
    secondary: c.secondary,
    advantages: c.advantages,
    disadvantages: c.disadvantages,
    perks: c.perks,
    quirks: c.quirks,
    skills: c.skills,
    spells: c.spells,
    equipment: c.equipment,
    weapons: c.weapons,
    cash: c.cash,
    notes: c.notes,
  }
}

function client() {
  if (!supabase) throw new Error('Supabase não configurado.')
  return supabase
}

export async function listCharacters(): Promise<Character[]> {
  const { data, error } = await client().from('characters').select('*').order('updated_at', { ascending: false })
  if (error) throw error
  return (data as CharacterRow[]).map(rowToCharacter)
}

export async function createCharacter(ownerId: string, name?: string): Promise<Character> {
  const c = newCharacter(ownerId, name)
  const { data, error } = await client().from('characters').insert(characterToRow(c)).select('*').single()
  if (error) throw error
  return rowToCharacter(data as CharacterRow)
}

export async function updateCharacter(character: Character): Promise<Character> {
  const { id, ...rest } = characterToRow(character)
  const { data, error } = await client().from('characters').update(rest).eq('id', id).select('*').single()
  if (error) throw error
  return rowToCharacter(data as CharacterRow)
}

export async function deleteCharacter(id: string): Promise<void> {
  const { error } = await client().from('characters').delete().eq('id', id)
  if (error) throw error
}

export async function duplicateCharacter(character: Character): Promise<Character> {
  const copy = { ...characterToRow(character) }
  const insertPayload = { ...copy, id: undefined, name: `${character.name} (cópia)` }
  delete (insertPayload as { id?: string }).id
  const { data, error } = await client().from('characters').insert(insertPayload).select('*').single()
  if (error) throw error
  return rowToCharacter(data as CharacterRow)
}

export async function importCharacter(ownerId: string, data: Partial<Character>): Promise<Character> {
  const base = newCharacter(ownerId, data.name)
  const merged: Character = { ...base, ...data, id: base.id, ownerId }
  const { data: row, error } = await client().from('characters').insert(characterToRow(merged)).select('*').single()
  if (error) throw error
  return rowToCharacter(row as CharacterRow)
}

export async function grantXp(characterId: string, grantedBy: string, amount: number, reason: string): Promise<void> {
  const { error } = await client().from('xp_grants').insert({ character_id: characterId, granted_by: grantedBy, amount, reason })
  if (error) throw error
}

export async function listXpGrants(characterId: string): Promise<XpGrant[]> {
  const { data, error } = await client()
    .from('xp_grants')
    .select('id, character_id, granted_by, amount, reason, created_at')
    .eq('character_id', characterId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as { id: string; character_id: string; granted_by: string; amount: number; reason: string; created_at: string }[]).map((r) => ({
    id: r.id,
    characterId: r.character_id,
    grantedBy: r.granted_by,
    amount: r.amount,
    reason: r.reason,
    createdAt: new Date(r.created_at).getTime(),
  }))
}
