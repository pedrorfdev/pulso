import { useAuth } from "@/shared/hooks/use-auth";
import {
  useUpdateTechCheckStatus,
  useDeleteTechCheckItem,
} from "../hooks/use-tech-check";
import { isCriticalUnassigned } from "../types";
import type { TechCheckItem } from "../types";

interface Props {
  item: TechCheckItem;
  eventId: string;
  canEdit: boolean;
}

export function TechCheckItemCard({ item, eventId, canEdit }: Props) {
  const { user } = useAuth();
  const { mutate: updateStatus, isPending } = useUpdateTechCheckStatus();
  const { mutate: deleteItem } = useDeleteTechCheckItem();

  // Compara user.id (User.id) com a.member.user.id — shape correto da API
  const myAssignment = item.assignments.find(
    (a) => a.member.user.id === user?.id,
  );
  const isChecked = myAssignment?.status === "CHECKED";
  const isUnassignedCritical = isCriticalUnassigned(item);

  function toggleCheck() {
    if (!myAssignment) return;
    updateStatus({
      eventId,
      assignmentId: myAssignment.id,
      status: isChecked ? "PENDING" : "CHECKED",
    });
  }

  return (
    <div
      className={`rounded-xl border p-4 transition ${
        isUnassignedCritical
          ? "border-pulse/40 bg-pulse/5"
          : "border-border bg-surface"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox — só interativo se o usuário tem assignment */}
        <button
          onClick={myAssignment ? toggleCheck : undefined}
          disabled={!myAssignment || isPending}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition ${
            isChecked
              ? "border-success bg-success text-white"
              : myAssignment
                ? "border-border hover:border-success/60"
                : "cursor-default border-border opacity-40"
          }`}
        >
          {isChecked && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 5l2.5 2.5L8 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p
              className={`text-sm font-medium ${isChecked ? "text-muted-foreground line-through" : "text-foreground"}`}
            >
              {item.label}
              {item.is_critical && (
                <span className="ml-1.5 text-xs text-pulse">crítico</span>
              )}
            </p>
            {canEdit && (
              <button
                onClick={() => deleteItem({ eventId, itemId: item.id })}
                className="shrink-0 text-xs text-muted-foreground hover:text-pulse"
              >
                remover
              </button>
            )}
          </div>

          {/* Responsáveis */}
          {item.assignments.length > 0 ? (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {item.assignments.map((a) => (
                <span
                  key={a.id}
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    a.status === "CHECKED"
                      ? "bg-success/10 text-success"
                      : "bg-border text-muted-foreground"
                  }`}
                >
                  {a.member.user.name}
                  {a.status === "CHECKED" && " ✓"}
                </span>
              ))}
            </div>
          ) : (
            <p
              className={`mt-1 text-xs ${isUnassignedCritical ? "text-pulse" : "text-muted-foreground"}`}
            >
              Sem responsável
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
