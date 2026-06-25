import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/shared/lib/api-client"
import type { MyOrganizationMembership } from "../types"

export function useOrganizations() {
  return useQuery({
    queryKey: ["organizations", "mine"],
    queryFn: async () => {
      const { data } = await apiClient.get<MyOrganizationMembership[]>(
        "/me/organizations"
      )
      return data
    },
  })
}
