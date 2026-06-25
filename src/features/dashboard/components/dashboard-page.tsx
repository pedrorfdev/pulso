import { Link } from "@tanstack/react-router"
import { useUpcomingEvents } from "@/features/events/hooks/use-upcoming-events"
import { useOrgMembers } from "@/features/organizations/hooks/use-org-members"
import { useMyRole } from "@/shared/hooks/use-my-role"
import { EventHeroCard } from "@/features/events/components/event-hero-card"
import { UpcomingEventsList } from "@/features/events/components/upcoming-events-list"

export function DashboardPage() {
  const { data: events, isLoading: loadingEvents } = useUpcomingEvents()
  const { data: members, isLoading: loadingMembers } = useOrgMembers()
  const { isLeader } = useMyRole()

  const [nextEvent, ...restEvents] = events ?? []

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Hero card do próximo evento */}
      {loadingEvents ? (
        <DashboardSkeleton />
      ) : nextEvent ? (
        <EventHeroCard event={nextEvent} />
      ) : (
        <EmptyDashboard isLeader={isLeader} />
      )}

      {/* Lista dos próximos eventos */}
      {restEvents.length > 0 && <UpcomingEventsList events={restEvents} />}

      {/* Cards de membros da equipe */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Equipe</p>
          {isLeader && (
            <Link to="/events/new" className="text-sm text-pulse hover:text-pulse/80">
              + novo evento
            </Link>
          )}
        </div>

        {loadingMembers ? (
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-surface" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {(members ?? []).map((member) => (
              <div key={member.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3">
                {member.user.avatar_url ? (
                  <img
                    src={member.user.avatar_url}
                    alt={member.user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-pulse text-xs font-semibold text-white">
                    {initials(member.nickname ?? member.user.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {member.nickname ?? member.user.name.split(" ")[0]}
                  </p>
                  <p className="text-xs text-muted-foreground">{roleLabel(member.role)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function EmptyDashboard({ isLeader }: { isLeader: boolean }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 text-center">
      <p className="font-medium text-foreground">Nenhum evento por aqui ainda.</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {isLeader
          ? "Crie um evento pra começar."
          : "Quando a liderança publicar uma escala, ela aparece aqui."}
      </p>
      <div className="mt-4 flex flex-col gap-2">
        {isLeader && (
          <Link
            to="/events/new"
            className="rounded-xl bg-gradient-pulse py-3 text-sm font-medium text-white"
          >
            Criar evento
          </Link>
        )}
        <Link
          to="/create-organization"
          className="rounded-xl border border-border py-3 text-sm text-muted-foreground"
        >
          Criar outro grupo
        </Link>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-52 animate-pulse rounded-2xl bg-surface" />
      <div className="h-16 animate-pulse rounded-xl bg-surface" />
    </div>
  )
}

function initials(name: string): string {
  return name.split(" ").slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("")
}

function roleLabel(role: string): string {
  if (role === "ADMIN") return "Admin"
  if (role === "LEADER") return "Líder"
  return "Membro"
}
