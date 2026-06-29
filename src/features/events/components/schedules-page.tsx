import { Link, useNavigate } from "@tanstack/react-router";
import { useUpcomingEvents } from "@/features/events/hooks/use-upcoming-events";
import { useMyRole } from "@/shared/hooks/use-my-role";
import type { EventSummary } from "@/features/events/types";

const STATUS_COLORS: Record<string, string> = {
  published: "text-success",
  draft: "text-warning",
};

export function SchedulesPage() {
  const navigate = useNavigate();
  const { data: events, isLoading } = useUpcomingEvents();
  const { isLeader } = useMyRole();

  // Separamos futuros de passados (a API retorna todos os publicados)
  const now = Date.now();
  const upcoming = (events ?? []).filter(
    (e) => new Date(e.starts_at).getTime() >= now,
  );
  const past = (events ?? []).filter(
    (e) => new Date(e.starts_at).getTime() < now,
  );

  return (
    <div className="flex flex-col gap-5 p-4 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-surface transition"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 4L6 8l4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-foreground">Escalas</h1>
        </div>
        {isLeader && (
          <Link
            to="/events/new"
            className="rounded-xl bg-gradient-pulse px-4 py-2 text-sm font-medium text-white"
          >
            + Novo
          </Link>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-surface" />
          ))}
        </div>
      )}

      {!isLoading && upcoming.length === 0 && past.length === 0 && (
        <div className="rounded-xl border border-border bg-surface p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhuma escala publicada ainda.
          </p>
        </div>
      )}

      {upcoming.length > 0 && (
        <section>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Próximos
          </p>
          <EventList events={upcoming} isLeader={isLeader} />
        </section>
      )}

      {past.length > 0 && (
        <section>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Histórico
          </p>
          <EventList events={past} isLeader={isLeader} isPast />
        </section>
      )}
    </div>
  );
}

function EventList({
  events,
  isLeader,
  isPast = false,
}: {
  events: EventSummary[];
  isLeader: boolean;
  isPast?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      {events.map((event) => (
        <div
          key={event.id}
          className={`flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 ${isPast ? "opacity-60" : ""}`}
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {event.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(event.starts_at)}
            </p>
            {event.location && (
              <p className="text-xs text-muted-foreground truncate">
                {event.location}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2 ml-2">
            {!event.is_published && (
              <span className="text-xs text-warning">rascunho</span>
            )}
            {isLeader && !isPast && (
              <Link
                to="/events/$eventId/manage"
                params={{ eventId: event.id }}
                className="text-xs text-pulse"
              >
                gerenciar
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
