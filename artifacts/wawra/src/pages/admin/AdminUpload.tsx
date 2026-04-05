import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListCategories, useCreateAudio, useUploadAudioFile, useUploadImageFile } from "@workspace/api-client-react";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Music, Image as ImageIcon } from "lucide-react";
import { formatDuration } from "@/lib/format";
import { useLanguage } from "@/contexts/LanguageContext";

const audioSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

type AudioFormValues = z.infer<typeof audioSchema>;

export default function AdminUpload() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { data: categories } = useListCategories();

  const createAudio = useCreateAudio();
  const uploadAudio = useUploadAudioFile();
  const uploadImage = useUploadImageFile();

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<AudioFormValues>({
    resolver: zodResolver(audioSchema),
    defaultValues: { title: "", slug: "", description: "", published: false, featured: false }
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    onChange(e);
    const generatedSlug = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    form.setValue("slug", generatedSlug);
  };

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      const audio = new Audio(url);
      audio.onloadedmetadata = () => {
        setAudioDuration(Math.round(audio.duration));
        URL.revokeObjectURL(url);
      };
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => { setCoverPreview(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: AudioFormValues) => {
    if (!audioFile) {
      toast({ title: t.audioRequired, description: t.audioRequiredDesc, variant: "destructive" });
      return;
    }

    try {
      const audioRes = await uploadAudio.mutateAsync({ data: { file: audioFile } });

      let imageUrl = null;
      if (coverImage) {
        const imageRes = await uploadImage.mutateAsync({ data: { file: coverImage } });
        imageUrl = imageRes.url;
      }

      await createAudio.mutateAsync({
        data: {
          title: values.title,
          slug: values.slug,
          description: values.description || null,
          audioUrl: audioRes.url,
          coverImageUrl: imageUrl,
          duration: audioDuration,
          categoryId: values.categoryId ? parseInt(values.categoryId) : null,
          published: values.published,
          featured: values.featured,
          publishDate: values.published ? new Date().toISOString() : null,
        }
      });

      toast({ title: t.uploadSuccess });
      setLocation("/admin");

    } catch (error) {
      console.error(error);
      toast({ title: t.uploadFailed, description: t.uploadFailedDesc, variant: "destructive" });
    }
  };

  const isUploading = uploadAudio.isPending || uploadImage.isPending || createAudio.isPending;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-medium tracking-tight mb-2">{t.uploadTitle}</h1>
        <p className="text-muted-foreground">{t.uploadSubtitle}</p>
      </div>

      <div className="bg-card border rounded-xl shadow-sm p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <FormLabel className="text-base">{t.audioFileLabel}</FormLabel>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-colors ${audioFile ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                  onClick={() => audioInputRef.current?.click()}
                >
                  <input type="file" accept="audio/*" className="hidden" ref={audioInputRef} onChange={handleAudioSelect} data-testid="input-audio-file" />

                  {audioFile ? (
                    <>
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-3">
                        <Music className="w-6 h-6" />
                      </div>
                      <p className="font-medium text-sm truncate max-w-full px-4">{audioFile.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t.duration} {formatDuration(audioDuration)}</p>
                      <Button variant="ghost" size="sm" className="mt-4" onClick={(e) => { e.stopPropagation(); setAudioFile(null); setAudioDuration(0); }} data-testid="btn-remove-audio">
                        {t.remove}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                        <Music className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-sm">{t.clickToSelectAudio}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t.audioFileHint}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <FormLabel className="text-base">{t.coverArtLabel}</FormLabel>
                <div
                  className={`border-2 border-dashed rounded-xl overflow-hidden aspect-square md:aspect-auto md:h-full flex flex-col items-center justify-center cursor-pointer transition-colors relative ${coverPreview ? 'border-border' : 'hover:bg-muted/50'}`}
                  onClick={() => imageInputRef.current?.click()}
                >
                  <input type="file" accept="image/*" className="hidden" ref={imageInputRef} onChange={handleImageSelect} data-testid="input-cover-file" />

                  {coverPreview ? (
                    <>
                      <img src={coverPreview} alt="Cover preview" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setCoverImage(null); setCoverPreview(null); }} data-testid="btn-remove-cover">
                          {t.changeImage}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-8">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3 mx-auto">
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-sm">{t.clickToSelectCover}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t.coverHint}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.titleLabel}</FormLabel>
                    <FormControl>
                      <Input className="text-lg h-12" placeholder={t.episodeTitlePlaceholder} {...field} onChange={e => handleTitleChange(e, field.onChange)} data-testid="input-audio-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.urlSlug}</FormLabel>
                      <FormControl>
                        <Input className="font-mono text-sm" {...field} data-testid="input-audio-slug" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.category}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-audio-category">
                            <SelectValue placeholder={t.selectCategory} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">{t.none}</SelectItem>
                          {categories?.map(c => (
                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.descriptionLabel}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t.descriptionPlaceholder}
                        className="resize-y min-h-[120px] text-base"
                        {...field}
                        data-testid="input-audio-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-muted/30 p-6 rounded-xl border">
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg p-3 border bg-card">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">{t.publishImmediately}</FormLabel>
                        <FormDescription>{t.publishDesc}</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-publish" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg p-3 border bg-card">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">{t.featureOnHome}</FormLabel>
                        <FormDescription>{t.featureDesc}</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-feature" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-6 border-t flex justify-end">
              <Button type="submit" size="lg" className="px-8" disabled={isUploading} data-testid="btn-submit-upload">
                {isUploading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
                {isUploading ? t.uploading : t.saveAudio}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
