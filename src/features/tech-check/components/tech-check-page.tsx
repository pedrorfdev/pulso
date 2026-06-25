import { useState } from "react"
import { useParams } from "@tanstack/react-router"
import { useTechCheck, useAssignTechCheckItem } from "../hooks/use-tech-check"
import { useOrgMembers } from "@/features/organizations/hooks/use-org-members"
import { useAuth } from "@/shared/hooks/use-auth"
import { TechCheckProgress } from "./tech-check-progress"
import { CriticalItemAlert } from "./critical-item-alert"
import { TechCheckItemCard } from "./tech-check-item-card"
import { AddTechCheckItemForm } from "./add-tech-check-item-form"

/**
 * Tela de tech check de um evento. Estrutura:
 *
 *   1. Progress bar (quantos itens verificados)
 *   2. Alerta de itens críticos sem responsável (se houver)
 *   3. Itens agrupados por categoria
 *   4. Form de adicionar item (só líder/admin)
 *
 * A lógica de "pode editar" usa o role do membro logado — líder e admin
 * veem o form de adicionar item e o botão de atribuir responsável.
 */
export function TechCheckPage() {
  const { eventId } = useParams({ from: "/events/$eventId/tech-check" })
  const { user } = useAuth()
  const { data: items, isLoading } = useTechCheck(eventId)
  const { data: members } = useOrgMembers()
  const { mutate: assignMember } = useAssignTechCheckItem()
  const [showForm, setShowForm] = useState(false)

  const myMember = members?.find((m) => m.user.id === user?.id)
  const canEdit = myMember?.role === "LEADER" || myMember?.role === "ADMIN"

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <div className="h-8 animate-pulse rounded-xl bg-surface" />
        <div className="h-24 animate-pulse rounded-xl bg-surface" />
        <div className="h-16 animate-pulse rounded-xl bg-surface" />
      </div>
    )
  }

  const allItems = items ?? []

  // Agrupa por categoria mantendo a ordem de inserção
  const byCategory = allItems.reduce<Record<string, typeof allItems>>(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    },
    {}
  )

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold text-foreground">Tech Check</h1>

      {allItems.length > 0 && <TechCheckProgress items={allItems} />}

      <CriticalItemAlert items={allItems} />

      {allItems.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground">
          Nenhum item no checklist ainda.
        </p>
      )}

      {/* Itens agrupados por categoria */}
      {Object.entries(byCategory).map(([category, categoryItems]) => (
        <section key={category}>
          <p className="mb-2 text-sm text-muted-foreground">{category}</p>
          <div className="flex flex-col gap-2">
            {categoryItems.map((item) => (
              <div key={item.id}>
                <TechCheckItemCard
                  item={item}
                  eventId={eventId}
                  canEdit={canEdit}
                />

                {/* Picker de responsável — só líder/admin, só se não tem ninguém ainda */}
                {canEdit && item.assignments.length === 0 && (
                  <div className="mt-2 flex gap-2 pl-2">
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        if (!e.target.value) return
                        assignMember({
                          eventId,
                          itemId: item.id,
                          memberId: e.target.value,
                        })
                        e.target.value = ""
                      }}
                      className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-pulse"
                    >
                      <option value="">Atribuir responsável...</option>
                      {(members ?? []).map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nickname ?? m.user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Form de adicionar item — só líder/admin */}
      {canEdit && (
        <div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="mb-3 text-sm text-muted-foreground hover:text-foreground"
          >
            {showForm ? "Cancelar" : "+ Adicionar item"}
          </button>
          {showForm && (
            <AddTechCheckItemForm
              eventId={eventId}
              onSuccess={() => setShowForm(false)}
            />
          )}
        </div>
      )}
    </div>
  )
}
