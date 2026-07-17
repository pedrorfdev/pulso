import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEventDetail } from "../hooks/use-event-detail";
import { useAttendanceRealtime } from "../hooks/use-attendance-realtime";
import { useAuth } from "@/shared/hooks/use-auth";
import { useMyRole } from "@/shared/hooks/use-my-role";
import { ConfirmAttendanceButton } from "@/features/attendance/components/confirm-attendance-button";
import { AttendanceStatusList } from "./attendance-status-list";
import { EventSongsList } from "@/features/songs/components/event-songs-list";

export function EventViewPage() {
  const navigate = useNavigate();
  const { eventId } = useParams({ from: "/events/$eventId/view" });
  const { user } = useAuth();
  const { isLeader } = useMyRole();
  const { data: event, isLoading } = useEventDetail(eventId);
  useAttendanceRealtime(eventId);

  if (isLoading || !event) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <div className="h-8 w-1/2 animate-pulse rounded-lg bg-surface" />
        <div className="h-32 animate-pulse rounded-xl bg-surface" />
      </div>
    );
  }

  const mySlot = event.slots.find((s) => s.member.user.id === user?.id);

  return (
    <div className="flex flex-col gap-6 p-6 pb-24">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate({ to: "/schedules" })}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-surface transition"
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
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold text-foreground">
              {event.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {formatEventDate(event.starts_at)}
            </p>
            {event.location && (
              <p className="text-xs text-muted-foreground">{event.location}</p>
            )}
          </div>
        </div>

        {/* Botão editar — só líder/admin vê */}
        {isLeader && (
          <Link
            to="/events/$eventId/manage"
            params={{ eventId: event.id }}
            className="shrink-0 rounded-xl bg-gradient-pulse px-4 py-2 text-sm font-medium text-white"
          >
            Editar escala
          </Link>
        )}
      </div>

      {/* Confirmação — só se escalado */}
      {mySlot ? (
        <ConfirmAttendanceButton
          attendanceId={mySlot.attendance.id}
          eventId={event.id}
          currentStatus={mySlot.attendance.status}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-surface px-4 py-3 text-center">
          <p className="text-sm text-muted-foreground">
            Você não está escalado nesse evento.
          </p>
        </div>
      )}

      {/* Equipe escalada */}
      {event.slots.length > 0 && (
        <section>
          <AttendanceStatusList slots={event.slots} />
        </section>
      )}

      {/* Louvores */}
      <section>
        <p className="mb-2 text-sm text-muted-foreground">Louvores</p>
        <EventSongsList eventId={event.id} canEdit={false} />
      </section>
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
