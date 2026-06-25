import { Link } from "@tanstack/react-router"
import { useUnreadCount } from "@/features/notifications/hooks/use-notifications"
import { useMyRole } from "@/shared/hooks/use-my-role"

/**
 * Bottom navigation — o único ponto de navegação global do app.
 * Mobile-first: 5 itens máximo, ícones grandes, área de toque generosa.
 *
 * Itens:
 *   Início     → /dashboard
 *   Trocas     → /swaps
 *   Louvores   → /songs
 *   Estatísticas → /stats
 *   Sino       → /notifications (com badge de não-lidas)
 */
export function BottomNav() {
  const unreadCount = useUnreadCount()
  const { isLeader } = useMyRole()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        <NavItem to="/dashboard" label="Início" icon={<HomeIcon />} />
        <NavItem to="/swaps" label="Trocas" icon={<SwapIcon />} />
        <NavItem to="/songs" label="Louvores" icon={<MusicIcon />} />
        {isLeader && <NavItem to="/stats" label="Stats" icon={<StatsIcon />} />}
        <NavItem
          to="/notifications"
          label="Avisos"
          icon={
            <div className="relative">
              <BellIcon />
              {unreadCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-pulse text-[9px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
          }
        />
      </div>
    </nav>
  )
}

function NavItem({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-1 px-3 py-1 text-muted-foreground transition-colors [&.active]:text-pulse"
      activeProps={{ className: "active" }}
    >
      <div className="h-6 w-6">{icon}</div>
      <span className="text-[10px]">{label}</span>
    </Link>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function SwapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  )
}

function MusicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}

function StatsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  )
}
