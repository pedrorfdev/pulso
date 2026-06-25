import type { EventSlot } from "../types"

interface EventStatsCardsProps {
  slots: EventSlot[]
}

/**
 * Cards de resumo rápido pro líder: confirmados / pendentes / ausentes,
 * num relance — sem precisar ler a lista inteira de nomes.
 */
export function EventStatsCards({ slots }: EventStatsCardsProps) {
  const confirmed = slots.filter((s) => s.attendance.status === "CONFIRMED").length
  const pending = slots.filter((s) => s.attendance.status === "PENDING").length
  const absent = slots.filter(
    (s) =>
      s.attendance.status === "DECLINED" ||
      s.attendance.status === "DEADLINE_MISSED"
  ).length

  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard label="Confirmados" value={confirmed} colorClassName="text-success" />
      <StatCard label="Pendentes" value={pending} colorClassName="text-warning" />
      <StatCard label="Ausentes" value={absent} colorClassName="text-muted-foreground" />
    </div>
  )
}

function StatCard({
  label,
  value,
  colorClassName,
}: {
  label: string
  value: number
  colorClassName: string
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 text-center">
      <p className={`text-2xl font-semibold ${colorClassName}`}>{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
