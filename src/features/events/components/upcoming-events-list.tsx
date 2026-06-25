import type { EventSummary } from "../types"

interface UpcomingEventsListProps { events: EventSummary[] }

export function UpcomingEventsList({ events }: UpcomingEventsListProps) {
  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum outro evento agendado.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">Próximos eventos</p>
      {events.map((event) => (
        <div key={event.id} className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
          <div>
            <p className="text-foreground">{event.title}</p>
            <p className="text-sm text-muted-foreground">{formatShortDate(event.starts_at)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function formatShortDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
}
