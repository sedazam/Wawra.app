import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addFavorite = useMutation({
    mutationFn: async (item: { podcast_title: string; episode_title?: string; cover_url?: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        ...item,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  const removeFavorite = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("favorites").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  const isFavorite = (podcastTitle: string) =>
    favorites.some((f) => f.podcast_title === podcastTitle);

  const getFavoriteId = (podcastTitle: string) =>
    favorites.find((f) => f.podcast_title === podcastTitle)?.id;

  return { favorites, isLoading, addFavorite, removeFavorite, isFavorite, getFavoriteId };
}
