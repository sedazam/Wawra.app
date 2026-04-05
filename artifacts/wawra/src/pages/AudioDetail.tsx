import { MainLayout } from "@/components/layout/MainLayout";
import { useGetAudioBySlug, useListAudios, getGetAudioBySlugQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import { AudioGrid } from "@/components/audio/AudioGrid";
import { formatDate } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AudioDetail() {
  const params = useParams<{ slug: string }>();
  const { t } = useLanguage();

  const { data: audio, isLoading } = useGetAudioBySlug(params.slug!, {
    query: {
      enabled: !!params.slug,
      queryKey: getGetAudioBySlugQueryKey(params.slug!)
    }
  });

  const { data: relatedAudios } = useListAudios(
    { categoryId: audio?.categoryId || undefined, limit: 4 },
    { query: { enabled: !!audio?.categoryId } }
  );

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Skeleton className="w-full aspect-[2/1] md:aspect-[3/1] rounded-2xl mb-8" />
          <Skeleton className="w-32 h-6 mb-4" />
          <Skeleton className="w-3/4 h-10 mb-6" />
          <Skeleton className="w-full h-24 rounded-xl mb-8" />
        </div>
      </MainLayout>
    );
  }

  if (!audio) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-24 text-center max-w-xl">
          <h1 className="font-serif text-3xl mb-4">{t.audioNotFound}</h1>
          <p className="text-muted-foreground mb-8">{t.audioNotFoundDesc}</p>
          <Link href="/browse" className="text-primary hover:underline">
            {t.browseAllAudios}
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-card border-b relative overflow-hidden">
        {audio.coverImageUrl && (
          <div
            className="absolute inset-0 opacity-5 blur-3xl scale-110 pointer-events-none"
            style={{ backgroundImage: `url(${audio.coverImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        )}
        <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl relative z-10 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden bg-muted shadow-lg border border-white/10 shrink-0">
            {audio.coverImageUrl ? (
              <img src={audio.coverImageUrl} alt={audio.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary">
                <span className="text-6xl font-serif text-muted-foreground opacity-50">W</span>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center py-4">
            <div className="flex items-center gap-3 mb-4">
              {audio.categoryName && (
                <Link href={`/category/${audio.categorySlug}`}>
                  <Badge
                    variant="secondary"
                    className="font-medium hover:bg-secondary/80 transition-colors cursor-pointer"
                    style={audio.categoryColor ? { backgroundColor: `${audio.categoryColor}20`, color: audio.categoryColor } : {}}
                  >
                    {audio.categoryName}
                  </Badge>
                </Link>
              )}
              <span className="text-sm text-muted-foreground font-medium">
                {formatDate(audio.publishDate || audio.createdAt)}
              </span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 tracking-tight">
              {audio.title}
            </h1>

            <AudioPlayer audio={audio} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {audio.description && (
          <div className="prose prose-stone dark:prose-invert max-w-none text-lg leading-relaxed mb-20 font-light text-muted-foreground">
            <h2 className="font-serif text-2xl text-foreground font-normal mb-6">{t.about}</h2>
            <div className="whitespace-pre-line">{audio.description}</div>
          </div>
        )}

        {relatedAudios && relatedAudios.items.length > 1 && (
          <div>
            <h3 className="font-serif text-2xl font-normal mb-8 border-b pb-4">{t.youMightAlsoLike}</h3>
            <AudioGrid
              audios={relatedAudios.items.filter(a => a.id !== audio.id).slice(0, 4)}
              emptyMessage={t.noRelated}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
