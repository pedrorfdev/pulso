import { useEffect } from "react";
import { Navigate, useNavigate, Link } from "@tanstack/react-router";
import { useOrganizations } from "../hooks/use-organizations";
import { useOrgStore } from "@/shared/store/org-store";

export function SelectOrganizationPage() {
  const { data: memberships, isLoading } = useOrganizations();
  const setActiveOrgId = useOrgStore((s) => s.setActiveOrgId);
  const clearActiveOrgId = useOrgStore((s) => s.clearActiveOrgId);
  const activeOrgId = useOrgStore((s) => s.activeOrgId);
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const force = searchParams.get("force") === "true";

  const orgs = memberships ?? [];

  // Limpa o activeOrgId se não pertence mais a nenhuma org válida
  // — evita o bug de ficar preso em org fantasma do localStorage
  useEffect(() => {
    if (isLoading || orgs.length === 0) return;
    const stillValid = orgs.some((m) => m.organization.id === activeOrgId);
    if (!stillValid) clearActiveOrgId();
  }, [orgs, activeOrgId, isLoading, clearActiveOrgId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando seus grupos...</p>
      </div>
    );
  }

  if (orgs.length === 0) return <NoOrganizationsYet />;

  // Auto-redireciona se só tem 1 org e não está forçado a mostrar a lista
  if (orgs.length === 1 && !force) {
    setActiveOrgId(orgs[0].organization.id);
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-2xl font-semibold text-foreground">Qual grupo?</h1>

      <div className="flex w-full max-w-sm flex-col gap-3">
        {orgs.map((m) => (
          <button
            key={m.member_id}
            onClick={() => {
              setActiveOrgId(m.organization.id);
              navigate({ to: "/dashboard" });
            }}
            className="rounded-xl border border-border bg-surface px-4 py-3 text-left transition hover:border-pulse/50 active:bg-border/20"
          >
            <p className="font-medium text-foreground">{m.organization.name}</p>
            <p className="text-sm text-muted-foreground">{roleLabel(m.role)}</p>
          </button>
        ))}

        <Link
          to="/create-organization"
          className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm text-muted-foreground hover:border-pulse/40 hover:text-foreground transition"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 2v10M2 7h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Criar novo grupo
        </Link>
      </div>
    </div>
  );
}

function NoOrganizationsYet() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
        <div className="h-64 w-64 rounded-full bg-gradient-pulse blur-3xl" />
      </div>

      <div className="relative">
        <h1 className="text-2xl font-semibold text-foreground">
          Você ainda não tá em nenhum grupo
        </h1>
        <p className="mt-2 text-muted-foreground">
          Pede um link de convite pra liderança, ou cria um grupo novo.
        </p>
      </div>

      <div className="relative flex w-full max-w-xs flex-col gap-3">
        <Link
          to="/create-organization"
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-pulse px-6 py-4 font-semibold text-white shadow-lg shadow-pulse/30 active:scale-[0.98] transition-transform"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2v12M2 8h12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Criar um grupo
        </Link>
        <p className="text-center text-xs text-muted-foreground">
          ou peça um link de convite pra entrar em um grupo existente
        </p>
      </div>
    </div>
  );
}

function roleLabel(role: string): string {
  if (role === "ADMIN") return "Administrador";
  if (role === "LEADER") return "Líder";
  return "Membro";
}
