import { useUnreadCount } from "../hooks/use-notifications"

interface NotificationBadgeProps {
  children: React.ReactNode
}

/**
 * Wrapper que injeta o badge de não-lidas em qualquer ícone/botão.
 *
 * Uso:
 *   <NotificationBadge>
 *     <BellIcon />
 *   </NotificationBadge>
 *
 * Fica aqui como componente separado pra o header do Épico 11 só
 * importar isso e não precisar saber nada sobre a lógica de contagem.
 */
export function NotificationBadge({ children }: NotificationBadgeProps) {
  const count = useUnreadCount()

  return (
    <div className="relative inline-flex">
      {children}
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-pulse text-[10px] font-semibold text-pulse-foreground">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </div>
  )
}
