import { Skeleton, SkeletonLine } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface Props {
  variant?: 'grid' | 'list';
  connected?: boolean;
  className?: string;
}

export default function ScholarshipCardSkeleton({
  variant = 'grid',
  connected = false,
  className = '',
}: Props) {
  if (variant === 'list') {
    return (
      <div
        className={cn(
          'p-4 pr-14 flex flex-col sm:flex-row sm:items-start gap-4 bg-white',
          !connected && 'rounded-xl border border-brand-border shadow-xs',
          className
        )}
      >
        <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-2.5 w-24 rounded-full" />
            <Skeleton className="h-2.5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-3/4 rounded" />
          <div className="flex flex-wrap gap-2 pt-1">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative bg-white p-5 flex flex-col justify-between min-h-[290px]',
        !connected && 'rounded-xl border border-brand-border shadow-xs',
        className
      )}
    >
      <div className="flex flex-col flex-1">
        {/* Top Header: Logo + Badges */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
          <div className="flex flex-col items-end gap-1.5">
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
        </div>

        {/* Provider */}
        <Skeleton className="h-2.5 w-24 rounded-full mb-2" />

        {/* Title */}
        <SkeletonLine lines={2} className="mb-4" />

        {/* Details Footer */}
        <div className="mt-auto pt-3 border-t border-brand-border/60 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full flex-shrink-0" />
            <Skeleton className="h-3 w-28 rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full flex-shrink-0" />
            <Skeleton className="h-3 w-36 rounded-full" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
