import type { SongLinkType } from "@/types/enums"

interface SongLinkBadgeProps {
  linkType: SongLinkType
  linkUrl: string | null
}

/**
 * Indicador visual compacto de onde a música está linkada.
 * Se tiver URL, é clicável e abre numa nova aba.
 * Design: ponto colorido + label — discreto o suficiente pra não
 * competir com o nome da música, mas imediatamente reconhecível.
 */
export function SongLinkBadge({ linkType, linkUrl }: SongLinkBadgeProps) {
  if (linkType === "NONE" || !linkUrl) {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-border" />
        sem link
      </span>
    )
  }

  if (linkType === "SPOTIFY") {
    return (
      <a
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs text-[#1DB954] hover:underline"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#1DB954]" />
        Spotify
      </a>
    )
  }

  return (
    <a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 text-xs text-[#FF0000] hover:underline"
    >
      <YouTubeIcon />
      YouTube
    </a>
  )
}

function YouTubeIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="#FF0000"
      aria-hidden="true"
    >
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
    </svg>
  )
}
