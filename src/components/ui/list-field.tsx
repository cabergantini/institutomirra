import { useState, type KeyboardEvent } from "react"
import { X, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

type ListFieldProps = {
  id: string
  label: string
  hint?: string
  placeholder?: string
  values: string[]
  onChange: (values: string[]) => void
  /** Sugestões que aparecem ao digitar (ex.: nomes de outras soluções da esteira). */
  suggestions?: string[]
  /** "rows" (um item por linha, bom para textos longos) ou "chips" (nomes curtos). */
  layout?: "rows" | "chips"
}

/** Campo de lista: digita, aperta Enter (ou o botão +) e o item entra na lista. Dá para remover. */
export function ListField({ id, label, hint, placeholder, values, onChange, suggestions, layout = "rows" }: ListFieldProps) {
  const [draft, setDraft] = useState("")

  function addItem() {
    const t = draft.trim()
    if (!t) return
    onChange([...values, t])
    setDraft("")
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      addItem()
    }
  }

  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i))

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {hint && <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p>}
      <div className="flex gap-2">
        <Input
          id={id}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          list={suggestions && suggestions.length > 0 ? `${id}-sugestoes` : undefined}
        />
        <Button type="button" variant="outline" size="icon" onClick={addItem} aria-label={`Adicionar em ${label}`}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {suggestions && suggestions.length > 0 && (
        <datalist id={`${id}-sugestoes`}>
          {suggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      )}
      {values.length > 0 &&
        (layout === "chips" ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {values.map((item, i) => (
              <span key={`${item}-${i}`} className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground">
                {item}
                <button type="button" onClick={() => remove(i)} aria-label={`Remover ${item}`} className="rounded-full hover:opacity-70">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <ul className="flex flex-col gap-1.5 pt-1">
            {values.map((item, i) => (
              <li key={`${item}-${i}`} className="flex items-start justify-between gap-3 rounded-md bg-secondary/60 px-3 py-2 text-sm text-foreground">
                <span className="min-w-0 break-words">{item}</span>
                <button type="button" onClick={() => remove(i)} aria-label={`Remover ${item}`} className="mt-0.5 shrink-0 text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        ))}
    </div>
  )
}
