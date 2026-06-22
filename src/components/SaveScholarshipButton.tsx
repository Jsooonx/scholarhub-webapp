'use client';

import { Bookmark, Loader2 } from 'lucide-react';
import { useShortlist } from '@/components/ShortlistProvider';

interface Props {
  slug: string;
  variant?: 'icon' | 'wide';
  className?: string;
}

export default function SaveScholarshipButton({ slug, variant = 'icon', className = '' }: Props) {
  const { authenticated, ready, slugs, isPending, toggle } = useShortlist();
  const saved = slugs.has(slug);
  const label = saved ? 'Saved' : authenticated ? 'Save' : 'Sign in to save';

  if (variant === 'wide') {
    return (
      <button
        type="button"
        onClick={() => void toggle(slug)}
        disabled={!ready || isPending}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition-colors disabled:cursor-wait disabled:opacity-60 ${
          saved
            ? 'border-brand-dark bg-brand-dark text-white'
            : 'border-brand-border bg-white text-brand-dark hover:bg-brand-cream'
        } ${className}`}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
        )}
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void toggle(slug);
      }}
      disabled={!ready || isPending}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      className={`grid h-9 w-9 place-items-center rounded-full border border-brand-border bg-white text-brand-dark shadow-sm transition-colors hover:bg-brand-cream disabled:cursor-wait disabled:opacity-60 ${
        saved ? 'border-brand-dark bg-brand-dark text-white hover:bg-brand-dark' : ''
      } ${className}`}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
      )}
    </button>
  );
}
