import type { SongLinkType } from "@/types/enums"

export interface Song {
  id: string
  title: string
  artist: string
  linkType: SongLinkType
  linkUrl: string | null
  thumbnailUrl: string | null
}

/**
 * Vínculo de uma música com um evento específico — tem `order` pra
 * definir a ordem de louvor e `notes` pra observações do líder
 * (ex: "só o refrão", "versão acústica").
 */
export interface EventSong {
  id: string
  order: number
  notes: string | null
  song: Song
}
