'use client';

import { Bookmark } from 'lucide-react';
import { useShortlist } from '@/components/ShortlistProvider';
import { Button } from '@/components/ui/button';

interface Props {
  slug: string;
  variant?: 'icon' | 'wide';
  className?: string;
}

export default function SaveScholarshipButton({ slug, variant = 'icon', className = '' }: Props) {
  const { authenticated, slugs, isSlugPending, isPending, toggle } = useShortlist();
  const saved = slugs.has(slug);
  const itemPending = isSlugPending ? isSlugPending(slug) : isPending;
  const label = saved ? 'Saved' : authenticated ? 'Save' : 'Sign in to save';

  if (variant === 'wide') {
    return (
      <Button
        type="button"
        onClick={() => void toggle(slug)}
        disabled={itemPending}
        variant={saved ? 'primary' : 'secondary'}
        size="lg"
        className={`w-full transition-all duration-200 active:scale-[0.98] ${itemPending ? 'opacity-90 cursor-wait' : ''} ${className}`}
      >
        <Bookmark
          className={`h-4 w-4 transition-all duration-200 ${
            saved ? 'fill-current scale-105' : 'scale-100'
          }`}
        />
        <span>{label}</span>
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
      disabled={itemPending}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      variant={saved ? 'primary' : 'secondary'}
      size="icon-sm"
      shape="circle"
      className={`transition-all duration-200 active:scale-90 ${itemPending ? 'opacity-85' : ''} ${className}`}
    >
      <Bookmark
        className={`h-4 w-4 transition-all duration-200 ${
          saved ? 'fill-current scale-110' : 'scale-100'
        }`}
      />
    </Button>
  );
}

