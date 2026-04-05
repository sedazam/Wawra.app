import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import podcastCover3 from "@/assets/podcast-cover-3.jpg";

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([35]);
  const [volume, setVolume] = useState([75]);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-card/95 backdrop-blur-xl border-t border-border z-50">
      <div className="h-full flex items-center px-4 gap-4">
        {/* Track info */}
        <div className="flex items-center gap-3 w-64 min-w-0">
          <img
            src={podcastCover3}
            alt="Now playing"
            className="w-12 h-12 rounded-md object-cover shadow-card"
            width={48}
            height={48}
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              The Future of AI
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Tech Talks Daily
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-1 max-w-xl">
          <div className="flex items-center gap-4">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Shuffle className="w-4 h-4" />
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-full bg-primary flex items-center justify-center hover:scale-105 transition-transform shadow-glow"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-primary-foreground" />
              ) : (
                <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
              )}
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <SkipForward className="w-4 h-4" />
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Repeat className="w-4 h-4" />
            </button>
          </div>
          <div className="w-full flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground w-8 text-right">12:45</span>
            <Slider
              value={progress}
              onValueChange={setProgress}
              max={100}
              step={1}
              className="flex-1 [&_[role=slider]]:bg-primary [&_[role=slider]]:border-0 [&_[role=slider]]:w-3 [&_[role=slider]]:h-3"
            />
            <span className="text-[10px] text-muted-foreground w-8">36:20</span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 w-36">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className="flex-1 [&_[role=slider]]:bg-primary [&_[role=slider]]:border-0 [&_[role=slider]]:w-3 [&_[role=slider]]:h-3"
          />
        </div>
      </div>
    </div>
  );
}
