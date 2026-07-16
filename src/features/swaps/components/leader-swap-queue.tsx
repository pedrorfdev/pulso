import { useState } from "react"
import { usePendingLeaderSwaps } from "../hooks/use-pending-swaps"
import { useLeaderReviewSwap } from "../hooks/use-swap-mutations"
import type { Swap } from "../types"

/**
 * Fila de aprovação do líder — swaps no status PENDING_LEADER.
 *
 * Nota importante: rejeitar aqui NÃO cancela a troca — volta pra
 * PENDING_OPEN pra outro voluntário aparecer. O líder pode adicionar
 * um motivo opcional pra o voluntário entender por que não foi aprovado.
 */
export function LeaderSwapQueue() {
  const { data: swaps, isLoading } = usePendingLeaderSwaps()

  if (isLoading) {
    return <div className="h-24 animate-pulse rounded-xl bg-surface" />
  }

  const queue = swaps ?? []

  if (queue.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-sm text-muted-foreground">
          Nenhuma troca aguardando aprovação.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {queue.map((swap) => (
        <LeaderSwapCard key={swap.id} swap={swap} />
      ))}
    </div>
  )
}

function LeaderSwapCard({ swap }: { swap: Swap }) {
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectForm, setShowRejectForm] = useState(false)
  const { mutate: review, isPending } = useLeaderReviewSwap()

  const event = swap.requester.event
  const requester = swap.requester.member
  const volunteer = swap.volunteer?.member

  function handleApprove() {
    review({ swapId: swap.id, action: "APPROVE" })
  }

  function handleReject() {
    review({
      swapId: swap.id,
      action: "REJECT",
      rejectionReason: rejectionReason || undefined,
    })
    setShowRejectForm(false)
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-sm font-medium text-foreground">{event.title}</p>
      <p className="text-sm text-muted-foreground">
        {formatShortDate(event.starts_at)}
      </p>

      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        <span className="text-foreground">{requester.user.name}</span>
        <span>→</span>
        <span className="text-foreground">{volunteer?.user?.name ?? "?"}</span>
      </div>

      <div className="mt-1 flex flex-wrap gap-1">
        {swap.requester.role_labels.map((label: string) => (
          <span
            key={label}
            className="rounded-full bg-border px-2 py-0.5 text-xs text-muted-foreground"
          >
            {label}
          </span>
        ))}
      </div>

      {!showRejectForm ? (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setShowRejectForm(true)}
            disabled={isPending}
            className="flex-1 rounded-xl border border-border py-2 text-sm text-muted-foreground disabled:opacity-50"
          >
            Não rola
          </button>
          <button
            onClick={handleApprove}
            disabled={isPending}
            className="flex-1 rounded-xl bg-gradient-pulse py-2 text-sm font-medium text-pulse-foreground disabled:opacity-50"
          >
            {isPending ? "Aprovando..." : "Aprovar"}
          </button>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          <input
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Motivo (opcional) — volta pra fila aberta"
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-pulse"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setShowRejectForm(false)}
              className="flex-1 rounded-xl border border-border py-2 text-sm text-muted-foreground"
            >
              Voltar
            </button>
            <button
              onClick={handleReject}
              disabled={isPending}
              className="flex-1 rounded-xl bg-pulse py-2 text-sm font-medium text-pulse-foreground disabled:opacity-50"
            >
              {isPending ? "Rejeitando..." : "Rejeitar"}
            </button>
          </div>
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
