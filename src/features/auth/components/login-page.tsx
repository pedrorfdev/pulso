import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/shared/hooks/use-auth";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function getPendingInviteToken(): string | null {
  const redirect = localStorage.getItem("pulso_redirect_after_login") ?? "";
  const match = redirect.match(/^\/join\/(.+)$/);
  return match ? match[1] : null;
}

export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const inviteToken = getPendingInviteToken();

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/select-organization" />;
  }

  function handleGoogleLogin() {
    const current = window.location.pathname;
    if (current !== "/login") {
      localStorage.setItem("pulso_redirect_after_login", current);
    }
    window.location.href = `${API_URL}/auth/google`;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      {/* Logo */}
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Pulso
        </h1>
        <p className="mt-1 text-muted-foreground">tudo sincronizado</p>
      </div>

      {/* Card de convite — só aparece quando vem de link de convite */}
      {inviteToken && (
        <div className="flex w-full max-w-xs items-start gap-3 rounded-xl border border-pulse/30 bg-pulse/5 px-4 py-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pulse/10">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3.5v4l2.5 1.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-pulse"
              />
              <circle
                cx="8"
                cy="8"
                r="6.5"
                stroke="currentColor"
                strokeWidth="1.3"
                className="text-pulse"
              />
              <path
                d="M10 8H8V5.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                className="text-pulse"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Você foi convidado
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Entra com o Google pra aceitar o convite e entrar no grupo.
            </p>
          </div>
        </div>
      )}

      {/* Botão de login */}
      <button
        onClick={handleGoogleLogin}
        className="flex items-center gap-3 rounded-xl border border-border bg-surface px-6 py-3.5 text-foreground transition hover:border-pulse/50 active:scale-[0.98]"
      >
        <GoogleIcon />
        Entrar com Google
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.71v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.61z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 009 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72A5.4 5.4 0 013.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 00.96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
