import type { CheckItemStatus } from "@/types/enums"

export interface TechCheckItem {
  id: string
  label: string
  category: string
  isCritical: boolean
  assignments: TechCheckAssignment[]
}

export interface TechCheckAssignment {
  id: string
  status: CheckItemStatus
  checkedAt: string | null
  member: {
    id: string
    name: string
    avatarUrl: string | null
  }
}

/**
 * Item crítico sem nenhuma assignment — o alerta mais importante do
 * tech check. A regra vem do doc: `isCritical: true` sem nenhuma
 * TechCheckAssignment ativa é o sinal que o front precisa destacar.
 * O back não bloqueia nada — é 100% responsabilidade do front mostrar
 * isso de forma que ninguém ignore.
 */
export function isCriticalUnassigned(item: TechCheckItem): boolean {
  return item.isCritical && item.assignments.length === 0
}
