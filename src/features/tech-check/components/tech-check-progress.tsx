import type { TechCheckItem } from "../types"

interface TechCheckProgressProps {
  items: TechCheckItem[]
}

/**
 * Barra de progresso no topo da tela de tech check. Conta itens com
 * pelo menos uma assignment CHECKED — não conta "atribuído", conta
 * "confirmado como pronto". A diferença importa: ter responsável ≠
 * item resolvido.
 */
export function TechCheckProgress({ items }: TechCheckProgressProps) {
  const total = items.length
  const done = items.filter((item) =>
    item.assignments.some((a) => a.status === "CHECKED")
  ).length

  const percent = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Itens verificados</p>
        <p className="text-sm font-medium text-foreground">
          {done}/{total}
        </p>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-gradient-pulse transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      {percent === 100 && (
        <p className="text-sm text-success">
          Tudo verificado ✓
        </p>
      )}
    </div>
  )
}
