import { Link, useParams } from "@tanstack/react-router";
import { useEventDetail } from "../hooks/use-event-detail";
import { useAttendanceRealtime } from "../hooks/use-attendance-realtime";
import { AddSlotForm } from "./add-slot-form";
import { SlotList } from "./slot-list";
import { PublishEventButton } from "./publish-event-button";
import { EventStatsCards } from "./event-stats-cards";
import { EventSongsList } from "@/features/songs/components/event-songs-list";

export function ManageEventPage() {
  const { eventId } = useParams({ from: "/events/$eventId/manage" });
  const { data: event, isLoading } = useEventDetail(eventId);

  // Mantém confirmações atualizadas ao vivo
  useAttendanceRealtime(eventId);

  if (isLoading || !event) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <div className="h-8 w-1/2 animate-pulse rounded-lg bg-surface" />
        <div className="h-32 animate-pulse rounded-xl bg-surface" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 pb-24">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {event.title}
          </h1>
          <span
            className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
              event.is_published
                ? "bg-success/10 text-success"
                : "bg-warning/10 text-warning"
            }`}
          >
            {event.is_published ? "Publicado" : "Rascunho"}
          </span>
        </div>

        {/* Link para visualizar como membro vê */}
        <Link
          to="/dashboard"
          className="shrink-0 rounded-xl border border-border bg-surface px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition"
        >
          ← Voltar
        </Link>
      </div>

      {/* Stats só aparecem quando publicado */}
      {event.is_published && <EventStatsCards slots={event.slots} />}

      {/* Escala — sempre editável (back aceita edição pós-publicação) */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Escala</p>
          <span className="text-xs text-muted-foreground">
            {event.slots.length} escalados
          </span>
        </div>
        <SlotList eventId={event.id} slots={event.slots} canEdit={true} />
      </section>

      {/* Adicionar membro — sempre disponível */}
      <AddSlotForm
        eventId={event.id}
        alreadyAddedMemberIds={event.slots.map((s) => s.member.id)}
        existingSlots={event.slots}
      />

      {/* Louvores */}
      <section>
        <p className="mb-2 text-sm text-muted-foreground">Louvores</p>
        <EventSongsList eventId={event.id} canEdit={true} />
      </section>

      {/* Publicar só aparece se rascunho */}
      {!event.is_published && (
        <PublishEventButton eventId={event.id} slotCount={event.slots.length} />
      )}
    </div>
  );
}
