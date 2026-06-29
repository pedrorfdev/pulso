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
        const isRequester = swap.requesterSlot.member.userId === user?.id;
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

  // O slot relevante muda dependendo do papel: quem pediu vê o próprio slot,
  // quem vai cobrir vê o slot da pessoa que pediu.
  const primarySlot = swap.requesterSlot;
  const coverSlot = swap.volunteerSlot;

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      {/* Faixa do evento — contexto visual imediato */}
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
          {primarySlot.event.title} ·{" "}
          {formatShortDate(primarySlot.event.startsAt)}
        </p>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            {/* Função em jogo */}
            <div className="flex flex-wrap gap-1 mb-1">
              {primarySlot.roleLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-border px-2 py-0.5 text-xs text-foreground"
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Papel do usuário nessa troca */}
            <p className="text-sm text-muted-foreground">
              {isRequester
                ? "Você pediu cobertura"
                : `Você vai cobrir ${primarySlot.member.name}`}
            </p>

            {/* Estado do voluntário */}
            {coverSlot && (
              <p className="mt-1 text-xs text-muted-foreground">
                {isRequester
                  ? `${coverSlot.member.name} topou · aguardando líder`
                  : "Aguardando aprovação do líder"}
              </p>
            )}

            {/* Motivo de rejeição do líder */}
            {swap.rejectionReason && (
              <p className="mt-1 text-xs italic text-muted-foreground">
                Líder: "{swap.rejectionReason}"
              </p>
            )}
          </div>

          <SwapStatusBadge status={swap.status} />
        </div>

        {/* Mensagem do solicitante */}
        {swap.message && (
          <p className="mt-2 text-sm italic text-muted-foreground">
            "{swap.message}"
          </p>
        )}

        {/* Ação: solicitante pode cancelar enquanto aberto */}
        {isRequester && swap.status === "PENDING_OPEN" && (
          <>
            {!showCancelConfirm ? (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="mt-3 text-sm text-muted-foreground underline-offset-2 hover:text-pulse hover:underline"
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
                  {cancelling ? "Cancelando..." : "Confirmar"}
                </button>
              </div>
            )}
          </>
        )}

        {/* Ação: voluntário pode desistir antes do líder aprovar */}
        {!isRequester && swap.status === "PENDING_LEADER" && (
          <button
            onClick={() => volunteerReject({ swapId: swap.id })}
            disabled={rejecting}
            className="mt-3 text-sm text-muted-foreground underline-offset-2 hover:text-pulse hover:underline disabled:opacity-50"
          >
            {rejecting ? "Desistindo..." : "Desistir da cobertura"}
          </button>
        )}
      </div>
    </div>
  );
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}
