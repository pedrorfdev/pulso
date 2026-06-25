import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/shared/lib/api-client"
import { useOrgStore } from "@/shared/store/org-store"
import { db, isExpired } from "@/shared/lib/db"
import type { EventDetail } from "../types"

async function fetchEventDetail(orgId: string, eventId: string): Promise<EventDetail> {
  try {
    const { data } = await apiClient.get<EventDetail>(
      `/organizations/${orgId}/events/${eventId}`
    )
    db.events.put({ ...data, orgId, cachedAt: Date.now() }).catch(() => {})
    return data
  } catch (err) {
    const cached = await db.events.get(eventId)
    if (cached && !isExpired(cached.cachedAt)) return cached
    throw err
  }
}

export function useEventDetail(eventId: string | undefined) {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)

  return useQuery({
    queryKey: ["events", activeOrgId, eventId],
    queryFn: () => fetchEventDetail(activeOrgId!, eventId!),
    enabled: !!activeOrgId && !!eventId,
  })
}
