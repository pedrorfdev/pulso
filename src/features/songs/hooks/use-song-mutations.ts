import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client";
import { useOrgStore } from "@/shared/store/org-store";
import type { SongLinkType } from "@/types/enums";

export interface CreateSongPayload {
  title: string;
  artist?: string;
  link_type?: SongLinkType;
  link_url?: string; // URL do Spotify, YouTube, etc.
  thumbnail_url?: string; // capa do álbum vinda do Spotify
}

export function useCreateSong() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSongPayload) =>
      apiClient.post(`/organizations/${activeOrgId}/songs`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs", activeOrgId] });
    },
  });
}

export function useDeleteSong() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (songId: string) =>
      apiClient.delete(`/organizations/${activeOrgId}/songs/${songId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs", activeOrgId] });
    },
  });
}

export function useAddEventSong() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      songId,
      order,
      notes,
    }: {
      eventId: string;
      songId: string;
      order: number;
      notes?: string;
    }) =>
      apiClient.post(`/organizations/${activeOrgId}/events/${eventId}/songs`, {
        song_id: songId,
        order,
        notes,
      }),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({
        queryKey: ["songs", activeOrgId, "event", eventId],
      });
    },
  });
}

export function useRemoveEventSong() {
  const activeOrgId = useOrgStore((s) => s.activeOrgId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      eventSongId,
    }: {
      eventId: string;
      eventSongId: string;
    }) =>
      apiClient.delete(
        `/organizations/${activeOrgId}/events/${eventId}/songs/${eventSongId}`,
      ),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({
        queryKey: ["songs", activeOrgId, "event", eventId],
      });
    },
  });
}
