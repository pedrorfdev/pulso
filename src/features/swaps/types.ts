/**
 * Modelo broadcast de swaps — adendo ao CONTEXT_FOR_FRONTEND.md.
 *
 * Diferença crítica do modelo antigo: não existe mais target_id fixo
 * na criação. O pedido vai pro grupo, qualquer um voluntaria, líder
 * aprova. target_id e target_slot_id são nullable até alguém aceitar.
 */

export type SwapStatus =
  | "PENDING_OPEN"    // aberto, esperando voluntário
  | "PENDING_LEADER"  // alguém aceitou, líder precisa aprovar
  | "APPROVED"        // líder aprovou, slots já foram trocados
  | "CANCELLED"       // solicitante cancelou

export interface SwapSlotSummary {
  id: string
  roleLabels: string[] // era role_label: String — agora é array
  member: {
    id: string
    userId: string
    name: string
    avatarUrl: string | null
  }
  event: {
    id: string
    title: string
    startsAt: string
  }
}

export interface Swap {
  id: string
  status: SwapStatus
  message: string | null
  rejectionReason: string | null
  createdAt: string

  // Slot de quem pediu a troca
  requesterSlot: SwapSlotSummary

  // Nullable até alguém voluntariar — "volunteer" na UI, não "target"
  volunteerSlot: SwapSlotSummary | null
}
