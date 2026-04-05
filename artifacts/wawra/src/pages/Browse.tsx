import { MainLayout } from "@/components/layout/MainLayout";
import { useListAudios, useListCategories } from "@workspace/api-client-react";
import { AudioGrid } from "@/components/audio/AudioGrid";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Browse() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: categories } = useListCategories();

  const { data: audiosResponse, isLoading } = useListAudios({
    search: debouncedSearch,
    categoryId: selectedCategory,
    published: true,
    limit,
    offset: (page - 1) * limit
  });

  const totalPages = audiosResponse ? Math.ceil(audiosResponse.total / limit) : 0;

  return (
    <MainLayout>
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight mb-8">
            {t.browse}
          </h1>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t.searchPlaceholder}
                className="pl-9 h-12 bg-background border-muted text-base rounded-xl focus-visible:ring-1"
                value={search}
                onChange={e => setSearch(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Badge
              variant={selectedCategory === undefined ? "default" : "secondary"}
              className="cursor-pointer px-4 py-1.5 text-sm font-normal rounded-full whitespace-nowrap"
              onClick={() => { setSelectedCategory(undefined); setPage(1); }}
              data-testid="badge-filter-all"
            >
              {t.allTopics}
            </Badge>
            {categories?.map(category => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className="cursor-pointer px-4 py-1.5 text-sm font-normal rounded-full whitespace-nowrap bg-background"
                onClick={() => { setSelectedCategory(category.id); setPage(1); }}
                style={
                  selectedCategory !== category.id && category.color
                    ? { borderColor: `${category.color}40`, color: category.color }
                    : {}
                }
                data-testid={`badge-filter-${category.id}`}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl flex-1">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : (
          <>
            <AudioGrid audios={audiosResponse?.items || []} emptyMessage={t.noAudiosFound} />

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 border rounded-full text-sm font-medium disabled:opacity-50 hover:bg-muted transition-colors"
                  data-testid="btn-prev-page"
                >
                  {t.previous}
                </button>
                <span className="text-sm text-muted-foreground mx-4">
                  {t.pageOf(page, totalPages)}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 border rounded-full text-sm font-medium disabled:opacity-50 hover:bg-muted transition-colors"
                  data-testid="btn-next-page"
                >
                  {t.next}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
