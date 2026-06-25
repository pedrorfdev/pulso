import type { OrgRole } from "./enums"

/**
 * Shape real do GET /auth/me — snake_case conforme a API.
 * O front converte internamente onde necessário.
 */
export interface User {
  id: string
  name: string
  email: string
  avatar_url: string | null
  created_at: string
}

/**
 * Shape real do GET /me/organizations — shape aninhado.
 */
export interface MyOrganizationMembership {
  member_id: string
  role: OrgRole
  nickname: string | null
  joined_at: string
  organization: {
    id: string
    name: string
    slug: string
  }
}

export interface Organization {
  id: string
  name: string
  slug: string
  confirmation_deadline_hours: number
  absences_public: boolean
  justifications_public: boolean
}

export interface OrganizationMember {
  id: string
  role: OrgRole
  nickname: string | null
  is_active: boolean
  user: User
}
