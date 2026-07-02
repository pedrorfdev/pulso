import type { CheckItemStatus } from "@/types/enums";

export interface TechCheckItem {
  id: string;
  label: string;
  category: string;
  is_critical: boolean; // snake_case — conforme API real
  assignments: TechCheckAssignment[];
}

export interface TechCheckAssignment {
  id: string;
  status: CheckItemStatus;
  checked_at: string | null;
  member: {
    id: string; // OrganizationMember.id
    user: {
      id: string; // User.id — usado para identificar o usuário logado
      name: string;
      avatar_url: string | null;
    };
  };
}

export function isCriticalUnassigned(item: TechCheckItem): boolean {
  return item.is_critical && item.assignments.length === 0;
}
