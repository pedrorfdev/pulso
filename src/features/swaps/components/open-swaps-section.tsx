import { useState } from "react"
import { useOpenSwaps } from "../hooks/use-swaps"
import { useVolunteerForSwap } from "../hooks/use-swap-mutations"
import { useAuth } from "@/shared/hooks/use-auth"
import { useOrgMembers } from "@/features/organizations/hooks/use-org-members"
import type { Swap } from "../types"

/**
 * Trocas abertas do grupo — qualquer membro vê e pode voluntariar pra
 * cobrir. O membro precisa escolher QUAL DOS SEUS SLOTS vai usar pra
 * cobrir (ele pode estar em múltiplos eventos). Por isso busca os
 * membros da org pra achar os slots do usuário logado.
 *
 * Filtramos pra não mostrar o próprio pedido do usuário aqui — os
 * pedidos que ele mesmo abriu ficam na seção "Minhas trocas".
 */
export function OpenSwapsSection() {
  const { user } = useAuth()
  const { data: swaps, isLoading } = useOpenSwaps()
  const { data: members } = useOrgMembers()

  const myMember = members?.find((m) => m.user.id === user?.id)

  const openSwaps = (swaps ?? []).filter(
    (s) => s.requesterSlot.member.userId !== user?.id
  )

  if (isLoading) {
    return <div className="h-24 animate-pulse rounded-xl bg-surface" />
  }

  if (openSwaps.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-sm text-muted-foreground">
          Nenhuma troca aberta no grupo agora.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {openSwaps.map((swap) => (
        <OpenSwapCard
          key={swap.id}
          swap={swap}
          myMemberId={myMember?.id}
        />
      ))}
    </div>
  )
}

function OpenSwapCard({
  swap,
  myMemberId,
}: {
  swap: Swap
  myMemberId: string | undefined
}) {
  const [showConfirm, setShowConfirm] = useState(false)
  const { mutate: volunteer, isPending } = useVolunteerForSwap()

  const event = swap.requesterSlot.event
  const requester = swap.requesterSlot.member

  function handleVolunteer() {
    if (!myMemberId) return
    // volunteerSlotId aqui seria o slot do usuário naquele mesmo evento.
    // ⚠️ PENDÊNCIA: o back precisa saber qual slot do voluntário vai ser
    // trocado. Por ora mandamos o memberId e deixamos o back resolver,
    // mas pode precisar de um slot picker se o voluntário estiver em
    // múltiplos eventos com o mesmo membro. Confirmar com o back.
    volunteer(
      { swapId: swap.id, volunteerSlotId: myMemberId },
      { onSuccess: () => setShowConfirm(false) }
    )
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-foreground">{event.title}</p>
          <p className="text-sm text-muted-foreground">
            {formatShortDate(event.startsAt)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {requester.name} precisa de cobertura
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {swap.requesterSlot.roleLabels.map((label) => (
              <span
                key={label}
                className="rounded-full bg-border px-2 py-0.5 text-xs text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {swap.message && (
        <p className="mt-2 text-sm italic text-muted-foreground">
          "{swap.message}"
        </p>
      )}

      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="mt-3 w-full rounded-xl bg-gradient-pulse py-2 text-sm font-medium text-pulse-foreground"
        >
          Topar cobrir
        </button>
      ) : (
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setShowConfirm(false)}
            className="flex-1 rounded-xl border border-border py-2 text-sm text-muted-foreground"
          >
            Voltar
          </button>
          <button
            onClick={handleVolunteer}
            disabled={isPending}
            className="flex-1 rounded-xl bg-pulse py-2 text-sm font-medium text-pulse-foreground disabled:opacity-50"
          >
            {isPending ? "Confirmando..." : "Sim, vou cobrir"}
          </button>
        </div>
      )}
    </div>
  )
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    weekday: "short",
  })
}
