import { useState } from "react"
import { useCreateSong } from "../hooks/use-song-mutations"
import type { SongLinkType } from "@/types/enums"

interface AddSongFormProps {
  onSuccess?: () => void
}

export function AddSongForm({ onSuccess }: AddSongFormProps) {
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [linkType, setLinkType] = useState<SongLinkType>("NONE")
  const [linkUrl, setLinkUrl] = useState("")
  const { mutate, isPending, error } = useCreateSong()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !artist.trim()) return

    mutate(
      {
        title: title.trim(),
        artist: artist.trim(),
        link_type: linkType,
        link_url: linkType !== "NONE" ? linkUrl.trim() || undefined : undefined,
      },
      {
        onSuccess: () => {
          setTitle("")
          setArtist("")
          setLinkType("NONE")
          setLinkUrl("")
          onSuccess?.()
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nome da música"
        className="rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-pulse"
      />
      <input
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        placeholder="Artista / banda"
        className="rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-pulse"
      />

      <div className="flex gap-2">
        {(["NONE", "SPOTIFY", "YOUTUBE"] as SongLinkType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setLinkType(type)}
            className={`flex-1 rounded-xl border py-2 text-sm transition ${
              linkType === type
                ? "border-pulse bg-pulse/10 text-pulse"
                : "border-border text-muted-foreground"
            }`}
          >
            {type === "NONE" ? "Sem link" : type === "SPOTIFY" ? "Spotify" : "YouTube"}
          </button>
        ))}
      </div>

      {linkType !== "NONE" && (
        <input
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder={`URL do ${linkType === "SPOTIFY" ? "Spotify" : "YouTube"}`}
          className="rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-pulse"
        />
      )}

      {error && (
        <p className="text-sm text-pulse">Não deu pra adicionar a música. Tenta de novo.</p>
      )}

      <button
        type="submit"
        disabled={!title.trim() || !artist.trim() || isPending}
        className="rounded-xl bg-gradient-pulse py-3 font-medium text-pulse-foreground disabled:opacity-50"
      >
        {isPending ? "Adicionando..." : "Adicionar música"}
      </button>
    </form>
  )
}
