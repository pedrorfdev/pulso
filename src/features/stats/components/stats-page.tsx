import { useAuth } from "@/shared/hooks/use-auth"
import { useOrgMembers } from "@/features/organizations/hooks/use-org-members"
import { MyStatsPage } from "./my-stats-page"
import { OrgStatsPage } from "./org-stats-page"

/**
 * Entry point da feature de stats. Decide o que mostrar baseado no role:
 *   MEMBER → MyStatsPage (só os próprios dados)
 *   LEADER / ADMIN → OrgStatsPage (relatório completo do time)
 *
 * Por que não usar rotas separadas (/stats/me vs /stats/org): a URL
 * de stats não tem semântica pra o usuário — ele não vai digitar
 * /stats/org manualmente. A decisão de o que exibir é produto, não
 * navegação. Uma rota /stats só funciona bem aqui.
 */
export function StatsPage() {
  const { user } = useAuth()
  const { data: members } = useOrgMembers()

  const myMember = members?.find((m) => m.user.id === user?.id)
  const isLeader =
    myMember?.role === "LEADER" || myMember?.role === "ADMIN"

  if (isLeader) {
    return <OrgStatsPage />
  }

  return <MyStatsPage />
}
