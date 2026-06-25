import { useState } from "react"
import { usePublishEvent } from "../hooks/use-publish-event"

interface PublishEventButtonProps {
  eventId: string
  slotCount: number
}

/**
 * Botão de publicar — ação irreversível no MVP atual (sem despublicar),
 * por isso pede confirmação explícita antes de disparar. Fica desabilitado
 * se não houver nenhum slot, espelhando a regra do back (publish exige
 * >= 1 slot) — assim o usuário entende o motivo antes de tentar e tomar erro.
 */
export function PublishEventButton({ eventId, slotCount }: PublishEventButtonProps) {
  const [confirming, setConfirming] = useState(false)
  const { mutate, isPending, error } = usePublishEvent()

  const canPublish = slotCount > 0

  if (confirming) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4">
        <p className="text-sm text-foreground">
          Depois de publicado, ninguém poderá editar a escala. Todos os
          membros escalados serão notificados. Confirma?
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setConfirming(false)}
            className="flex-1 rounded-xl border border-border px-4 py-2 text-muted-foreground"
          >
            Cancelar
          </button>
          <button
            onClick={() => mutate(eventId)}
            disabled={isPending}
            className="flex-1 rounded-xl bg-pulse px-4 py-2 font-medium text-pulse-foreground disabled:opacity-50"
          >
            {isPending ? "Publicando..." : "Sim, publicar"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setConfirming(true)}
        disabled={!canPublish}
        className="rounded-xl bg-gradient-pulse px-6 py-3 font-medium text-pulse-foreground transition disabled:opacity-50"
      >
        Publicar escala
      </button>
      {!canPublish && (
        <p className="text-sm text-muted-foreground">
          Adicione pelo menos uma pessoa antes de publicar.
        </p>
      )}
      {error && (
        <p className="text-sm text-pulse">
          Não deu pra publicar. Tenta de novo em instantes.
        </p>
      )}
    </div>
  )
}
