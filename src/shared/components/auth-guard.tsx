import { Navigate } from "@tanstack/react-router"
import { useAuth } from "@/shared/hooks/use-auth"
import { AppLayout } from "./app-layout"

interface AuthGuardProps {
  children: React.ReactNode
  withLayout?: boolean
}

/**
 * Protege rotas autenticadas. Por padrão envolve em AppLayout
 * (header + bottom nav). Passa withLayout={false} pras telas que
 * têm layout próprio (ex: join, create-org que são full-screen).
 */
export function AuthGuard({ children, withLayout = true }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" />

  if (withLayout) return <AppLayout>{children}</AppLayout>
  return <>{children}</>
}
