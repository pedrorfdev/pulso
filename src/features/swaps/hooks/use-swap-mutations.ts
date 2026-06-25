import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/lib/api-client"
import { useOrgStore } from "@/shared/store/org-store"

function useSwapMutation<TVariables>(
  mutationFn: (orgId: string, vars: TVariables) => Promise<unknown>,
  keysToInvalidate: (orgId: string) => string[][]
) {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (vars: TVariables) => mutationFn(activeOrgId!, vars),
    onSuccess: () => {
      keysToInvalidate(activeOrgId!).forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key })
      )
    },
  })
}

export function useOpenSwap() {
  return useSwapMutation<{ slotId: string; message?: string }>(
    (orgId, { slotId, message }) =>
      apiClient.post(`/organizations/${orgId}/slots/${slotId}/swaps`, { message }),
    (orgId) => [["swaps", orgId, "mine"], ["swaps", orgId, "open"]]
  )
}

export function useVolunteerForSwap() {
  return useSwapMutation<{ swapId: string; volunteerSlotId: string }>(
    (orgId, { swapId, volunteerSlotId }) =>
      apiClient.post(`/organizations/${orgId}/swaps/${swapId}/volunteer`, {
        volunteer_slot_id: volunteerSlotId,
      }),
    (orgId) => [["swaps", orgId, "mine"], ["swaps", orgId, "open"], ["swaps", orgId, "pending-leader"]]
  )
}

export function useVolunteerReject() {
  return useSwapMutation<{ swapId: string; rejectionReason?: string }>(
    (orgId, { swapId, rejectionReason }) =>
      apiClient.post(`/organizations/${orgId}/swaps/${swapId}/volunteer-reject`, {
        rejection_reason: rejectionReason,
      }),
    (orgId) => [["swaps", orgId, "mine"], ["swaps", orgId, "open"], ["swaps", orgId, "pending-leader"]]
  )
}

export function useCancelSwap() {
  return useSwapMutation<{ swapId: string }>(
    (orgId, { swapId }) => apiClient.delete(`/organizations/${orgId}/swaps/${swapId}`),
    (orgId) => [["swaps", orgId, "mine"], ["swaps", orgId, "open"]]
  )
}

export function useLeaderReviewSwap() {
  return useSwapMutation<{ swapId: string; action: "APPROVE" | "REJECT"; rejectionReason?: string }>(
    (orgId, { swapId, action, rejectionReason }) =>
      apiClient.patch(`/organizations/${orgId}/swaps/${swapId}/leader`, {
        action,
        rejection_reason: rejectionReason,
      }),
    (orgId) => [["swaps", orgId, "pending-leader"], ["swaps", orgId, "open"], ["swaps", orgId, "mine"]]
  )
}
