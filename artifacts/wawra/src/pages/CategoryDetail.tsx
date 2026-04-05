import { MainLayout } from "@/components/layout/MainLayout";
import { useGetCategoryBySlug, useListAudios, getGetCategoryBySlugQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { AudioGrid } from "@/components/audio/AudioGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function CategoryDetail() {
  const params = useParams<{ slug: string }>();
  
  const { data: category, isLoading: categoryLoading } = useGetCategoryBySlug(params.slug!, {
    query: {
      enabled: !!params.slug,
      queryKey: getGetCategoryBySlugQueryKey(params.slug!)
    }
  });

  const { data: audiosResponse, isLoading: audiosLoading } = useListAudios(
    { categoryId: category?.id, published: true, limit: 20 },
    {
      query: {
        enabled: !!category?.id
      }
    }
  );

  if (categoryLoading) {
    return (
      <MainLayout>
        <div className="bg-card border-b py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <Skeleton className="w-48 h-10 mb-4" />
            <Skeleton className="w-96 h-6" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!category) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-24 text-center max-w-xl">
          <h1 className="font-serif text-3xl mb-4">Category not found</h1>
          <p className="text-muted-foreground mb-8">The category you're looking for doesn't exist.</p>
          <Link href="/browse" className="text-primary hover:underline">
            Browse all topics
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div 
        className="border-b relative overflow-hidden"
        style={category.color ? { backgroundColor: `${category.color}05` } : { backgroundColor: 'hsl(var(--card))' }}
      >
        {category.color && (
          <div 
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/3 pointer-events-none"
            style={{ backgroundColor: category.color }}
          />
        )}
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl relative z-10">
          <Link href="/browse" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to browse
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            {category.color && (
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
            )}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight">
              {category.name}
            </h1>
          </div>
          
          {category.description && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-light leading-relaxed">
              {category.description}
            </p>
          )}
          
          <div className="mt-8 text-sm font-medium text-muted-foreground bg-background/50 inline-block px-3 py-1 rounded-full border">
            {category.audioCount} {category.audioCount === 1 ? 'audio' : 'audios'}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {audiosLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />)}
          </div>
        ) : (
          <AudioGrid audios={audiosResponse?.items || []} emptyMessage={`No audios found in ${category.name}.`} />
        )}
      </div>
    </MainLayout>
  );
}
