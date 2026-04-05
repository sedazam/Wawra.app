import { AudioCard } from "./AudioCard";
import { Audio } from "@workspace/api-client-react";

export function AudioGrid({ audios, emptyMessage = "No audios found." }: { audios: Audio[], emptyMessage?: string }) {
  if (audios.length === 0) {
    return (
      <div className="py-24 text-center border rounded-2xl border-dashed bg-card/50">
        <p className="text-muted-foreground font-medium" data-testid="text-empty">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {audios.map(audio => (
        <AudioCard key={audio.id} audio={audio} />
      ))}
    </div>
  );
}
