import { create } from 'zustand'
import * as api from '../data/charactersApi'
import type { Character } from '../gurps/types'

const SAVE_DEBOUNCE_MS = 600
const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>()

interface CharacterStoreState {
  characters: Character[]
  loading: boolean
  error: string | null

  fetchAll: () => Promise<void>
  createCharacter: (ownerId: string, name?: string) => Promise<Character>
  duplicateCharacter: (id: string) => Promise<Character | undefined>
  deleteCharacter: (id: string) => Promise<void>
  updateCharacter: (id: string, patch: Partial<Character>) => void
  flush: (id: string) => Promise<void>
  getCharacter: (id: string) => Character | undefined
  grantXp: (characterId: string, grantedBy: string, amount: number, reason: string) => Promise<void>
  importCharacter: (ownerId: string, data: Partial<Character>) => Promise<Character>
  reset: () => void
}

export const useCharacterStore = create<CharacterStoreState>()((set, get) => ({
  characters: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null })
    try {
      const characters = await api.listCharacters()
      set({ characters, loading: false })
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : 'Erro ao carregar fichas.' })
    }
  },

  createCharacter: async (ownerId, name) => {
    const c = await api.createCharacter(ownerId, name)
    set((state) => ({ characters: [c, ...state.characters] }))
    return c
  },

  duplicateCharacter: async (id) => {
    const original = get().characters.find((c) => c.id === id)
    if (!original) return undefined
    const copy = await api.duplicateCharacter(original)
    set((state) => ({ characters: [copy, ...state.characters] }))
    return copy
  },

  deleteCharacter: async (id) => {
    await api.deleteCharacter(id)
    set((state) => ({ characters: state.characters.filter((c) => c.id !== id) }))
  },

  updateCharacter: (id, patch) => {
    set((state) => ({
      characters: state.characters.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }))
    const existing = debounceTimers.get(id)
    if (existing) clearTimeout(existing)
    debounceTimers.set(
      id,
      setTimeout(() => {
        debounceTimers.delete(id)
        get().flush(id)
      }, SAVE_DEBOUNCE_MS),
    )
  },

  flush: async (id) => {
    const timer = debounceTimers.get(id)
    if (timer) {
      clearTimeout(timer)
      debounceTimers.delete(id)
    }
    const current = get().characters.find((c) => c.id === id)
    if (!current) return
    try {
      const saved = await api.updateCharacter(current)
      set((state) => ({ characters: state.characters.map((c) => (c.id === id ? saved : c)) }))
    } catch (e) {
      set({ error: e instanceof Error ? e.message : 'Erro ao salvar ficha.' })
    }
  },

  getCharacter: (id) => get().characters.find((c) => c.id === id),

  grantXp: async (characterId, grantedBy, amount, reason) => {
    await api.grantXp(characterId, grantedBy, amount, reason)
    const [fresh] = await Promise.all([api.listCharacters()])
    set({ characters: fresh })
  },

  importCharacter: async (ownerId, data) => {
    const c = await api.importCharacter(ownerId, data)
    set((state) => ({ characters: [c, ...state.characters] }))
    return c
  },

  reset: () => {
    debounceTimers.forEach((t) => clearTimeout(t))
    debounceTimers.clear()
    set({ characters: [], loading: false, error: null })
  },
}))
