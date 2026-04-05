import { Play, Clock, MoreHorizontal } from "lucide-react";

interface EpisodeRowProps {
  number: number;
  title: string;
  podcast: string;
  duration: string;
  cover: string;
  date: string;
}

export function EpisodeRow({ number, title, podcast, duration, cover, date }: EpisodeRowProps) {
  return (
    <div className="group flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-secondary/60 transition-colors cursor-pointer">
      <span className="text-sm text-muted-foreground w-6 text-center group-hover:hidden">
        {number}
      </span>
      <button className="hidden group-hover:flex w-6 items-center justify-center text-primary">
        <Play className="w-4 h-4" />
      </button>
      <img
        src={cover}
        alt={title}
        className="w-10 h-10 rounded-md object-cover"
        loading="lazy"
        width={40}
        height={40}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{podcast}</p>
      </div>
      <span className="text-xs text-muted-foreground hidden sm:block">{date}</span>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span className="text-xs">{duration}</span>
      </div>
      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}
