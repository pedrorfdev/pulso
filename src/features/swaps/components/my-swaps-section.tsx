import { useState } from "react";
import { useMySwaps } from "../hooks/use-swaps";
import { useCancelSwap, useVolunteerReject } from "../hooks/use-swap-mutations";
import { SwapStatusBadge } from "./swap-status-badge";
import { useAuth } from "@/shared/hooks/use-auth";
import type { Swap } from "../types";

export function MySwapsSection() {
  const { user } = useAuth();
  const { data: swaps, isLoading } = useMySwaps();

  if (isLoading)
    return <div className="h-24 animate-pulse rounded-xl bg-surface" />;

  const mySwaps = swaps ?? [];

  if (mySwaps.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="text-sm text-muted-foreground">
          Nenhuma troca sua em andamento.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {mySwaps.map((swap) => {
        const isRequester = swap.requester.member.id === user?.id;
        return (
          <MySwapCard key={swap.id} swap={swap} isRequester={isRequester} />
        );
      })}
    </div>
  );
}

function MySwapCard({
  swap,
  isRequester,
}: {
  swap: Swap;
  isRequester: boolean;
}) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const { mutate: cancelSwap, isPending: cancelling } = useCancelSwap();
  const { mutate: volunteerReject, isPending: rejecting } =
    useVolunteerReject();

  const event = swap.requester.event;
  const requesterName = swap.requester.member.user.name;
  const volunteerName = swap.volunteer?.member.user.name;

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      {/* Faixa do evento */}
      <div className="flex items-center gap-2 border-b border-border bg-background px-4 py-2">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="shrink-0 text-muted-foreground"
        >
          <rect
            x="1"
            y="2"
            width="10"
            height="9"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M4 1v2M8 1v2M1 5h10"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-xs font-medium text-muted-foreground">
          {event.title} · {formatShortDate(event.starts_at)}
        </p>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {/* Funções em jogo */}
            <div className="flex flex-wrap gap-1 mb-1">
              {swap.requester.role_labels.map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-border px-2 py-0.5 text-xs text-foreground"
                >
                  {label}
                </span>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              {isRequester
                ? "Você pediu cobertura"
                : `${requesterName} pediu cobertura`}
            </p>

            {swap.volunteer && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {isRequester
                  ? `${volunteerName} topou · aguardando líder`
                  : "Você aceitou · aguardando líder"}
              </p>
            )}

            {swap.rejection_reason && (
              <p className="mt-1 text-xs italic text-muted-foreground">
                Líder: "{swap.rejection_reason}"
              </p>
            )}
          </div>

          <SwapStatusBadge status={swap.status} />
        </div>

        {swap.message && (
          <p className="mt-2 text-sm italic text-muted-foreground">
            "{swap.message}"
          </p>
        )}

        {/* Solicitante cancela enquanto aberto */}
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
                  className="flex-1 rounded-xl bg-pulse py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {cancelling ? "..." : "Sim, cancelar"}
                </button>
              </div>
            )}
          </>
        )}

        {/* Voluntário desiste antes do líder aprovar */}
        {!isRequester && swap.status === "PENDING_LEADER" && (
          <button
            onClick={() => volunteerReject({ swapId: swap.id })}
            disabled={rejecting}
            className="mt-3 text-sm text-muted-foreground hover:text-pulse disabled:opacity-50"
          >
            {rejecting ? "..." : "Desistir da cobertura"}
          </button>
        )}
      </div>
    </div>
  );
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    weekday: "short",
  });
}
