import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import {
  DIAS_SEMANA,
  DIA_LABEL,
  PERIODOS,
  PERIODO_LABEL,
  type Mapeamento,
} from "@/lib/types";

const COLORS = {
  ink: "#2c2420",
  inkSoft: "#5a4f47",
  terracotta: "#b6572f",
  plum: "#2f2438",
  sage: "#7c8a6e",
  line: "#e4d9c9",
  cream: "#faf6f0",
  creamSoft: "#f2ebe1",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 44,
    fontSize: 10,
    color: COLORS.ink,
    fontFamily: "Helvetica",
  },
  eyebrow: {
    fontSize: 9,
    color: COLORS.plum,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    color: COLORS.ink,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  meta: {
    fontSize: 9,
    color: COLORS.inkSoft,
    marginBottom: 20,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: COLORS.ink,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 9,
    color: COLORS.inkSoft,
    marginBottom: 12,
  },
  columns: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  column: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 8,
    padding: 12,
  },
  columnHeading: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 5,
  },
  bullet: {
    width: 10,
    fontSize: 9,
  },
  listText: {
    flex: 1,
    fontSize: 9.5,
    color: COLORS.ink,
    lineHeight: 1.35,
  },
  emptyText: {
    fontSize: 9,
    color: COLORS.inkSoft,
    fontStyle: "italic",
  },
  table: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: COLORS.creamSoft,
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
  },
  dayCell: {
    width: 78,
    padding: 8,
    justifyContent: "flex-start",
  },
  headerCell: {
    width: 78,
    padding: 8,
  },
  periodHeaderCell: {
    flex: 1,
    padding: 8,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.line,
  },
  periodCell: {
    flex: 1,
    padding: 8,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.line,
  },
  dayLabel: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: COLORS.ink,
  },
  periodHeaderText: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: COLORS.inkSoft,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  periodText: {
    fontSize: 8.5,
    color: COLORS.ink,
    lineHeight: 1.35,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 44,
    right: 44,
    fontSize: 8,
    color: COLORS.inkSoft,
    textAlign: "center",
  },
});

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function MapeamentoPdf({
  mapeamento,
  nomeAluna,
}: {
  mapeamento: Mapeamento;
  nomeAluna: string;
}) {
  return (
    <Document
      title={`Mapeamento de Vida Apaixonante — ${nomeAluna}`}
      author="Instituto Mirra — Mentoria Bússola"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.eyebrow}>Mentoria Bússola · Instituto Mirra</Text>
        <Text style={styles.title}>Mapeamento de Vida Apaixonante</Text>
        <Text style={styles.meta}>
          {nomeAluna} · Gerado em {formatarData(new Date().toISOString())}
        </Text>
        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Negociáveis &amp; Inegociáveis</Text>
        <Text style={styles.sectionSubtitle}>
          O que estou disposta a negociar nas tarefas e rotinas do dia a dia
          — e o que não negocio de jeito nenhum.
        </Text>

        <View style={styles.columns}>
          <View style={styles.column}>
            <Text style={[styles.columnHeading, { color: COLORS.terracotta }]}>
              Estou disposta a negociar
            </Text>
            {mapeamento.negociaveis.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum item registrado.</Text>
            ) : (
              mapeamento.negociaveis.map((item, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={[styles.bullet, { color: COLORS.terracotta }]}>
                    •
                  </Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.column}>
            <Text style={[styles.columnHeading, { color: COLORS.plum }]}>
              Não negocio de jeito nenhum
            </Text>
            {mapeamento.inegociaveis.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum item registrado.</Text>
            ) : (
              mapeamento.inegociaveis.map((item, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={[styles.bullet, { color: COLORS.plum }]}>•</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))
            )}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Rotina da vida apaixonante</Text>
        <Text style={styles.sectionSubtitle}>
          O que quero viver em cada bloco do dia, ao longo da semana.
        </Text>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <View style={styles.headerCell}>
              <Text style={styles.periodHeaderText}>Dia</Text>
            </View>
            {PERIODOS.map((periodo) => (
              <View key={periodo} style={styles.periodHeaderCell}>
                <Text style={styles.periodHeaderText}>
                  {PERIODO_LABEL[periodo]}
                </Text>
              </View>
            ))}
          </View>

          {DIAS_SEMANA.map((dia) => (
            <View key={dia} style={styles.tableRow} wrap={false}>
              <View style={styles.dayCell}>
                <Text style={styles.dayLabel}>{DIA_LABEL[dia]}</Text>
              </View>
              {PERIODOS.map((periodo) => (
                <View key={periodo} style={styles.periodCell}>
                  <Text style={styles.periodText}>
                    {mapeamento.rotina[dia]?.[periodo]?.trim() || "—"}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Mapeamento de Vida Apaixonante · Mentoria Bússola · página ${pageNumber} de ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
