import { Skeleton, SkeletonLine } from '@/components/ui/skeleton';

export default function ProfileSkeleton() {
  return (
    <>
      {/* Header Banner */}
      <div className="border-b border-brand-border bg-brand-bg">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-12 rounded-full" />
            <span className="text-xs text-brand-muted/40">·</span>
            <Skeleton className="h-3 w-14 rounded-full" />
          </div>
          <Skeleton className="h-10 w-44 rounded-lg" />
          <Skeleton className="h-4 w-full max-w-md rounded" />
        </div>
      </div>

      {/* Main Form Area */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left: Fields */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20 rounded-full" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-20 rounded-full" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-3 w-12 rounded-full" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24 rounded-full" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-28 rounded-full" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-3 w-24 rounded-full" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>

            <Skeleton className="h-10 w-36 rounded-lg pt-2" />
          </div>

          {/* Right: Preview Card */}
          <div className="space-y-6">
            <div className="rounded-xl border border-brand-border bg-white p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32 rounded-full" />
                  <Skeleton className="h-3 w-20 rounded-full" />
                </div>
              </div>
              <SkeletonLine lines={3} />
            </div>

            <div className="rounded-xl border border-brand-border bg-white p-6 space-y-3 shadow-xs">
              <Skeleton className="h-4 w-28 rounded-full" />
              <div className="flex flex-wrap gap-2 pt-1">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
