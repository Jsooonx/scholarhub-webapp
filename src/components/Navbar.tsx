'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Sparkles,
  ArrowRight,
  BookOpen,
  X,
} from 'lucide-react';

import { allScholarships, providerMeta } from '@/lib/scholarships';
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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button, LinkButton, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const providers = Object.entries(providerMeta).map(([slug, meta]) => ({
  name: meta.name,
  country: meta.country,
  flag: meta.flag,
  slug,
}));

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { authenticated, ready, slugs, signOut } = useShortlist();

  const [mounted, setMounted] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');
  const [dialogSearchQuery, setDialogSearchQuery] = useState('');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter scholarships for live dialog search
  const filteredScholarships = dialogSearchQuery.trim()
    ? allScholarships.filter(
        (s) =>
          s.name.toLowerCase().includes(dialogSearchQuery.toLowerCase()) ||
          s.provider.toLowerCase().includes(dialogSearchQuery.toLowerCase()) ||
          (s.country && s.country.toLowerCase().includes(dialogSearchQuery.toLowerCase())) ||
          s.degree_levels.some((lvl) => lvl.toLowerCase().includes(dialogSearchQuery.toLowerCase()))
      ).slice(0, 15)
    : allScholarships.slice(0, 10);

  // Filter providers for live dialog search
  const filteredProviders = dialogSearchQuery.trim()
    ? providers.filter(
        (p) =>
          p.name.toLowerCase().includes(dialogSearchQuery.toLowerCase()) ||
          p.country.toLowerCase().includes(dialogSearchQuery.toLowerCase())
      )
    : providers.slice(0, 12);

  const handleNavSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearchQuery.trim()) {
      router.push(`/scholarships?q=${encodeURIComponent(navSearchQuery.trim())}`);
      setNavSearchQuery('');
    }
  };

  const handleDialogSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dialogSearchQuery.trim()) {
      setSearchDialogOpen(false);
      router.push(`/scholarships?q=${encodeURIComponent(dialogSearchQuery.trim())}`);
      setDialogSearchQuery('');
    }
  };

  const handleSelectScholarship = useCallback(
    (slug: string) => {
      setSearchDialogOpen(false);
      setMobileOpen(false);
      router.push(`/scholarships/${slug}`);
    },
    [router]
  );

  const handleSelectProvider = useCallback(
    (slug: string) => {
      setSearchDialogOpen(false);
      setMobileOpen(false);
      router.push(`/providers/${slug}`);
    },
    [router]
  );

  return (
    <>
      {/* ── STICKY TOP NAVBAR ── */}
      <header className="sticky top-0 z-40 w-full border-b border-brand-border/60 bg-brand-bg/90 backdrop-blur-md transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">

          {/* ── LEFT: BRAND LOGO ── */}
          <div className="flex items-center gap-4 lg:gap-6">
            <Link
              href="/"
              className="flex items-center gap-2.5 group transition-opacity hover:opacity-90 flex-shrink-0"
            >
              <img
                src="/images/logos/Scholarhub_logo.png"
                alt="ScholarHub Logo"
                className="h-8 w-8 rounded-lg object-cover shadow-xs border border-brand-border/40 transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-tight text-brand-dark leading-none">
                  Scholar<span className="text-brand-accent">Hub</span>
                </span>
                <span className="text-[10px] text-brand-muted uppercase tracking-widest font-medium">
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
                    <NavigationMenuLink
                      href="/scholarships"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent hover:bg-black/5 text-xs font-semibold tracking-wide text-brand-dark/90",
                        pathname === '/scholarships' && "bg-black/5 text-brand-dark font-bold"
                      )}
                    >
                      Scholarships
                    </NavigationMenuLink>
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
                          className="flex flex-col justify-between p-3.5 rounded-xl bg-gradient-to-br from-brand-accent/10 via-brand-cream to-white border border-brand-accent/30 hover:border-brand-accent/60 hover:shadow-md transition-all group/quiz"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Badge className="bg-brand-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                AI Matcher
                              </Badge>
                              <Sparkles className="h-4 w-4 text-brand-accent group-hover/quiz:rotate-12 transition-transform" />
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
                    <NavigationMenuLink
                      href="/about"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent hover:bg-black/5 text-xs font-semibold tracking-wide text-brand-dark/90",
                        pathname === '/about' && "bg-black/5 text-brand-dark font-bold"
                      )}
                    >
                      About
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                </NavigationMenuList>
              </NavigationMenu>
            </nav>
          </div>

          {/* ── RIGHT: SEARCH BAR, SHORTLIST, USER PROFILE, MOBILE MENU ── */}
          <div className="flex items-center gap-2 sm:gap-2.5">

            {/* Desktop Inline Search Bar (without ⌘K badge) */}
            <form
              onSubmit={handleNavSearchSubmit}
              className="relative hidden sm:flex items-center"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brand-muted pointer-events-none" />
              <Input
                type="text"
                placeholder="Search scholarships..."
                value={navSearchQuery}
                onChange={(e) => setNavSearchQuery(e.target.value)}
                className="h-9 w-44 md:w-52 lg:w-60 pl-8.5 pr-3 rounded-full border-brand-border/80 bg-white/80 text-xs text-brand-dark placeholder:text-brand-muted/70 focus:bg-white focus:w-64 transition-all shadow-2xs"
              />
            </form>

            {/* Mobile Search Button Trigger (Opens Search Dialog) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchDialogOpen(true)}
              className="sm:hidden h-9 w-9 rounded-full text-brand-dark hover:bg-black/5 cursor-pointer"
              aria-label="Search scholarships"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Shortlist Button (with dynamic count badge) */}
            <Link
              href="/shortlist"
              title="Saved Shortlist"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "relative h-9 px-2.5 rounded-full hover:bg-black/5 text-brand-dark cursor-pointer flex items-center"
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
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="relative flex items-center justify-center rounded-full focus:outline-none cursor-pointer"
                  aria-label="User Account Menu"
                >
                  <Avatar size="sm" className="border border-brand-accent/30 ring-2 ring-brand-cream">
                    <AvatarFallback className="bg-brand-accent text-white text-xs font-bold">
                      <User className="h-3.5 w-3.5" />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-56 bg-brand-bg border border-brand-border rounded-2xl p-1.5 shadow-xl"
                >
                  <DropdownMenuLabel className="px-2.5 py-1.5">
                    <p className="text-xs font-bold text-brand-dark">Account</p>
                    <p className="text-[10px] text-brand-muted font-normal">Manage your preferences</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-brand-border/60 my-1" />

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => router.push('/profile')}
                      className="cursor-pointer rounded-xl px-2.5 py-1.5 text-xs text-brand-dark hover:bg-black/5 focus:bg-black/5"
                    >
                      <User className="mr-2 h-3.5 w-3.5 text-brand-accent" />
                      Profile Settings
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push('/shortlist')}
                      className="cursor-pointer rounded-xl px-2.5 py-1.5 text-xs text-brand-dark hover:bg-black/5 focus:bg-black/5"
                    >
                      <Bookmark className="mr-2 h-3.5 w-3.5 text-brand-accent" />
                      Shortlist Tracker ({slugs.size})
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push('/match')}
                      className="cursor-pointer rounded-xl px-2.5 py-1.5 text-xs text-brand-dark hover:bg-black/5 focus:bg-black/5"
                    >
                      <Sparkles className="mr-2 h-3.5 w-3.5 text-brand-accent" />
                      ScholarMatch Quiz
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator className="bg-brand-border/60 my-1" />

                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => void signOut()}
                    className="cursor-pointer rounded-xl px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-3.5 w-3.5" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : ready && !authenticated ? (
              <LinkButton
                href={`/login?next=${encodeURIComponent(pathname)}`}
                variant="primary"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Sign in
              </LinkButton>
            ) : null}

            {/* Mobile Menu Drawer Trigger (shadcn Sheet) */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "md:hidden h-9 w-9 rounded-full text-brand-dark hover:bg-black/5 cursor-pointer"
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

                  {/* Mobile Search Form */}
                  <form
                    onSubmit={(e) => {
                      handleNavSearchSubmit(e);
                      setMobileOpen(false);
                    }}
                    className="relative mb-6"
                  >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brand-muted pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="Search scholarships..."
                      value={navSearchQuery}
                      onChange={(e) => setNavSearchQuery(e.target.value)}
                      className="h-10 w-full pl-9 pr-3 rounded-xl border-brand-border bg-white text-xs text-brand-dark placeholder:text-brand-muted shadow-2xs"
                    />
                  </form>

                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col gap-1.5">

                    {/* ScholarMatch Quiz Highlight */}
                    <Link
                      href="/match"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-brand-accent/15 to-brand-cream border border-brand-accent/30 text-xs font-bold text-brand-accent hover:opacity-90 transition-opacity"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        ScholarMatch Quiz
                      </span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    <Link
                      href="/scholarships"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 text-xs font-semibold text-brand-dark transition-colors"
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
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 text-xs font-semibold text-brand-dark transition-colors"
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
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 text-xs font-semibold text-brand-dark transition-colors"
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
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 text-xs font-semibold text-brand-dark transition-colors"
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

      {/* ── MOBILE SEARCH MODAL DIALOG ── */}
      <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
        <DialogContent className="max-w-lg bg-brand-bg border border-brand-border rounded-2xl p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-4 pb-2 border-b border-brand-border/60">
            <DialogTitle className="text-sm font-bold text-brand-dark flex items-center gap-2">
              <Search className="h-4 w-4 text-brand-accent" />
              Search Scholarships &amp; Destinations
            </DialogTitle>
          </DialogHeader>

          <div className="p-4 space-y-4">
            <form onSubmit={handleDialogSearchSubmit} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted pointer-events-none" />
              <Input
                type="text"
                autoFocus
                placeholder="Search by scholarship title, country, degree level..."
                value={dialogSearchQuery}
                onChange={(e) => setDialogSearchQuery(e.target.value)}
                className="h-11 pl-10 pr-20 rounded-xl border-brand-border bg-white text-sm text-brand-dark placeholder:text-brand-muted shadow-2xs"
              />
              <Button
                type="submit"
                size="sm"
                variant="primary"
                shape="control"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 min-h-0 px-3 text-xs"
              >
                Search
              </Button>
            </form>

            {/* Results container */}
            <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1 navbar-dropdown-scroll">
              {/* Destinations Section */}
              {filteredProviders.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-brand-muted mb-1.5 px-1">
                    Destinations
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {filteredProviders.slice(0, 6).map((p) => (
                      <Button
                        key={p.slug}
                        type="button"
                        onClick={() => handleSelectProvider(p.slug)}
                        variant="secondary"
                        size="sm"
                        shape="control"
                        className="h-auto min-h-9 w-full justify-start rounded-lg bg-white/50 p-2 text-left text-xs font-medium truncate"
                      >
                        <span>{p.flag}</span>
                        <span className="truncate">{p.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Scholarships Section */}
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-brand-muted mb-1.5 px-1">
                  Scholarships ({filteredScholarships.length})
                </p>
                <div className="space-y-1.5">
                  {filteredScholarships.length === 0 ? (
                    <p className="text-xs text-brand-muted py-4 text-center">
                      No matching scholarships found. Press &quot;Search&quot; to browse all filters.
                    </p>
                  ) : (
                    filteredScholarships.map((s) => (
                      <Button
                        key={s.slug}
                        type="button"
                        onClick={() => handleSelectScholarship(s.slug)}
                        variant="secondary"
                        size="sm"
                        shape="control"
                        className="h-auto min-h-10 w-full justify-between rounded-xl bg-white/50 p-2.5 text-left group/item"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-bold text-brand-dark group-hover/item:text-brand-accent transition-colors truncate">
                            {s.name}
                          </p>
                          <p className="text-[10px] text-brand-muted truncate">
                            {s.provider} {s.country ? `· ${s.country}` : ''} · {s.funding_type}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-brand-border flex-shrink-0">
                          {s.degree_levels?.[0] || 'Degree'}
                        </Badge>
                      </Button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
