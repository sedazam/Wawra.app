import { Link } from "wouter";
import { Audio } from "@workspace/api-client-react";
import { formatDuration, formatDate } from "@/lib/format";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AudioCard({ audio }: { audio: Audio }) {
  return (
    <Link href={`/audio/${audio.slug}`} className="group block" data-testid={`card-audio-${audio.id}`}>
      <div className="bg-card rounded-xl overflow-hidden border shadow-sm transition-all hover:shadow-md hover:border-primary/20 flex flex-row items-center gap-0">
        {/* Thumbnail */}
        <div className="relative w-16 h-16 shrink-0 overflow-hidden bg-secondary">
          {audio.coverImageUrl ? (
            <img
              src={audio.coverImageUrl}
              alt={audio.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-lg font-serif text-muted-foreground opacity-40">W</span>
            </div>
          )}

          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow">
              <Play className="w-3 h-3 text-black ml-0.5 fill-current" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 min-w-0 px-3 py-2 gap-0.5">
          <h3 className="font-medium text-sm leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {audio.title}
          </h3>

          {audio.description && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {audio.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-0.5">
            {audio.categoryName && (
              <Badge
                variant="secondary"
                className="font-normal text-xs px-1.5 py-0 h-4"
                style={audio.categoryColor ? { backgroundColor: `${audio.categoryColor}20`, color: audio.categoryColor } : {}}
              >
                {audio.categoryName}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">{formatDate(audio.publishDate || audio.createdAt)}</span>
          </div>
        </div>

        {/* Duration */}
        {audio.duration && (
          <div className="shrink-0 pr-3 text-xs font-mono text-muted-foreground">
            {formatDuration(audio.duration)}
          </div>
        )}
      </div>
    </Link>
  );
}
