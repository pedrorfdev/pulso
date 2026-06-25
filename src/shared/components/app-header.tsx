import { useOrgStore } from "@/shared/store/org-store";
import { useOrganizations } from "@/features/organizations/hooks/use-organizations";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useMyRole } from "@/shared/hooks/use-my-role";
import { Link } from "@tanstack/react-router";

export function AppHeader() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId);
  const { data: memberships } = useOrganizations();
  const { mutate: logout, isPending } = useLogout();
  const { isAdmin } = useMyRole();

  const activeOrg = memberships?.find((m) => m.organization.id === activeOrgId);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/95 px-4 py-2 backdrop-blur-sm">
      {/* Nome da org + trocar */}
      <Link
        to="/select-organization"
        search={{ force: true } as never}
        className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-surface active:bg-surface transition"
      >
        <span className="text-sm font-semibold text-foreground">
          {activeOrg?.organization.name ?? "Pulso"}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="text-muted-foreground shrink-0"
        >
          <path
            d="M3 5l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      {/* Ações do lado direito */}
      <div className="flex items-center gap-1">
        {isAdmin && (
          <Link
            to="/create-organization"
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-surface hover:text-foreground active:bg-surface transition"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 1v10M1 6h10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Grupo
          </Link>
        )}
        <button
          onClick={() => logout()}
          disabled={isPending}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-surface hover:text-pulse active:bg-surface transition disabled:opacity-50"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M8 4l3 3-3 3M11 7H4M6 2H2a1 1 0 00-1 1v6a1 1 0 001 1h4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Sair
        </button>
      </div>
    </header>
  );
}
