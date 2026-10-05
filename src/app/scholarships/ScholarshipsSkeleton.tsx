import { Skeleton } from '@/components/ui/skeleton';
import ScholarshipCardSkeleton from '@/components/ScholarshipCardSkeleton';

export default function ScholarshipsSkeleton() {
  return (
    <>
      {/* Header Banner */}
      <div className="border-b border-brand-border bg-brand-bg">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-12 rounded-full" />
            <span className="text-xs text-brand-muted/40">·</span>
            <Skeleton className="h-3 w-20 rounded-full" />
          </div>
          <Skeleton className="h-10 w-64 sm:w-80 rounded-lg" />
          <Skeleton className="h-4 w-full max-w-md rounded" />
        </div>
      </div>

      {/* Main Body */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Search & Filter Skeletons */}
        <div className="space-y-3">
          <Skeleton className="w-full h-10 rounded-xl" />
          <div className="hidden sm:flex items-center gap-2">
            <Skeleton className="h-7.5 w-32 rounded-lg" />
            <Skeleton className="h-7.5 w-28 rounded-lg" />
            <Skeleton className="h-7.5 w-24 rounded-lg" />
            <Skeleton className="h-7.5 w-30 rounded-lg" />
            <Skeleton className="ml-auto h-3 w-20 rounded-full" />
          </div>
        </div>

        {/* View bar info */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-3.5 w-40 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>

        {/* Cards Grid */}
        <div className="mt-6 rounded-xl border border-brand-border bg-brand-border overflow-hidden grid grid-cols-1 gap-[1px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 shadow-xs">
          {Array.from({ length: 8 }).map((_, i) => (
            <ScholarshipCardSkeleton key={i} connected />
          ))}
        </div>
      </div>
    </>
  );
}
