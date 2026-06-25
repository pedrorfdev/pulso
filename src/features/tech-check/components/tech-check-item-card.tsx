import { useAuth } from "@/shared/hooks/use-auth"
import { useUpdateTechCheckStatus, useDeleteTechCheckItem } from "../hooks/use-tech-check"
import { isCriticalUnassigned } from "../types"
import type { TechCheckItem } from "../types"

interface TechCheckItemCardProps {
  item: TechCheckItem
  eventId: string
  canEdit: boolean
}

export function TechCheckItemCard({ item, eventId, canEdit }: TechCheckItemCardProps) {
  const { user } = useAuth()
  const { mutate: updateStatus } = useUpdateTechCheckStatus()
  const { mutate: deleteItem } = useDeleteTechCheckItem()

  // member.id aqui é OrganizationMember.id — precisamos comparar com o member_id do assignment
  // O assignment.member.id é o OrganizationMember.id, user.id é o User.id
  // Então buscamos via user.id comparando com assignment member que tem seu próprio user
  const myAssignment = item.assignments.find((a) => a.member.id === user?.id)
  const isChecked = myAssignment?.status === "CHECKED"
  const isUnassignedCritical = isCriticalUnassigned(item)

  return (
    <div className={`rounded-xl border p-4 transition ${isUnassignedCritical ? "border-pulse/40 bg-pulse/5" : "border-border bg-surface"}`}>
      <div className="flex items-start gap-3">
        {myAssignment ? (
          <button
            onClick={() => updateStatus({
              eventId,
              assignmentId: myAssignment.id,
              status: isChecked ? "PENDING" : "CHECKED",
            })}
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition ${isChecked ? "border-success bg-success text-background" : "border-border"}`}
          >
            {isChecked && <span className="text-xs">✓</span>}
          </button>
        ) : (
          <div className={`mt-0.5 h-5 w-5 shrink-0 rounded border-2 ${isUnassignedCritical ? "border-pulse/40" : "border-border"}`} />
        )}

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${isChecked ? "text-muted-foreground line-through" : "text-foreground"}`}>
              {item.label}
              {item.isCritical && <span className="ml-1 text-xs text-pulse">crítico</span>}
            </p>
            {canEdit && (
              <button onClick={() => deleteItem({ eventId, itemId: item.id })} className="text-xs text-muted-foreground hover:text-pulse">
                remover
              </button>
            )}
          </div>

          {item.assignments.length > 0 ? (
            <div className="mt-1 flex flex-wrap gap-1">
              {item.assignments.map((a) => (
                <span key={a.id} className={`rounded-full px-2 py-0.5 text-xs ${a.status === "CHECKED" ? "bg-success/10 text-success" : "bg-border text-muted-foreground"}`}>
                  {a.member.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              {isUnassignedCritical ? <span className="text-pulse">Sem responsável</span> : "Sem responsável"}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
