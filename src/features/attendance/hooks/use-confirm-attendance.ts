import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/lib/api-client"
import { useOrgStore } from "@/shared/store/org-store"
import type { AttendanceStatus } from "@/types/enums"
import type { EventDetail } from "@/features/events/types"

interface ConfirmAttendancePayload {
  attendanceId: string
  status: Extract<AttendanceStatus, "CONFIRMED" | "DECLINED">
  justification?: string
  eventId: string
}

export function useConfirmAttendance() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ attendanceId, status, justification }: ConfirmAttendancePayload) =>
      apiClient.patch(`/organizations/${activeOrgId}/attendances/${attendanceId}`, {
        status,
        justification,
      }),

    onMutate: async (payload) => {
      const queryKey = ["events", activeOrgId, payload.eventId]
      await queryClient.cancelQueries({ queryKey })
      const previousEvent = queryClient.getQueryData<EventDetail>(queryKey)

      queryClient.setQueryData<EventDetail>(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          slots: old.slots.map((slot) =>
            slot.attendance.id === payload.attendanceId
              ? { ...slot, attendance: { ...slot.attendance, status: payload.status, justification: payload.justification ?? null } }
              : slot
          ),
        }
      })

      return { previousEvent, queryKey }
    },

    onError: (_err, _payload, context) => {
      if (context?.previousEvent) {
        queryClient.setQueryData(context.queryKey, context.previousEvent)
      }
    },

    onSettled: (_data, _err, payload) => {
      queryClient.invalidateQueries({ queryKey: ["events", activeOrgId, payload.eventId] })
      queryClient.invalidateQueries({ queryKey: ["events", activeOrgId, "upcoming"] })
    },
  })
}
