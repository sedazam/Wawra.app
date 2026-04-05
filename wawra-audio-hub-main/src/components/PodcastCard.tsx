import { Play, Heart } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { useNavigate } from "react-router-dom";

interface PodcastCardProps {
  title: string;
  author: string;
  cover: string;
  duration?: string;
}

export function PodcastCard({ title, author, cover, duration }: PodcastCardProps) {
  const [hovered, setHovered] = useState(false);
  const { user } = useAuth();
  const { isFavorite, getFavoriteId, addFavorite, removeFavorite } = useFavorites();
  const navigate = useNavigate();
  const liked = isFavorite(title);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate("/auth");
      return;
    }
    if (liked) {
      const id = getFavoriteId(title);
      if (id) removeFavorite.mutate(id);
    } else {
      addFavorite.mutate({ podcast_title: title, cover_url: cover });
    }
  };

  return (
    <div
      className="group relative bg-card rounded-xl p-3 transition-all duration-300 hover:bg-secondary cursor-pointer shadow-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          width={512}
          height={512}
        />
        <div
          className={`absolute inset-0 bg-background/40 flex items-end justify-between p-2 transition-opacity duration-300 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            onClick={handleFavorite}
            className="w-8 h-8 rounded-full bg-card/80 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-accent text-accent" : "text-foreground"}`} />
          </button>
          <button className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-glow hover:scale-110 transition-transform">
            <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
          </button>
        </div>
      </div>
      <h3 className="text-sm font-semibold text-foreground truncate">{title}</h3>
      <p className="text-xs text-muted-foreground truncate mt-1">{author}</p>
      {duration && (
        <span className="text-[10px] text-muted-foreground/60 mt-1 block">{duration}</span>
      )}
    </div>
  );
}
