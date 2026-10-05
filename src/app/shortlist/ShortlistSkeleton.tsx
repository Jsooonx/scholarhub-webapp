import { Skeleton } from '@/components/ui/skeleton';
import ScholarshipCardSkeleton from '@/components/ScholarshipCardSkeleton';

export default function ShortlistSkeleton() {
  return (
    <>
      {/* Header Banner */}
      <div className="border-b border-brand-border bg-brand-bg">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-14 rounded-full" />
            <span className="text-xs text-brand-muted/40">·</span>
            <Skeleton className="h-3 w-16 rounded-full" />
          </div>
          <Skeleton className="h-10 w-72 sm:w-96 rounded-lg" />
          <Skeleton className="h-4 w-full max-w-lg rounded" />
        </div>
      </div>

      {/* Main Body */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Tabs Skeleton */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border pb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>

        {/* Section Heading */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-48 rounded-lg" />
            <Skeleton className="h-3.5 w-16 rounded-full" />
          </div>

          {/* Cards Grid */}
          <div className="rounded-xl border border-brand-border bg-brand-border overflow-hidden grid grid-cols-1 gap-[1px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 shadow-xs">
            {Array.from({ length: 4 }).map((_, i) => (
              <ScholarshipCardSkeleton key={i} connected />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
