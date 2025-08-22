import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Event, InsertRsvp } from "@shared/schema";

export function useEvents() {
  return useQuery<Event[]>({
    queryKey: ["/api/events"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useEvent(id: number) {
  return useQuery<Event>({
    queryKey: ["/api/events", id],
    enabled: !!id,
  });
}

export function useRsvpMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rsvpData: InsertRsvp) => {
      return apiRequest("POST", "/api/rsvp", rsvpData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
    },
  });
}
