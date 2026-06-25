import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/shared/lib/api-client"
import { useOrgStore } from "@/shared/store/org-store"
import type { Swap } from "../types"

export function useMySwaps() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)
  return useQuery({
    queryKey: ["swaps", activeOrgId, "mine"],
    queryFn: async () => {
      const { data } = await apiClient.get<Swap[]>(`/organizations/${activeOrgId}/swaps`)
      return data
    },
    enabled: !!activeOrgId,
  })
}

export function useOpenSwaps() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId)
  return useQuery({
    queryKey: ["swaps", activeOrgId, "open"],
    queryFn: async () => {
      const { data } = await apiClient.get<Swap[]>(`/organizations/${activeOrgId}/swaps/open`)
      return data
    },
    enabled: !!activeOrgId,
    refetchInterval: 30_000,
  })
}
