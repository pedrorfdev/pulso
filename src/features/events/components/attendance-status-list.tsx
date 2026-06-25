import type { EventSlot } from "../types"

interface AttendanceStatusListProps { slots: EventSlot[] }

export function AttendanceStatusList({ slots }: AttendanceStatusListProps) {
  const confirmed = slots.filter((s) => s.attendance.status === "CONFIRMED")
  const pending = slots.filter((s) => s.attendance.status === "PENDING")
  const declined = slots.filter((s) => s.attendance.status === "DECLINED")

  return (
    <div className="flex flex-col gap-4">
      {confirmed.length > 0 && <StatusGroup label="Confirmados" slots={confirmed} dotClassName="bg-success" />}
      {pending.length > 0 && <StatusGroup label="Aguardando resposta" slots={pending} dotClassName="bg-warning" />}
      {declined.length > 0 && <StatusGroup label="Não vão" slots={declined} dotClassName="bg-muted-foreground" />}
    </div>
  )
}

function StatusGroup({ label, slots, dotClassName }: { label: string; slots: EventSlot[]; dotClassName: string }) {
  return (
    <div>
      <p className="mb-2 text-sm text-muted-foreground">{label} ({slots.length})</p>
      <div className="flex flex-col gap-2">
        {slots.map((slot) => (
          <div key={slot.id} className="flex items-center gap-3">
            <span className={`h-2 w-2 rounded-full ${dotClassName}`} />
            <span className="text-foreground">{slot.member.name}</span>
            {slot.role_labels.length > 0 && (
              <span className="text-sm text-muted-foreground">· {slot.role_labels.join(", ")}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
