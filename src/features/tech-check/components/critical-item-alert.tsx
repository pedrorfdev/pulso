import { isCriticalUnassigned } from "../types"
import type { TechCheckItem } from "../types"

interface CriticalAlertProps {
  items: TechCheckItem[]
}

/**
 * O componente mais importante do Épico 7.
 *
 * Um item crítico sem ninguém atribuído é um risco operacional real —
 * imagina chegar no culto e a DI Box não ter responsável, ninguém trouxe,
 * ninguém sabe quem ia trazer. É exatamente esse cenário que o Pulso
 * precisa prevenir.
 *
 * Por isso esse alerta é agressivo visualmente: borda vermelha, fundo
 * colorido, ícone de atenção. Não pode ser ignorado acidentalmente.
 * O back não bloqueia nada — essa responsabilidade é inteiramente do front.
 */
export function CriticalItemAlert({ items }: CriticalAlertProps) {
  const critical = items.filter(isCriticalUnassigned)

  if (critical.length === 0) return null

  return (
    <div className="rounded-xl border border-pulse/40 bg-pulse/10 p-4">
      <div className="flex items-center gap-2">
        <span className="text-pulse">⚠</span>
        <p className="font-medium text-pulse">
          {critical.length === 1
            ? "1 item crítico sem responsável"
            : `${critical.length} itens críticos sem responsável`}
        </p>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        {critical.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-pulse" />
            <p className="text-sm text-foreground">
              {item.label}
              <span className="ml-1 text-muted-foreground">
                · {item.category}
              </span>
            </p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Atribua um responsável antes do evento.
      </p>
    </div>
  )
}
