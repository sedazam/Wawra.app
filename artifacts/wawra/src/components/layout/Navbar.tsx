import { Link } from "wouter";
import logoSrc from "@assets/wawra-logo.png";

export function Navbar() {
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

        <div className="flex items-center gap-6">
          <Link
            href="/browse"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            data-testid="link-browse"
          >
            Browse
          </Link>
        </div>
      </div>
    </nav>
  );
}
