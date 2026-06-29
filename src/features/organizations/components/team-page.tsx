import { Link, useNavigate } from "@tanstack/react-router";
import { useOrgMembers } from "@/features/organizations/hooks/use-org-members";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  LEADER: "Líder",
  MEMBER: "Membro",
};

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function TeamPage() {
  const navigate = useNavigate();
  const { data: members, isLoading } = useOrgMembers();

  const sorted = [...(members ?? [])].sort((a, b) => {
    const order = { ADMIN: 0, LEADER: 1, MEMBER: 2 };
    return (
      (order[a.role as keyof typeof order] ?? 3) -
      (order[b.role as keyof typeof order] ?? 3)
    );
  });

  return (
    <div className="flex flex-col gap-5 p-4 pb-24">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate({ to: "/dashboard" })}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-surface transition"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 4L6 8l4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Equipe</h1>
          {members && (
            <p className="text-xs text-muted-foreground">
              {members.length} membros
            </p>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-surface" />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {sorted.map((member) => {
          const displayName = member.nickname ?? member.user.name;
          const isLeaderOrAdmin =
            member.role === "ADMIN" || member.role === "LEADER";

          return (
            <Link
              key={member.id}
              to="/team/$memberId/profile"
              params={{ memberId: member.id } as Record<string, string>}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 transition hover:border-pulse/30 active:bg-border/30"
            >
              {/* Avatar */}
              {member.user.avatar_url ? (
                <img
                  src={member.user.avatar_url}
                  alt={displayName}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-pulse text-sm font-semibold text-white">
                  {initials(displayName)}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {displayName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {member.user.name}
                </p>
              </div>

              {/* Role badge + seta */}
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    isLeaderOrAdmin
                      ? "bg-pulse/10 text-pulse"
                      : "bg-border text-muted-foreground"
                  }`}
                >
                  {ROLE_LABEL[member.role] ?? member.role}
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="text-border"
                >
                  <path
                    d="M5 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
