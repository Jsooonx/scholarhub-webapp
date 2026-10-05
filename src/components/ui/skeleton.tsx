import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-brand-border/70', className)}
      {...props}
    />
  );
}

export function SkeletonLine({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-3.5 rounded-full',
            i === lines - 1 ? 'w-3/5' : i === 0 ? 'w-4/5' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}
