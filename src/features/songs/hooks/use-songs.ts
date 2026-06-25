import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/shared/lib/api-client"
import { useOrgStore } from "@/shared/store/org-store"
import type { Song, EventSong } from "../types"

export function useOrgSongs() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)

  return useQuery({
    queryKey: ["songs", activeOrgId],
    queryFn: async () => {
      const { data } = await apiClient.get<Song[]>(`/organizations/${activeOrgId}/songs`)
      return data
    },
    enabled: !!activeOrgId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useEventSongs(eventId: string | undefined) {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)

  return useQuery({
    queryKey: ["songs", activeOrgId, "event", eventId],
    queryFn: async () => {
      const { data } = await apiClient.get<EventSong[]>(
        `/organizations/${activeOrgId}/events/${eventId}/songs`
      )
      return data
    },
    enabled: !!activeOrgId && !!eventId,
  })
}
