import { Link } from "wouter";
import { Audio } from "@workspace/api-client-react";
import { formatDuration, formatDate } from "@/lib/format";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AudioCard({ audio }: { audio: Audio }) {
  return (
    <Link href={`/audio/${audio.slug}`} className="group block" data-testid={`card-audio-${audio.id}`}>
      <div className="bg-card rounded-2xl overflow-hidden border shadow-sm transition-all hover:shadow-md hover:border-primary/20 flex flex-col h-full">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {audio.coverImageUrl ? (
            <img 
              src={audio.coverImageUrl} 
              alt={audio.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary">
              <span className="text-4xl font-serif text-muted-foreground opacity-50">W</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
              <Play className="w-5 h-5 text-black ml-1 fill-current" />
            </div>
          </div>
          
          {audio.duration && (
            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-mono px-2 py-1 rounded-md backdrop-blur-sm">
              {formatDuration(audio.duration)}
            </div>
          )}
        </div>
        
        <div className="p-5 flex flex-col flex-1 gap-2">
          <div className="flex items-center justify-between gap-2">
            {audio.categoryName && (
              <Badge variant="secondary" className="font-normal text-xs" style={audio.categoryColor ? { backgroundColor: `${audio.categoryColor}20`, color: audio.categoryColor } : {}}>
                {audio.categoryName}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">{formatDate(audio.publishDate || audio.createdAt)}</span>
          </div>
          
          <h3 className="font-serif text-xl leading-tight line-clamp-2 mt-1 group-hover:text-primary transition-colors">
            {audio.title}
          </h3>
          
          {audio.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1 flex-1">
              {audio.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
