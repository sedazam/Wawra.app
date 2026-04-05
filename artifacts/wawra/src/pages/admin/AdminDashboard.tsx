import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetAudioStats, useListAudios, useUpdateAudio, getGetAudioStatsQueryKey, getListAudiosQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Headphones, Library, CheckCircle2, Star, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetAudioStats();
  const { data: recent, isLoading: recentLoading } = useListAudios({ limit: 10 });
  const updateAudio = useUpdateAudio();
  const queryClient = useQueryClient();

  const handleToggleStatus = (id: number, currentStatus: boolean, field: 'published' | 'featured') => {
    updateAudio.mutate(
      { id, data: { [field]: !currentStatus } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListAudiosQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetAudioStatsQueryKey() });
        }
      }
    );
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your audio library.</p>
        </div>
      </div>

      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Audios</CardTitle>
              <Headphones className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-serif">{stats.totalAudios}</div>
              <p className="text-xs text-muted-foreground mt-1">+{stats.recentUploads} recently uploaded</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-serif">{stats.publishedAudios}</div>
              <p className="text-xs text-muted-foreground mt-1">Available to listeners</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Library className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-serif">{stats.totalCategories}</div>
              <p className="text-xs text-muted-foreground mt-1">Active topics</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-serif">{stats.featuredAudios}</div>
              <p className="text-xs text-muted-foreground mt-1">Pinned to homepage</p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="font-serif text-xl font-medium tracking-tight">Recent Uploads</h2>
        </div>
        
        {recentLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : recent?.items.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <p>No audios uploaded yet.</p>
          </div>
        ) : (
          <div className="divide-y">
            {recent?.items.map(audio => (
              <div key={audio.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded bg-muted overflow-hidden shrink-0">
                    {audio.coverImageUrl && <img src={audio.coverImageUrl} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{audio.title}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {formatDuration(audio.duration)} • {formatDate(audio.createdAt)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant={audio.published ? "default" : "secondary"} className="font-normal">
                    {audio.published ? "Published" : "Draft"}
                  </Badge>
                  {audio.featured && (
                    <Badge variant="outline" className="font-normal border-primary text-primary">Featured</Badge>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/audio/${audio.slug}`} className="cursor-pointer">View Page</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={() => handleToggleStatus(audio.id, audio.published, 'published')}
                      >
                        {audio.published ? "Unpublish" : "Publish"}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={() => handleToggleStatus(audio.id, audio.featured, 'featured')}
                      >
                        {audio.featured ? "Remove Featured" : "Mark as Featured"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
