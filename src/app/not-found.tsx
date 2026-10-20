import Footer from '@/components/Footer';
import { LinkButton } from '@/components/ui/button';
import { Compass, Search, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-border bg-white text-[11px] font-semibold text-brand-muted mb-4 shadow-2xs">
            <span>Error 404 · Page Not Found</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-dark mb-3 tracking-tight">
            Lost your way?
          </h1>
          <p className="text-sm text-brand-muted mb-8 leading-relaxed max-w-md mx-auto">
            The page you are looking for doesn&apos;t exist, was moved, or has an outdated link. Let&apos;s get you back on track toward your scholarship goals.
          </p>

          <div className="flex flex-wrap gap-2.5 justify-center mb-8">
            <LinkButton
              href="/"
              variant="primary"
              size="lg"
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              <span>Back to home</span>
            </LinkButton>
            <LinkButton
              href="/scholarships"
              variant="secondary"
              size="lg"
              className="gap-2"
            >
              <Search className="h-4 w-4" />
              <span>Browse scholarships</span>
            </LinkButton>
            <LinkButton
              href="/match"
              variant="secondary"
              size="lg"
              className="gap-2"
            >
              <Compass className="h-4 w-4 text-brand-accent" />
              <span>Match Quiz</span>
            </LinkButton>
          </div>

          <div className="pt-6 border-t border-brand-border text-xs text-brand-muted">
            <p>
              💡 Quick tip: Press <kbd className="px-1.5 py-0.5 rounded border border-brand-border bg-brand-cream font-mono text-[11px] text-brand-dark">Ctrl+K</kbd> (or <kbd className="px-1.5 py-0.5 rounded border border-brand-border bg-brand-cream font-mono text-[11px] text-brand-dark">⌘K</kbd>) anywhere to open the search palette.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
