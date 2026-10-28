import { useEffect, useRef } from "react"

/**
 * Protege contra perda de texto em formulários de CRIAÇÃO (Nova despesa, Nova tarefa, Novo
 * lead etc.) quando o navegador — principalmente o Safari no iPhone/iPad — recarrega a aba em
 * segundo plano por economia de memória. Isso reseta todo o estado do React, inclusive um
 * popup que estava sendo preenchido: a pessoa troca de aba, volta, e o texto sumiu.
 *
 * Enquanto o formulário está aberto, salva os campos no localStorage a cada mudança. Quando o
 * formulário abre (inclusive reaberto automaticamente depois de um recarregamento — ver
 * hasFormDraft), se existir um rascunho salvo, recupera os valores automaticamente. Ao salvar
 * de verdade com sucesso, o código que chama isso deve apagar o rascunho com clearFormDraft.
 *
 * Só usar em formulários de criação, nunca de edição — pra nunca correr o risco do rascunho
 * de um item sobrescrever sem querer os dados reais de outro já existente.
 */
const dirtyKey = (storageKey: string) => `${storageKey}:dirty`

export function useFormDraft<T extends Record<string, unknown>>(
  storageKey: string,
  open: boolean,
  snapshot: T,
  restore: (draft: Partial<T>) => void
) {
  const restoredRef = useRef(false)
  const wasOpenRef = useRef(false)
  // Como o formulário estava quando abriu: só vira rascunho o que a pessoa realmente mudou.
  const initialRef = useRef<string | null>(null)
  const openedAtRef = useRef(0)

  // Ao abrir, tenta recuperar um rascunho salvo — só uma vez por "abertura" do formulário.
  // Só vale rascunho marcado como alterado: formulário aberto e fechado sem digitar nada não reabre sozinho.
  useEffect(() => {
    if (!open) {
      restoredRef.current = false
      initialRef.current = null
      // Fechar o formulário de propósito (X, Cancelar ou Salvar) descarta o rascunho.
      // Recarregar a página não passa por aqui, então o rascunho sobrevive ao recarregamento.
      if (wasOpenRef.current) clearFormDraft(storageKey)
      wasOpenRef.current = false
      return
    }
    if (!wasOpenRef.current) openedAtRef.current = Date.now()
    wasOpenRef.current = true
    if (restoredRef.current) return
    restoredRef.current = true
    try {
      if (localStorage.getItem(dirtyKey(storageKey)) === "1") {
        const raw = localStorage.getItem(storageKey)
        if (raw) restore(JSON.parse(raw))
      } else {
        // Sobra de versões antigas (rascunho sem alteração): descarta.
        localStorage.removeItem(storageKey)
      }
    } catch {
      // Rascunho corrompido ou localStorage indisponível (modo privado etc.) — segue sem ele.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, storageKey])

  // Enquanto a pessoa digita, salva o rascunho (só depois de ela mudar alguma coisa).
  useEffect(() => {
    if (!open) return
    const json = JSON.stringify(snapshot)
    // Nos primeiros instantes depois de abrir, o formulário ainda está sendo preenchido com os dados
    // iniciais (ex.: abrir para editar um item); isso não é digitação, então vira o ponto de partida.
    if (initialRef.current === null || Date.now() - openedAtRef.current < 400) {
      initialRef.current = json
      return
    }
    if (json === initialRef.current) return
    try {
      localStorage.setItem(storageKey, json)
      localStorage.setItem(dirtyKey(storageKey), "1")
    } catch {
      // localStorage indisponível ou cheio — não é crítico, só não protege dessa vez.
    }
  }, [open, storageKey, snapshot])
}

export function clearFormDraft(storageKey: string) {
  try {
    localStorage.removeItem(storageKey)
    localStorage.removeItem(dirtyKey(storageKey))
  } catch {
    // ignore
  }
}

export function hasFormDraft(storageKey: string): boolean {
  try {
    return localStorage.getItem(storageKey) !== null && localStorage.getItem(dirtyKey(storageKey)) === "1"
  } catch {
    return false
  }
}
