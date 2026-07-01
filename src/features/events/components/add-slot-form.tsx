import { useState } from "react";
import { useOrgMembers } from "@/features/organizations/hooks/use-org-members";
import { useAddSlot } from "../hooks/use-event-slots";
import type { EventSlot } from "../types";

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
  existingSlots: EventSlot[]; // para mostrar quem já está em cada posição
}

export function AddSlotForm({
  eventId,
  alreadyAddedMemberIds,
  existingSlots,
}: AddSlotFormProps) {
  const { data: members, isLoading } = useOrgMembers();
  const { mutate, isPending } = useAddSlot();

  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [roleLabel, setRoleLabel] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const availableMembers = (members ?? []).filter(
    (m) => !alreadyAddedMemberIds.includes(m.id),
  );

  // Membros já escalados para a função selecionada
  const membersInRole = roleLabel
    ? existingSlots.filter((s) => s.role_labels.includes(roleLabel))
    : [];

  // Membro selecionado já está em alguma posição?
  const memberAlreadyInSlot = selectedMemberId
    ? existingSlots.find((s) => s.member.id === selectedMemberId)
    : null;

  function doAdd() {
    mutate(
      { eventId, member_id: selectedMemberId, role_labels: [roleLabel.trim()] },
      {
        onSuccess: () => {
          setSelectedMemberId("");
          setRoleLabel("");
          setShowCustom(false);
          setConfirmOpen(false);
        },
      },
    );
  }

  function handleAdd() {
    if (!selectedMemberId || roleLabel.trim().length === 0) return;

    // Se a pessoa já está em outro slot, pede confirmação
    if (memberAlreadyInSlot) {
      setConfirmOpen(true);
      return;
    }

    doAdd();
  }

  if (isLoading)
    return <div className="h-12 animate-pulse rounded-xl bg-surface" />;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-foreground">Adicionar à escala</p>

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
        {/* Membros já escalados aparecem separados — podem ter segunda função */}
        {existingSlots.length > 0 && (
          <optgroup label="Já escalados (segunda função)">
            {existingSlots.map((slot) => (
              <option key={slot.member.id} value={slot.member.id}>
                {slot.member.user.name} ({slot.role_labels.join(", ")})
              </option>
            ))}
          </optgroup>
        )}
      </select>

      {/* Chips de função */}
      <div>
        <p className="mb-2 text-xs text-muted-foreground">Função</p>
        <div className="flex flex-wrap gap-2">
          {ROLE_PRESETS.map((preset) => {
            // Quem já está nessa função?
            const occupied = existingSlots.filter((s) =>
              s.role_labels.includes(preset),
            );
            return (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setRoleLabel(preset);
                  setShowCustom(false);
                }}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                  roleLabel === preset && !showCustom
                    ? "border-pulse bg-pulse/10 text-pulse"
                    : "border-border bg-surface text-muted-foreground hover:border-pulse/40"
                }`}
              >
                {preset}
                {/* Indicador de quem já está */}
                {occupied.length > 0 && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      roleLabel === preset ? "bg-pulse" : "bg-warning"
                    }`}
                    title={occupied.map((s) => s.member.user.name).join(", ")}
                  />
                )}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setShowCustom(true);
              setRoleLabel("");
            }}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              showCustom
                ? "border-pulse bg-pulse/10 text-pulse"
                : "border-border bg-surface text-muted-foreground hover:border-pulse/40"
            }`}
          >
            + outra
          </button>
        </div>

        {/* Quem já está na função selecionada */}
        {membersInRole.length > 0 && !showCustom && roleLabel && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Já em <span className="text-foreground">{roleLabel}</span>:{" "}
            {membersInRole.map((s) => s.member.user.name).join(", ")}
          </p>
        )}

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
        type="button"
        onClick={handleAdd}
        disabled={
          !selectedMemberId || roleLabel.trim().length === 0 || isPending
        }
        className="rounded-xl bg-gradient-pulse py-3 text-sm font-medium text-white disabled:opacity-50"
      >
        {isPending ? "Adicionando..." : "Adicionar à escala"}
      </button>

      {/* Confirm dialog — pessoa em múltiplas posições */}
      {confirmOpen && memberAlreadyInSlot && (
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
          <p className="text-sm font-medium text-foreground">
            {memberAlreadyInSlot.member.user.name} já está como{" "}
            <span className="text-warning">
              {memberAlreadyInSlot.role_labels.join(", ")}
            </span>
            .
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Confirma colocar também como <strong>{roleLabel}</strong>?
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setConfirmOpen(false)}
              className="flex-1 rounded-xl border border-border py-2 text-sm text-muted-foreground"
            >
              Cancelar
            </button>
            <button
              onClick={doAdd}
              disabled={isPending}
              className="flex-1 rounded-xl bg-warning/10 py-2 text-sm font-medium text-warning disabled:opacity-50"
            >
              {isPending ? "..." : "Sim, escalar nas duas"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
