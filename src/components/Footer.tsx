'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Mail } from 'lucide-react';

export default function Footer() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const countryImages = [
    '/images/universities/GE_HeidelbergU.png',
    '/images/universities/JP_UofTokyo.png',
    '/images/universities/TU_METU.png',
    '/images/editorial/stem.jpg',
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <footer className="bg-brand-bg border-t border-brand-border pt-10 pb-6 md:pt-16 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-10 mb-8 md:mb-12">

          {/* Logo & Intro Column (2 cols) */}
          <div className="lg:col-span-2 flex flex-col justify-between max-w-sm">
            <div>
              <Link href="/" className="flex items-center gap-2 font-serif text-2xl font-bold tracking-tight text-brand-dark mb-4">
                <img src="/images/logos/Scholarhub_logo.png" alt="ScholarHub Logo" className="h-8 w-8 rounded-lg object-cover" />
                <span>Scholar<span className="text-brand-accent">Hub</span></span>
              </Link>
              <p className="text-xs text-brand-muted leading-relaxed mb-6">
                A curated directory of scholarships from top providers worldwide - DAAD, MEXT, Türkiye Burslari, and more. Built to help students find their path abroad.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <a href="#" className="text-brand-muted hover:text-brand-dark transition-colors flex items-center justify-center" aria-label="X (formerly Twitter)">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.threads.net/@jsooofx" target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-brand-dark transition-colors flex items-center justify-center" aria-label="Threads">
                <svg className="h-4 w-4" viewBox="0 0 192 192" fill="currentColor">
                  <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/jsooofx" target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-brand-dark transition-colors flex items-center justify-center" aria-label="Instagram">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a
                href="mailto:jsnxbusiness@gmail.com"
                className="text-brand-muted hover:text-brand-dark transition-colors flex items-center justify-center"
                aria-label="Email us"
                title="Send us feedback or a scholarship suggestion"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-muted hover:text-brand-dark transition-colors flex items-center justify-center"
                aria-label="GitHub"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Column: Explore (1 col) */}
          <div>
            <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5">
              <li><Link href="/scholarships" className="text-[11px] text-brand-muted hover:text-brand-dark transition-colors">All Scholarships</Link></li>
              <li><Link href="/scholarships?country=germany" className="text-[11px] text-brand-muted hover:text-brand-dark transition-colors">By Country</Link></li>
              <li><Link href="/scholarships?level=master" className="text-[11px] text-brand-muted hover:text-brand-dark transition-colors">By Degree Level</Link></li>
              <li><Link href="/scholarships?funding=fully" className="text-[11px] text-brand-muted hover:text-brand-dark transition-colors">Fully Funded</Link></li>
              <li><Link href="/about" className="text-[11px] text-brand-muted hover:text-brand-dark transition-colors">Guides</Link></li>
            </ul>
          </div>

          {/* Links Column: Providers (1 col) with Click/Hover Dropdown */}
          <div className="relative flex flex-col items-start">
            <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-4">
              Providers
            </h4>
            <div className="relative group" ref={dropdownRef}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                className="flex items-center text-[11px] font-medium text-brand-muted hover:text-brand-dark transition-colors focus:outline-none pb-2 cursor-pointer"
              >
                Select Provider
                <ChevronDown className="ml-1 h-3.5 w-3.5" />
              </button>
              
              {/* Dropdown Menu - opening upwards since it is in the footer */}
              <div
                onClick={() => setIsDropdownOpen(false)}
                className={`absolute bottom-full left-0 mb-2 w-56 rounded-md shadow-lg bg-white border border-brand-border ring-1 ring-black/5 transition-all duration-200 ease-in-out z-50 ${
                  isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
                }`}
              >
                <div className="py-1">
                  <Link href="/providers/daad" className="block px-4 py-2 text-xs text-brand-muted hover:bg-brand-cream">🇩🇪 DAAD - Germany</Link>
                  <Link href="/providers/mext" className="block px-4 py-2 text-xs text-brand-muted hover:bg-brand-cream">🇯🇵 MEXT - Japan</Link>
                  <Link href="/providers/jasso" className="block px-4 py-2 text-xs text-brand-muted hover:bg-brand-cream">🇯🇵 JASSO - Japan</Link>
                  <Link href="/providers/turkiye" className="block px-4 py-2 text-xs text-brand-muted hover:bg-brand-cream">🇹🇷 Türkiye Burslari</Link>
                  <div className="my-1 border-t border-brand-border/40" />
                  <Link href="/providers/chevening" className="block px-4 py-2 text-xs text-brand-muted hover:bg-brand-cream">🇬🇧 Chevening - UK</Link>
                  <Link href="/providers/australia-awards" className="block px-4 py-2 text-xs text-brand-muted hover:bg-brand-cream">🇦🇺 Australia Awards</Link>
                  <Link href="/providers/gks" className="block px-4 py-2 text-xs text-brand-muted hover:bg-brand-cream">🇰🇷 GKS - South Korea</Link>
                  <Link href="/providers/koica" className="block px-4 py-2 text-xs text-brand-muted hover:bg-brand-cream">🇰🇷 KOICA - South Korea</Link>
                  <div className="my-1 border-t border-brand-border/40" />
                  <Link href="/providers/eiffel" className="block px-4 py-2 text-xs text-brand-muted hover:bg-brand-cream">🇫🇷 Eiffel - France</Link>
                  <Link href="/providers/singapore" className="block px-4 py-2 text-xs text-brand-muted hover:bg-brand-cream">🇸🇬 Singapore (NUS/NTU)</Link>
                  <Link href="/providers/astar" className="block px-4 py-2 text-xs text-brand-muted hover:bg-brand-cream">🇸🇬 A*STAR - Singapore</Link>
                  <Link href="/providers/canada" className="block px-4 py-2 text-xs text-brand-muted hover:bg-brand-cream">🇨🇦 Canada CRTAS</Link>
                  <Link href="/providers/cpra" className="block px-4 py-2 text-xs text-brand-muted hover:bg-brand-cream">🇨🇦 Canada CPRA</Link>
                </div>
              </div>
            </div>
            
            <ul className="space-y-2.5 mt-3">
              <li><Link href="/about" className="text-[11px] text-brand-muted hover:text-brand-dark transition-colors">About ScholarHub</Link></li>
              <li>
                <a
                  href="mailto:jsnxbusiness@gmail.com"
                  className="text-[11px] text-brand-muted hover:text-brand-dark transition-colors inline-flex items-center gap-1"
                >
                  <Mail className="h-3 w-3" />
                  Contact / Feedback
                </a>
              </li>
            </ul>
          </div>

          {/* Featured Countries Grid (1 col) */}
          <div className="hidden md:block">
            <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-4">
              Featured Countries
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {countryImages.map((img, idx) => (
                <div
                  key={idx}
                  className="rounded-lg overflow-hidden aspect-square border border-brand-border group cursor-pointer relative"
                >
                  <img
                    src={img}
                    alt="Country thumbnail"
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-brand-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1 items-center sm:items-start text-center sm:text-left">
            <p className="text-[10px] text-brand-muted">
              &copy; 2026 ScholarHub. All rights reserved. Scholarship information is sourced from official providers.
            </p>
            <p className="text-[10px] text-brand-muted/80">
              Made by <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-brand-dark underline decoration-brand-accent/30 hover:decoration-brand-accent transition-all font-medium">Jsooonx</a> to All the Students out there.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link href="/terms" className="text-[10px] text-brand-muted hover:text-brand-dark transition-colors">Terms of service</Link>
            <Link href="/privacy" className="text-[10px] text-brand-muted hover:text-brand-dark transition-colors">Privacy policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
