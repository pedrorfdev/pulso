import { useAuth } from "./use-auth"
import { useOrgMembers } from "@/features/organizations/hooks/use-org-members"
import type { OrgRole } from "@/types/enums"

/**
 * Retorna o role do usuário logado na org ativa.
 * Usado pra mostrar/esconder ações de líder na UI.
 * A segurança real é sempre server-side — isso é só UX.
 */
export function useMyRole(): { role: OrgRole | null; isLeader: boolean; isAdmin: boolean } {
  const { user } = useAuth()
  const { data: members } = useOrgMembers()

  const myMember = members?.find((m) => m.user.id === user?.id)
  const role = myMember?.role ?? null

  return {
    role,
    isLeader: role === "LEADER" || role === "ADMIN",
    isAdmin: role === "ADMIN",
  }
}
