import { Link } from "wouter";
import logoSrc from "@assets/wawra-logo.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { lang, setLang, t } = useLanguage();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center group" data-testid="link-home">
          <img
            src={logoSrc}
            alt="Wawra"
            className="h-8 w-auto object-contain transition-opacity group-hover:opacity-70"
          />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/browse"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-testid="link-browse"
          >
            {t.browse}
          </Link>

          <Button
            variant="outline"
            size="sm"
            className="rounded-full px-3 h-8 text-xs font-medium"
            onClick={() => setLang(lang === "en" ? "ps" : "en")}
            data-testid="btn-lang-toggle"
          >
            {lang === "en" ? "پښتو" : "English"}
          </Button>
        </div>
      </div>
    </nav>
  );
}
