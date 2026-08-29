export const DIAS_SEMANA = [
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
  "domingo",
] as const;

export type DiaSemana = (typeof DIAS_SEMANA)[number];

export const DIA_LABEL: Record<DiaSemana, string> = {
  segunda: "Segunda-feira",
  terca: "Terça-feira",
  quarta: "Quarta-feira",
  quinta: "Quinta-feira",
  sexta: "Sexta-feira",
  sabado: "Sábado",
  domingo: "Domingo",
};

export const PERIODOS = ["manha", "tarde", "noite"] as const;

export type Periodo = (typeof PERIODOS)[number];

export const PERIODO_LABEL: Record<Periodo, string> = {
  manha: "Manhã",
  tarde: "Tarde",
  noite: "Noite",
};

export type Rotina = Record<DiaSemana, Record<Periodo, string>>;

export function rotinaVazia(): Rotina {
  return DIAS_SEMANA.reduce((acc, dia) => {
    acc[dia] = { manha: "", tarde: "", noite: "" };
    return acc;
  }, {} as Rotina);
}

export type StatusMapeamento = "rascunho" | "concluido";

export interface Mapeamento {
  id: string;
  user_id: string;
  negociaveis: string[];
  inegociaveis: string[];
  rotina: Rotina;
  status: StatusMapeamento;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  nome_completo: string;
  email: string;
}
