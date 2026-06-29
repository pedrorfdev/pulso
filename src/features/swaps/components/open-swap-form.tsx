import { useState } from "react";
import { useOpenSwap } from "../hooks/use-swap-mutations";
import { useUpcomingEvents } from "@/features/events/hooks/use-upcoming-events";
import { useEventDetail } from "@/features/events/hooks/use-event-detail";
import { useAuth } from "@/shared/hooks/use-auth";

interface OpenSwapFormProps {
  onSuccess?: () => void;
}

/**
 * Monta a lista de slots do usuário buscando o detalhe de cada evento.
 * Só exibe eventos onde o usuário tem slot — sem N+1 problemático porque
 * useEventDetail usa o cache do TanStack Query (os eventos já foram
 * buscados pelo EventHeroCard no dashboard).
 */
export function OpenSwapForm({ onSuccess }: OpenSwapFormProps) {
  const { user } = useAuth();
  const { data: events } = useUpcomingEvents();
  const { mutate: openSwap, isPending } = useOpenSwap();

  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [message, setMessage] = useState("");

  // Para cada evento, busca o detalhe (usa cache se já buscou antes)
  const eventDetails = (events ?? []).map((e) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data } = useEventDetail(e.id);
    return data;
  });

  // Extrai os slots do usuário logado
  const mySlots = eventDetails.flatMap((detail) => {
    if (!detail) return [];
    const slot = detail.slots.find((s) => s.member.user_id === user?.id);
    if (!slot) return [];
    return [
      {
        slotId: slot.id,
        eventTitle: detail.title,
        startsAt: detail.starts_at,
        roleLabels: slot.role_labels,
        attendanceStatus: slot.attendance.status,
      },
    ];
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlotId) return;
    openSwap(
      { slotId: selectedSlotId, message: message.trim() || undefined },
      { onSuccess },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {mySlots.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Você não está escalado em nenhum evento futuro.
          </p>
        </div>
      ) : (
        <select
          value={selectedSlotId}
          onChange={(e) => setSelectedSlotId(e.target.value)}
          className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-pulse"
        >
          <option value="">Qual evento você quer trocar?</option>
          {mySlots.map((slot) => (
            <option key={slot.slotId} value={slot.slotId}>
              {slot.eventTitle} · {formatShortDate(slot.startsAt)} —{" "}
              {slot.roleLabels.join(", ")}
            </option>
          ))}
        </select>
      )}

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Mensagem pro grupo (opcional) — ex: viagem de última hora"
        rows={2}
        className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-pulse"
      />

      <button
        type="submit"
        disabled={!selectedSlotId || isPending || mySlots.length === 0}
        className="rounded-xl bg-gradient-pulse py-3 font-medium text-pulse-foreground disabled:opacity-50"
      >
        {isPending ? "Abrindo..." : "Pedir cobertura pro grupo"}
      </button>
    </form>
  );
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}
