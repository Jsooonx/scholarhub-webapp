import Link from 'next/link';

import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="font-serif text-8xl font-bold text-brand-dark/10 mb-4">404</p>
          <h1 className="font-serif text-3xl font-bold text-brand-dark mb-3">Page not found</h1>
          <p className="text-sm text-brand-muted mb-8 leading-relaxed">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-brand-dark text-sm font-semibold rounded-full text-white bg-brand-dark hover:bg-white hover:text-brand-dark cursor-pointer interactive-press"
            >
              Back to home
            </Link>
            <Link
              href="/scholarships"
              className="inline-flex items-center justify-center px-6 py-3 border border-brand-border bg-white text-sm font-semibold rounded-full text-brand-dark hover:bg-brand-cream cursor-pointer transition-colors"
            >
              Browse scholarships
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
