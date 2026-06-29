import { useState, useEffect } from "react";
import { useOrgSongs } from "../hooks/use-songs";
import { useDeleteSong, useCreateSong } from "../hooks/use-song-mutations";
import {
  useSpotifySearch,
  type SpotifyTrack,
} from "../hooks/use-spotify-search";
import { SongCard } from "./song-card";

// Debounce simples — sem lib externa
function useDebounce(value: string, ms: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

export function SongLibrary() {
  const { data: songs, isLoading } = useOrgSongs();
  const { mutate: deleteSong } = useDeleteSong();
  const { mutate: createSong, isPending: creating } = useCreateSong();

  const [mode, setMode] = useState<"catalog" | "spotify">("catalog");
  const [localQuery, setLocalQuery] = useState("");
  const [spotifyQuery, setSpotifyQuery] = useState("");
  const debouncedSpotify = useDebounce(spotifyQuery, 400);

  const {
    data: spotifyResults,
    isLoading: searching,
    error: spotifyError,
  } = useSpotifySearch(debouncedSpotify);

  // Filtra catálogo local
  const filtered = (songs ?? []).filter(
    (s) =>
      s.title.toLowerCase().includes(localQuery.toLowerCase()) ||
      s.artist.toLowerCase().includes(localQuery.toLowerCase()),
  );

  function handleAddFromSpotify(track: SpotifyTrack) {
    createSong({
      title: track.title,
      artist: track.artist,
      link_type: "SPOTIFY",
      link_url: track.spotify_url,
      thumbnail_url: track.thumbnail_url ?? undefined,
    });
  }

  const alreadyInCatalog = new Set(
    (songs ?? []).map((s) => s.title + s.artist),
  );

  return (
    <div className="flex flex-col gap-0 pb-24">
      {/* Header com abas */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm px-4 pt-4 pb-0">
        <h1 className="mb-3 text-xl font-semibold text-foreground">Louvores</h1>
        <div className="flex gap-0">
          <TabButton
            active={mode === "catalog"}
            onClick={() => setMode("catalog")}
            first
          >
            Catálogo
          </TabButton>
          <TabButton
            active={mode === "spotify"}
            onClick={() => setMode("spotify")}
            last
          >
            <span className="flex items-center gap-1.5">
              <SpotifyIcon />
              Buscar no Spotify
            </span>
          </TabButton>
        </div>
      </div>

      {/* Catálogo local */}
      {mode === "catalog" && (
        <div className="flex flex-col gap-3 p-4">
          <input
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Buscar por nome ou artista..."
            className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-pulse"
          />

          {isLoading && <SkeletonList />}

          {!isLoading && filtered.length === 0 && (
            <EmptyState
              query={localQuery}
              onAddViaSpotify={() => setMode("spotify")}
            />
          )}

          <div className="flex flex-col gap-2">
            {filtered.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                action={
                  <button
                    onClick={() => deleteSong(song.id)}
                    className="rounded-lg px-2 py-1 text-xs text-muted-foreground hover:text-pulse transition"
                  >
                    remover
                  </button>
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Busca Spotify */}
      {mode === "spotify" && (
        <div className="flex flex-col gap-3 p-4">
          {/* Input com ícone do Spotify */}
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
              <SpotifyIcon size={16} />
            </div>
            <input
              autoFocus
              value={spotifyQuery}
              onChange={(e) => setSpotifyQuery(e.target.value)}
              placeholder="Nome da música ou artista..."
              className="w-full rounded-xl border border-border bg-surface py-3 pl-9 pr-4 text-sm text-foreground outline-none focus:border-[#1DB954]"
            />
            {searching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-[#1DB954]" />
              </div>
            )}
          </div>

          {/* 503 — Spotify não configurado */}
          {spotifyError && (
            <div className="rounded-xl border border-warning/20 bg-warning/5 px-4 py-3">
              <p className="text-sm text-warning">
                Busca no Spotify não está disponível agora.
              </p>
            </div>
          )}

          {/* Resultados */}
          {spotifyResults && spotifyResults.length > 0 && (
            <div className="flex flex-col gap-2">
              {spotifyResults.map((track) => {
                const inCatalog = alreadyInCatalog.has(
                  track.title + track.artist,
                );
                return (
                  <SpotifyTrackCard
                    key={track.spotify_id}
                    track={track}
                    inCatalog={inCatalog}
                    onAdd={() => handleAddFromSpotify(track)}
                    adding={creating}
                  />
                );
              })}
            </div>
          )}

          {/* Empty — digitou mas não achou nada */}
          {spotifyResults?.length === 0 &&
            debouncedSpotify.length >= 2 &&
            !searching && (
              <p className="text-sm text-muted-foreground">
                Nenhuma música encontrada para "{debouncedSpotify}".
              </p>
            )}

          {/* Prompt inicial */}
          {debouncedSpotify.length < 2 && !searching && (
            <div className="flex flex-col items-center gap-2 py-8">
              <SpotifyIcon size={32} />
              <p className="text-sm text-muted-foreground">
                Digite para buscar músicas no Spotify
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Sub-componentes ───────────────────────────────────────────────────────────

function SpotifyTrackCard({
  track,
  inCatalog,
  onAdd,
  adding,
}: {
  track: SpotifyTrack;
  inCatalog: boolean;
  onAdd: () => void;
  adding: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3 transition hover:border-[#1DB954]/40">
      {/* Thumbnail */}
      {track.thumbnail_url ? (
        <img
          src={track.thumbnail_url}
          alt={track.title}
          className="h-11 w-11 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-border">
          <SpotifyIcon size={16} />
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {track.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">{track.artist}</p>
        {track.album && (
          <p className="truncate text-xs text-muted-foreground/60">
            {track.album}
          </p>
        )}
      </div>

      {/* Ação */}
      <div className="flex shrink-0 flex-col items-end gap-1">
        {inCatalog ? (
          <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
            No catálogo
          </span>
        ) : (
          <button
            onClick={onAdd}
            disabled={adding}
            className="rounded-full bg-[#1DB954] px-3 py-1 text-xs font-semibold text-black disabled:opacity-50 active:scale-95 transition-transform"
          >
            + Adicionar
          </button>
        )}
        <a
          href={track.spotify_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-muted-foreground/60 hover:text-[#1DB954] transition"
        >
          abrir ↗
        </a>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
  first,
  last,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  first?: boolean;
  last?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2.5 text-sm font-medium transition border-b-2 ${
        active
          ? "border-pulse text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      } ${first ? "text-left" : "text-right"}`}
    >
      {children}
    </button>
  );
}

function SpotifyIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1DB954">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function SkeletonList() {
  return (
    <div className="flex flex-col gap-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 animate-pulse rounded-xl bg-surface" />
      ))}
    </div>
  );
}

function EmptyState({
  query,
  onAddViaSpotify,
}: {
  query: string;
  onAddViaSpotify: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <p className="text-sm text-muted-foreground">
        {query
          ? `Nenhuma música encontrada para "${query}".`
          : "Nenhuma música no catálogo ainda."}
      </p>
      <button
        onClick={onAddViaSpotify}
        className="flex items-center gap-2 rounded-full border border-[#1DB954]/30 bg-[#1DB954]/10 px-4 py-2 text-sm font-medium text-[#1DB954] transition hover:bg-[#1DB954]/20"
      >
        <SpotifyIcon size={14} />
        Buscar no Spotify
      </button>
    </div>
  );
}
