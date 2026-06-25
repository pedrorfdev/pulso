interface AvatarStackProps {
  people: { id: string; name: string; avatarUrl: string | null }[]
  max?: number
}

/**
 * Avatares sobrepostos dos confirmados — o elemento visual "vivo" do
 * hero card. Mostra até `max` avatares e um indicador "+N" pro resto,
 * evitando que a lista estoure o card em grupos grandes.
 */
export function AvatarStack({ people, max = 5 }: AvatarStackProps) {
  if (people.length === 0) return null

  const visible = people.slice(0, max)
  const overflow = people.length - visible.length

  return (
    <div className="flex items-center">
      {visible.map((person, index) => (
        <div
          key={person.id}
          className="-ml-2 first:ml-0"
          style={{ zIndex: visible.length - index }}
        >
          {person.avatarUrl ? (
            <img
              src={person.avatarUrl}
              alt={person.name}
              className="h-8 w-8 rounded-full border-2 border-surface object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-gradient-pulse text-xs font-medium text-pulse-foreground">
              {initials(person.name)}
            </div>
          )}
        </div>
      ))}

      {overflow > 0 && (
        <div className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-border text-xs text-muted-foreground">
          +{overflow}
        </div>
      )}
    </div>
  )
}

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}
