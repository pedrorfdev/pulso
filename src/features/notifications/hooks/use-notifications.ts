import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/lib/api-client"
import { useOrgStore } from "@/shared/store/org-store"
import { isUnread } from "../types"
import type { Notification } from "../types"

export function useNotifications() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)
  return useQuery({
    queryKey: ["notifications", activeOrgId],
    queryFn: async () => {
      const { data } = await apiClient.get<Notification[]>(
        `/organizations/${activeOrgId}/notifications`
      )
      return data
    },
    enabled: !!activeOrgId,
    refetchInterval: 60_000,
  })
}

export function useUnreadCount(): number {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)
  const { data } = useQuery<Notification[]>({
    queryKey: ["notifications", activeOrgId],
    enabled: false,
  })
  return (data ?? []).filter(isUnread).length
}

export function useMarkNotificationRead() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: string) =>
      apiClient.patch(`/organizations/${activeOrgId}/notifications/${notificationId}/read`),
    onMutate: async (notificationId) => {
      const queryKey = ["notifications", activeOrgId]
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<Notification[]>(queryKey)
      queryClient.setQueryData<Notification[]>(queryKey, (old) =>
        (old ?? []).map((n) =>
          n.id === notificationId ? { ...n, readAt: new Date().toISOString() } : n
        )
      )
      return { previous, queryKey }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(context.queryKey, context.previous)
    },
  })
}

export function useMarkAllRead() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      apiClient.patch(`/organizations/${activeOrgId}/notifications/read-all`),
    onSuccess: () => {
      queryClient.setQueryData<Notification[]>(
        ["notifications", activeOrgId],
        (old) => (old ?? []).map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() }))
      )
    },
  })
}
