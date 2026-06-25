import { Navigate } from "@tanstack/react-router"
import { useAuth } from "@/shared/hooks/use-auth"

export function AuthCallbackPage() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Entrando...</p>
      </div>
    )
  }

  if (isAuthenticated) {
    // Verifica se tinha um redirect pendente (ex: link de convite)
    const pendingRedirect = localStorage.getItem("pulso_redirect_after_login")
    if (pendingRedirect && pendingRedirect !== "/login") {
      localStorage.removeItem("pulso_redirect_after_login")
      return <Navigate to={pendingRedirect as never} />
    }
    return <Navigate to="/select-organization" />
  }

  return <Navigate to="/login" />
}
