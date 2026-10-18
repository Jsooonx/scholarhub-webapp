'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Globe, BookOpen, ArrowRight, Compass } from 'lucide-react';
import Link from 'next/link';
import { allScholarships, providerGroup, providerMeta } from '@/lib/scholarships';
import { useShortlist } from '@/components/ShortlistProvider';
import { fetchProfile, getCachedProfile } from '@/lib/client-api';
import type { Profile } from '@/app/actions/profile';
import { LinkButton } from '@/components/ui/button';
import { formatDegree, formatField } from '@/lib/matching';

// Pull one per provider group for the hero row - prioritise the most complete providers
function getFeaturedByGroup(group: string) {
  return allScholarships.find((s) => providerGroup(s.provider) === group)!;
}

const FEATURED_IMAGES: Record<string, string> = {
  germany: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1600&q=80',
  japan: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1600&q=80',
  turkey: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=80',
  'united-kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=80',
  australia: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1600&q=80',
  'south-korea': 'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?auto=format&fit=crop&w=1600&q=80',
};

const countryCount = new Set(allScholarships.map((s) => s.country).filter(Boolean)).size;
const providerCount = Object.keys(providerMeta).length;

import { useIsHydrated } from '@/lib/hydration';

export default function Hero() {
  const isHydrated = useIsHydrated();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { authenticated } = useShortlist();
  const [profile, setProfile] = useState<Profile | null>(() => {
    if (typeof window !== 'undefined' && isHydrated) {
      return getCachedProfile()?.profile || null;
    }
    return null;
  });
  const [ready, setReady] = useState(true);

  useEffect(() => {
    // 1. Instantly restore cached profile on client mount if not initialized
    const cached = getCachedProfile();
    if (cached?.profile) {
      setProfile(cached.profile);
    }

    // 2. Fresh background revalidation
    fetchProfile()
      .then((res) => {
        if (res.profile) setProfile(res.profile);
        setReady(true);
      })
      .catch(() => {
        setReady(true);
      });

    // 3. Real-time profile synchronization across components & tabs
    const handleProfileUpdate = () => {
      const updated = getCachedProfile();
      setProfile(updated?.profile || null);
    };

    window.addEventListener('scholarhub_profile_updated', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);
    return () => {
      window.removeEventListener('scholarhub_profile_updated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, []);

  useEffect(() => {
    if (!authenticated && ready) {
      const cached = getCachedProfile();
      if (!cached?.profile?.quiz_answers) {
        setProfile(null);
      }
    }
  }, [authenticated, ready]);

  const cycleGroups = ['germany', 'japan', 'turkey', 'united-kingdom', 'australia', 'south-korea'];
  const featuredList = cycleGroups
    .map((group) => ({
      s: getFeaturedByGroup(group),
      image: FEATURED_IMAGES[group],
      group,
    }))
    .filter((item) => item.s !== undefined);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredList.length]);

  const activeItem = featuredList[currentIndex];
  if (!activeItem) return null;

  const activeFeatured = activeItem.s;
  const activeImage = activeItem.image;
  const activeGroup = activeItem.group;

  return (
    <section className="relative bg-brand-bg py-8 sm:py-12 lg:py-14 select-text overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Arc-Style Luminous Floating Showcase Canvas */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl sm:rounded-[36px] overflow-hidden border border-black/[0.07] bg-gradient-to-tr from-[#FFF4EE]/70 via-[#FCFBF9] to-[#EFF3FF]/70 p-6 sm:p-12 lg:p-14 shadow-xl shadow-brand-dark/[0.04] flex flex-col items-center text-center group select-none"
        >
          {/* Subtle Ambient Glow Blobs */}
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-200/35 rounded-full blur-3xl pointer-events-none" />

          {/* ── TOP SECTION: ARC TYPOGRAPHY & HEADLINE ── */}
          <div className="relative z-10 flex flex-col items-center max-w-4xl">
            {/* Small Kicker Pill */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium text-zinc-600 bg-black/[0.03] border border-black/[0.06] mb-4">
              Scholarship Directory &amp; Matcher
            </span>

            {/* Arc-Style Main Headline: Geist Medium, Tight Tracking, Dark Charcoal Ink */}
            <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-medium tracking-[-0.035em] text-[#18181B] leading-[1.08] text-balance">
              Your path to studying abroad.
            </h1>

            {/* Subtitle: Clean Inter / Geist Normal */}
            <p className="font-sans text-sm sm:text-base md:text-lg text-[#52525B] font-normal leading-relaxed mt-4 sm:mt-5 max-w-xl text-balance">
              Browse curated scholarships from top providers worldwide — all requirements, benefits, and deadlines in one place.
            </p>

            {/* Kumo UI Buttons */}
            <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-3">
              {!isHydrated || !ready ? (
                <div className="h-10 w-44 rounded-xl bg-black/5 animate-pulse" />
              ) : profile?.quiz_answers ? (
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <LinkButton
                    href="/match"
                    variant="primary"
                    size="lg"
                    className="h-10 sm:h-11 px-5 rounded-xl text-xs sm:text-sm font-semibold shadow-xs"
                  >
                    <span>Target: {formatDegree(profile.quiz_answers.degree)} · {formatField(profile.quiz_answers.field)}</span>
                    <ArrowRight className="h-4 w-4" />
                  </LinkButton>
                  <LinkButton
                    href="/match"
                    variant="secondary"
                    size="lg"
                    className="h-10 sm:h-11 px-4 rounded-xl text-xs sm:text-sm font-semibold shadow-xs"
                  >
                    Retake Quiz
                  </LinkButton>
                </div>
              ) : (
                <>
                  {/* Primary Kumo Button */}
                  <LinkButton
                    href="/match"
                    variant="primary"
                    size="lg"
                    className="h-10 sm:h-11 px-5 rounded-xl text-xs sm:text-sm font-semibold shadow-xs"
                  >
                    <span>Find your match (30s)</span>
                    <ArrowRight className="h-4 w-4" />
                  </LinkButton>

                  {/* Secondary Kumo Button */}
                  <LinkButton
                    href="/scholarships"
                    variant="secondary"
                    size="lg"
                    className="h-10 sm:h-11 px-5 rounded-xl text-xs sm:text-sm font-semibold shadow-xs"
                  >
                    <Compass className="h-4 w-4 text-brand-dark" />
                    <span>Explore scholarships</span>
                  </LinkButton>
                </>
              )}
            </div>

            {/* Micro Stats Bar */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4 sm:gap-7 text-zinc-500 text-[11px] sm:text-xs font-sans">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-brand-accent" />
                <strong className="text-zinc-800 font-semibold">{allScholarships.length}+</strong> Scholarships
              </span>
              <span className="text-zinc-300">•</span>
              <span className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-brand-accent" />
                <strong className="text-zinc-800 font-semibold">{countryCount}+</strong> Countries
              </span>
              <span className="text-zinc-300">•</span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-brand-accent" />
                <strong className="text-zinc-800 font-semibold">{providerCount}</strong> Top Providers
              </span>
            </div>
          </div>

          {/* ── BOTTOM SECTION: FEATURED SCHOLARSHIP SHOWCASE CAROUSEL ── */}
          <div className="mt-10 sm:mt-12 w-full max-w-4xl rounded-2xl sm:rounded-3xl overflow-hidden border border-black/[0.08] shadow-lg relative aspect-[16/9] sm:aspect-[21/9] group/card text-left">
            {/* Background Image Carousel with Crossfade */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-cover bg-center will-change-transform"
                style={{ backgroundImage: `url('${activeImage}')` }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30 pointer-events-none" />

            <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7 z-10">
              <Link
                href={`/scholarships/${activeFeatured.slug}`}
                className="max-w-2xl group/link"
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-md text-white border border-white/20">
                    {providerMeta[activeGroup]?.flag ?? '🌍'} {activeFeatured.country} · {activeFeatured.provider}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-accent text-white">
                    {activeFeatured.funding_type}
                  </span>
                </div>
                <h2 className="font-sans text-base sm:text-xl md:text-2xl font-semibold text-white tracking-tight leading-snug group-hover/link:underline">
                  {activeFeatured.name}
                </h2>
              </Link>

              {/* Slide Indicators */}
              <div className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7 flex gap-1.5 z-20">
                {featuredList.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentIndex ? 'w-8 bg-white shadow-xs' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
