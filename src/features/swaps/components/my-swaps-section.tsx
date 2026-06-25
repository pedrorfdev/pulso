import { useState } from "react"
import { useMySwaps } from "../hooks/use-swaps"
import { useCancelSwap, useVolunteerReject } from "../hooks/use-swap-mutations"
import { SwapStatusBadge } from "./swap-status-badge"
import { useAuth } from "@/shared/hooks/use-auth"
import type { Swap } from "../types"

/**
 * Trocas que envolvem o usuário logado — tanto as que ele pediu quanto
 * as que ele voluntariou pra cobrir. Separamos visualmente os dois casos
 * porque as ações disponíveis são diferentes:
 *   - Solicitante: pode cancelar enquanto PENDING_OPEN
 *   - Voluntário: pode desistir enquanto PENDING_LEADER
 */
export function MySwapsSection() {
  const { user } = useAuth()
  const { data: swaps, isLoading } = useMySwaps()

  if (isLoading) {
    return <div className="h-24 animate-pulse rounded-xl bg-surface" />
  }

  const mySwaps = swaps ?? []

  if (mySwaps.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-sm text-muted-foreground">
          Nenhuma troca sua em andamento.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {mySwaps.map((swap) => {
        const isRequester = swap.requesterSlot.member.userId === user?.id
        return (
          <MySwapCard key={swap.id} swap={swap} isRequester={isRequester} />
        )
      })}
    </div>
  )
}

function MySwapCard({
  swap,
  isRequester,
}: {
  swap: Swap
  isRequester: boolean
}) {
  const [rejectionReason, setRejectionReason] = useState("")
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const { mutate: cancelSwap, isPending: cancelling } = useCancelSwap()
  const { mutate: volunteerReject, isPending: rejecting } = useVolunteerReject()

  const event = swap.requesterSlot.event

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">{event.title}</p>
          <p className="text-sm text-muted-foreground">
            {formatShortDate(event.startsAt)}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {isRequester ? "Você pediu cobertura" : "Você topou cobrir"}
          </p>
        </div>
        <SwapStatusBadge status={swap.status} />
      </div>

      {swap.volunteerSlot && (
        <p className="mt-2 text-sm text-muted-foreground">
          {isRequester
            ? `${swap.volunteerSlot.member.name} topou cobrir — aguardando líder`
            : "Você aceitou — aguardando aprovação do líder"}
        </p>
      )}

      {swap.rejectionReason && (
        <p className="mt-2 text-sm italic text-muted-foreground">
          Líder: "{swap.rejectionReason}"
        </p>
      )}

      {/* Solicitante pode cancelar enquanto pedido está aberto */}
      {isRequester && swap.status === "PENDING_OPEN" && (
        <>
          {!showCancelConfirm ? (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="mt-3 text-sm text-muted-foreground hover:text-pulse"
            >
              Cancelar pedido
            </button>
          ) : (
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 rounded-xl border border-border py-2 text-sm text-muted-foreground"
              >
                Voltar
              </button>
              <button
                onClick={() => cancelSwap({ swapId: swap.id })}
                disabled={cancelling}
                className="flex-1 rounded-xl bg-pulse py-2 text-sm font-medium text-pulse-foreground disabled:opacity-50"
              >
                {cancelling ? "Cancelando..." : "Sim, cancelar"}
              </button>
            </div>
          )}
        </>
      )}

      {/* Voluntário pode desistir enquanto líder ainda não aprovou */}
      {!isRequester && swap.status === "PENDING_LEADER" && (
        <div className="mt-3">
          <input
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Motivo (opcional)"
            className="mb-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-pulse"
          />
          <button
            onClick={() => volunteerReject({ swapId: swap.id })}
            disabled={rejecting}
            className="w-full rounded-xl border border-border py-2 text-sm text-muted-foreground disabled:opacity-50"
          >
            {rejecting ? "Desistindo..." : "Desistir da cobertura"}
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
