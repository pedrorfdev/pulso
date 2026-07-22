import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useUpcomingEvents } from "@/features/events/hooks/use-upcoming-events";
import { useEventDetail } from "@/features/events/hooks/use-event-detail";
import { useMyRole } from "@/shared/hooks/use-my-role";
import { useAuth } from "@/shared/hooks/use-auth";
import { EventHeroCard } from "@/features/events/components/event-hero-card";
import { InviteModal } from "@/features/organizations/components/invite-modal";

export function DashboardPage() {
  const { data: events, isLoading } = useUpcomingEvents();
  const { isLeader } = useMyRole();
  const [showInvite, setShowInvite] = useState(false);

  const [nextEvent, ...restEvents] = events ?? [];

  return (
    <div className="flex flex-col gap-5 p-4 pb-24">
      {/* Ações rápidas do líder */}
      {isLeader && (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-muted-foreground hover:border-pulse/40 hover:text-foreground transition"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle
                cx="5.5"
                cy="4"
                r="2.5"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M1 12c0-2.5 2-4 4.5-4M10 8v4M8 10h4"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            Convidar
          </button>
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
        <EmptyState isLeader={isLeader} onInvite={() => setShowInvite(true)} />
      )}

      {/* Grid de próximos eventos */}
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

      {/* Modal de convite */}
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </div>
  );
}

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
      className="flex flex-col justify-between rounded-xl border border-border bg-surface p-3 transition hover:border-pulse/30 active:bg-border/20 min-h-24"
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

function EmptyState({
  isLeader,
  onInvite,
}: {
  isLeader: boolean;
  onInvite: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
      <p className="font-medium text-foreground">
        Nenhum evento publicado ainda.
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {isLeader
          ? "Crie um evento e convide sua equipe."
          : "Quando a liderança publicar uma escala, aparece aqui."}
      </p>
      {isLeader && (
        <button
          onClick={onInvite}
          className="mt-4 text-sm text-pulse hover:underline"
        >
          Convidar membros →
        </button>
      )}
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
