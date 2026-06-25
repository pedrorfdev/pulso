/**
 * Espelha os enums do schema.prisma do back-end.
 *
 * IMPORTANTE: não há shared types entre os repos (decisão consciente, ver
 * doc de contexto). Isso significa que sempre que um enum mudar no back,
 * alguém precisa lembrar de atualizar aqui manualmente. Revisão de PR é
 * a rede de segurança — não tem checagem automática disso.
 */

export type OrgRole = "ADMIN" | "LEADER" | "MEMBER"

export type AttendanceStatus =
  | "PENDING"
  | "CONFIRMED"
  | "DECLINED"
  | "DEADLINE_MISSED"
  | "SWAPPED"

export type SwapStatus =
  | "PENDING_TARGET"
  | "PENDING_LEADER"
  | "APPROVED"
  | "REJECTED_TARGET"
  | "REJECTED_LEADER"

export type CheckItemStatus = "PENDING" | "CHECKED" | "MISSING"

export type SongLinkType = "SPOTIFY" | "YOUTUBE" | "NONE"
