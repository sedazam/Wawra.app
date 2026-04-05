import { useGetAdminMe, useAdminLogout } from "@workspace/api-client-react";
import { useLocation, Link } from "wouter";
import { useEffect } from "react";
import { Loader2, LogOut, LayoutDashboard, Upload, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isLoading, error } = useGetAdminMe();
  const [, setLocation] = useLocation();
  const logout = useAdminLogout();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isLoading && (!session?.authenticated || error)) {
      setLocation("/admin/login");
    }
  }, [session, isLoading, error, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.authenticated) return null;

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row">
      <aside className="w-full md:w-64 border-r bg-card flex flex-col">
        <div className="p-6 border-b">
          <Link href="/" className="font-serif text-2xl font-medium tracking-tight" data-testid="link-admin-home">
            {t.adminTitle}
          </Link>
        </div>
        <nav className="p-4 flex-1 flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors" data-testid="link-admin-dashboard">
            <LayoutDashboard className="w-4 h-4" /> {t.dashboard}
          </Link>
          <Link href="/admin/upload" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors" data-testid="link-admin-upload">
            <Upload className="w-4 h-4" /> {t.uploadAudio}
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-sm font-medium transition-colors" data-testid="link-admin-categories">
            <Tags className="w-4 h-4" /> {t.categories}
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={() => logout.mutate(undefined, { onSuccess: () => setLocation("/") })}
            data-testid="btn-logout"
          >
            <LogOut className="w-4 h-4" /> {t.logout}
          </Button>
        </div>
      </aside>

      <main className="flex-1 bg-background p-6 md:p-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
