import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroPodcast from "@/assets/hero-podcast.jpg";

export function HeroSection() {
  return (
    <section className="relative rounded-xl overflow-hidden mb-8">
      <div className="absolute inset-0">
        <img
          src={heroPodcast}
          alt="Featured podcast"
          className="w-full h-full object-cover"
          width={1920}
          height={800}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>
      <div className="relative z-10 px-8 py-16 md:py-24 max-w-lg">
        <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-widest font-semibold bg-primary/20 text-primary rounded-full mb-4">
          Featured
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight">
          The Sound of Tomorrow
        </h1>
        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          Explore the intersection of technology and creativity with the world's leading innovators. New episodes every week.
        </p>
        <div className="flex gap-3">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-glow">
            <Play className="w-4 h-4" />
            Play Now
          </Button>
          <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
            View Episodes
          </Button>
        </div>
      </div>
    </section>
  );
}
