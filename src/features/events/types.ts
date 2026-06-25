import type { AttendanceStatus } from "@/types/enums"

export interface EventSummary {
  id: string
  title: string
  location: string | null
  starts_at: string
  confirmation_deadline: string
  is_published: boolean
}

export interface EventDetail extends EventSummary {
  description: string | null
  slots: EventSlot[]
}

export interface EventSlot {
  id: string
  role_labels: string[]
  notes: string | null
  member: {
    id: string          // OrganizationMember.id
    user_id: string     // User.id — pra achar "qual slot é o meu"
    name: string
    avatar_url: string | null
  }
  attendance: {
    id: string
    status: AttendanceStatus
    justification: string | null
  }
}
