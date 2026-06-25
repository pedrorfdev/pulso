import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/lib/api-client"
import { useOrgStore } from "@/shared/store/org-store"
import type { CreateEventFormValues } from "../schemas/create-event-schema"
import type { EventDetail } from "../types"

export function useCreateEvent() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (values: CreateEventFormValues) => {
      const { data } = await apiClient.post<EventDetail>(
        `/organizations/${activeOrgId}/events`,
        {
          title: values.title,
          description: values.description,
          location: values.location,
          starts_at: values.startsAt,
        }
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", activeOrgId, "upcoming"] })
    },
  })
}
