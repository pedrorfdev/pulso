import { Navigate, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/shared/hooks/use-auth";
import { AppLayout } from "./app-layout";

interface AuthGuardProps {
  children?: React.ReactNode;
  withLayout?: boolean;
}

export function AuthGuard({ children, withLayout = true }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    const currentPath = location.pathname;
    if (currentPath && currentPath !== "/login") {
      localStorage.setItem("pulso_redirect_after_login", currentPath);
    }
    return <Navigate to="/login" />;
  }

  if (withLayout) return <AppLayout>{children}</AppLayout>;
  return <>{children}</>;
}

