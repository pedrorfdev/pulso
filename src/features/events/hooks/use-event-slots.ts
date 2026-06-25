import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/lib/api-client"
import { useOrgStore } from "@/shared/store/org-store"

interface AddSlotPayload {
  eventId: string
  member_id: string
  role_labels: string[]
  notes?: string
}

export function useAddSlot() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, member_id, role_labels, notes }: AddSlotPayload) =>
      apiClient.post(`/organizations/${activeOrgId}/events/${eventId}/slots`, {
        member_id,
        role_labels,
        notes,
      }),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["events", activeOrgId, eventId] })
    },
  })
}

export function useRemoveSlot() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, slotId }: { eventId: string; slotId: string }) =>
      apiClient.delete(`/organizations/${activeOrgId}/events/${eventId}/slots/${slotId}`),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["events", activeOrgId, eventId] })
    },
  })
}
