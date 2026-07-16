import type { Song } from "../types";
import type { SongLinkType } from "@/types/enums";

interface SongCardProps {
  song: Song;
  action?: React.ReactNode;
}

export function SongCard({ song, action }: SongCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
      {/* Thumbnail do Spotify se disponível */}
      <div className="flex items-center gap-3 min-w-0">
        {song.thumbnail_url ? (
          <img
            src={song.thumbnail_url}
            alt={song.title}
            className="h-10 w-10 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-border">
            <MusicNoteIcon />
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {song.title}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {song.artist}
          </p>
          <SongLinkBadge link_type={song.link_type} link_url={song.link_url} />
        </div>
      </div>

      {action && <div className="ml-3 shrink-0">{action}</div>}
    </div>
  );
}

function SongLinkBadge({
  link_type,
  link_url,
}: {
  link_type: SongLinkType;
  link_url: string | null;
}) {
  if (link_type === "NONE" || !link_url) {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-border" />
        sem link
      </span>
    );
  }

  if (link_type === "SPOTIFY") {
    return (
      <a
        href={link_url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs text-[#1DB954] hover:underline"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#1DB954]" />
        Spotify ↗
      </a>
    );
  }

  return (
    <a
      href={link_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 text-xs text-[#FF0000] hover:underline"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#FF0000]" />
      YouTube ↗
    </a>
  );
}

function MusicNoteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M5 10.5V3.5l7-1.5v7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="3.5"
        cy="10.5"
        r="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle
        cx="10.5"
        cy="9"
        r="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}
