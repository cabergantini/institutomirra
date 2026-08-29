import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { newCharacter } from '../gurps/factory'
import type { Character } from '../gurps/types'

interface CharacterStoreState {
  characters: Character[]
  createCharacter: (name?: string) => Character
  duplicateCharacter: (id: string) => Character | undefined
  deleteCharacter: (id: string) => void
  updateCharacter: (id: string, patch: Partial<Character>) => void
  getCharacter: (id: string) => Character | undefined
  importCharacter: (c: Character) => void
}

export const useCharacterStore = create<CharacterStoreState>()(
  persist(
    (set, get) => ({
      characters: [],

      createCharacter: (name) => {
        const c = newCharacter(name)
        set((state) => ({ characters: [...state.characters, c] }))
        return c
      },

      duplicateCharacter: (id) => {
        const original = get().characters.find((c) => c.id === id)
        if (!original) return undefined
        const copy: Character = {
          ...original,
          id: crypto.randomUUID(),
          name: `${original.name} (cópia)`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set((state) => ({ characters: [...state.characters, copy] }))
        return copy
      },

      deleteCharacter: (id) => {
        set((state) => ({ characters: state.characters.filter((c) => c.id !== id) }))
      },

      updateCharacter: (id, patch) => {
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id ? { ...c, ...patch, updatedAt: Date.now() } : c,
          ),
        }))
      },

      getCharacter: (id) => get().characters.find((c) => c.id === id),

      importCharacter: (c) => {
        set((state) => {
          const exists = state.characters.some((existing) => existing.id === c.id)
          if (exists) {
            return {
              characters: state.characters.map((existing) => (existing.id === c.id ? c : existing)),
            }
          }
          return { characters: [...state.characters, c] }
        })
      },
    }),
    { name: 'gurps-fantasy-fichas' },
  ),
)
