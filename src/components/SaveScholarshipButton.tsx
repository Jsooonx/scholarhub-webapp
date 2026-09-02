'use client';

import { Bookmark, Loader2 } from 'lucide-react';
import { useShortlist } from '@/components/ShortlistProvider';
import { Button } from '@/components/ui/button';

interface Props {
  slug: string;
  variant?: 'icon' | 'wide';
  className?: string;
}

export default function SaveScholarshipButton({ slug, variant = 'icon', className = '' }: Props) {
  const { authenticated, slugs, isPending, toggle } = useShortlist();
  const saved = slugs.has(slug);
  const label = saved ? 'Saved' : authenticated ? 'Save' : 'Sign in to save';

  if (variant === 'wide') {
    return (
      <Button
        type="button"
        onClick={() => void toggle(slug)}
        disabled={isPending}
        variant={saved ? 'primary' : 'secondary'}
        size="lg"
        className={`w-full ${className}`}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
        )}
        {label}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void toggle(slug);
      }}
      disabled={isPending}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      variant={saved ? 'primary' : 'secondary'}
      size="icon-sm"
      shape="circle"
      className={className}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
      )}
    </Button>
  );
}
