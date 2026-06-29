import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import { useOrgStore } from "@/shared/store/org-store";
import type { AttendanceStatus } from "@/types/enums";

export interface MemberProfile {
  member_id: string;
  role: "ADMIN" | "LEADER" | "MEMBER";
  nickname: string | null;
  joined_at: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
  };
  stats: {
    confirmed_on_time: number;
    confirmed_late: number;
    absences: number;
    deadline_misses: number;
    swaps_requested: number;
    swaps_accepted: number;
    reliability_score: number;
  } | null;
  history: Array<{
    event: {
      id: string;
      title: string;
      location: string | null;
      starts_at: string;
    };
    role_labels: string[];
    attendance: {
      status: AttendanceStatus;
      justification: string | null;
      responded_at: string | null;
    } | null;
    swap: {
      id: string;
      status: string;
      was_requester: boolean;
    } | null;
  }>;
}

export function useMyProfile() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId);
  return useQuery({
    queryKey: ["profile", activeOrgId, "me"],
    queryFn: async () => {
      const { data } = await apiClient.get<MemberProfile>(
        `/organizations/${activeOrgId}/members/me/profile`,
      );
      return data;
    },
    enabled: !!activeOrgId,
  });
}

export function useMemberProfile(memberId: string) {
  const activeOrgId = useOrgStore((s) => s.activeOrgId);
  return useQuery({
    queryKey: ["profile", activeOrgId, memberId],
    queryFn: async () => {
      const { data } = await apiClient.get<MemberProfile>(
        `/organizations/${activeOrgId}/members/${memberId}/profile`,
      );
      return data;
    },
    enabled: !!activeOrgId && !!memberId,
  });
}

export function useUpdateNickname() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nickname: string) =>
      apiClient.patch(`/organizations/${activeOrgId}/members/me/profile`, {
        nickname,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", activeOrgId, "me"],
      });
    },
  });
}
