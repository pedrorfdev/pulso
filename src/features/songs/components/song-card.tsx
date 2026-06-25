import { SongLinkBadge } from "./song-link-badge"
import type { Song } from "../types"

interface SongCardProps {
  song: Song
  action?: React.ReactNode
}

/**
 * Card de música reutilizável — aparece tanto na biblioteca da org
 * quanto na lista de músicas do evento. `action` é um slot opcional
 * pra o pai injetar botões contextuais (ex: "Adicionar ao evento" na
 * biblioteca, "Remover" na lista do evento, "Excluir" no admin).
 */
export function SongCard({ song, action }: SongCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="truncate text-sm font-medium text-foreground">
          {song.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
        <SongLinkBadge linkType={song.linkType} linkUrl={song.linkUrl} />
      </div>

      {action && <div className="ml-3 shrink-0">{action}</div>}
    </div>
  )
}
