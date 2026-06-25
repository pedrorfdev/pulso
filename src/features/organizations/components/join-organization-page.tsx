import { useState } from "react"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/shared/lib/api-client"
import { useOrgStore } from "@/shared/store/org-store"

// Shape real do POST /organizations/join/:token
interface JoinResponse {
  id: string         // member_id
  organization_id: string
  role: string
  nickname: string | null
}

export function JoinOrganizationPage() {
  const { token } = useParams({ from: "/join/$token" })
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setActiveOrgId = useOrgStore((s) => s.setActiveOrgId)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.post<JoinResponse>(
        `/organizations/join/${token}`
      )
      return data
    },
    onSuccess: (data) => {
      setActiveOrgId(data.organization_id)
      queryClient.invalidateQueries({ queryKey: ["organizations", "mine"] })
      navigate({ to: "/dashboard" })
    },
    onError: () => {
      setErrorMessage(
        "Esse link não é válido ou já expirou. Pede um novo link pra liderança."
      )
    },
  })

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Você foi convidado pro Pulso
        </h1>
        <p className="mt-2 text-muted-foreground">
          Toca em entrar pra fazer parte do grupo.
        </p>
      </div>
      {errorMessage && <p className="text-sm text-pulse">{errorMessage}</p>}
      <button
        onClick={() => mutate()}
        disabled={isPending}
        className="rounded-xl bg-gradient-pulse px-6 py-3 font-medium text-pulse-foreground disabled:opacity-50"
      >
        {isPending ? "Entrando..." : "Entrar no grupo"}
      </button>
    </div>
  )
}
