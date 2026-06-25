import { Navigate } from "@tanstack/react-router"
import { useAuth } from "@/shared/hooks/use-auth"

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000"

export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth()

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/select-organization" />
  }

  function handleGoogleLogin() {
    const current = window.location.pathname
    if (current !== "/login") {
      localStorage.setItem("pulso_redirect_after_login", current)
    }
    window.location.href = `${API_URL}/auth/google`
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Pulso</h1>
        <p className="mt-2 text-muted-foreground">tudo sincronizado</p>
      </div>
      <button
        onClick={handleGoogleLogin}
        className="flex items-center gap-3 rounded-xl border border-border bg-surface px-6 py-3 text-foreground transition hover:border-pulse/50"
      >
        <GoogleIcon />
        Entrar com Google
      </button>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.71v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.61z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 009 18z" />
      <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 013.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.05l3.01-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 00.96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  )
}
