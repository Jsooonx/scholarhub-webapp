'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export default function Footer() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const countryImages = [
    '/images/universities/germany_heidelberg.jpg',
    '/images/universities/japan_tokyo.jpg',
    '/images/universities/turkey_istanbul.jpg',
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

            <div className="flex space-x-4">
              <a href="#" className="text-brand-muted hover:text-brand-dark transition-colors" aria-label="Twitter / X">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="text-brand-muted hover:text-brand-dark transition-colors" aria-label="Instagram">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className="text-brand-muted hover:text-brand-dark transition-colors" aria-label="LinkedIn">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
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
                  <Link href="/providers/turkiye" className="block px-4 py-2 text-xs text-brand-muted hover:bg-brand-cream">🇹🇷 Türkiye Burslari</Link>
                  <div className="my-1 border-t border-brand-border/40" />
                  <Link href="/providers/chevening" className="block px-4 py-2 text-xs text-brand-muted hover:bg-brand-cream">🇬🇧 Chevening - UK</Link>
                  <Link href="/providers/australia-awards" className="block px-4 py-2 text-xs text-brand-muted hover:bg-brand-cream">🇦🇺 Australia Awards</Link>
                  <Link href="/providers/gks" className="block px-4 py-2 text-xs text-brand-muted hover:bg-brand-cream">🇰🇷 GKS - South Korea</Link>
                  <div className="my-1 border-t border-brand-border/40" />
                  <Link href="/providers/eiffel" className="block px-4 py-2 text-xs text-brand-muted hover:bg-brand-cream">🇫🇷 Eiffel - France</Link>
                  <Link href="/providers/singapore" className="block px-4 py-2 text-xs text-brand-muted hover:bg-brand-cream">🇸🇬 Singapore (NUS/NTU/A*STAR)</Link>
                  <Link href="/providers/canada" className="block px-4 py-2 text-xs text-brand-muted hover:bg-brand-cream">🇨🇦 Canada CRTAS</Link>
                </div>
              </div>
            </div>
            
            <ul className="space-y-2.5 mt-3">
              <li><Link href="/about" className="text-[11px] text-brand-muted hover:text-brand-dark transition-colors">About ScholarHub</Link></li>
              <li><Link href="/about" className="text-[11px] text-brand-muted hover:text-brand-dark transition-colors">Contact</Link></li>
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
          <p className="text-[10px] text-brand-muted">
            &copy; 2026 ScholarHub. All rights reserved. Scholarship information is sourced from official providers.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-[10px] text-brand-muted hover:text-brand-dark transition-colors">Terms of service</a>
            <a href="#" className="text-[10px] text-brand-muted hover:text-brand-dark transition-colors">Privacy policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
