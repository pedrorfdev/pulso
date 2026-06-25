export interface Notification {
  id: string
  type: string        // ex: "SWAP_OPEN", "ATTENDANCE_CONFIRMED", "EVENT_PUBLISHED"
  title: string
  body: string
  data: Record<string, string> | null  // payload extra (ex: eventId pra navegar direto)
  readAt: string | null
  sentAt: string
}

export function isUnread(notification: Notification): boolean {
  return notification.readAt === null
}
