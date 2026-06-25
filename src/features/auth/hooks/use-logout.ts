import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { apiClient } from "@/shared/lib/api-client"
import { useOrgStore } from "@/shared/store/org-store"

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const clearActiveOrgId = useOrgStore((s) => s.clearActiveOrgId)

  return useMutation({
    mutationFn: () => apiClient.post("/auth/logout"),
    onSuccess: () => {
      clearActiveOrgId()
      queryClient.clear()
      navigate({ to: "/login" })
    },
  })
}
