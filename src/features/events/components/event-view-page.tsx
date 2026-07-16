import { useNavigate, useParams } from "@tanstack/react-router";
import { useEventDetail } from "../hooks/use-event-detail";
import { useAttendanceRealtime } from "../hooks/use-attendance-realtime";
import { useAuth } from "@/shared/hooks/use-auth";
import { ConfirmAttendanceButton } from "@/features/attendance/components/confirm-attendance-button";
import { AttendanceStatusList } from "./attendance-status-list";
import { EventSongsList } from "@/features/songs/components/event-songs-list";

/**
 * Visualização de um evento por qualquer membro — escalado ou não.
 * Quem está escalado vê o botão de confirmação; quem não está, só
 * acompanha (slots, louvores, link pro tech check em modo leitura).
 */
export function EventViewPage() {
  const navigate = useNavigate();
  const { eventId } = useParams({ from: "/events/$eventId/view" });
  const { user } = useAuth();
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
  const isScheduled = !!mySlot;

  return (
    <div className="flex flex-col gap-6 p-6 pb-24">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate({ to: "/schedules" })}
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
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {event.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {formatEventDate(event.starts_at)}
          </p>
        </div>
      </div>

      {/* Confirmação — só se escalado */}
      {isScheduled && mySlot && (
        <ConfirmAttendanceButton
          attendanceId={mySlot.attendance.id}
          eventId={event.id}
          currentStatus={mySlot.attendance.status}
        />
      )}

      {!isScheduled && (
        <div className="rounded-xl border border-dashed border-border bg-surface px-4 py-3 text-center">
          <p className="text-sm text-muted-foreground">
            Você não está escalado — acompanhando como visitante.
          </p>
        </div>
      )}

      {/* Escala — sempre visível, sem botão de editar */}
      {event.slots.length > 0 && <AttendanceStatusList slots={event.slots} />}

      {/* Louvores — leitura */}
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
