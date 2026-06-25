import { useNotifications, useMarkNotificationRead, useMarkAllRead } from "../hooks/use-notifications"
import { isUnread } from "../types"

/**
 * Lista de notificações do usuário. As não-lidas aparecem primeiro e com
 * destaque visual — fundo levemente diferente e dot colorido.
 *
 * Tocar numa notificação a marca como lida. No futuro, se `data` tiver
 * um eventId ou swapId, podemos navegar direto pra tela relevante —
 * a estrutura já suporta, só falta o useNavigate condicional.
 */
export function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications()
  const { mutate: markRead } = useMarkNotificationRead()
  const { mutate: markAllRead, isPending: markingAll } = useMarkAllRead()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-surface" />
        ))}
      </div>
    )
  }

  const items = notifications ?? []
  const unreadCount = items.filter(isUnread).length

  const sorted = [...items].sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  )

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">
          Notificações
          {unreadCount > 0 && (
            <span className="ml-2 rounded-full bg-pulse px-2 py-0.5 text-xs text-pulse-foreground">
              {unreadCount}
            </span>
          )}
        </h1>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllRead()}
            disabled={markingAll}
            className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      {items.length === 0 && (
        <div className="rounded-xl border border-border bg-surface p-6 text-center">
          <p className="text-muted-foreground">Nenhuma notificação ainda.</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {sorted.map((notification) => {
          const unread = isUnread(notification)
          return (
            <button
              key={notification.id}
              onClick={() => {
                if (unread) markRead(notification.id)
              }}
              className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                unread
                  ? "border-pulse/20 bg-pulse/5"
                  : "border-border bg-surface"
              }`}
            >
              <div className="flex items-start gap-3">
                {unread && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-pulse" />
                )}
                <div className={unread ? "" : "pl-5"}>
                  <p className="text-sm font-medium text-foreground">
                    {notification.title}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {notification.body}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatRelativeTime(notification.sentAt)}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  const diffHours = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMin < 1) return "agora"
  if (diffMin < 60) return `há ${diffMin}min`
  if (diffHours < 24) return `há ${diffHours}h`
  if (diffDays === 1) return "ontem"
  return `há ${diffDays} dias`
}
