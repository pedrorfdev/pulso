import { useParams } from "@tanstack/react-router"
import { useEventDetail } from "../hooks/use-event-detail"
import { useAttendanceRealtime } from "../hooks/use-attendance-realtime"
import { AddSlotForm } from "./add-slot-form"
import { SlotList } from "./slot-list"
import { PublishEventButton } from "./publish-event-button"
import { EventStatsCards } from "./event-stats-cards"
import { EventSongsList } from "@/features/songs/components/event-songs-list"

/**
 * Tela de gestão do evento pelo líder — junta os 3 passos da Jornada 4:
 * adicionar membros, publicar, e acompanhar confirmações ao vivo.
 *
 * O MESMO componente serve tanto pro evento em rascunho (mostra o form
 * de adicionar slot + botão de publicar) quanto pro evento já publicado
 * (esconde edição, mostra só acompanhamento ao vivo) — a UI se adapta
 * lendo `event.is_published`, espelhando a regra de bloqueio do back
 * (T4.5: evento publicado não pode ter slots alterados).
 */
export function ManageEventPage() {
  const { eventId } = useParams({ from: "/events/$eventId/manage" })
  const { data: event, isLoading } = useEventDetail(eventId)

  // Mantém os status de presença atualizados ao vivo enquanto o líder
  // acompanha a tela — é o "Acompanha confirmações live" da Jornada 4.
  useAttendanceRealtime(eventId)

  if (isLoading || !event) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <div className="h-8 w-1/2 animate-pulse rounded-lg bg-surface" />
        <div className="h-32 animate-pulse rounded-xl bg-surface" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{event.title}</h1>
        <p className="text-sm text-muted-foreground">
          {event.is_published ? "Publicado" : "Rascunho — ainda não publicado"}
        </p>
      </div>

      {event.is_published && <EventStatsCards slots={event.slots} />}

      <div>
        <p className="mb-2 text-sm text-muted-foreground">Escala</p>
        <SlotList
          eventId={event.id}
          slots={event.slots}
          canEdit={!event.is_published}
        />
      </div>

      <div>
        <p className="mb-2 text-sm text-muted-foreground">Louvores</p>
        <EventSongsList eventId={event.id} canEdit={!event.is_published} />
      </div>

      {!event.is_published && (
        <>
          <AddSlotForm
            eventId={event.id}
            alreadyAddedMemberIds={event.slots.map((s) => s.member.id)}
          />
          <PublishEventButton eventId={event.id} slotCount={event.slots.length} />
        </>
      )}
    </div>
  )
}
