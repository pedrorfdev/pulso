import { useMyStats } from "../hooks/use-stats"
import { ReliabilityScore } from "./reliability-score"

/**
 * Visão do membro sobre os próprios stats. Intencionalmente mais
 * "reflexiva" que a visão do líder — menos números, mais contexto
 * humano. O membro não precisa saber a fórmula exata, só entender
 * onde está e o que pode melhorar.
 */
export function MyStatsPage() {
  const { data: stats, isLoading } = useMyStats()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="h-32 animate-pulse rounded-2xl bg-surface" />
        <div className="h-24 animate-pulse rounded-xl bg-surface" />
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold text-foreground">Meu histórico</h1>

      {/* Score em destaque */}
      <div className="flex justify-center rounded-2xl border border-border bg-surface py-8">
        <ReliabilityScore score={stats.reliabilityScore} size="lg" />
      </div>

      {/* Cards de detalhe */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Confirmações no prazo"
          value={stats.confirmedOnTime}
          positive
        />
        <StatCard
          label="Confirmações com atraso"
          value={stats.confirmedLate}
        />
        <StatCard
          label="Faltas justificadas"
          value={stats.absences}
        />
        <StatCard
          label="Prazo perdido"
          value={stats.deadlineMisses}
          negative={stats.deadlineMisses > 0}
        />
        <StatCard
          label="Trocas solicitadas"
          value={stats.swapsRequested}
        />
        <StatCard
          label="Trocas aceitas"
          value={stats.swapsAccepted}
          positive={stats.swapsAccepted > 0}
        />
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Atualizado diariamente à meia-noite.
      </p>
    </div>
  )
}

function StatCard({
  label,
  value,
  positive,
  negative,
}: {
  label: string
  value: number
  positive?: boolean
  negative?: boolean
}) {
  const valueColor = positive
    ? "text-success"
    : negative
    ? "text-pulse"
    : "text-foreground"

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className={`text-2xl font-semibold ${valueColor}`}>{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
