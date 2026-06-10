'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';

const levelCards = [
  {
    id: 1,
    image: '/images/editorial/bachelor.jpg',
    badge: 'Bachelor',
    title: 'Undergraduate scholarships for your first degree abroad',
    count: '4 scholarships',
  },
  {
    id: 2,
    image: '/images/editorial/master_phd.jpg',
    badge: 'Master',
    title: 'Postgraduate scholarships for Master\'s degree programs',
    count: '20+ scholarships',
  },
];

export default function Inspiration() {
  return (
    <section className="py-12 border-t border-brand-border bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header with Nav Arrows */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-brand-dark">
            Browse by level
          </h2>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full border border-brand-border hover:bg-brand-cream text-brand-dark transition-colors" aria-label="Previous">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full border border-brand-border hover:bg-brand-cream text-brand-dark transition-colors" aria-label="Next">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left / Middle: Two Level Cards (9 cols) */}
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
            {levelCards.map((card) => (
              <div key={card.id} className="group cursor-pointer flex flex-col">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-brand-border mb-4">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url('${card.image}')` }}
                  />
                  {/* Bottom Text Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
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
              </div>
            ))}
          </div>

          {/* Right Column: PhD & Research CTA (3 cols) */}
          <div className="lg:col-span-3">
            <div className="flex flex-col group cursor-pointer border border-brand-border rounded-2xl overflow-hidden h-full bg-brand-cream">
              <div
                className="h-40 bg-cover bg-center border-b border-brand-border"
                style={{
                  backgroundImage: `url('/images/editorial/stem.jpg')`,
                }}
              />
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-dark" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">Research</span>
                  </div>
                  <h3 className="font-serif text-sm font-semibold text-brand-dark mb-4 leading-relaxed">
                    PhD & postdoctoral grants - push the boundaries of your research career.
                  </h3>
                </div>

                <a
                  href="#"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-xs font-semibold rounded-full text-white bg-brand-dark hover:opacity-95 transition-opacity"
                >
                  Explore PhD grants
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
