import type { OrgRole } from "@/types/enums"

/**
 * Shape real do GET /me/organizations
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
