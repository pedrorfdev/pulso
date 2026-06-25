import { useState } from "react"
import { useOrgSongs } from "../hooks/use-songs"
import { useDeleteSong } from "../hooks/use-song-mutations"
import { SongCard } from "./song-card"
import { AddSongForm } from "./add-song-form"

/**
 * Biblioteca completa de músicas da org. Busca é feita localmente no
 * array — não tem rota de search no back (YAGNI: o catálogo raramente
 * passa de algumas dezenas de músicas num grupo de jovens). Se o volume
 * crescer muito, aí vale pensar em search server-side.
 */
export function SongLibrary() {
  const { data: songs, isLoading } = useOrgSongs()
  const { mutate: deleteSong } = useDeleteSong()
  const [query, setQuery] = useState("")
  const [showForm, setShowForm] = useState(false)

  const filtered = (songs ?? []).filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.artist.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Louvores</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-xl border border-border bg-surface px-4 py-2 text-sm text-foreground"
        >
          {showForm ? "Cancelar" : "+ Adicionar"}
        </button>
      </div>

      {showForm && (
        <AddSongForm onSuccess={() => setShowForm(false)} />
      )}

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por nome ou artista..."
        className="rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-pulse"
      />

      {isLoading && (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-surface" />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {query ? "Nenhuma música encontrada." : "Nenhuma música no catálogo ainda."}
        </p>
      )}

      <div className="flex flex-col gap-2">
        {filtered.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            action={
              <button
                onClick={() => deleteSong(song.id)}
                className="text-xs text-muted-foreground hover:text-pulse"
              >
                remover
              </button>
            }
          />
        ))}
      </div>
    </div>
  )
}
