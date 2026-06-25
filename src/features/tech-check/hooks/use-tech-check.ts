import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/lib/api-client"
import { useOrgStore } from "@/shared/store/org-store"
import type { TechCheckItem } from "../types"
import type { CheckItemStatus } from "@/types/enums"

export function useTechCheck(eventId: string | undefined) {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)

  return useQuery({
    queryKey: ["tech-check", activeOrgId, eventId],
    queryFn: async () => {
      const { data } = await apiClient.get<TechCheckItem[]>(
        `/organizations/${activeOrgId}/events/${eventId}/tech-check`
      )
      return data
    },
    enabled: !!activeOrgId && !!eventId,
  })
}

export function useCreateTechCheckItem() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, label, category, isCritical }: { eventId: string; label: string; category: string; isCritical: boolean }) =>
      apiClient.post(`/organizations/${activeOrgId}/events/${eventId}/tech-check`, {
        label,
        category,
        is_critical: isCritical,
      }),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["tech-check", activeOrgId, eventId] })
    },
  })
}

export function useDeleteTechCheckItem() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, itemId }: { eventId: string; itemId: string }) =>
      apiClient.delete(`/organizations/${activeOrgId}/events/${eventId}/tech-check/${itemId}`),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["tech-check", activeOrgId, eventId] })
    },
  })
}

export function useAssignTechCheckItem() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, itemId, memberId }: { eventId: string; itemId: string; memberId: string }) =>
      apiClient.post(`/organizations/${activeOrgId}/events/${eventId}/tech-check/${itemId}/assign`, {
        member_id: memberId,
      }),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["tech-check", activeOrgId, eventId] })
    },
  })
}

export function useUpdateTechCheckStatus() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ assignmentId, status }: { eventId: string; assignmentId: string; status: CheckItemStatus }) =>
      apiClient.patch(`/organizations/${activeOrgId}/tech-check/assignments/${assignmentId}`, { status }),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["tech-check", activeOrgId, eventId] })
    },
  })
}
