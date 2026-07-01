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

  // Shape real: member.user.id (não member.user_id)
  const mySlot = detail?.slots.find((s) => s.member.user.id === user?.id);
  const confirmedSlots = detail?.slots.filter(
    (s) => s.attendance.status === "CONFIRMED",
  );
  const isScheduled = !!mySlot;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">Próximo evento</p>
        <DeadlineCountdown deadline={event.confirmation_deadline} />
      </div>

      <h2 className="mt-1 text-2xl font-semibold text-foreground">
        {event.title}
      </h2>
      {event.location && (
        <p className="mt-1 text-muted-foreground">{event.location}</p>
      )}
      <p className="mt-1 text-sm text-muted-foreground">
        {formatEventDate(event.starts_at)}
      </p>

      {!isLoading && confirmedSlots && confirmedSlots.length > 0 && (
        <div className="mt-4">
          <AvatarStack
            people={confirmedSlots.map((s) => ({
              id: s.member.id,
              name: s.member.user.name,
              avatarUrl: s.member.user.avatar_url,
            }))}
          />
        </div>
      )}

      <div className="mt-6">
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

        {/* View-only — não escalado, só acompanha */}
        {!isLoading && !isScheduled && (
          <div className="rounded-xl border border-dashed border-border bg-background/40 px-4 py-3 text-center">
            <p className="text-sm text-muted-foreground">
              Você não está escalado pra esse evento — só acompanhando.
            </p>
          </div>
        )}
      </div>

      {!isLoading && detail && detail.slots.length > 0 && (
        <div className="mt-6 border-t border-border pt-6">
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
