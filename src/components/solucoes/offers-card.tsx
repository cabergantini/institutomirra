import { useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import { ChevronDown, Plus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Lead, Sale, SolutionOffer, SolutionOfferStatus } from "@/lib/supabase"
import { calcOfferStats, formatBRL, loadOfferObjections, OFFER_STATUS_LABELS, type OfferObjectionCount } from "@/lib/offers"
import { useFormDraft, clearFormDraft } from "@/hooks/use-form-draft"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ListField } from "@/components/ui/list-field"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OffersResults } from "@/components/solucoes/offers-results"

export type OffersSummary = {
  total: number
  active: number
  firstActive: { name: string; price: number | null } | null
  leads: number
  sales: number
}

type Props = {
  userId: string
  solutionId: string
  solutionName: string
  solutionPrice: string
  /** "ofertas" mostra a lista e o formulário; "resultados" mostra a tabela. O componente fica sempre montado. */
  view: "ofertas" | "resultados" | "none"
  onSummary?: (summary: OffersSummary) => void
}

type Editing = { id: string | null } | null

const RESULT_DAYS = 90

export function OffersCard({ userId, solutionId, solutionName, solutionPrice, view, onSummary }: Props) {
  const [offers, setOffers] = useState<SolutionOffer[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [objections, setObjections] = useState<OfferObjectionCount[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Editing>(null)

  useEffect(() => {
    void load()
  }, [solutionId])

  async function load() {
    setLoading(true)
    const { data: offersData } = await supabase
      .from("solution_offer")
      .select("*")
      .eq("solution_id", solutionId)
      .order("created_at", { ascending: false })
    const list = (offersData as SolutionOffer[]) ?? []
    setOffers(list)

    if (list.length > 0) {
      const ids = list.map((o) => o.id)
      const since = new Date(Date.now() - RESULT_DAYS * 86400000)
      const [{ data: leadsData }, { data: salesData }] = await Promise.all([
        supabase.from("lead").select("*").in("offer_id", ids),
        supabase.from("sales").select("*").in("offer_id", ids),
      ])
      const leadList = ((leadsData as Lead[]) ?? []).filter((l) => new Date(l.created_at) >= since)
      const saleList = ((salesData as Sale[]) ?? []).filter((s) => new Date(s.sale_date + "T00:00:00") >= since)
      setLeads(leadList)
      setSales(saleList)
      setObjections(await loadOfferObjections(leadList.map((l) => l.id)))
    } else {
      setLeads([])
      setSales([])
      setObjections([])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (loading) return
    const active = offers.filter((o) => o.status === "active")
    onSummary?.({
      total: offers.length,
      active: active.length,
      firstActive: active[0] ? { name: active[0].name, price: active[0].price } : null,
      leads: leads.length,
      sales: sales.filter((x) => x.status === "confirmed").length,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, offers, leads, sales])

  const stats = useMemo(() => calcOfferStats(offers, leads, sales), [offers, leads, sales])
  const editingOffer = editing?.id ? offers.find((o) => o.id === editing.id) ?? null : null

  return (
    <>
      <div className={view === "ofertas" ? "flex flex-col gap-5" : "hidden"}>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Ofertas deste produto</CardTitle>
              <CardDescription>Cada vez que você apresenta o produto de um jeito diferente, registre como uma oferta.</CardDescription>
            </div>
            {!editing && (
              <Button type="button" size="sm" className="gap-1.5" onClick={() => setEditing({ id: null })}>
                <Plus className="h-4 w-4" /> Adicionar oferta
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2.5">
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : offers.length === 0 && !editing ? (
            <p className="text-sm text-muted-foreground">Nenhuma oferta cadastrada ainda.</p>
          ) : (
            offers.map((o) => {
              const summary = offerSummary(o)
              const selected = editing?.id === o.id
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setEditing({ id: o.id })}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left ring-1 transition-colors hover:ring-primary ${
                    selected ? "ring-primary" : "ring-border"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{o.name}</p>
                    {summary && <p className="mt-1 text-xs text-muted-foreground">{summary}</p>}
                    {(o.promised_result || o.time_to_result) && (
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {[o.promised_result && `Resultado: ${o.promised_result}`, o.time_to_result].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      o.status === "active" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {OFFER_STATUS_LABELS[o.status]}
                  </span>
                  <span className={`shrink-0 font-heading text-base ${o.status === "active" ? "text-primary" : "text-muted-foreground"}`}>
                    {formatBRL(o.price)}
                  </span>
                  <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">{selected ? "Editando ›" : "Editar ›"}</span>
                </button>
              )
            })
          )}
        </CardContent>
      </Card>

      {editing && (
        <OfferForm
          key={editing.id ?? "nova"}
          userId={userId}
          solutionId={solutionId}
          offer={editingOffer}
          defaultName={`Oferta de ${solutionName || "lançamento"}`}
          defaultPrice={solutionPrice}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            void load()
          }}
        />
      )}

      </div>

      <div className={view === "resultados" ? "" : "hidden"}>
      {offers.length === 0 && !loading && (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Cadastre uma oferta na aba Ofertas para acompanhar os resultados dela aqui.
          </CardContent>
        </Card>
      )}
      {offers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado das ofertas</CardTitle>
            <CardDescription>Últimos {RESULT_DAYS} dias. Os números vêm dos leads e das vendas em que você escolheu a oferta.</CardDescription>
          </CardHeader>
          <CardContent>
            <OffersResults stats={stats} objections={objections} />
          </CardContent>
        </Card>
      )}
      </div>
    </>
  )
}

/** Resumo de uma linha da oferta: "3 entregáveis · Bônus: 1 Rei, 1 Perpétuo · 1 orderbump · 1 upsell". */
function offerSummary(o: SolutionOffer): string {
  const n = (list: string[] | null | undefined) => list?.length ?? 0
  const bonus = [
    n(o.bonus_king) ? `${n(o.bonus_king)} Rei` : null,
    n(o.bonus_perpetual) ? `${n(o.bonus_perpetual)} Perpétuo` : null,
    n(o.bonus_ascension) ? `${n(o.bonus_ascension)} Ascensão` : null,
  ].filter(Boolean)
  return [
    n(o.deliverables) ? `${n(o.deliverables)} entregável${n(o.deliverables) > 1 ? "is" : ""}` : null,
    bonus.length ? `Bônus: ${bonus.join(", ")}` : null,
    n(o.orderbumps) ? `${n(o.orderbumps)} orderbump` : null,
    n(o.upsells) ? `${n(o.upsells)} upsell` : null,
  ]
    .filter(Boolean)
    .join(" · ")
}

/** Bloco numerado do formulário, que abre e fecha. */
function FormSection({
  n,
  title,
  summary,
  open,
  onToggle,
  children,
}: {
  n: number
  title: string
  summary?: string
  open: boolean
  onToggle: () => void
  children?: React.ReactNode
}) {
  return (
    <section className="border-t border-border">
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-3 px-5 py-4 text-left sm:px-6">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">{n}</span>
        <span className="text-[15px] font-medium text-foreground">{title}</span>
        {summary && <span className="hidden truncate text-xs text-muted-foreground sm:inline">{summary}</span>}
        <ChevronDown className={`ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && <div className="px-5 pb-6 sm:px-6">{children}</div>}
    </section>
  )
}

type FormProps = {
  userId: string
  solutionId: string
  offer: SolutionOffer | null
  defaultName: string
  defaultPrice: string
  onCancel: () => void
  onSaved: () => void
}

function OfferForm({ userId, solutionId, offer, defaultName, defaultPrice, onCancel, onSaved }: FormProps) {
  const [name, setName] = useState(offer?.name ?? defaultName)
  const [status, setStatus] = useState<SolutionOfferStatus>(offer?.status ?? "active")
  const [price, setPrice] = useState(offer ? (offer.price !== null ? String(offer.price) : "") : defaultPrice)
  const [timeToResult, setTimeToResult] = useState(offer?.time_to_result ?? "")
  const [promisedResult, setPromisedResult] = useState(offer?.promised_result ?? "")
  const [salesLink, setSalesLink] = useState(offer?.sales_link ?? "")
  const [deliverables, setDeliverables] = useState<string[]>(offer?.deliverables ?? [])
  const [bonusKing, setBonusKing] = useState<string[]>(offer?.bonus_king ?? [])
  const [bonusPerpetual, setBonusPerpetual] = useState<string[]>(offer?.bonus_perpetual ?? [])
  const [bonusAscension, setBonusAscension] = useState<string[]>(offer?.bonus_ascension ?? [])
  const [orderbumps, setOrderbumps] = useState<string[]>(offer?.orderbumps ?? [])
  const [upsells, setUpsells] = useState<string[]>(offer?.upsells ?? [])
  const [prospects, setProspects] = useState<string[]>(offer?.prospects ?? [])
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: true, 4: false })
  const toggleSection = (n: number) => setOpenSections((prev) => ({ ...prev, [n]: !prev[n] }))
  // Nomes das outras soluções da esteira, só como sugestão ao preencher orderbump e upsell.
  const [solutionNames, setSolutionNames] = useState<string[]>([])

  useEffect(() => {
    void supabase
      .from("solution")
      .select("name")
      .eq("user_id", userId)
      .neq("id", solutionId)
      .order("name", { ascending: true })
      .then(({ data }) => setSolutionNames(((data as { name: string }[]) ?? []).map((x) => x.name).filter(Boolean)))
  }, [userId, solutionId])
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Protege contra perda de texto se a aba recarregar. Ver src/hooks/use-form-draft.ts.
  const draftKey = `mirra:draft:oferta:${solutionId}:${offer?.id ?? "nova"}`
  useFormDraft(
    draftKey,
    true,
    { name, status, price, timeToResult, promisedResult, salesLink, deliverables, bonusKing, bonusPerpetual, bonusAscension, orderbumps, upsells, prospects },
    (d) => {
      if (d.name !== undefined) setName(d.name)
      if (d.status !== undefined) setStatus(d.status)
      if (d.price !== undefined) setPrice(d.price)
      if (d.timeToResult !== undefined) setTimeToResult(d.timeToResult)
      if (d.promisedResult !== undefined) setPromisedResult(d.promisedResult)
      if (d.salesLink !== undefined) setSalesLink(d.salesLink)
      if (Array.isArray(d.deliverables)) setDeliverables(d.deliverables)
      if (Array.isArray(d.bonusKing)) setBonusKing(d.bonusKing)
      if (Array.isArray(d.bonusPerpetual)) setBonusPerpetual(d.bonusPerpetual)
      if (Array.isArray(d.bonusAscension)) setBonusAscension(d.bonusAscension)
      if (Array.isArray(d.orderbumps)) setOrderbumps(d.orderbumps)
      if (Array.isArray(d.upsells)) setUpsells(d.upsells)
      if (Array.isArray(d.prospects)) setProspects(d.prospects)
    }
  )

  const snapshot = JSON.stringify({ name, status, price, timeToResult, promisedResult, salesLink, deliverables, bonusKing, bonusPerpetual, bonusAscension, orderbumps, upsells, prospects })
  const initialSnapshot = useRef(snapshot)
  const dirty = snapshot !== initialSnapshot.current

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError("Dê um nome para a oferta.")
      return
    }
    const priceNumber = price.trim() === "" ? null : Number(price.replace(",", "."))
    if (priceNumber !== null && Number.isNaN(priceNumber)) {
      setError("Preço inválido. Use apenas números, por exemplo 37,00.")
      return
    }
    setSaving(true)
    setError(null)
    const payload = {
      user_id: userId,
      solution_id: solutionId,
      name: name.trim(),
      status,
      price: priceNumber,
      promised_result: promisedResult || null,
      time_to_result: timeToResult || null,
      sales_link: salesLink.trim() || null,
      deliverables,
      bonus_king: bonusKing,
      bonus_perpetual: bonusPerpetual,
      bonus_ascension: bonusAscension,
      orderbumps,
      upsells,
      prospects,
      updated_at: new Date().toISOString(),
    }
    const { error: saveError } = offer
      ? await supabase.from("solution_offer").update(payload).eq("id", offer.id)
      : await supabase.from("solution_offer").insert(payload)
    setSaving(false)
    if (saveError) {
      setError("Não foi possível salvar a oferta. Tente novamente.")
      return
    }
    clearFormDraft(draftKey)
    onSaved()
  }

  async function handleDelete() {
    if (!offer) return
    setDeleting(true)
    const { error: delError } = await supabase.from("solution_offer").delete().eq("id", offer.id)
    setDeleting(false)
    if (delError) {
      setError("Não foi possível excluir a oferta. Tente novamente.")
      return
    }
    clearFormDraft(draftKey)
    onSaved()
  }

  const bonusTotal = bonusKing.length + bonusPerpetual.length + bonusAscension.length

  return (
    <Card className="ring-1 ring-primary">
      <CardHeader>
        <CardTitle>{offer ? "Editar oferta" : "Nova oferta"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <FormSection n={1} title="Dados da oferta" open={openSections[1]} onToggle={() => toggleSection(1)}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
            <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
              <Label htmlFor="offer-name">Nome da oferta</Label>
              <Input id="offer-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="offer-status">Status</Label>
              <Select id="offer-status" value={status} onChange={(e) => setStatus(e.target.value as SolutionOfferStatus)}>
                <option value="active">Ativa</option>
                <option value="closed">Inativa</option>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="offer-price">Preço (R$)</Label>
              <Input id="offer-price" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="offer-time">Time-to-Value</Label>
              <Input id="offer-time" value={timeToResult} onChange={(e) => setTimeToResult(e.target.value)} placeholder="Ex.: em até 7 dias" />
            </div>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">Time-to-Value: quanto tempo leva para o cliente ter a primeira percepção de resultado.</p>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="offer-result">Resultado prometido</Label>
              <Textarea id="offer-result" value={promisedResult} onChange={(e) => setPromisedResult(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="offer-link">Link de vendas</Label>
              <Input id="offer-link" type="url" inputMode="url" value={salesLink} onChange={(e) => setSalesLink(e.target.value)} placeholder="https://" />
            </div>
          </div>
        </FormSection>

        <FormSection
          n={2}
          title="O que o cliente recebe"
          summary={[deliverables.length ? `${deliverables.length} entregáveis` : null, bonusTotal ? `${bonusTotal} bônus` : null].filter(Boolean).join(" · ")}
          open={openSections[2]}
          onToggle={() => toggleSection(2)}
        >
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            <ListField
              id="offer-deliverables"
              label="Entregáveis"
              hint="O que o aluno recebe. Adicione um item de cada vez."
              placeholder="Ex.: Planilha de precificação em Excel"
              values={deliverables}
              onChange={setDeliverables}
            />
            <div className="flex flex-col gap-4 rounded-lg bg-secondary/30 p-4 ring-1 ring-border">
              <ListField
                id="offer-bonus-king"
                label="Bônus Retorno do Rei"
                hint="Um bônus que é ainda melhor do que a solução vendida."
                placeholder="Ex.: Mentoria em grupo de 1h"
                values={bonusKing}
                onChange={setBonusKing}
              />
              <ListField
                id="offer-bonus-perpetual"
                label="Bônus Perpétuo"
                hint="Algo com acesso de longo prazo (3 meses, 6 meses, 1 ano). Pode ser algo ao vivo, gravado, material, PDF etc."
                placeholder="Ex.: Comunidade fechada por 6 meses"
                values={bonusPerpetual}
                onChange={setBonusPerpetual}
              />
              <ListField
                id="offer-bonus-ascension"
                label="Bônus de Ascensão e Recorrência"
                hint="Estimula a próxima compra e aumenta o LTV, como cashback ou porcentagem de desconto em outras soluções da esteira."
                placeholder="Ex.: 20% off na próxima solução da esteira"
                values={bonusAscension}
                onChange={setBonusAscension}
              />
            </div>
          </div>
        </FormSection>

        <FormSection
          n={3}
          title="Venda"
          summary={[orderbumps.length ? `${orderbumps.length} orderbump` : null, upsells.length ? `${upsells.length} upsell` : null].filter(Boolean).join(" · ")}
          open={openSections[3]}
          onToggle={() => toggleSection(3)}
        >
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            <ListField
              id="offer-orderbump"
              label="Orderbump"
              hint="Soluções complementares que o cliente pode adquirir junto com a oferta."
              placeholder="Escolha uma solução ou escreva"
              values={orderbumps}
              onChange={setOrderbumps}
              suggestions={solutionNames}
            />
            <ListField
              id="offer-upsell"
              label="Upsell"
              hint="O próximo passo de compra, geralmente uma solução de mesmo ticket ou de ticket superior."
              placeholder="Escolha uma solução ou escreva"
              values={upsells}
              onChange={setUpsells}
              suggestions={solutionNames}
            />
          </div>
        </FormSection>

        <FormSection
          n={4}
          title="Possíveis clientes"
          summary={prospects.length ? `${prospects.length} nome${prospects.length > 1 ? "s" : ""}` : undefined}
          open={openSections[4]}
          onToggle={() => toggleSection(4)}
        >
          <ListField
            id="offer-prospects"
            label="Lista de possíveis clientes"
            hint="Apenas o nome de quem você acredita que pode comprar essa oferta."
            placeholder="Nome da pessoa"
            values={prospects}
            onChange={setProspects}
            layout="chips"
          />
        </FormSection>

        {/* Barra fixa: acompanha a rolagem da tela enquanto o formulário está aberto. */}
        <div className="sticky bottom-0 z-10 flex flex-wrap items-center gap-2 rounded-b-xl border-t border-border bg-card/95 px-5 py-3.5 backdrop-blur sm:px-6">
          <Button type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar oferta"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          {dirty && <span className="ml-1 text-xs text-primary">● Alterações não salvas</span>}
          {error && <span className="text-sm text-destructive">{error}</span>}
          {offer &&
            (confirmDelete ? (
              <span className="ml-auto flex flex-wrap items-center gap-2 text-sm">
                <span className="hidden text-muted-foreground sm:inline">Leads e vendas ligados a ela perdem só o vínculo.</span>
                <Button type="button" variant="outline" size="sm" disabled={deleting} onClick={handleDelete}>
                  {deleting ? "Excluindo..." : "Confirmar exclusão"}
                </Button>
              </span>
            ) : (
              <Button type="button" variant="ghost" size="sm" className="ml-auto" onClick={() => setConfirmDelete(true)}>
                Excluir oferta
              </Button>
            ))}
        </div>
      </form>
    </Card>
  )
}
