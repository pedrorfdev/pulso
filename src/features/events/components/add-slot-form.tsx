import { useState } from "react";
import { useOrgMembers } from "@/features/organizations/hooks/use-org-members";
import { useAddSlot } from "../hooks/use-event-slots";

// Funções pré-definidas — líder escolhe ou digita livremente
const ROLE_PRESETS = [
  "Violão elétrico",
  "Baixo elétrico",
  "Bateria",
  "Teclado",
  "Vocal",
  "Guitarra",
  "Violino",
  "Percussão",
  "Sonoplastia",
  "Apresentação",
];

interface AddSlotFormProps {
  eventId: string;
  alreadyAddedMemberIds: string[];
}

export function AddSlotForm({
  eventId,
  alreadyAddedMemberIds,
}: AddSlotFormProps) {
  const { data: members, isLoading } = useOrgMembers();
  const { mutate, isPending } = useAddSlot();
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [roleLabel, setRoleLabel] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const availableMembers = (members ?? []).filter(
    (m) => !alreadyAddedMemberIds.includes(m.id),
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMemberId || roleLabel.trim().length === 0) return;
    mutate(
      { eventId, member_id: selectedMemberId, role_labels: [roleLabel.trim()] },
      {
        onSuccess: () => {
          setSelectedMemberId("");
          setRoleLabel("");
          setShowCustom(false);
        },
      },
    );
  }

  if (isLoading)
    return <div className="h-12 animate-pulse rounded-xl bg-surface" />;
  if (availableMembers.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Todos os membros já estão na escala.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <p className="text-sm font-medium text-foreground">Adicionar membro</p>

      {/* Picker de membro */}
      <select
        value={selectedMemberId}
        onChange={(e) => setSelectedMemberId(e.target.value)}
        className="rounded-xl border border-border bg-surface px-3 py-3 text-sm text-foreground outline-none focus:border-pulse"
      >
        <option value="">Escolher membro...</option>
        {availableMembers.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nickname ?? m.user.name}
          </option>
        ))}
      </select>

      {/* Funções pré-definidas como chips */}
      <div>
        <p className="mb-2 text-xs text-muted-foreground">Função</p>
        <div className="flex flex-wrap gap-2">
          {ROLE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setRoleLabel(preset);
                setShowCustom(false);
              }}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                roleLabel === preset && !showCustom
                  ? "border-pulse bg-pulse/10 text-pulse"
                  : "border-border bg-surface text-muted-foreground hover:border-pulse/50"
              }`}
            >
              {preset}
            </button>
          ))}
          {/* Opção livre */}
          <button
            type="button"
            onClick={() => {
              setShowCustom(true);
              setRoleLabel("");
            }}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              showCustom
                ? "border-pulse bg-pulse/10 text-pulse"
                : "border-border bg-surface text-muted-foreground hover:border-pulse/50"
            }`}
          >
            + outra
          </button>
        </div>

        {showCustom && (
          <input
            autoFocus
            value={roleLabel}
            onChange={(e) => setRoleLabel(e.target.value)}
            placeholder="Ex: Coral, Direção, Mídia..."
            className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-pulse"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={
          !selectedMemberId || roleLabel.trim().length === 0 || isPending
        }
        className="rounded-xl bg-gradient-pulse py-3 text-sm font-medium text-white disabled:opacity-50"
      >
        {isPending ? "Adicionando..." : "Adicionar à escala"}
      </button>
    </form>
  );
}
