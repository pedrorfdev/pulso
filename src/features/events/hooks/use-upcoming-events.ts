import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/shared/lib/api-client"
import { useOrgStore } from "@/shared/store/org-store"
import type { EventSummary } from "../types"

export function useUpcomingEvents() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)

  return useQuery({
    queryKey: ["events", activeOrgId, "upcoming"],
    queryFn: async () => {
      const { data } = await apiClient.get<EventSummary[]>(
        `/organizations/${activeOrgId}/events`
      )
      return data
    },
    enabled: !!activeOrgId,
  })
}
