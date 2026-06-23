'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { ScholarshipApplication } from '@/app/actions/shortlist';
import ScholarshipCard from '@/components/ScholarshipCard';
import RemoveShortlistButton from '@/components/RemoveShortlistButton';
import ApplicationTracker from '@/components/ApplicationTracker';
import SplitText from '@/components/SplitText';
import { Kanban, List, LayoutGrid, Heart } from 'lucide-react';

interface Props {
  initialApplications: ScholarshipApplication[];
  email?: string;
  error?: string;
}

export default function ShortlistDashboard({ initialApplications, email, error }: Props) {
  const [view, setView] = useState<'board' | 'list'>('board');
  const [apps, setApps] = useState<ScholarshipApplication[]>(initialApplications);

  const available = apps.filter((app) => app.scholarship);
  const unavailable = apps.filter((app) => !app.scholarship);

  return (
    <main className="flex-grow">
      {/* Header and Toggle Area */}
      <div className="border-b border-brand-border bg-brand-bg">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-2 text-xs text-brand-muted">
            <Link href="/" className="hover:text-brand-dark transition-colors">Home</Link>
            <span className="mx-2">·</span>
            <span className="font-medium text-brand-dark">Shortlist & Tracker</span>
          </nav>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <SplitText
                text="My Shortlist"
                className="font-serif text-4xl font-bold tracking-tight text-brand-dark sm:text-5xl"
                tag="h1"
                delay={30}
                duration={0.6}
                ease="power2.out"
                threshold={0.1}
              />
              <p className="mt-2 max-w-xl text-sm text-brand-muted">
                Track your application stages and save notes for your favorite scholarships.
              </p>
            </div>

            {/* Premium Toggle Button */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {email && (
                <p className="text-xs text-brand-muted md:text-right">
                  Signed in as <span className="font-semibold text-brand-dark">{email}</span>
                </p>
              )}
              
              <div className="relative inline-flex rounded-full border border-brand-border bg-brand-cream p-1 shadow-sm">
                <button
                  onClick={() => setView('board')}
                  className={`relative z-10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200 ${
                    view === 'board'
                      ? 'text-white'
                      : 'text-brand-muted hover:text-brand-dark'
                  }`}
                >
                  <Kanban className="h-3.5 w-3.5" />
                  Board Tracker
                  {view === 'board' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 -z-10 rounded-full bg-brand-dark shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`relative z-10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200 ${
                    view === 'list'
                      ? 'text-white'
                      : 'text-brand-muted hover:text-brand-dark'
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  List view
                  {view === 'list' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 -z-10 rounded-full bg-brand-dark shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        {apps.length === 0 ? (
          <div className="rounded-3xl border border-brand-border bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-brand-cream text-brand-accent">
              <Heart className="h-6 w-6" />
            </div>
            <p className="font-serif text-2xl font-semibold text-brand-dark">No saved scholarships yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-brand-muted">
              Browse scholarships and tap the bookmark button to build your personal shortlist and track your application progress.
            </p>
            <Link
              href="/scholarships"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-dark px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Browse scholarships
            </Link>
          </div>
        ) : view === 'board' ? (
          <ApplicationTracker initialApplications={apps} />
        ) : (
          <div className="space-y-8 animate-fade-in">
            {available.length > 0 && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-serif text-2xl font-semibold text-brand-dark">Saved scholarships</h2>
                  <p className="text-xs text-brand-muted">{available.length} saved</p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {available.map((app) => (
                    <ScholarshipCard key={app.scholarship_slug} scholarship={app.scholarship!} />
                  ))}
                </div>
              </div>
            )}

            {unavailable.length > 0 && (
              <div>
                <h2 className="mb-4 font-serif text-2xl font-semibold text-brand-dark">Unavailable</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {unavailable.map((app) => (
                    <div key={app.scholarship_slug} className="rounded-2xl border border-brand-border bg-white p-5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">Saved item</p>
                      <h3 className="mt-2 font-serif text-lg font-semibold text-brand-dark">Unavailable scholarship</h3>
                      <p className="mt-2 text-xs leading-relaxed text-brand-muted">
                        The saved slug <span className="font-mono text-brand-dark">{app.scholarship_slug}</span> no longer matches the local scholarship database.
                      </p>
                      <div className="mt-4">
                        <RemoveShortlistButton slug={app.scholarship_slug} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
