'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { allScholarships } from '@/lib/scholarships';
import { Button } from '@/components/ui/button';

export default function Inspiration() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Calculate counts dynamically from real database
  const bachelorCount = allScholarships.filter(s =>
    s.degree_levels.some(d => d.toLowerCase().includes('bachelor'))
  ).length;

  const masterCount = allScholarships.filter(s =>
    s.degree_levels.some(d => d.toLowerCase().includes('master'))
  ).length;

  const phdCount = allScholarships.filter(s =>
    s.degree_levels.some(d => d.toLowerCase().includes('phd') || d.toLowerCase().includes('doctoral') || d.toLowerCase().includes('research') || d.toLowerCase().includes('postdoctoral'))
  ).length;

  const nonDegreeCount = allScholarships.filter(s =>
    s.degree_levels.some(d => d.toLowerCase().includes('non-degree') || d.toLowerCase().includes('short') || d.toLowerCase().includes('diploma') || d.toLowerCase().includes('associate') || d.toLowerCase().includes('exchange'))
  ).length;

  const levelCards = [
    {
      id: 'bachelor',
      image: '/images-optimized/editorial/bachelor.webp',
      badge: 'Bachelor',
      title: 'Undergraduate scholarships for your first degree abroad',
      count: `${bachelorCount} scholarships`,
      href: '/scholarships?level=bachelor',
    },
    {
      id: 'master',
      image: '/images-optimized/editorial/master_phd.webp',
      badge: 'Master',
      title: "Postgraduate scholarships for Master's degree programs",
      count: `${masterCount} scholarships`,
      href: '/scholarships?level=master',
    },
    {
      id: 'phd',
      image: '/images-optimized/editorial/stem.webp',
      badge: 'PhD & Research',
      title: 'Doctoral & postdoctoral grants for advanced research',
      count: `${phdCount} scholarships`,
      href: '/scholarships?level=phd',
    },
    {
      id: 'non-degree',
      image: '/images-optimized/editorial/fully_funded.webp',
      badge: 'Short Course',
      title: 'Short courses, language training & non-degree studies',
      count: `${nonDegreeCount} scholarships`,
      href: '/scholarships?level=non-degree',
    },
  ];

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      // Wait a tiny bit for layout/mount to calculate sizes accurately
      setTimeout(updateScrollButtons, 100);
      window.addEventListener('resize', updateScrollButtons);
    }
    return () => {
      container?.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    // Calculate card width from actual rendered size
    const firstCard = container.children[0] as HTMLElement | null;
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    const gap = 24; // gap-6
    const amount = cardWidth + gap;

    container.scrollLeft += direction === 'left' ? -amount : amount;
  };

  return (
    <section className="py-12 border-t border-brand-border bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header with Nav Arrows */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-brand-dark">
            Browse by level
          </h2>
          <div className="flex space-x-2">
            <Button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              variant="secondary"
              size="icon-sm"
              shape="circle"
              className={!canScrollLeft ? 'opacity-30' : ''}
              aria-label="Previous"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              variant="secondary"
              size="icon-sm"
              shape="circle"
              className={!canScrollRight ? 'opacity-30' : ''}
              aria-label="Next"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Horizontal Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 snap-x snap-mandatory no-scrollbar pb-4"
          style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
        >
          {levelCards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="group cursor-pointer flex flex-col flex-shrink-0 w-[85vw] sm:w-[45vw] lg:w-[calc(33.333%-16px)] snap-start"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-brand-border">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform transform-gpu"
                  style={{ backgroundImage: `url('${card.image}')` }}
                />
                {/* Bottom Text Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 backdrop-blur-sm text-white mb-2 max-w-fit">
                    {card.badge}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-white leading-snug group-hover:underline">
                    {card.title}
                  </h3>
                  <p className="text-[10px] text-white/70 mt-1.5 font-medium">{card.count}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
