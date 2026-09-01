'use client';

import { Trash2 } from 'lucide-react';
import { useShortlist } from '@/components/ShortlistProvider';
import { Button } from '@/components/ui/button';

export default function RemoveShortlistButton({ slug }: { slug: string }) {
  const { toggle, isPending } = useShortlist();

  return (
    <Button
      type="button"
      onClick={() => void toggle(slug)}
      disabled={isPending}
      variant="danger"
      size="sm"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Remove
    </Button>
  );
}
