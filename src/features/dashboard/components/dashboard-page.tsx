import { Link } from "@tanstack/react-router";
import { useUpcomingEvents } from "@/features/events/hooks/use-upcoming-events";
import { useMyRole } from "@/shared/hooks/use-my-role";
import { EventHeroCard } from "@/features/events/components/event-hero-card";

export function DashboardPage() {
  const { data: events, isLoading } = useUpcomingEvents();
  const { isLeader } = useMyRole();

  const [nextEvent, ...restEvents] = events ?? [];

  return (
    <div className="flex flex-col gap-5 p-4 pb-24">
      {/* Botão "Novo evento" — ação rápida do líder, topo da página */}
      {isLeader && (
        <Link
          to="/events/new"
          className="flex items-center justify-between rounded-2xl bg-gradient-pulse p-4 shadow-lg shadow-pulse/20 active:scale-[0.98] transition-transform"
        >
          <div>
            <p className="text-xs font-medium text-white/70">Líder</p>
            <p className="text-lg font-semibold text-white">
              Criar novo evento
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 4v12M4 10h12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </Link>
      )}

      {/* Hero card do próximo evento */}
      {isLoading ? (
        <DashboardSkeleton />
      ) : nextEvent ? (
        <EventHeroCard event={nextEvent} />
      ) : (
        <EmptyDashboard />
      )}

      {/* Próximos eventos */}
      {restEvents.length > 0 && (
        <section>
          <p className="mb-2 text-sm text-muted-foreground">Próximos eventos</p>
          <div className="flex flex-col gap-2">
            {restEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {event.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatShortDate(event.starts_at)}
                  </p>
                </div>
                {isLeader && (
                  <Link
                    to="/events/$eventId/manage"
                    params={{ eventId: event.id }}
                    className="text-xs text-pulse"
                  >
                    gerenciar
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Equipe — link pra página dedicada */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Equipe</p>
          <Link to="/team" className="text-xs text-pulse">
            ver todos
          </Link>
        </div>
        <Link
          to="/team"
          className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 active:bg-border/40 transition-colors"
        >
          <p className="text-sm text-foreground">Ver membros do grupo</p>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            />
          </svg>
        </Link>
      </section>
    </div>
  );
}

function EmptyDashboard() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 text-center">
      <p className="font-medium text-foreground">
        Nenhum evento por aqui ainda.
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Quando a liderança publicar uma escala, ela aparece aqui.
      </p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-52 animate-pulse rounded-2xl bg-surface" />
    </div>
  );
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}
