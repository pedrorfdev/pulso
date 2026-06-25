import { useState } from "react"
import { useEventSongs, useOrgSongs } from "../hooks/use-songs"
import { useAddEventSong, useRemoveEventSong } from "../hooks/use-song-mutations"
import { SongCard } from "./song-card"

interface EventSongsListProps {
  eventId: string
  canEdit: boolean
}

/**
 * Músicas de um evento — listagem ordenada + picker pra adicionar da
 * biblioteca. `canEdit` vem do pai baseado em `event.isPublished`.
 *
 * Decisão de UX: ao invés de um form de "nova música" aqui, o usuário
 * seleciona da biblioteca da org. Cria músicas novas na SongLibrary.
 * Isso evita catálogos fragmentados (mesma música com grafias diferentes
 * em eventos distintos).
 */
export function EventSongsList({ eventId, canEdit }: EventSongsListProps) {
  const { data: eventSongs, isLoading } = useEventSongs(eventId)
  const { data: orgSongs } = useOrgSongs()
  const { mutate: addSong, isPending: adding } = useAddEventSong()
  const { mutate: removeSong } = useRemoveEventSong()
  const [selectedSongId, setSelectedSongId] = useState("")

  const eventSongIds = new Set((eventSongs ?? []).map((es) => es.song.id))
  const availableSongs = (orgSongs ?? []).filter((s) => !eventSongIds.has(s.id))

  if (isLoading) {
    return <div className="h-24 animate-pulse rounded-xl bg-surface" />
  }

  return (
    <div className="flex flex-col gap-3">
      {(eventSongs ?? []).length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhuma música adicionada ainda.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {(eventSongs ?? []).map((es) => (
          <SongCard
            key={es.id}
            song={es.song}
            action={
              canEdit ? (
                <button
                  onClick={() =>
                    removeSong({ eventId, eventSongId: es.id })
                  }
                  className="text-xs text-muted-foreground hover:text-pulse"
                >
                  remover
                </button>
              ) : undefined
            }
          />
        ))}
      </div>

      {canEdit && availableSongs.length > 0 && (
        <div className="flex gap-2">
          <select
            value={selectedSongId}
            onChange={(e) => setSelectedSongId(e.target.value)}
            className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-pulse"
          >
            <option value="">Adicionar da biblioteca...</option>
            {availableSongs.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} — {s.artist}
              </option>
            ))}
          </select>
          <button
            disabled={!selectedSongId || adding}
            onClick={() => {
              addSong(
                { eventId, songId: selectedSongId, order: (eventSongs ?? []).length + 1 },
                { onSuccess: () => setSelectedSongId("") }
              )
            }}
            className="rounded-xl bg-pulse px-4 py-2 text-sm font-medium text-pulse-foreground disabled:opacity-50"
          >
            +
          </button>
        </div>
      )}
    </div>
  )
}
