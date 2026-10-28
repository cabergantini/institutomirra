import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    "Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env"
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type BusinessStructure = {
  id: string
  user_id: string
  business_name: string | null
  what_we_sell: string | null
  icp_summary: string | null
  profit_model: string | null
  value_proposition: string | null
  sales_narrative: string | null
  positioning: string | null
  created_at: string
  updated_at: string
}

export type Icp = {
  id: string
  user_id: string
  business_structure_id: string
  name: string | null
  description: string | null
  age_range: string | null
  business_profile: string | null
  income_or_revenue_range: string | null
  current_situation: string | null
  desired_situation: string | null
  created_at: string
  updated_at: string
}

export type IcpPsychologicalMap = {
  id: string
  user_id: string
  icp_id: string
  pains: string[]
  doubts: string[]
  desires: string[]
  objections: string[]
  fears: string[]
  goals: string[]
  created_at: string
  updated_at: string
}

export type SolutionType =
  | "service"
  | "infoproduct"
  | "mentoring"
  | "consulting"
  | "course"
  | "workshop"
  | "event"
  | "other"

export type SolutionStatus = "active" | "inactive" | "draft"

export type Solution = {
  id: string
  user_id: string
  name: string
  description: string | null
  type: SolutionType
  price: number | null
  status: SolutionStatus
  target_icp_id: string | null
  promise: string | null
  main_problem: string | null
  desired_transformation: string | null
  delivery_format: string | null
  delivery_duration: string | null
  sales_link: string | null
  created_at: string
  updated_at: string
}

export type SolutionPsychologicalMap = {
  id: string
  user_id: string
  solution_id: string
  pains: string[]
  doubts: string[]
  desires: string[]
  objections: string[]
  created_at: string
  updated_at: string
}

export type CrmStageType = "open" | "won" | "lost"

export type CrmStage = {
  id: string
  name: string
  display_order: number
  stage_type: CrmStageType
  active: boolean
  created_at: string
  updated_at: string
}

export type Lead = {
  id: string
  user_id: string
  name: string
  email: string | null
  phone: string | null
  instagram: string | null
  source_channel: string | null
  solution_interest_id: string | null
  offer_id: string | null
  crm_stage_id: string
  estimated_value: number | null
  first_contact_date: string | null
  last_contact_date: string | null
  next_followup_date: string | null
  next_followup_time: string | null
  notes: string | null
  status: string
  created_at: string
  updated_at: string
}

export type LeadInteractionType =
  | "mensagem"
  | "ligacao"
  | "reuniao"
  | "proposta"
  | "followup"
  | "observacao"
  | "outro"

export type LeadInteraction = {
  id: string
  lead_id: string
  user_id: string
  type: LeadInteractionType
  description: string | null
  interaction_date: string
  created_at: string
}

export type FollowupStatus = "pending" | "completed" | "cancelled"

export type Followup = {
  id: string
  lead_id: string
  user_id: string
  scheduled_date: string
  scheduled_time: string | null
  description: string | null
  status: FollowupStatus
  completed_at: string | null
  created_at: string
  updated_at: string
}

export type CustomerStatus = "active" | "archived"

export type Customer = {
  id: string
  user_id: string
  lead_id: string | null
  name: string
  email: string | null
  phone: string | null
  instagram: string | null
  cpf: string | null
  customer_since: string
  notes: string | null
  status: CustomerStatus
  created_at: string
  updated_at: string
}

export type PaymentMethod = "pix" | "cartao" | "boleto" | "transferencia" | "dinheiro" | "outro"
export type SaleStatus = "pending" | "confirmed" | "cancelled" | "refunded"

export type Sale = {
  id: string
  user_id: string
  customer_id: string
  lead_id: string | null
  solution_id: string | null
  offer_id: string | null
  gross_value: number
  discount_value: number
  final_value: number
  payment_method: PaymentMethod
  installments: number
  sale_date: string
  status: SaleStatus
  created_at: string
  updated_at: string
}

export type ReceivableStatus = "pending" | "received" | "overdue" | "cancelled"

export type Receivable = {
  id: string
  sale_id: string
  user_id: string
  customer_id: string
  installment_number: number
  amount: number
  due_date: string
  received_date: string | null
  status: ReceivableStatus
  created_at: string
  updated_at: string
}

export type ExpenseType = "fixed" | "variable"
export type ExpenseStatus = "pending" | "paid" | "cancelled"
export type RecurrenceFrequency = "monthly" | "quarterly" | "semiannual" | "annual"

export type Expense = {
  id: string
  user_id: string
  description: string
  category: string | null
  type: ExpenseType
  amount: number
  due_date: string
  payment_date: string | null
  status: ExpenseStatus
  recurring: boolean
  recurrence_frequency: RecurrenceFrequency | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type ClassType = "live_class" | "mentoring" | "workshop" | "event" | "other"
export type ClassStatus = "draft" | "published" | "cancelled"

export type ClassItem = {
  id: string
  title: string
  description: string | null
  class_date: string
  start_time: string | null
  end_time: string | null
  meeting_url: string | null
  type: ClassType
  status: ClassStatus
  product_id: string | null
  created_at: string
  updated_at: string
}

export type MirraProduct = {
  id: string
  name: string
  sales_page_url: string | null
  created_at: string
  updated_at: string
}

export type StudentProductAccess = {
  id: string
  user_id: string
  product_id: string
  granted_at: string
}

export type AgendaTaskSegment =
  | "estrutura_negocio"
  | "esteira_solucoes"
  | "crm"
  | "calendario_vendas"
  | "magic_plan"
  | "metas"
  | "financeiro"
  | "geral"

export type AgendaTaskStatus = "pending" | "done" | "cancelled"

export type AgendaRecurrenceFrequency = "daily" | "weekly" | "biweekly" | "monthly" | "custom"

export type AgendaTask = {
  id: string
  user_id: string
  title: string
  description: string | null
  segment: AgendaTaskSegment
  due_date: string
  original_due_date: string
  status: AgendaTaskStatus
  completed_at: string | null
  reschedule_count: number
  created_at: string
  updated_at: string
  /** Horário opcional (formato "HH:MM" ou "HH:MM:SS", como o Postgres devolve). Usado só
   * pra ordenar/exibir — não interfere em nada do resto da lógica de datas. */
  start_time: string | null
  end_time: string | null
  /** Agrupa as tarefas que nasceram juntas de uma recorrência ou de um período de vários
   * dias — cada ocorrência é uma linha normal em agenda_tasks, com sua própria due_date. */
  series_id: string | null
  /** Preenchido só nas ocorrências de uma tarefa recorrente (null numa tarefa única ou
   * numa tarefa de vários dias, que não se repete, só "dura" um período). */
  recurrence_frequency: AgendaRecurrenceFrequency | null
  /** Quem criou a tarefa (preenchido sozinho, é quem está logada no momento de criar) e
   * quem é responsável por ela (escolhida no formulário — pode ser outra pessoa da conta). */
  created_by: string | null
  responsible_user_id: string | null
}

export type PublishStatus = "draft" | "published"

/** Um material anexado a uma gravação (apostila, planilha etc.) — ver RecordingMaterial. */
export type RecordingMaterial = { name: string; url: string }

export type Recording = {
  id: string
  title: string
  description: string | null
  module: string | null
  class_date: string | null
  video_url: string | null
  /** @deprecated Campo antigo, de quando só dava pra anexar um material por gravação —
   * mantido só pra gravações antigas que ainda têm um link aqui e nada em `materials`. Novas
   * gravações usam `materials` (lista), que permite vários arquivos. Ver RecordingMaterial. */
  materials_url: string | null
  /** Lista de materiais anexados (apostilas, planilhas, PDFs...) — cada um com um nome pra
   * mostrar e o link (de upload direto ou colado). Pode ter quantos a admin quiser. */
  materials: RecordingMaterial[]
  thumbnail_url: string | null
  status: PublishStatus
  display_order: number
  product_id: string | null
  /** Aula (classes.id) que deu origem a essa gravação, quando criada a partir do botão
   * "Criar gravação" na página Aulas — ver src/pages/admin-aulas.tsx. null pra gravações
   * cadastradas direto em Gravações, sem vínculo com uma aula. */
  class_id: string | null
  created_at: string
  updated_at: string
}

export type MentoringToolType =
  | "spreadsheet"
  | "pdf"
  | "template"
  | "link"
  | "prompt"
  | "checklist"
  | "external_tool"
  | "interactive"
  | "other"

export type MentoringTool = {
  id: string
  title: string
  description: string | null
  type: MentoringToolType
  url: string | null
  file_url: string | null
  category: string | null
  status: PublishStatus
  display_order: number
  /** Só preenchido em ferramentas do tipo "interactive" — identifica qual tela do app abrir
   * (ver src/lib/mentoring-tools/*.ts e a rota /ferramentas/:slug). */
  slug: string | null
  /** Aula a que a ferramenta pertence (ex.: "Aula 2 — Identidade e posicionamento"). Agrupa as ferramentas na página /ferramentas. */
  lesson: string | null
  /** Se preenchido, só quem tem acesso liberado a esse produto (student_product_access) vê o
   * conteúdo da ferramenta — as demais veem um aviso de conteúdo exclusivo. Null = aberta pra
   * qualquer aluna. Mesmo esquema usado em Recording.product_id (Gravações). */
  product_id: string | null
  created_at: string
  updated_at: string
}

/** Resposta da aluna a uma ferramenta interativa (ex.: Mapeamento da Vida Apaixonante) —
 * "payload" é livre (cada ferramenta define seu próprio formato) e a Mi lê essas respostas
 * como contexto (ver src/lib/mi-context.ts). */
export type MentoringToolResponse = {
  id: string
  tool_id: string
  user_id: string
  payload: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type Profile = {
  id: string
  full_name: string | null
  role: "aluna" | "admin"
  status: "active" | "inactive"
  created_at: string
  avatar_url: string | null
  birth_date: string | null
  phone: string | null
  cpf: string | null
  cnpj: string | null
  instagram: string | null
  personal_address: string | null
  business_address: string | null
  updated_at: string
}

export type AcquisitionChannel = {
  id: string
  name: string
  display_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export type ExpenseCategory = {
  id: string
  name: string
  display_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export type AiConversation = {
  id: string
  user_id: string
  title: string | null
  context_type: string
  context_id: string | null
  created_at: string
  updated_at: string
}

export type AiMessageRole = "user" | "assistant"

export type AiMessage = {
  id: string
  conversation_id: string
  role: AiMessageRole
  content: string
  created_at: string
}

export type AiActionStatus = "proposed" | "confirmed" | "executed" | "cancelled" | "failed"

export type AiAction = {
  id: string
  user_id: string
  conversation_id: string | null
  action_type: string
  entity_type: string
  entity_id: string | null
  payload: Record<string, unknown>
  status: AiActionStatus
  error_message: string | null
  created_at: string
  confirmed_at: string | null
  executed_at: string | null
}

export type GoalType = "revenue" | "sales" | "new_clients" | "leads" | "custom" | "renewals" | "qualitative"
export type GoalKind = "quantitative" | "qualitative"
export type GoalProgressStatus = "not_started" | "in_progress" | "done"
export type GoalRevenueMode = "total" | "monthly_avg"
export type GoalStatus = "active" | "completed" | "cancelled"

export type BusinessGoal = {
  id: string
  user_id: string
  goal_type: GoalType
  /** Qualitativas guardam 0 aqui (não há número). */
  target_value: number
  start_date: string
  end_date: string
  status: GoalStatus
  kind: GoalKind
  /** Meta escrita pela aluna (o "S" do SMART). Metas antigas não têm. */
  title: string | null
  /** Qualitativa: como saber que concluiu (o "M"). */
  measure_note: string | null
  achievable: string | null
  relevant: string | null
  revenue_mode: GoalRevenueMode
  progress_status: GoalProgressStatus
  /** Renovações: realizado informado à mão. */
  manual_progress: number | null
  created_at: string
  updated_at: string
}

export type InsightPriority = "low" | "medium" | "high"
export type InsightStatus = "active" | "seen" | "dismissed" | "resolved" | "expired"
export type InteractionStyle = "inform" | "celebrate" | "question" | "challenge" | "warn" | "recommend"

export type MiInsight = {
  id: string
  user_id: string
  type: string
  category: string
  title: string
  description: string
  priority: InsightPriority
  source_type: string | null
  source_ids: string[]
  suggested_action: string | null
  interaction_style: InteractionStyle | null
  status: InsightStatus
  generated_at: string
  expires_at: string | null
}

export type MiCelebration = {
  id: string
  user_id: string
  event_type: string
  entity_type: string
  entity_id: string | null
  title: string
  message: string
  seen: boolean
  created_at: string
}

export type MarketSignalType = "pain" | "desire" | "doubt" | "objection" | "question" | "feedback" | "loss_reason"
export type MarketSignalSource = "manual" | "crm" | "mi" | "customer" | "other"

export type MarketSignal = {
  id: string
  user_id: string
  lead_id: string | null
  customer_id: string | null
  solution_id: string | null
  interaction_id: string | null
  signal_type: MarketSignalType
  content: string
  source: MarketSignalSource
  created_at: string
}

export type LeadObjectionCategory = "price" | "time" | "priority" | "trust" | "implementation" | "decision" | "offer_fit" | "other"

export type LeadObjection = {
  id: string
  user_id: string
  lead_id: string
  category: LeadObjectionCategory
  description: string
  created_at: string
}

export type ContentPlanFormat = "post" | "carrossel" | "reel" | "stories" | "caixinha" | "email" | "whatsapp"
export type ContentPlanObjective = "atrair" | "conectar" | "educar" | "quebrar_objecao" | "gerar_desejo" | "vender" | "reativar"
export type ContentPlanStatus = "idea" | "planned" | "ready" | "published"

export type ContentPlanItem = {
  id: string
  user_id: string
  planned_date: string
  format: ContentPlanFormat
  objective: ContentPlanObjective
  title: string
  status: ContentPlanStatus
  solution_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type SalesCampaignType = "lancamento" | "promocao" | "reativacao" | "evento" | "outro"
export type SalesCampaignStatus = "planned" | "active" | "completed" | "cancelled"

export type SalesCampaign = {
  id: string
  user_id: string
  name: string
  campaign_type: SalesCampaignType
  start_date: string
  end_date: string
  target_solution_id: string | null
  goal_value: number | null
  status: SalesCampaignStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export type GoogleCalendarConnection = {
  id: string
  user_id: string
  access_token: string
  refresh_token: string
  token_expiry: string
  calendar_id: string
  connected_at: string
  created_at: string
  updated_at: string
}

export type AdminStudent = {
  id: string
  full_name: string | null
  email: string | null
  role: "aluna" | "admin"
  status: "active" | "inactive"
  created_at: string
  last_sign_in_at: string | null
}

export type AdminStudentSignal = {
  id: string
  full_name: string | null
  email: string | null
  status: "active" | "inactive"
  created_at: string
  last_sign_in_at: string | null
  business_structure_filled: boolean
  leads_count: number
  sales_count_90d: number
  sales_total_90d: number
  ai_messages_count: number
  goals_active_count: number
  google_connected: boolean
}

/** Uma sub-usuária de uma conta (ex.: sócia) — login próprio, mesmos dados de negócio da
 * conta dona. Listada em Admin → Alunas → Editar → "Sub-usuárias desta conta". */
export type AccountMember = {
  id: string
  member_user_id: string
  full_name: string | null
  email: string | null
  created_at: string
  last_sign_in_at: string | null
}

/** Dona da conta ou uma de suas sub-usuárias — usado no seletor de "Responsável" da Agenda
 * e em qualquer lugar que precise listar "quem é dessa conta". */
export type AccountPerson = {
  id: string
  full_name: string | null
}

export type ActivityLogAction = "create" | "update" | "delete"

/** Uma linha do log de atividades (Admin → Alunas → Editar → "Log de atividades"): quem fez
 * o quê, em qual área do negócio. */
export type ActivityLogEntry = {
  id: string
  actor_user_id: string | null
  actor_name: string | null
  actor_email: string | null
  action: ActivityLogAction
  entity_type: string
  entity_id: string | null
  entity_label: string | null
  created_at: string
}

export type SolutionOfferStatus = "active" | "closed"

export type SolutionOffer = {
  id: string
  user_id: string
  solution_id: string
  name: string
  status: SolutionOfferStatus
  price: number | null
  includes: string | null
  promised_result: string | null
  time_to_result: string | null
  why_buy: string | null
  why_not_buy: string | null
  sales_link: string | null
  /** O que o cliente recebe, um item por linha da lista. */
  deliverables: string[]
  /** Bônus Retorno do Rei: melhor do que a solução vendida. */
  bonus_king: string[]
  /** Bônus perpétuo: acesso de longo prazo (3 meses, 6 meses, 1 ano...). */
  bonus_perpetual: string[]
  /** Bônus de ascensão e recorrência: estimula a próxima compra e aumenta o LTV. */
  bonus_ascension: string[]
  orderbumps: string[]
  upsells: string[]
  /** Só nomes. */
  prospects: string[]
  created_at: string
  updated_at: string
}
