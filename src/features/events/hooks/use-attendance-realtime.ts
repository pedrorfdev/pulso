import { useQueryClient } from "@tanstack/react-query"
import { useSocketEvent } from "@/shared/hooks/use-socket"
import { useOrgStore } from "@/shared/store/org-store"
import type { AttendanceStatus } from "@/types/enums"
import type { EventDetail } from "../types"

interface AttendanceUpdatedPayload {
  id: string
  status: AttendanceStatus
  justification: string | null
}

export function useAttendanceRealtime(eventId: string | undefined) {
  const queryClient = useQueryClient()
  const activeOrgId = useOrgStore((s) => s.activeOrgId)

  useSocketEvent<AttendanceUpdatedPayload>("attendance:updated", (payload) => {
    if (!eventId) return
    const queryKey = ["events", activeOrgId, eventId]
    queryClient.setQueryData<EventDetail>(queryKey, (old) => {
      if (!old) return old
      return {
        ...old,
        slots: old.slots.map((slot) =>
          slot.attendance.id === payload.id
            ? { ...slot, attendance: { ...slot.attendance, status: payload.status, justification: payload.justification } }
            : slot
        ),
      }
    })
  })
}
