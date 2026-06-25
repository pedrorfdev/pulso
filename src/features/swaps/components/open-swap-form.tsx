import { useState } from "react"
import { useOpenSwap } from "../hooks/use-swap-mutations"
import { useUpcomingEvents } from "@/features/events/hooks/use-upcoming-events"

interface OpenSwapFormProps {
  onSuccess?: () => void
}

/**
 * Form pra o membro abrir um pedido de troca — broadcast aberto, sem
 * escolher colega. O membro escolhe QUAL dos seus slots escalados quer
 * trocar, e opcionalmente deixa uma mensagem pro grupo.
 *
 * Só lista eventos futuros em que o usuário está escalado. Se não estiver
 * escalado em nenhum, mostra empty state explicativo.
 */
export function OpenSwapForm({ onSuccess }: OpenSwapFormProps) {
  // const { user } = useAuth() — pendência: usado quando slots do usuário forem disponíveis
  const { data: events } = useUpcomingEvents()
  const { mutate: openSwap, isPending } = useOpenSwap()
  const [selectedSlotId, setSelectedSlotId] = useState("")
  const [message, setMessage] = useState("")

  // Filtra só os eventos em que o usuário está escalado, e extrai o slot dele
  const mySlots = (events ?? []).flatMap((_event) => {
    // ⚠️ useUpcomingEvents retorna EventSummary, que não tem slots.
    // Esse componente precisa de useEventDetail por evento pra achar o slot,
    // OU o back pode retornar os slots do próprio usuário junto com o
    // GET /:orgId/events. Por ora deixamos o select vazio e marcamos como
    // pendência — ver nota abaixo.
    return []
  })

  // PENDÊNCIA: pra popular o select de "qual evento/slot", precisamos ou:
  //   (a) Chamar useEventDetail pra cada evento (N+1 requests, ruim), ou
  //   (b) O back incluir "meu slot" no EventSummary do GET /:orgId/events
  //   (c) Uma rota GET /:orgId/my-slots que retorna só os slots do usuário
  // Implementação atual: mostra o select vazio com nota. Assim que
  // confirmarmos a abordagem com o back, completamos.

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSlotId) return
    openSwap(
      { slotId: selectedSlotId, message: message || undefined },
      { onSuccess }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <select
        value={selectedSlotId}
        onChange={(e) => setSelectedSlotId(e.target.value)}
        className="rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-pulse"
      >
        <option value="">Qual evento você quer trocar?</option>
        {mySlots.map((slot: { id: string; eventTitle: string; roleLabels: string[] }) => (
          <option key={slot.id} value={slot.id}>
            {slot.eventTitle} — {slot.roleLabels.join(", ")}
          </option>
        ))}
      </select>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Mensagem pro grupo (opcional)"
        rows={2}
        className="rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none focus:border-pulse"
      />

      <button
        type="submit"
        disabled={!selectedSlotId || isPending}
        className="rounded-xl bg-gradient-pulse py-3 font-medium text-pulse-foreground disabled:opacity-50"
      >
        {isPending ? "Abrindo..." : "Pedir cobertura pro grupo"}
      </button>
    </form>
  )
}
