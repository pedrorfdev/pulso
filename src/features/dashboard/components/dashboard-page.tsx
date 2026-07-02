import { Link } from "@tanstack/react-router";
import { useUpcomingEvents } from "@/features/events/hooks/use-upcoming-events";
import { useEventDetail } from "@/features/events/hooks/use-event-detail";
import { useMyRole } from "@/shared/hooks/use-my-role";
import { useAuth } from "@/shared/hooks/use-auth";
import { EventHeroCard } from "@/features/events/components/event-hero-card";

export function DashboardPage() {
  const { data: events, isLoading } = useUpcomingEvents();
  const { isLeader } = useMyRole();

  const [nextEvent, ...restEvents] = events ?? [];

  return (
    <div className="flex flex-col gap-5 p-4 pb-24">
      {/* Ação rápida do líder — canto superior, discreto mas rápido */}
      {isLeader && (
        <div className="flex justify-end">
          <Link
            to="/events/new"
            className="flex items-center gap-2 rounded-xl bg-gradient-pulse px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-pulse/30 active:scale-95 transition-transform"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 2v10M2 7h10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Novo evento
          </Link>
        </div>
      )}

      {/* Hero do próximo evento */}
      {isLoading ? (
        <div className="h-52 animate-pulse rounded-2xl bg-surface" />
      ) : nextEvent ? (
        <EventHeroCard event={nextEvent} />
      ) : (
        <EmptyState />
      )}

      {/* Próximos eventos — cards compactos com função e status */}
      {restEvents.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Próximos eventos
            </p>
            <Link to="/schedules" className="text-xs text-pulse">
              ver todos
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {restEvents.map((event) => (
              <UpcomingEventCard
                key={event.id}
                eventId={event.id}
                title={event.title}
                startsAt={event.starts_at}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Card quadrado de evento futuro — mostra a função do usuário naquele evento
function UpcomingEventCard({
  eventId,
  title,
  startsAt,
}: {
  eventId: string;
  title: string;
  startsAt: string;
}) {
  const { user } = useAuth();
  const { data: detail } = useEventDetail(eventId);

  const mySlot = detail?.slots.find((s) => s.member.user.id === user?.id);
  const myRoles = mySlot?.role_labels.join(", ");
  const status = mySlot?.attendance.status;

  const statusDot =
    status === "CONFIRMED"
      ? "bg-success"
      : status === "DECLINED"
        ? "bg-muted-foreground"
        : status === "PENDING"
          ? "bg-warning"
          : null;

  return (
    <Link
      to="/events/$eventId/view"
      params={{ eventId }}
      className="flex flex-col justify-between rounded-xl border border-border bg-surface p-3 transition hover:border-pulse/30 active:bg-border/20 min-h-[96px]"
    >
      <div>
        <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
          {title}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatShortDate(startsAt)}
        </p>
      </div>

      <div className="mt-2 flex items-center justify-between">
        {myRoles ? (
          <span className="truncate text-xs text-muted-foreground">
            {myRoles}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground/50">não escalado</span>
        )}
        {statusDot && (
          <span className={`ml-1 h-2 w-2 shrink-0 rounded-full ${statusDot}`} />
        )}
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
      <p className="font-medium text-foreground">
        Nenhum evento publicado ainda.
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Quando a liderança publicar uma escala, aparece aqui.
      </p>
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
