import { useRemoveSlot } from "../hooks/use-event-slots";
import type { EventSlot } from "../types";

interface SlotListProps {
  eventId: string;
  slots: EventSlot[];
  canEdit: boolean;
}

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function SlotList({ eventId, slots, canEdit }: SlotListProps) {
  const { mutate: removeSlot, isPending } = useRemoveSlot();

  if (slots.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Ninguém escalado ainda. Adicione pelo menos uma pessoa pra poder
        publicar.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {slots.map((slot) => {
        const name = slot.member.user.name;

        return (
          <div
            key={slot.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3"
          >
            {/* Avatar */}
            {slot.member.user.avatar_url ? (
              <img
                src={slot.member.user.avatar_url}
                alt={name}
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-pulse text-xs font-semibold text-white">
                {initials(name)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-foreground truncate">{name}</p>
              <p className="text-sm text-muted-foreground truncate">
                {slot.role_labels.join(", ")}
              </p>
            </div>

            {canEdit && (
              <button
                onClick={() => removeSlot({ eventId, slotId: slot.id })}
                disabled={isPending}
                className="shrink-0 text-sm text-muted-foreground hover:text-pulse disabled:opacity-50"
              >
                remover
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
