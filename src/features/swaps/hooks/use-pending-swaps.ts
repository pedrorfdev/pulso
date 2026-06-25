import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/shared/lib/api-client"
import { useOrgStore } from "@/shared/store/org-store"
import type { Swap } from "../types"

export function usePendingLeaderSwaps() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)
  return useQuery({
    queryKey: ["swaps", activeOrgId, "pending-leader"],
    queryFn: async () => {
      // Rota correta: /swaps/pending-leader (não /swaps/pending)
      const { data } = await apiClient.get<Swap[]>(`/organizations/${activeOrgId}/swaps/pending-leader`)
      return data
    },
    enabled: !!activeOrgId,
  })
}
