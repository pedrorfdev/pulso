import { Link, useNavigate } from "@tanstack/react-router";
import { useOrgMembers } from "@/features/organizations/hooks/use-org-members";

const ROLE_CONFIG: Record<string, { label: string; class: string }> = {
  ADMIN: { label: "Admin", class: "bg-pulse/10 text-pulse" },
  LEADER: { label: "Líder", class: "bg-pulse/10 text-pulse" },
  MEMBER: { label: "Membro", class: "bg-border text-muted-foreground" },
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

  const leaders = sorted.filter(
    (m) => m.role === "ADMIN" || m.role === "LEADER",
  );
  const regular = sorted.filter((m) => m.role === "MEMBER");

  return (
    <div className="flex flex-col gap-6 p-4 pb-24">
      {/* Header */}
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
              {members.length} {members.length === 1 ? "membro" : "membros"}
            </p>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-2xl bg-surface"
            />
          ))}
        </div>
      )}

      {/* Liderança */}
      {!isLoading && leaders.length > 0 && (
        <section>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Liderança
          </p>
          <div className="grid grid-cols-2 gap-3">
            {leaders.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </section>
      )}

      {/* Membros */}
      {!isLoading && regular.length > 0 && (
        <section>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Membros
          </p>
          <div className="grid grid-cols-2 gap-3">
            {regular.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </section>
      )}

      {!isLoading && sorted.length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhum membro ainda.</p>
      )}
    </div>
  );
}

function MemberCard({
  member,
}: {
  member: ReturnType<typeof useOrgMembers>["data"] extends
    | (infer T)[]
    | undefined
    ? T
    : never;
}) {
  const displayName = member.nickname ?? member.user.name;
  const roleCfg = ROLE_CONFIG[member.role] ?? ROLE_CONFIG.MEMBER;

  return (
    <Link
      to="/team/$memberId/profile"
      params={{ memberId: member.id }}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-4 text-center transition hover:border-pulse/30 active:scale-[0.98] active:bg-border/20"
    >
      {/* Avatar grande */}
      <div className="relative">
        {member.user.avatar_url ? (
          <img
            src={member.user.avatar_url}
            alt={displayName}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-border group-hover:ring-pulse/30 transition"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-pulse text-xl font-bold text-white ring-2 ring-border group-hover:ring-pulse/30 transition">
            {initials(displayName)}
          </div>
        )}
      </div>

      {/* Nome */}
      <div className="w-full min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">
          {displayName}
        </p>
        {member.nickname && (
          <p className="truncate text-xs text-muted-foreground">
            {member.user.name}
          </p>
        )}
      </div>

      {/* Badge de role */}
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleCfg.class}`}
      >
        {roleCfg.label}
      </span>
    </Link>
  );
}
