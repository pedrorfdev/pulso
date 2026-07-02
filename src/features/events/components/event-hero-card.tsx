import { Link } from "@tanstack/react-router";
import { useAuth } from "@/shared/hooks/use-auth";
import { useEventDetail } from "../hooks/use-event-detail";
import { useAttendanceRealtime } from "../hooks/use-attendance-realtime";
import { ConfirmAttendanceButton } from "@/features/attendance/components/confirm-attendance-button";
import { AvatarStack } from "@/shared/components/avatar-stack";
import { DeadlineCountdown } from "@/shared/components/deadline-countdown";
import { AttendanceStatusList } from "./attendance-status-list";
import type { EventSummary } from "../types";

interface EventHeroCardProps {
  event: EventSummary;
}

export function EventHeroCard({ event }: EventHeroCardProps) {
  const { user } = useAuth();
  const { data: detail, isLoading } = useEventDetail(event.id);
  useAttendanceRealtime(event.id);

  const mySlot = detail?.slots.find((s) => s.member.user.id === user?.id);
  const confirmedSlots = detail?.slots.filter(
    (s) => s.attendance.status === "CONFIRMED",
  );
  const isScheduled = !!mySlot;

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      {/* Header clicável — navega pro detalhe */}
      <Link
        to="/events/$eventId/view"
        params={{ eventId: event.id }}
        className="block p-6 pb-4 hover:bg-surface/80 active:bg-border/20 transition-colors"
      >
        <div className="flex items-start justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Próximo evento
          </p>
          <DeadlineCountdown deadline={event.confirmation_deadline} />
        </div>

        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          {event.title}
        </h2>

        {event.location && (
          <p className="mt-1 text-sm text-muted-foreground">{event.location}</p>
        )}

        <p className="mt-1 text-sm text-muted-foreground">
          {formatEventDate(event.starts_at)}
        </p>

        {/* Avatares dos confirmados */}
        {!isLoading && confirmedSlots && confirmedSlots.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <AvatarStack
              people={confirmedSlots.map((s) => ({
                id: s.member.id,
                name: s.member.user.name,
                avatarUrl: s.member.user.avatar_url,
              }))}
            />
            <span className="text-xs text-muted-foreground">
              {confirmedSlots.length} confirmado
              {confirmedSlots.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Seta indicando que é clicável */}
        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
          <span>Ver detalhes, tech check e louvores</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M4 2l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Link>

      {/* Confirmação — fora do Link pra não conflitar com cliques */}
      <div className="border-t border-border px-6 py-4">
        {isLoading && (
          <div className="h-14 animate-pulse rounded-xl bg-border/40" />
        )}

        {!isLoading && isScheduled && mySlot && (
          <ConfirmAttendanceButton
            attendanceId={mySlot.attendance.id}
            eventId={event.id}
            currentStatus={mySlot.attendance.status}
          />
        )}

        {!isLoading && !isScheduled && (
          <p className="text-center text-sm text-muted-foreground">
            Você não está escalado nesse evento.
          </p>
        )}
      </div>

      {/* Lista da equipe */}
      {!isLoading && detail && detail.slots.length > 0 && (
        <div className="border-t border-border px-6 py-4">
          <AttendanceStatusList slots={detail.slots} />
        </div>
      )}
    </div>
  );
}

function formatEventDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}
