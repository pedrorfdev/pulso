import { useOrgStore } from "@/shared/store/org-store"
import { useOrganizations } from "@/features/organizations/hooks/use-organizations"
import { useLogout } from "@/features/auth/hooks/use-logout"
import { useMyRole } from "@/shared/hooks/use-my-role"
import { Link } from "@tanstack/react-router"

/**
 * Header do app — só aparece nas telas autenticadas (dentro do AppLayout).
 *
 * Mostra: nome da org ativa + botão de trocar grupo + ações de líder/admin.
 * Logout fica aqui pra facilitar testes.
 */
export function AppHeader() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)
  const { data: memberships } = useOrganizations()
  const { mutate: logout, isPending } = useLogout()
  const { isAdmin } = useMyRole()

  const activeOrg = memberships?.find((m) => m.organization.id === activeOrgId)

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-foreground">
          {activeOrg?.organization.name ?? "Pulso"}
        </span>
        <Link
          to="/select-organization"
          search={{ force: true } as never}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          trocar
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {isAdmin && (
          <Link to="/create-organization" className="text-xs text-muted-foreground hover:text-foreground">
            + grupo
          </Link>
        )}
        <button
          onClick={() => logout()}
          disabled={isPending}
          className="text-xs text-muted-foreground hover:text-pulse disabled:opacity-50"
        >
          Sair
        </button>
      </div>
    </header>
  )
}
