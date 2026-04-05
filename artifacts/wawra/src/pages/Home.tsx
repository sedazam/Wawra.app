import { MainLayout } from "@/components/layout/MainLayout";
import { useGetFeaturedAudios, useGetLatestAudios, useListCategories } from "@workspace/api-client-react";
import { AudioGrid } from "@/components/audio/AudioGrid";
import { Link } from "wouter";
import { Headphones, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const { data: featured, isLoading: featuredLoading } = useGetFeaturedAudios({ limit: 4 });
  const { data: latest, isLoading: latestLoading } = useGetLatestAudios({ limit: 8 });
  const { data: categories, isLoading: categoriesLoading } = useListCategories();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-card border-b py-24 lg:py-32">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Headphones className="w-4 h-4" />
            <span>{t.curatedLibrary}</span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-normal tracking-tight text-foreground mb-6 leading-[1.1]">
            {t.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl font-light">
            {t.heroSubtitle}
          </p>
          <div className="flex items-center gap-4">
            <Button asChild size="lg" className="rounded-full px-8 h-14 text-base" data-testid="btn-start-listening">
              <Link href="/browse">
                <PlayCircle className="mr-2 w-5 h-5" />
                {t.startListening}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl font-medium tracking-tight">{t.featured}</h2>
            <p className="text-muted-foreground mt-2">{t.featuredSubtitle}</p>
          </div>
        </div>

        {featuredLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : (
          <AudioGrid audios={featured || []} emptyMessage={t.noFeatured} />
        )}
      </section>

      {/* Categories Nav */}
      <section className="py-16 bg-muted/30 border-y">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-2xl font-medium tracking-tight mb-8 text-center">{t.browseByTopic}</h2>

          {categoriesLoading ? (
            <div className="flex justify-center gap-4 flex-wrap">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="w-32 h-12 rounded-full" />)}
            </div>
          ) : (
            <div className="flex justify-center gap-4 flex-wrap max-w-4xl mx-auto">
              {categories?.map(category => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="px-6 py-3 rounded-full bg-card border shadow-sm hover:shadow-md hover:border-primary/30 transition-all font-medium text-sm flex items-center gap-2"
                  data-testid={`link-category-${category.id}`}
                >
                  {category.color && (
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: category.color }}></span>
                  )}
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl font-medium tracking-tight">{t.latestUploads}</h2>
            <p className="text-muted-foreground mt-2">{t.latestSubtitle}</p>
          </div>
          <Button variant="outline" asChild data-testid="btn-view-all">
            <Link href="/browse">{t.viewAll}</Link>
          </Button>
        </div>

        {latestLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : (
          <AudioGrid audios={latest || []} emptyMessage={t.noRecent} />
        )}
      </section>
    </MainLayout>
  );
}
