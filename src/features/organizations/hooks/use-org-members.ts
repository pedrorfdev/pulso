import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/shared/lib/api-client"
import { useOrgStore } from "@/shared/store/org-store"
import type { OrganizationMember } from "@/types/entities"

export function useOrgMembers() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)

  return useQuery({
    queryKey: ["organizations", activeOrgId, "members"],
    queryFn: async () => {
      const { data } = await apiClient.get<OrganizationMember[]>(
        `/organizations/${activeOrgId}/members`
      )
      return data
    },
    enabled: !!activeOrgId,
  })
}
