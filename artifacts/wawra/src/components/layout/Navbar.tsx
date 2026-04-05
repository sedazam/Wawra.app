import { Link } from "wouter";
import { Headphones } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" data-testid="link-home">
          <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
            <Headphones className="w-5 h-5 text-primary" />
          </div>
          <span className="font-serif text-2xl font-medium tracking-tight">Wawra</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/browse" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-browse">
            Browse
          </Link>
        </div>
      </div>
    </nav>
  );
}
