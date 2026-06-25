/**
 * Shape de stats de um membro individual.
 * Espelha o modelo MemberStats do Prisma — calculado à meia-noite
 * pelo cron job, não em tempo real. O front não precisa saber disso,
 * mas é importante pra UX: os números podem ter até ~24h de delay.
 */
export interface MemberStats {
  confirmedOnTime: number
  confirmedLate: number
  absences: number
  deadlineMisses: number
  swapsRequested: number
  swapsAccepted: number
  reliabilityScore: number // 0-100, normalizado pelo cron
}

/**
 * Stats de um membro dentro do relatório do líder — inclui dados do
 * membro pra renderizar a lista sem busca adicional.
 */
export interface MemberStatsEntry {
  member: {
    id: string
    name: string
    avatarUrl: string | null
    nickname: string | null
  }
  stats: MemberStats
}

/**
 * Resposta do GET /:orgId/stats (visão do líder).
 * Traz a lista de todos os membros com seus stats.
 */
export interface OrgStatsReport {
  members: MemberStatsEntry[]
}

/**
 * Resposta do GET /:orgId/members/absences (lista pública de faltas).
 * O back já aplica o filtro de absences_public / justifications_public
 * da org — o front só renderiza o que vier, sem lógica de privacidade
 * adicional.
 */
export interface MemberAbsence {
  member: {
    id: string
    name: string
    avatarUrl: string | null
  }
  absences: number
  justification: string | null // null se justifications_public: false
}
