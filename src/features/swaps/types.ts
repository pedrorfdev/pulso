// Shape real que a API retorna — conforme contrato atualizado
export type SwapStatus =
  | "PENDING_OPEN" // aberto, esperando voluntário
  | "PENDING_LEADER" // alguém aceitou, líder precisa aprovar
  | "APPROVED" // líder aprovou
  | "CANCELLED"; // solicitante cancelou

// Slot resumido dentro do swap — API retorna assim
export interface SwapSlot {
  id: string;
  role_labels: string[];
  member: {
    id: string;
    user: {
      name: string;
      avatar_url: string | null;
    };
  };
  event: {
    id: string;
    title: string;
    starts_at: string;
  };
}

// SwapResponse completo conforme API
export interface Swap {
  id: string;
  status: SwapStatus;
  message: string | null;
  rejection_reason: string | null;
  created_at: string;
  resolved_at: string | null;

  // Quem abriu o pedido
  requester: SwapSlot;

  // Null até alguém voluntariar
  volunteer: SwapSlot | null;
}

// Helper: nome de exibição do membro do slot
export function swapMemberName(slot: SwapSlot): string {
  return slot.member.user.name;
}
