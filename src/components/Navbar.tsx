'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  Bookmark,
  User,
  LogOut,
  Menu,
  Globe,
  GraduationCap,
  Compass,
  ArrowRight,
  BookOpen,
  X,
} from 'lucide-react';

import { providerMeta } from '@/lib/scholarships/providerMeta';
import type { SearchItem } from '@/lib/scholarships/searchIndex';
import { useShortlist } from '@/components/ShortlistProvider';
import { cn } from '@/lib/utils';

// shadcn / Kumo UI components
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import MorphSearch from '@/components/MorphSearch';
import UserMenu from '@/components/UserMenu';
import { Button, LinkButton, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const providers = Object.entries(providerMeta).map(([slug, meta]) => ({
  name: meta.name,
  country: meta.country,
  flag: meta.flag,
  slug,
}));

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { authenticated, ready, slugs, signOut, email } = useShortlist();

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const userDisplayName = email
    ? email
        .split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Scholar';

  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sync scroll state immediately when navigating to another page
  useEffect(() => {
    setScrolled(window.scrollY > 24);
  }, [pathname]);

  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);

  return (
    <>
      {/* ── STICKY TOP NAVBAR (Morphs on scroll) ── */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full h-16 transition-[padding] duration-300 ease-out flex items-center",
          scrolled
            ? "px-3 sm:px-6 pointer-events-none"
            : "px-0 pointer-events-auto"
        )}
      >
        {/* Full-width unscrolled background & bottom border layer (fades seamlessly without position jump or leftover border artifacts) */}
        <div
          className={cn(
            "absolute inset-0 border-b border-brand-border/60 bg-brand-bg/90 backdrop-blur-md transition-opacity duration-300 ease-out pointer-events-none",
            scrolled ? "opacity-0" : "opacity-100"
          )}
        />

        {/* Morphing floating pill container */}
        <div
          className={cn(
            "relative z-10 mx-auto w-full flex items-center justify-between gap-3 transition-[max-width,padding,height,border-radius,background-color,border-color,box-shadow] duration-300 ease-out pointer-events-auto",
            scrolled
              ? "max-w-6xl px-4 sm:px-6 h-12.5 sm:h-13 rounded-full border border-brand-border/80 bg-brand-bg/95 backdrop-blur-xl shadow-lg shadow-brand-dark/5"
              : "max-w-7xl px-4 sm:px-6 lg:px-8 h-16 rounded-none border border-transparent bg-transparent shadow-none"
          )}
        >

          {/* ── LEFT: BRAND LOGO ── */}
          <div className="flex items-center gap-3 lg:gap-5">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-transform duration-150 hover:opacity-90 active:scale-[0.98] flex-shrink-0"
            >
              <img
                src="/images/logos/Scholarhub_logo.png"
                alt="ScholarHub Logo"
                className={cn(
                  "rounded-lg object-cover shadow-xs border border-brand-border/40 transition-[width,height,transform] duration-200 ease-out group-hover:scale-105 group-active:scale-[0.96]",
                  scrolled ? "h-7 w-7" : "h-8 w-8"
                )}
              />
              <div className="flex flex-col overflow-hidden">
                <span className={cn(
                  "font-serif font-bold tracking-tight text-brand-dark leading-none transition-[font-size] duration-200",
                  scrolled ? "text-base" : "text-lg"
                )}>
                  Scholar<span className="text-brand-accent">Hub</span>
                </span>
                <span className={cn(
                  "text-[10px] text-brand-muted uppercase tracking-widest font-medium transition-[max-height,opacity] duration-200 overflow-hidden",
                  scrolled ? "max-h-0 opacity-0" : "max-h-4 opacity-100"
                )}>
                  Directory
                </span>
              </div>
            </Link>

            {/* ── CENTER: DESKTOP SHADCN NAVIGATION MENU ── */}
            <nav className="hidden md:flex items-center">
              <NavigationMenu>
                <NavigationMenuList className="gap-1">

                  {/* 1. All Scholarships Link */}
                  <NavigationMenuItem>
                    <Link
                      href="/scholarships"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent hover:bg-black/5 text-xs font-semibold tracking-wide text-brand-dark/90",
                        pathname === '/scholarships' && "bg-black/5 text-brand-dark font-bold"
                      )}
                    >
                      Scholarships
                    </Link>
                  </NavigationMenuItem>

                  {/* 2. Destinations / Countries (Scrollable Mega Dropdown with ALL Countries) */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={cn(
                        "bg-transparent hover:bg-black/5 text-xs font-semibold tracking-wide text-brand-dark/90",
                        pathname.startsWith('/providers') && "bg-black/5 text-brand-dark font-bold"
                      )}
                    >
                      Destinations
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="w-[640px] max-w-[calc(100vw-32px)]">

                      {/* Dropdown Header */}
                      <div className="flex items-center justify-between mb-3 px-1 pb-2 border-b border-brand-border/50">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-dark">
                          <Globe className="h-3.5 w-3.5 text-brand-accent" />
                          <span>All Study Destinations ({providers.length} Countries &amp; Providers)</span>
                        </div>
                        <Link
                          href="/scholarships"
                          className="text-[11px] font-semibold text-brand-accent hover:underline flex items-center gap-1"
                        >
                          Explore all <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>

                      {/* Scrollable Container with ALL Countries */}
                      <div
                        data-lenis-prevent
                        className="max-h-[340px] overflow-y-auto pr-1.5 grid grid-cols-2 sm:grid-cols-3 gap-2 navbar-dropdown-scroll"
                        style={{
                          overscrollBehavior: 'contain',
                          scrollbarWidth: 'thin',
                          scrollbarColor: 'rgba(0,0,0,0.15) transparent',
                        }}
                      >
                        {providers.map((p) => (
                          <Link
                            key={p.slug}
                            href={`/providers/${p.slug}`}
                            className="flex items-center gap-2.5 p-2 rounded-xl border border-brand-border/40 bg-white/60 hover:bg-white hover:border-brand-accent/40 hover:shadow-xs transition-all group/card"
                          >
                            <span className="text-xl leading-none flex-shrink-0">{p.flag}</span>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-brand-dark group-hover/card:text-brand-accent transition-colors truncate">
                                {p.name}
                              </p>
                              <p className="text-[10px] text-brand-muted truncate">{p.country}</p>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* Dropdown Footer */}
                      <div className="mt-3.5 pt-2.5 border-t border-brand-border/50 flex items-center justify-between text-[11px] text-brand-muted px-1">
                        <span>Covering official government &amp; global foundation programs</span>
                        <Link
                          href="/about"
                          className="font-medium text-brand-dark hover:text-brand-accent underline underline-offset-2"
                        >
                          How to apply
                        </Link>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* 3. Explore & Features (Mega Dropdown) */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={cn(
                        "bg-transparent hover:bg-black/5 text-xs font-semibold tracking-wide text-brand-dark/90",
                        pathname === '/match' && "bg-black/5 text-brand-dark font-bold"
                      )}
                    >
                      Explore
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="w-[480px] max-w-[calc(100vw-32px)]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* ScholarMatch Quiz Card */}
                        <Link
                          href="/match"
                          className="flex flex-col justify-between p-3.5 rounded-xl bg-brand-cream border border-brand-border hover:border-brand-dark/20 hover:bg-white transition-all group/quiz"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2.5">
                              <div className="w-7 h-7 rounded-lg bg-white border border-brand-border flex items-center justify-center text-brand-dark group-hover/quiz:bg-brand-dark group-hover/quiz:text-white transition-all">
                                <Compass className="h-4 w-4 group-hover/quiz:rotate-45 transition-transform" />
                              </div>
                            </div>
                            <h4 className="text-sm font-bold text-brand-dark group-hover/quiz:text-brand-accent transition-colors">
                              ScholarMatch Quiz
                            </h4>
                            <p className="text-[11px] text-brand-muted mt-1 leading-relaxed">
                              Get tailored scholarship matches based on your GPA, major, and destination.
                            </p>
                          </div>
                          <div className="mt-3 flex items-center text-xs font-bold text-brand-accent">
                            Take 2-min Quiz <ArrowRight className="h-3 w-3 ml-1 group-hover/quiz:translate-x-1 transition-transform" />
                          </div>
                        </Link>

                        {/* Guides & Resources Column */}
                        <div className="flex flex-col gap-2">
                          <Link
                            href="/about"
                            className="p-2.5 rounded-xl border border-brand-border/40 bg-white/40 hover:bg-white hover:border-brand-border transition-all flex items-start gap-2.5 group/guide"
                          >
                            <BookOpen className="h-4 w-4 text-brand-accent mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-brand-dark group-hover/guide:text-brand-accent transition-colors">
                                Guide &amp; Tips
                              </p>
                              <p className="text-[10px] text-brand-muted">
                                Eligibility, requirements, deadlines
                              </p>
                            </div>
                          </Link>

                          <Link
                            href="/shortlist"
                            className="p-2.5 rounded-xl border border-brand-border/40 bg-white/40 hover:bg-white hover:border-brand-border transition-all flex items-start gap-2.5 group/shortlist"
                          >
                            <Bookmark className="h-4 w-4 text-brand-accent mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-brand-dark group-hover/shortlist:text-brand-accent transition-colors">
                                Application Tracker
                              </p>
                              <p className="text-[10px] text-brand-muted">
                                Manage and track saved scholarships
                              </p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* 4. About Link */}
                  <NavigationMenuItem>
                    <Link
                      href="/about"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent hover:bg-black/5 text-xs font-semibold tracking-wide text-brand-dark/90",
                        pathname === '/about' && "bg-black/5 text-brand-dark font-bold"
                      )}
                    >
                      About
                    </Link>
                  </NavigationMenuItem>

                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>

          {/* ── RIGHT: MORPH SEARCH, SHORTLIST, USER PROFILE, MOBILE MENU ── */}
          <div className="flex items-center gap-2 sm:gap-2.5">

            {/* Continuous Surface Morphing Search Bar */}
            <MorphSearch />

            {/* Shortlist Button (with dynamic count badge) */}
            <Link
              href="/shortlist"
              title="Saved Shortlist"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "relative h-9 px-2.5 rounded-full hover:bg-black/5 active:scale-95 transition-transform duration-150 ease-out text-brand-dark cursor-pointer flex items-center"
              )}
            >
              <Bookmark className="h-4 w-4" />
              {mounted && slugs.size > 0 && (
                <Badge className="ml-1.5 h-4 min-w-4 px-1 rounded-full text-[10px] bg-brand-accent text-white border-none flex items-center justify-center font-bold">
                  {slugs.size}
                </Badge>
              )}
            </Link>

            {/* User Profile / Auth Section */}
            {ready && authenticated ? (
              <UserMenu
                user={{
                  name: userDisplayName,
                  email: email || 'scholar@scholarhub.id',
                  plan: 'Scholar',
                }}
                showName
                items={[
                  {
                    label: 'Profile Settings',
                    icon: <User className="h-4 w-4" />,
                    onSelect: () => router.push('/profile'),
                  },
                  {
                    label: 'Shortlist Tracker',
                    icon: <Bookmark className="h-4 w-4" />,
                    badge:
                      slugs.size > 0 ? (
                        <Badge className="ml-auto h-4 px-1 rounded-full text-[10px] bg-brand-accent text-white border-none flex items-center justify-center font-bold">
                          {slugs.size}
                        </Badge>
                      ) : undefined,
                    onSelect: () => router.push('/shortlist'),
                  },
                  {
                    label: 'ScholarMatch Quiz',
                    icon: <Compass className="h-4 w-4" />,
                    onSelect: () => router.push('/match'),
                  },
                ]}
                onSignOut={async () => {
                  await signOut();
                  router.push('/');
                }}
              />
            ) : ready && !authenticated ? (
              <LinkButton
                href={`/login?next=${encodeURIComponent(pathname)}`}
                variant="primary"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Sign in
              </LinkButton>
            ) : (
              <div className="w-8 h-8 rounded-full flex-none opacity-0" />
            )}

            {/* Mobile Menu Drawer Trigger (shadcn Sheet) */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "md:hidden h-9 w-9 rounded-full text-brand-dark hover:bg-black/5 active:scale-90 transition-transform duration-150 ease-out cursor-pointer"
                )}
                aria-label="Open mobile menu"
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[300px] sm:w-[360px] bg-brand-bg border-l border-brand-border p-0 flex flex-col justify-between"
              >
                <div className="flex flex-col p-6 overflow-y-auto">

                  {/* Sheet Header */}
                  <SheetHeader className="p-0 text-left mb-6">
                    <div className="flex items-center gap-2.5">
                      <img
                        src="/images/logos/Scholarhub_logo.png"
                        alt="ScholarHub Logo"
                        className="h-7 w-7 rounded-lg object-cover border border-brand-border/40"
                      />
                      <div>
                        <SheetTitle className="font-serif text-lg font-bold text-brand-dark leading-none">
                          Scholar<span className="text-brand-accent">Hub</span>
                        </SheetTitle>
                        <p className="text-[10px] text-brand-muted uppercase tracking-widest mt-0.5">
                          Directory &amp; Matcher
                        </p>
                      </div>
                    </div>
                  </SheetHeader>

                  {/* Mobile Search Input Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      window.dispatchEvent(new CustomEvent('scholarhub:open-search'));
                    }}
                    className="relative mb-6 flex h-10 w-full items-center rounded-xl border border-brand-border bg-white pl-9 pr-3 text-xs text-brand-muted shadow-2xs text-left group active:scale-[0.98] transition-all duration-150 cursor-pointer hover:border-brand-accent/40"
                  >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brand-muted group-hover:text-brand-accent transition-colors pointer-events-none" />
                    <span className="text-brand-muted group-hover:text-brand-dark transition-colors">Search scholarships...</span>
                  </button>

                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col gap-1.5">

                    {/* ScholarMatch Quiz Highlight */}
                    <Link
                      href="/match"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl bg-brand-cream border border-brand-border text-xs font-bold text-brand-dark hover:bg-white active:scale-[0.98] transition-all duration-150"
                    >
                      <span className="flex items-center gap-2">
                        <Compass className="h-4 w-4 text-brand-dark" />
                        ScholarMatch Quiz
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-brand-muted" />
                    </Link>

                    <Link
                      href="/scholarships"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 active:scale-[0.98] text-xs font-semibold text-brand-dark transition-all duration-150"
                    >
                      <span className="flex items-center gap-2.5">
                        <GraduationCap className="h-4 w-4 text-brand-muted" />
                        All Scholarships
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-brand-muted/60" />
                    </Link>

                    <Link
                      href="/shortlist"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 active:scale-[0.98] text-xs font-semibold text-brand-dark transition-all duration-150"
                    >
                      <span className="flex items-center gap-2.5">
                        <Bookmark className="h-4 w-4 text-brand-muted" />
                        Saved Shortlist
                      </span>
                      {mounted && slugs.size > 0 && (
                        <Badge className="bg-brand-accent text-white text-[10px] px-1.5 py-0.5 rounded-full">
                          {slugs.size}
                        </Badge>
                      )}
                    </Link>

                    <Link
                      href="/about"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 active:scale-[0.98] text-xs font-semibold text-brand-dark transition-all duration-150"
                    >
                      <span className="flex items-center gap-2.5">
                        <BookOpen className="h-4 w-4 text-brand-muted" />
                        Guides &amp; About
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-brand-muted/60" />
                    </Link>

                    {authenticated && (
                      <Link
                        href="/profile"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 active:scale-[0.98] text-xs font-semibold text-brand-dark transition-all duration-150"
                      >
                        <span className="flex items-center gap-2.5">
                          <User className="h-4 w-4 text-brand-muted" />
                          Profile Settings
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-brand-muted/60" />
                      </Link>
                    )}
                  </div>

                  {/* ALL Destinations Scrollable Grid in Mobile Menu */}
                  <div className="mt-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2 px-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Globe className="h-3 w-3 text-brand-accent" /> All Destinations
                      </span>
                      <span className="text-[10px] font-normal">{providers.length} Countries</span>
                    </p>
                    <div
                      data-lenis-prevent
                      className="max-h-56 overflow-y-auto pr-1 grid grid-cols-2 gap-1.5 navbar-dropdown-scroll"
                      style={{ overscrollBehavior: 'contain' }}
                    >
                      {providers.map((p) => (
                        <Link
                          key={p.slug}
                          href={`/providers/${p.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-1.5 p-2 rounded-lg border border-brand-border/60 bg-white/50 hover:bg-white text-[11px] font-medium text-brand-dark transition-all truncate"
                        >
                          <span className="text-sm">{p.flag}</span>
                          <span className="truncate">{p.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mobile Drawer Footer with Auth Action */}
                <div className="p-6 border-t border-brand-border/60 bg-white/40">
                  {authenticated ? (
                    <Button
                      variant="outline"
                      className="w-full text-xs font-semibold text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                      onClick={() => {
                        setMobileOpen(false);
                        void signOut();
                      }}
                    >
                      <LogOut className="h-3.5 w-3.5 mr-1.5" />
                      Sign Out
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        setMobileOpen(false);
                        router.push(`/login?next=${encodeURIComponent(pathname)}`);
                      }}
                    >
                      Sign In to ScholarHub
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

          </div>
        </div>
      </header>

      {/* ── END OF NAVBAR ── */}
    </>
  );
}
