import ScholarshipCardSkeleton from '@/components/ScholarshipCardSkeleton';

export default function ScholarMatchSkeleton() {
  return (
    <div className="w-full bg-brand-bg py-8 md:py-12 flex flex-col items-center justify-start min-h-[calc(100dvh-4rem)] select-none">
      <div className="w-full max-w-7xl mx-auto px-4 select-none flex flex-col justify-start">
        <div className="bg-white border border-brand-border rounded-xl shadow-xs overflow-hidden">
          <div className="p-6 md:p-10 flex flex-col">
            <div className="space-y-6 w-full">
              {/* Result header - exact match with real component */}
              <div className="max-w-3xl mx-auto text-center border-b border-brand-border pb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-dark text-white mb-3">
                  Matches Found
                </span>
                <h3 className="font-serif text-3xl font-bold text-brand-dark">
                  Your Personalized Recommendations
                </h3>
                <p className="text-xs text-brand-muted mt-2">
                  Here are scholarships matching your profile. Adjust your options below to filter in real-time:
                </p>

                {/* Live Adjust Filters Panel Skeleton matching real 2-row layout */}
                <div className="mt-5 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto z-20 relative">
                  <div className="h-8 w-32 rounded-full bg-brand-cream/80 border border-brand-border/60 animate-pulse" />
                  <div className="h-8 w-28 rounded-full bg-brand-cream/80 border border-brand-border/60 animate-pulse" />
                  <div className="h-8 w-40 rounded-full bg-brand-cream/80 border border-brand-border/60 animate-pulse" />
                  <div className="h-8 w-36 rounded-full bg-brand-cream/80 border border-brand-border/60 animate-pulse" />
                  <div className="w-full flex justify-center">
                    <div className="h-8 w-36 rounded-full bg-brand-cream/80 border border-brand-border/60 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Grid of Results Skeleton */}
              <div className="mt-4 rounded-xl border border-brand-border bg-brand-border overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px] shadow-xs">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ScholarshipCardSkeleton key={i} connected />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
