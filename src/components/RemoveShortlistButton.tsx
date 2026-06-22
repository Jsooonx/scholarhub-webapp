'use client';

import { Trash2 } from 'lucide-react';
import { useShortlist } from '@/components/ShortlistProvider';

export default function RemoveShortlistButton({ slug }: { slug: string }) {
  const { toggle, isPending } = useShortlist();

  return (
    <button
      type="button"
      onClick={() => void toggle(slug)}
      disabled={isPending}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-wait disabled:opacity-60"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Remove
    </button>
  );
}
