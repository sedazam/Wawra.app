import { useState } from "react";
import { Search } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { PodcastCard } from "@/components/PodcastCard";
import { EpisodeRow } from "@/components/EpisodeRow";
import { CategoryPill } from "@/components/CategoryPill";

import cover1 from "@/assets/podcast-cover-1.jpg";
import cover2 from "@/assets/podcast-cover-2.jpg";
import cover3 from "@/assets/podcast-cover-3.jpg";
import cover4 from "@/assets/podcast-cover-4.jpg";
import cover5 from "@/assets/podcast-cover-5.jpg";
import cover6 from "@/assets/podcast-cover-6.jpg";

const categories = ["All", "Technology", "Culture", "Business", "Science", "Music", "True Crime", "Comedy"];

const trendingPodcasts = [
  { title: "The Sound of Tomorrow", author: "Wawra Originals", cover: cover1, duration: "45 min" },
  { title: "Deep Frequencies", author: "Audio Lab", cover: cover2, duration: "32 min" },
  { title: "Voices Unheard", author: "Global Stories", cover: cover3, duration: "28 min" },
  { title: "The Listening Room", author: "Sound & Vision", cover: cover4, duration: "55 min" },
  { title: "Neon Nights", author: "Midnight Radio", cover: cover5, duration: "40 min" },
  { title: "Analog Dreams", author: "Retro Waves", cover: cover6, duration: "38 min" },
];

const recentEpisodes = [
  { title: "Why AI Will Change Everything", podcast: "The Sound of Tomorrow", duration: "42:15", cover: cover1, date: "Apr 3" },
  { title: "The Art of Deep Listening", podcast: "Deep Frequencies", duration: "31:08", cover: cover2, date: "Apr 2" },
  { title: "Stories from the Silk Road", podcast: "Voices Unheard", duration: "28:45", cover: cover3, date: "Apr 1" },
  { title: "Vinyl Revival: Why Records Matter", podcast: "The Listening Room", duration: "55:20", cover: cover4, date: "Mar 31" },
  { title: "Electronic Music's Golden Era", podcast: "Neon Nights", duration: "39:50", cover: cover5, date: "Mar 30" },
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="pb-24">
      {/* Top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-xl">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search podcasts, episodes..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-secondary rounded-full border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </header>

      <main className="px-6">
        {/* Hero */}
        <HeroSection />

        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </div>

        {/* Trending */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Trending Now</h2>
            <button className="text-xs text-primary hover:underline">See all</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trendingPodcasts.map((podcast) => (
              <PodcastCard key={podcast.title} {...podcast} />
            ))}
          </div>
        </section>

        {/* Recent Episodes */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Recent Episodes</h2>
            <button className="text-xs text-primary hover:underline">See all</button>
          </div>
          <div className="bg-card rounded-xl overflow-hidden shadow-card">
            {recentEpisodes.map((ep, i) => (
              <EpisodeRow key={ep.title} number={i + 1} {...ep} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
