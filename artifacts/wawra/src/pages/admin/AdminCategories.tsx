import { AdminLayout } from "@/components/layout/AdminLayout";
import { useListCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, getListCategoriesQueryKey } from "@workspace/api-client-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";

const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/i, "Must be a valid hex color").optional().or(z.literal('')),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function AdminCategories() {
  const { t } = useLanguage();
  const { data: categories, isLoading } = useListCategories();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", slug: "", description: "", color: "#000000" }
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    onChange(e);
    if (!editingId) {
      const generatedSlug = e.target.value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      form.setValue("slug", generatedSlug);
    }
  };

  const openCreateDialog = () => {
    setEditingId(null);
    form.reset({ name: "", slug: "", description: "", color: "#000000" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: any) => {
    setEditingId(category.id);
    form.reset({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      color: category.color || "#000000"
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm(t.confirmDelete)) {
      deleteCategory.mutate({ id }, {
        onSuccess: () => {
          toast({ title: t.categoryDeleted });
          queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
        }
      });
    }
  };

  const onSubmit = (values: CategoryFormValues) => {
    const dataToSubmit = {
      ...values,
      color: values.color || null,
      description: values.description || null
    };

    if (editingId) {
      updateCategory.mutate({ id: editingId, data: dataToSubmit }, {
        onSuccess: () => {
          toast({ title: t.categoryUpdated });
          setIsDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
        }
      });
    } else {
      createCategory.mutate({ data: dataToSubmit }, {
        onSuccess: () => {
          toast({ title: t.categoryCreated });
          setIsDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight mb-2">{t.categoriesTitle}</h1>
          <p className="text-muted-foreground">{t.categoriesSubtitle}</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} data-testid="btn-create-category">
              <Plus className="w-4 h-4 mr-2" /> {t.newCategory}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? t.editCategory : t.createCategory}</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.nameLabel}</FormLabel>
                      <FormControl>
                        <Input {...field} onChange={e => handleNameChange(e, field.onChange)} data-testid="input-category-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.slugLabel}</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-category-slug" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.descriptionLabel}</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="resize-none" rows={3} data-testid="input-category-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.accentColor}</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input type="color" className="w-12 p-1 h-10" {...field} data-testid="input-category-color-picker" />
                        </FormControl>
                        <FormControl>
                          <Input {...field} placeholder="#000000" className="flex-1 font-mono uppercase" data-testid="input-category-color" />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={createCategory.isPending || updateCategory.isPending}
                    data-testid="btn-save-category"
                  >
                    {(createCategory.isPending || updateCategory.isPending) && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    {editingId ? t.saveChanges : t.create}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : categories?.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <p>{t.noCategoriesYet}</p>
          </div>
        ) : (
          <div className="divide-y">
            {categories?.map(category => (
              <div key={category.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-medium"
                    style={{ backgroundColor: category.color || 'hsl(var(--primary))' }}
                  >
                    {category.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{category.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="font-mono bg-muted px-1.5 py-0.5 rounded">/{category.slug}</span>
                      <span>{category.audioCount} {t.audiosUnit}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)} data-testid={`btn-edit-category-${category.id}`}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(category.id)}
                    disabled={deleteCategory.isPending}
                    data-testid={`btn-delete-category-${category.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
