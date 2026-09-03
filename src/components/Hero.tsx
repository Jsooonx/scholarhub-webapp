'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Globe, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { allScholarships, providerGroup, providerMeta } from '@/lib/scholarships';
import { useShortlist } from '@/components/ShortlistProvider';
import { fetchProfile } from '@/lib/client-api';
import type { Profile } from '@/app/actions/profile';
import { Button, LinkButton } from '@/components/ui/button';

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

const countryCount = new Set(allScholarships.map(s => s.country).filter(Boolean)).size;
const providerCount = Object.keys(providerMeta).length;

const stats = [
  { icon: BookOpen, value: `${allScholarships.length}+`, label: 'Scholarships listed' },
  { icon: Globe, value: `${countryCount}+`, label: 'Countries covered' },
  { icon: GraduationCap, value: `${providerCount}`, label: 'Top providers' },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { authenticated } = useShortlist();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (authenticated) {
      fetchProfile().then((res) => {
        if (res.profile) setProfile(res.profile as any);
      });
    } else {
      setProfile(null);
    }
  }, [authenticated]);

  const cycleGroups = ['germany', 'japan', 'turkey', 'united-kingdom', 'australia', 'south-korea'];
  const featuredList = cycleGroups.map(group => ({
    s: getFeaturedByGroup(group),
    image: FEATURED_IMAGES[group],
    group
  })).filter(item => item.s !== undefined);

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
    <section className="py-12 sm:py-16 bg-brand-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Header Row: Title & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end mb-10 sm:mb-14">
          <div className="lg:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted mb-3 block">
              Scholarship Directory
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-brand-dark leading-[1.08] max-w-2xl">
              Your path to studying abroad
            </h1>

            {/* ScholarMatch CTA */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {profile?.quiz_answers ? (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-cream border border-brand-border text-brand-dark">
                    <span>Target: </span>
                    <span className="capitalize font-bold text-brand-accent">
                      {profile.quiz_answers.degree} · {profile.quiz_answers.field}
                    </span>
                  </span>
                  <LinkButton
                    href="/match"
                    variant="link"
                    size="xs"
                    className="h-auto min-h-0 rounded-none px-0 !text-brand-accent"
                  >
                    Retake Quiz
                  </LinkButton>
                </div>
              ) : (
                <LinkButton
                  href="/match"
                  variant="primary"
                  size="lg"
                >
                  Find Your Match (30s)
                </LinkButton>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="lg:max-w-sm w-full rounded-2xl border border-brand-border bg-brand-cream/80 p-6 shadow-xs backdrop-blur-xs transition-all duration-200 hover:border-brand-dark/20 hover:shadow-sm">
            <p className="text-xs text-brand-muted leading-relaxed mb-4">
              Browse curated scholarships from top providers worldwide — all requirements, benefits, and deadlines in one place.
            </p>
            <div className="flex flex-col gap-3">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-brand-dark/5 border border-brand-border">
                    <Icon className="h-3.5 w-3.5 text-brand-dark" />
                  </div>
                  <span className="text-sm font-bold text-brand-dark">{value}</span>
                  <span className="text-xs text-brand-muted">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Big Featured Card with Carousel Slideshow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-[350px] sm:h-auto sm:aspect-[16/9] lg:aspect-[21/9] mb-8 group border border-brand-border bg-black"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col justify-end"
            >
              <Link
                href={`/scholarships/${activeFeatured.slug}`}
                className="absolute inset-0 z-20 cursor-pointer"
                aria-label={activeFeatured.name}
              />
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform transform-gpu"
                style={{ backgroundImage: `url('${activeImage}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-12 z-10 select-none">
                <div className="max-w-3xl">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white mb-4">
                    {providerMeta[activeGroup]?.flag ?? '🌍'} {activeFeatured.country} · {activeFeatured.provider}
                  </span>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-brand-accent/80 text-white">
                      {activeFeatured.funding_type}
                    </span>
                    {activeFeatured.degree_levels.slice(0, 2).map((l) => (
                      <span key={l} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/15 text-white/90 border border-white/20">
                        {l}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight leading-tight group-hover:underline transition-all">
                    {activeFeatured.name}
                  </h2>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 flex gap-2 z-30">
            {featuredList.map((_, idx) => (
              <Button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                variant="ghost"
                size="icon-xs"
                shape="circle"
                className={`!h-2 !min-h-2 !rounded-full !p-0 transition-all duration-300 ${
                  idx === currentIndex ? '!w-8 !bg-white' : '!w-2 !bg-white/40 hover:!bg-white/70'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
