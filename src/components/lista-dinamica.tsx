"use client";

import { useState, KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/field";

export function ListaDinamica({
  titulo,
  placeholder,
  itens,
  onChange,
  corAccent = "terracotta",
}: {
  titulo: string;
  placeholder: string;
  itens: string[];
  onChange: (itens: string[]) => void;
  corAccent?: "terracotta" | "plum";
}) {
  const [rascunho, setRascunho] = useState("");

  function adicionar() {
    const valor = rascunho.trim();
    if (!valor) return;
    onChange([...itens, valor]);
    setRascunho("");
  }

  function remover(index: number) {
    onChange(itens.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      adicionar();
    }
  }

  const dot = corAccent === "terracotta" ? "bg-terracotta" : "bg-plum";

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <h3 className="font-display text-base text-ink">{titulo}</h3>

      <ul className="mt-3 space-y-2">
        {itens.map((item, i) => (
          <li
            key={i}
            className="flex items-start justify-between gap-3 rounded-lg bg-cream-soft px-3 py-2 text-sm text-ink"
          >
            <span className="flex gap-2">
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
              {item}
            </span>
            <button
              type="button"
              onClick={() => remover(i)}
              aria-label={`Remover ${item}`}
              className="shrink-0 text-ink-soft hover:text-terracotta cursor-pointer"
            >
              <X size={16} />
            </button>
          </li>
        ))}
        {itens.length === 0 && (
          <li className="text-sm text-ink-soft/70 italic">
            Nenhum item adicionado ainda.
          </li>
        )}
      </ul>

      <div className="mt-3 flex gap-2">
        <Input
          value={rascunho}
          onChange={(e) => setRascunho(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={adicionar}
          aria-label="Adicionar item"
          className="flex shrink-0 items-center justify-center rounded-xl bg-plum px-3 text-cream hover:bg-plum/90 cursor-pointer"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}
