import { Link } from "wouter";
import logoSrc from "@assets/wawra-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <img
            src={logoSrc}
            alt="Wawra"
            className="h-7 w-auto object-contain opacity-80"
          />
          <p className="text-sm text-muted-foreground">{t.tagline}</p>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/browse"
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-testid="link-footer-browse"
          >
            {t.allAudios}
          </Link>
          <Link
            href="/admin/login"
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-testid="link-footer-admin"
          >
            {t.admin}
          </Link>
        </div>
      </div>
    </footer>
  );
}
