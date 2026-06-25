import { useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/lib/api-client"
import type { User } from "@/types/entities"

const AUTH_QUERY_KEY = ["auth", "me"] as const

async function fetchCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>("/auth/me")
  return data
}

export function useAuth() {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: fetchCurrentUser,
    retry: false,
  })

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !isError && !!user,
  }
}

export function useInvalidateAuth() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY })
}
