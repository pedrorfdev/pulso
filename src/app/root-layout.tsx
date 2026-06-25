import { Outlet } from "@tanstack/react-router"
import { useSocketConnection } from "@/shared/hooks/use-socket"
import { useAuth } from "@/shared/hooks/use-auth"
import { usePushSubscription } from "@/features/notifications/hooks/use-push-subscription"

export function RootLayout() {
  const { isAuthenticated } = useAuth()
  useSocketConnection()
  usePushSubscription(isAuthenticated)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  )
}
