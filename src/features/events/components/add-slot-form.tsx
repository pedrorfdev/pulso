import { useState } from "react"
import { useOrgMembers } from "@/features/organizations/hooks/use-org-members"
import { useAddSlot } from "../hooks/use-event-slots"

interface AddSlotFormProps {
  eventId: string
  alreadyAddedMemberIds: string[]
}

export function AddSlotForm({ eventId, alreadyAddedMemberIds }: AddSlotFormProps) {
  const { data: members, isLoading } = useOrgMembers()
  const { mutate, isPending } = useAddSlot()
  const [selectedMemberId, setSelectedMemberId] = useState("")
  const [roleLabel, setRoleLabel] = useState("")

  // member.id é o OrganizationMember.id — campo correto pra comparar
  const availableMembers = (members ?? []).filter(
    (m) => !alreadyAddedMemberIds.includes(m.id)
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedMemberId || roleLabel.trim().length === 0) return
    mutate(
      { eventId, member_id: selectedMemberId, role_labels: [roleLabel.trim()] },
      { onSuccess: () => { setSelectedMemberId(""); setRoleLabel("") } }
    )
  }

  if (isLoading) return <div className="h-12 animate-pulse rounded-xl bg-surface" />
  if (availableMembers.length === 0) {
    return <p className="text-sm text-muted-foreground">Todos os membros já estão na escala.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <select
        value={selectedMemberId}
        onChange={(e) => setSelectedMemberId(e.target.value)}
        className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-pulse"
      >
        <option value="">Escolher membro</option>
        {availableMembers.map((member) => (
          <option key={member.id} value={member.id}>
            {member.nickname ?? member.user.name}
          </option>
        ))}
      </select>
      <input
        value={roleLabel}
        onChange={(e) => setRoleLabel(e.target.value)}
        placeholder="Função (ex: Vocal)"
        className="w-32 rounded-xl border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-pulse"
      />
      <button
        type="submit"
        disabled={!selectedMemberId || roleLabel.trim().length === 0 || isPending}
        className="rounded-xl bg-pulse px-4 py-2 font-medium text-pulse-foreground disabled:opacity-50"
      >
        +
      </button>
    </form>
  )
}
