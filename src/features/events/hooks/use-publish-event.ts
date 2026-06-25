import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/lib/api-client"
import { useOrgStore } from "@/shared/store/org-store"

export function usePublishEvent() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (eventId: string) =>
      apiClient.post(`/organizations/${activeOrgId}/events/${eventId}/publish`),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ["events", activeOrgId, eventId] })
      queryClient.invalidateQueries({ queryKey: ["events", activeOrgId, "upcoming"] })
    },
  })
}
