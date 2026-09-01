'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { ScholarshipApplication } from '@/app/actions/shortlist';
import ScholarshipCard from '@/components/ScholarshipCard';
import RemoveShortlistButton from '@/components/RemoveShortlistButton';
import ApplicationTracker from '@/components/ApplicationTracker';
import DeadlineCalendar from '@/components/DeadlineCalendar';
import SplitText from '@/components/SplitText';
import { Kanban, List, LayoutGrid, Heart, Calendar, Compass, Undo2, ArrowRight, GraduationCap } from 'lucide-react';
import { filterScholarships, type QuizAnswers } from '@/lib/matching';
import { useShortlist } from '@/components/ShortlistProvider';
import { updateProfileQuizAnswers } from '@/app/actions/profile';
import { FilterPill } from '@/components/ScholarMatchQuiz';
import { Button, LinkButton } from '@/components/ui/button';

interface Props {
  initialApplications: ScholarshipApplication[];
  email?: string;
  error?: string;
  quizAnswers?: QuizAnswers | null;
}

export default function ShortlistDashboard({ initialApplications, email, error, quizAnswers }: Props) {
  const [view, setView] = useState<'board' | 'list' | 'calendar' | 'match'>('board');
  const { authenticated } = useShortlist();
  
  const [currentQuizAnswers, setCurrentQuizAnswers] = useState<QuizAnswers | null>(quizAnswers ?? null);
  const [activeDropdown, setActiveDropdown] = useState<'degree' | 'field' | 'experience' | 'funding' | 'region' | null>(null);

  // Sync state if prop changes
  useEffect(() => {
    setCurrentQuizAnswers(quizAnswers ?? null);
  }, [quizAnswers]);

  // Close active dropdown on click outside
  useEffect(() => {
    if (!activeDropdown) return;
    const handleOutsideClick = () => {
      setActiveDropdown(null);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [activeDropdown]);

  const handleUpdateAnswers = async (updated: QuizAnswers) => {
    setCurrentQuizAnswers(updated);
    sessionStorage.setItem('scholarMatchAnswers', JSON.stringify(updated));
    if (authenticated) {
      await updateProfileQuizAnswers(updated);
    }
  };

  const available = initialApplications.filter((app) => app.scholarship);
  const unavailable = initialApplications.filter((app) => !app.scholarship);

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
                <Button
                  onClick={() => setView('board')}
                  variant="ghost"
                  size="sm"
                  shape="pill"
                  aria-pressed={view === 'board'}
                  className={`relative z-10 rounded-full px-4 text-xs font-semibold ${
                    view === 'board'
                      ? '!text-white'
                      : '!text-brand-muted hover:!text-brand-dark'
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
                </Button>
                <Button
                  onClick={() => setView('calendar')}
                  variant="ghost"
                  size="sm"
                  shape="pill"
                  aria-pressed={view === 'calendar'}
                  className={`relative z-10 rounded-full px-4 text-xs font-semibold ${
                    view === 'calendar'
                      ? '!text-white'
                      : '!text-brand-muted hover:!text-brand-dark'
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Deadline Calendar
                  {view === 'calendar' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 -z-10 rounded-full bg-brand-dark shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Button>
                <Button
                  onClick={() => setView('list')}
                  variant="ghost"
                  size="sm"
                  shape="pill"
                  aria-pressed={view === 'list'}
                  className={`relative z-10 rounded-full px-4 text-xs font-semibold ${
                    view === 'list'
                      ? '!text-white'
                      : '!text-brand-muted hover:!text-brand-dark'
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
                </Button>
                <Button
                  onClick={() => setView('match')}
                  variant="ghost"
                  size="sm"
                  shape="pill"
                  aria-pressed={view === 'match'}
                  className={`relative z-10 rounded-full px-4 text-xs font-semibold ${
                    view === 'match'
                      ? '!text-white'
                      : '!text-brand-muted hover:!text-brand-dark'
                  }`}
                >
                  <Compass className="h-3.5 w-3.5" />
                  ScholarMatch
                  {view === 'match' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 -z-10 rounded-full bg-brand-dark shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Button>
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

        {view === 'match' ? (
          currentQuizAnswers ? (
            <div className="space-y-8 animate-fade-in">
              <div className="p-6 sm:p-8 rounded-3xl bg-brand-cream border border-brand-border/60 flex flex-col gap-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-brand-dark flex items-center gap-1.5">
                      Recommended For Your Profile
                    </h2>
                    <p className="text-xs text-brand-muted mt-1">
                      Here are matching scholarships based on your quiz profile. Adjust your options below:
                    </p>
                  </div>
                  <LinkButton
                    href="/match"
                    variant="secondary"
                    size="sm"
                    className="self-start sm:self-auto"
                  >
                    <Undo2 className="h-3.5 w-3.5" /> Retake Quiz
                  </LinkButton>
                </div>

                {/* Live Adjust Filters Panel */}
                <div className="flex flex-wrap gap-2 z-20 relative">
                  {/* Degree Pill */}
                  <FilterPill
                    label="Degree"
                    value={currentQuizAnswers.degree === 'non-degree' ? 'Short Course' : currentQuizAnswers.degree}
                    active={activeDropdown === 'degree'}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(activeDropdown === 'degree' ? null : 'degree');
                    }}
                    options={[
                      { val: 'bachelor', label: 'Bachelor' },
                      { val: 'master', label: 'Master' },
                      { val: 'phd', label: 'PhD / Doctoral' },
                      { val: 'non-degree', label: 'Short Course' }
                    ]}
                    onChange={(val) => {
                      const updated = { ...currentQuizAnswers, degree: val as any };
                      void handleUpdateAnswers(updated);
                      setActiveDropdown(null);
                    }}
                  />

                  {/* Field Pill */}
                  <FilterPill
                    label="Field"
                    value={currentQuizAnswers.field === 'any' ? 'General' : currentQuizAnswers.field}
                    active={activeDropdown === 'field'}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(activeDropdown === 'field' ? null : 'field');
                    }}
                    options={[
                      { val: 'stem', label: 'STEM & IT' },
                      { val: 'business', label: 'Business & Econ' },
                      { val: 'arts', label: 'Arts & Creative' },
                      { val: 'social', label: 'Social & Human' },
                      { val: 'medicine', label: 'Medicine & Health' },
                      { val: 'any', label: 'General / Any' }
                    ]}
                    onChange={(val) => {
                      const updated = { ...currentQuizAnswers, field: val as any };
                      void handleUpdateAnswers(updated);
                      setActiveDropdown(null);
                    }}
                  />

                  {/* Experience Pill */}
                  <FilterPill
                    label="Work Exp"
                    value={currentQuizAnswers.experience === 'yes' ? '2+ Yrs' : 'None / Fresh'}
                    active={activeDropdown === 'experience'}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(activeDropdown === 'experience' ? null : 'experience');
                    }}
                    options={[
                      { val: 'yes', label: '2+ Yrs Experience' },
                      { val: 'no', label: 'No/Less Experience' }
                    ]}
                    onChange={(val) => {
                      const updated = { ...currentQuizAnswers, experience: val as any };
                      void handleUpdateAnswers(updated);
                      setActiveDropdown(null);
                    }}
                  />

                  {/* Funding Pill */}
                  <FilterPill
                    label="Funding"
                    value={currentQuizAnswers.funding === 'fully' ? 'Strictly Fully' : 'All/Partial'}
                    active={activeDropdown === 'funding'}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(activeDropdown === 'funding' ? null : 'funding');
                    }}
                    options={[
                      { val: 'fully', label: 'Strictly Fully' },
                      { val: 'any', label: 'Open to All' }
                    ]}
                    onChange={(val) => {
                      const updated = { ...currentQuizAnswers, funding: val as any };
                      void handleUpdateAnswers(updated);
                      setActiveDropdown(null);
                    }}
                  />

                  {/* Region Pill */}
                  <FilterPill
                    label="Region"
                    value={currentQuizAnswers.region === 'any' ? 'Any Region' : currentQuizAnswers.region}
                    active={activeDropdown === 'region'}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(activeDropdown === 'region' ? null : 'region');
                    }}
                    options={[
                      { val: 'any', label: 'Any Region' },
                      { val: 'asia', label: 'Asia' },
                      { val: 'europe', label: 'Europe' },
                      { val: 'americas', label: 'Americas' },
                      { val: 'oceania', label: 'Oceania' }
                    ]}
                    onChange={(val) => {
                      const updated = { ...currentQuizAnswers, region: val as any };
                      void handleUpdateAnswers(updated);
                      setActiveDropdown(null);
                    }}
                  />
                </div>
              </div>

              {(() => {
                const results = filterScholarships(currentQuizAnswers);
                return (
                  <div className="space-y-6">
                    {results.isFuzzy && (
                      <div className="p-3 border border-amber-100 bg-amber-50 text-[11px] text-amber-800 rounded-xl font-medium max-w-2xl leading-normal flex items-start gap-1.5">
                        <span className="text-sm leading-none mt-0.5">💡</span>
                        <span>
                          Fuzzy match: we relaxed constraints for <strong>{results.fuzzyLevels.join(' & ')}</strong> to display opportunities suitable for your level and field.
                        </span>
                      </div>
                    )}

                    {results.matches.length === 0 ? (
                      <div className="text-center py-12 text-brand-muted italic text-xs">
                        No matching scholarships found.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {results.matches.slice(0, 8).map((s) => (
                          <ScholarshipCard key={s.slug} scholarship={s} variant="grid" quizAnswers={currentQuizAnswers} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="rounded-3xl border border-brand-border bg-white px-6 py-16 text-center shadow-sm max-w-2xl mx-auto">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-brand-cream text-brand-dark">
                <GraduationCap className="h-6 w-6" />
              </div>
              <p className="font-serif text-2xl font-semibold text-brand-dark">Find your matching scholarships</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-brand-muted leading-relaxed">
                Take our 30-second ScholarMatch quiz. We will analyze your degree level, study fields, work history, and funding expectations to show you personalized grants!
              </p>
              <LinkButton
                href="/match"
                variant="primary"
                size="lg"
                className="mt-6"
              >
                Start ScholarMatch Quiz
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </LinkButton>
            </div>
          )
        ) : initialApplications.length === 0 ? (
          <div className="rounded-3xl border border-brand-border bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-brand-cream text-brand-accent">
              <Heart className="h-6 w-6" />
            </div>
            <p className="font-serif text-2xl font-semibold text-brand-dark">No saved scholarships yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-brand-muted">
              Browse scholarships and tap the bookmark button to build your personal shortlist and track your application progress.
            </p>
            <LinkButton
              href="/scholarships"
              variant="primary"
              size="lg"
              className="mt-6"
            >
              Browse scholarships
            </LinkButton>
          </div>
        ) : view === 'board' ? (
          <ApplicationTracker initialApplications={initialApplications} />
        ) : view === 'calendar' ? (
          <DeadlineCalendar applications={initialApplications} />
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
