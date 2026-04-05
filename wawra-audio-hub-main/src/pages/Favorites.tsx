import { useFavorites } from "@/hooks/useFavorites";
import { PodcastCard } from "@/components/PodcastCard";
import { Heart } from "lucide-react";

const FavoritesPage = () => {
  const { favorites, isLoading } = useFavorites();

  return (
    <div className="p-6 pb-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
          <Heart className="w-5 h-5 text-accent" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Your Favorites</h1>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground text-sm">Loading...</div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No favorites yet</p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            Tap the heart icon on any podcast to save it here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {favorites.map((fav) => (
            <PodcastCard
              key={fav.id}
              title={fav.podcast_title}
              author=""
              cover={fav.cover_url || ""}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
