import { useState } from "react"
import { MySwapsSection } from "./my-swaps-section"
import { OpenSwapsSection } from "./open-swaps-section"
import { LeaderSwapQueue } from "./leader-swap-queue"
import { OpenSwapForm } from "./open-swap-form"
import { useOrgMembers } from "@/features/organizations/hooks/use-org-members"
import { useAuth } from "@/shared/hooks/use-auth"

/**
 * Página de swaps — junta os 3 contextos numa view só, com separação
 * visual clara. A seção do líder só aparece se o usuário for LEADER
 * ou ADMIN na org ativa (verificado via useOrgMembers que já tem o role).
 *
 * Estrutura da página:
 *   1. "Pedir cobertura" (form de abrir swap)
 *   2. "Minhas trocas" (pedidos e voluntariados do usuário)
 *   3. "Trocas abertas" (do grupo, onde pode topar cobrir)
 *   4. "Aguardando aprovação" (só líder/admin vê)
 */
export function SwapsPage() {
  const { user } = useAuth()
  const { data: members } = useOrgMembers()
  const [showForm, setShowForm] = useState(false)

  const myMember = members?.find((m) => m.user.id === user?.id)
  const isLeader = myMember?.role === "LEADER" || myMember?.role === "ADMIN"

  return (
    <div className="flex flex-col gap-8 p-6">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Trocas</h1>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="rounded-xl bg-surface border border-border px-4 py-2 text-sm text-foreground"
          >
            {showForm ? "Cancelar" : "Pedir cobertura"}
          </button>
        </div>

        {showForm && (
          <OpenSwapForm onSuccess={() => setShowForm(false)} />
        )}
      </div>

      <section>
        <p className="mb-3 text-sm text-muted-foreground">Minhas trocas</p>
        <MySwapsSection />
      </section>

      <section>
        <p className="mb-3 text-sm text-muted-foreground">
          Trocas abertas do grupo
        </p>
        <OpenSwapsSection />
      </section>

      {isLeader && (
        <section>
          <p className="mb-3 text-sm text-muted-foreground">
            Aguardando sua aprovação
          </p>
          <LeaderSwapQueue />
        </section>
      )}
    </div>
  )
}
