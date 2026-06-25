import { useRemoveSlot } from "../hooks/use-event-slots"
import type { EventSlot } from "../types"

interface SlotListProps {
  eventId: string
  slots: EventSlot[]
  canEdit: boolean
}

export function SlotList({ eventId, slots, canEdit }: SlotListProps) {
  const { mutate: removeSlot, isPending } = useRemoveSlot()

  if (slots.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Ninguém escalado ainda. Adicione pelo menos uma pessoa pra poder publicar.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {slots.map((slot) => (
        <div key={slot.id} className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
          <div>
            <p className="text-foreground">{slot.member.name}</p>
            <p className="text-sm text-muted-foreground">{slot.role_labels.join(", ")}</p>
          </div>
          {canEdit && (
            <button
              onClick={() => removeSlot({ eventId, slotId: slot.id })}
              disabled={isPending}
              className="text-sm text-muted-foreground hover:text-pulse disabled:opacity-50"
            >
              remover
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
