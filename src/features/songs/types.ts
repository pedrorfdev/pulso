import type { SongLinkType } from "@/types/enums";

export interface Song {
  id: string;
  title: string;
  artist: string;
  link_type: SongLinkType;
  link_url: string | null;
  thumbnail_url: string | null;
}

export interface EventSong {
  id: string;
  order: number;
  notes: string | null;
  song: Song;
}
