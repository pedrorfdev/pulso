import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import { useOrgStore } from "@/shared/store/org-store";

interface InviteLink {
  token: string;
  role_to_assign: string;
}

export function useInviteLink() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId);

  return useQuery({
    queryKey: ["invite-link", activeOrgId],
    queryFn: async () => {
      // ASSUNÇÃO: GET /organizations/:orgId/invite → { token, role_to_assign }
      const { data } = await apiClient.get<InviteLink>(
        `/organizations/${activeOrgId}/invite`,
      );
      return data;
    },
    enabled: !!activeOrgId,
    staleTime: 5 * 60_000, // token muda raramente
  });
}

export function buildInviteUrl(token: string): string {
  return `${window.location.origin}/join/${token}`;
}
