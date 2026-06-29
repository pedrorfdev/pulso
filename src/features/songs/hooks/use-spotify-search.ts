import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import { useOrgStore } from "@/shared/store/org-store";

export interface SpotifyTrack {
  spotify_id: string;
  title: string;
  artist: string;
  album: string;
  thumbnail_url: string | null;
  spotify_url: string;
  preview_url: string | null;
}

export function useSpotifySearch(query: string) {
  const activeOrgId = useOrgStore((s) => s.activeOrgId);
  const enabled = !!activeOrgId && query.trim().length >= 2;

  return useQuery({
    queryKey: ["spotify-search", activeOrgId, query],
    queryFn: async () => {
      const { data } = await apiClient.get<SpotifyTrack[]>(
        `/organizations/${activeOrgId}/songs/search`,
        { params: { q: query.trim() } },
      );
      return data;
    },
    enabled,
    staleTime: 60_000,
    // Não retry em 503 — Spotify não configurado
    retry: (count, error: any) => error?.response?.status !== 503 && count < 2,
  });
}
