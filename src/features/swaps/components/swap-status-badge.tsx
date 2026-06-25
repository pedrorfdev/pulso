import type { SwapStatus } from "../types"

interface SwapStatusBadgeProps {
  status: SwapStatus
}

const config: Record<SwapStatus, { label: string; className: string }> = {
  PENDING_OPEN: {
    label: "Aguardando alguém",
    className: "bg-warning/10 text-warning",
  },
  PENDING_LEADER: {
    label: "Aguardando líder",
    className: "bg-info/10 text-info",
  },
  APPROVED: {
    label: "Aprovada",
    className: "bg-success/10 text-success",
  },
  CANCELLED: {
    label: "Cancelada",
    className: "bg-border text-muted-foreground",
  },
}

export function SwapStatusBadge({ status }: SwapStatusBadgeProps) {
  const { label, className } = config[status]

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}
