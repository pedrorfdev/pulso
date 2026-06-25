import { Navigate, useNavigate } from "@tanstack/react-router"
import { useOrganizations } from "../hooks/use-organizations"
import { useOrgStore } from "@/shared/store/org-store"

export function SelectOrganizationPage() {
  const { data: memberships, isLoading } = useOrganizations()
  const setActiveOrgId = useOrgStore((s) => s.setActiveOrgId)
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(window.location.search)
  const force = searchParams.get("force") === "true"

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando seus grupos...</p>
      </div>
    )
  }

  const orgs = memberships ?? []

  if (orgs.length === 0) {
    return <NoOrganizationsYet />
  }

  // Auto-redireciona se só tem 1 org e não é forçado a mostrar a lista
  if (orgs.length === 1 && !force) {
    setActiveOrgId(orgs[0].organization.id)
    return <Navigate to="/dashboard" />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-2xl font-semibold text-foreground">Qual grupo?</h1>
      <div className="flex w-full max-w-sm flex-col gap-3">
        {orgs.map((m) => (
          <button
            key={m.member_id}
            onClick={() => {
              setActiveOrgId(m.organization.id)
              navigate({ to: "/dashboard" })
            }}
            className="rounded-xl border border-border bg-surface px-4 py-3 text-left transition hover:border-pulse/50"
          >
            <p className="font-medium text-foreground">{m.organization.name}</p>
            <p className="text-sm text-muted-foreground">{roleLabel(m.role)}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function NoOrganizationsYet() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold text-foreground">
        Você ainda não tá em nenhum grupo
      </h1>
      <p className="text-muted-foreground">
        Pede um link de convite pra liderança, ou crie um grupo novo.
      </p>
    </div>
  )
}

function roleLabel(role: string): string {
  if (role === "ADMIN") return "Administrador"
  if (role === "LEADER") return "Líder"
  return "Membro"
}
