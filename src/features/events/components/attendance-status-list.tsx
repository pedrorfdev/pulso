import type { EventSlot } from "../types";

interface AttendanceStatusListProps {
  slots: EventSlot[];
}

const STATUS_CONFIG = {
  CONFIRMED: {
    label: "Confirmado",
    dot: "bg-success",
    badge: "text-success bg-success/10",
  },
  PENDING: {
    label: "Aguardando",
    dot: "bg-warning",
    badge: "text-warning bg-warning/10",
  },
  DECLINED: {
    label: "Não vai",
    dot: "bg-muted-foreground",
    badge: "text-muted-foreground bg-border",
  },
  DEADLINE_MISSED: {
    label: "Prazo expirado",
    dot: "bg-pulse",
    badge: "text-pulse bg-pulse/10",
  },
} as const;

function initials(name?: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function AttendanceStatusList({ slots }: AttendanceStatusListProps) {
  if (slots.length === 0) return null;

  // Ordem: confirmados → pendentes → recusados → expirados
  const order = ["CONFIRMED", "PENDING", "DECLINED", "DEADLINE_MISSED"];
  const sorted = [...slots].sort(
    (a, b) =>
      order.indexOf(a.attendance.status) - order.indexOf(b.attendance.status),
  );

  return (
    <div className="flex flex-col gap-2">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Equipe escalada
      </p>
      {sorted.map((slot) => {
        const config =
          STATUS_CONFIG[slot.attendance.status as keyof typeof STATUS_CONFIG] ??
          STATUS_CONFIG.PENDING;
        const name = slot.member.name;
        const role = slot.role_labels.join(", ");

        return (
          <div
            key={slot.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5"
          >
            {/* Avatar */}
            {slot.member.avatar_url ? (
              <img
                src={slot.member.avatar_url}
                alt={name}
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-pulse text-xs font-semibold text-white">
                {initials(name)}
              </div>
            )}

            {/* Nome + função */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {name ?? "—"}
              </p>
              {role && (
                <p className="text-xs text-muted-foreground truncate">{role}</p>
              )}
            </div>

            {/* Badge de status */}
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.badge}`}
            >
              {config.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
