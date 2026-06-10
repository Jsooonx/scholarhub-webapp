import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { allScholarships, providerMeta } from '@/lib/scholarships';
import { BookOpen, Globe, GraduationCap, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About ScholarHub',
  description: 'ScholarHub is a curated directory of international scholarships to help students find their path to studying abroad.',
};

const steps = [
  {
    icon: Search,
    title: 'Browse & filter',
    description: 'Search by keyword, country, degree level, or funding type. All scholarships from 6 top providers in one place.',
  },
  {
    icon: BookOpen,
    title: 'Read the details',
    description: 'Every scholarship page shows requirements, benefits, eligibility, and important dates - no fluff.',
  },
  {
    icon: GraduationCap,
    title: 'Apply officially',
    description: 'Each page links directly to the official provider website so you always apply from the source.',
  },
];

export default function AboutPage() {
  const total = allScholarships.length;
  const providers = Object.values(providerMeta);
  const countries = [...new Set(allScholarships.map(s => s.country).filter(Boolean))].length;

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <div className="border-b border-brand-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <nav className="text-xs text-brand-muted mb-6">
              <Link href="/" className="hover:text-brand-dark transition-colors">Home</Link>
              <span className="mx-2">·</span>
              <span className="text-brand-dark font-medium">About</span>
            </nav>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-brand-dark mb-6 leading-tight">
              About ScholarHub
            </h1>
            <p className="text-base text-brand-muted leading-relaxed max-w-2xl mx-auto">
              ScholarHub is a free, independent scholarship directory built to make finding international scholarships simpler - no accounts, no spam, just clean information.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="border-b border-brand-border bg-brand-cream">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="font-serif text-4xl font-bold text-brand-dark">{total}+</p>
                <p className="text-xs text-brand-muted uppercase tracking-wider mt-1">Scholarships</p>
              </div>
              <div>
                <p className="font-serif text-4xl font-bold text-brand-dark">{providers.length}</p>
                <p className="text-xs text-brand-muted uppercase tracking-wider mt-1">Providers</p>
              </div>
              <div>
                <p className="font-serif text-4xl font-bold text-brand-dark">{countries}+</p>
                <p className="text-xs text-brand-muted uppercase tracking-wider mt-1">Countries</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
          {/* How it works */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-brand-dark mb-8 text-center">How it works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {steps.map(({ icon: Icon, title, description }, i) => (
                <div key={i} className="rounded-2xl border border-brand-border bg-white p-6">
                  <div className="w-10 h-10 rounded-xl bg-brand-dark flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-2">Step {i + 1}</p>
                  <h3 className="font-serif text-lg font-semibold text-brand-dark mb-2">{title}</h3>
                  <p className="text-xs text-brand-muted leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Providers */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-brand-dark mb-8 text-center">Scholarship providers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((p) => (
                <Link key={p.name} href={`/providers/${Object.keys(providerMeta).find(k => providerMeta[k] === p) ?? ''}`}
                  className="rounded-2xl border border-brand-border bg-brand-cream p-6 hover:border-brand-dark/20 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{p.flag}</span>
                    <div>
                      <p className="font-semibold text-brand-dark text-sm">{p.name}</p>
                      <p className="text-[10px] text-brand-muted">{p.country}</p>
                    </div>
                  </div>
                  <p className="text-xs text-brand-muted leading-relaxed mb-4">{p.description}</p>
                  <span className="text-xs font-medium text-brand-accent">
                    {p.website.replace('https://', '')} ↗
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <section className="rounded-2xl border border-brand-border bg-brand-cream p-8 text-center">
            <Globe className="h-8 w-8 text-brand-muted mx-auto mb-4" />
            <h3 className="font-serif text-xl font-semibold text-brand-dark mb-3">A note on accuracy</h3>
            <p className="text-sm text-brand-muted leading-relaxed max-w-lg mx-auto">
              ScholarHub aggregates publicly available scholarship information for reference only. Always verify details, deadlines, and requirements on the official provider website before applying. Information may change without notice.
            </p>
            <Link
              href="/scholarships"
              className="inline-flex items-center justify-center mt-6 px-6 py-3 border border-transparent text-sm font-semibold rounded-full text-white bg-brand-dark hover:opacity-90 transition-opacity"
            >
              Browse all scholarships
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
