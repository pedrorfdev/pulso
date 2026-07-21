import { Link } from "@tanstack/react-router";
import { useUnreadCount } from "@/features/notifications/hooks/use-notifications";
import { useMyRole } from "@/shared/hooks/use-my-role";
import {
  Home,
  Calendar,
  Music,
  Bell,
  User,
  Users,
  ArrowUpDown,
  ChartNoAxesColumn,
} from "lucide-react";

export function BottomNav() {
  const unreadCount = useUnreadCount();
  const { isLeader } = useMyRole();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        <NavItem to="/dashboard" label="Início" icon={<Home />} />
        <NavItem to="/schedules" label="Escalas" icon={<Calendar />} />
        <NavItem to="/swaps" label="Trocas" icon={<ArrowUpDown />} />
        <NavItem to="/songs" label="Louvores" icon={<Music />} />
        <NavItem to="/team" label="Equipe" icon={<Users />} />
        {isLeader && (
          <NavItem to="/stats" label="Stats" icon={<ChartNoAxesColumn />} />
        )}
        <NavItem
          to="/notifications"
          label="Avisos"
          icon={
            <div className="relative">
              <Bell />
              {unreadCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-pulse text-[9px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
          }
        />
        <NavItem to="/profile" label="Perfil" icon={<User />} />
      </div>
    </nav>
  );
}

function NavItem({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-1 px-2 py-1 text-muted-foreground transition-colors [&.active]:text-pulse"
      activeProps={{ className: "active" }}
    >
      <div className="h-6 w-6">{icon}</div>
      <span className="text-[10px]">{label}</span>
    </Link>
  );
}
