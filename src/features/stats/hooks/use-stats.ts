import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/shared/lib/api-client"
import { useOrgStore } from "@/shared/store/org-store"
import type { MemberStats, OrgStatsReport, MemberAbsence } from "../types"

export function useMyStats() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)
  return useQuery({
    queryKey: ["stats", activeOrgId, "me"],
    queryFn: async () => {
      const { data } = await apiClient.get<MemberStats>(`/organizations/${activeOrgId}/stats/me`)
      return data
    },
    enabled: !!activeOrgId,
    staleTime: 10 * 60 * 1000,
  })
}

export function useOrgStats() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)
  return useQuery({
    queryKey: ["stats", activeOrgId, "org"],
    queryFn: async () => {
      const { data } = await apiClient.get<OrgStatsReport>(`/organizations/${activeOrgId}/stats`)
      return data
    },
    enabled: !!activeOrgId,
    staleTime: 10 * 60 * 1000,
  })
}

export function useMemberAbsences() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)
  return useQuery({
    queryKey: ["stats", activeOrgId, "absences"],
    queryFn: async () => {
      const { data } = await apiClient.get<MemberAbsence[]>(`/organizations/${activeOrgId}/members/absences`)
      return data
    },
    enabled: !!activeOrgId,
    staleTime: 10 * 60 * 1000,
  })
}
