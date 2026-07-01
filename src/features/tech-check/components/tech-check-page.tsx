import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useTechCheck, useAssignTechCheckItem } from "../hooks/use-tech-check";
import { useOrgMembers } from "@/features/organizations/hooks/use-org-members";
import { useAuth } from "@/shared/hooks/use-auth";
import { TechCheckProgress } from "./tech-check-progress";
import { CriticalItemAlert } from "./critical-item-alert";
import { TechCheckItemCard } from "./tech-check-item-card";
import { AddTechCheckItemForm } from "./add-tech-check-item-form";

export function TechCheckPage() {
  const { eventId } = useParams({ from: "/events/$eventId/tech-check" });
  const { user } = useAuth();
  const { data: items, isLoading } = useTechCheck(eventId);
  const { data: members, isLoading: loadingMembers } = useOrgMembers();
  const { mutate: assignMember } = useAssignTechCheckItem();
  const [showForm, setShowForm] = useState(false);

  // Espera os dois carregarem antes de decidir o role — evita
  // "não reconhece" por causa de race condition entre as duas queries
  const stillResolving = isLoading || loadingMembers;
  const myMember = members?.find((m) => m.user.id === user?.id);
  const canEdit = myMember?.role === "LEADER" || myMember?.role === "ADMIN";

  if (stillResolving) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <div className="h-8 animate-pulse rounded-xl bg-surface" />
        <div className="h-24 animate-pulse rounded-xl bg-surface" />
        <div className="h-16 animate-pulse rounded-xl bg-surface" />
      </div>
    );
  }

  const allItems = items ?? [];

  const byCategory = allItems.reduce<Record<string, typeof allItems>>(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {},
  );

  return (
    <div className="flex flex-col gap-6 p-6 pb-24">
      <h1 className="text-xl font-semibold text-foreground">Tech Check</h1>

      {/* Membro comum vê tudo como leitura — avisa que é view-only */}
      {!canEdit && (
        <p className="text-xs text-muted-foreground">
          Você está vendo o checklist — só líderes podem editar.
        </p>
      )}

      {allItems.length > 0 && <TechCheckProgress items={allItems} />}

      <CriticalItemAlert items={allItems} />

      {allItems.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground">
          Nenhum item no checklist ainda.
        </p>
      )}

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

                {canEdit && item.assignments.length === 0 && (
                  <div className="mt-2 flex gap-2 pl-2">
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        if (!e.target.value) return;
                        assignMember({
                          eventId,
                          itemId: item.id,
                          memberId: e.target.value,
                        });
                        e.target.value = "";
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
  );
}
