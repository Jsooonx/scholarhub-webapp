import type { DeadlineStatus } from '@/lib/scholarships';
import { AlertCircle, CheckCircle2, Clock, RefreshCw, XCircle } from 'lucide-react';

interface Props {
  status: DeadlineStatus;
  size?: 'sm' | 'md';
}

const CONFIG = {
  open: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  closing: {
    icon: Clock,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
  },
  closed: {
    icon: XCircle,
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-600',
    dot: 'bg-red-500',
  },
  rolling: {
    icon: RefreshCw,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    dot: 'bg-blue-400',
  },
  check: {
    icon: AlertCircle,
    bg: 'bg-brand-cream',
    border: 'border-brand-border',
    text: 'text-brand-muted',
    dot: 'bg-brand-muted',
  },
};

export default function DeadlineStatus({ status, size = 'md' }: Props) {
  const cfg = CONFIG[status.type];
  const Icon = cfg.icon;
  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-medium
        ${cfg.bg} ${cfg.border} ${cfg.text}
        ${isSmall ? 'text-[10px]' : 'text-xs'}`}
    >
      {/* Animated dot for open/closing */}
      {(status.type === 'open' || status.type === 'closing') ? (
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${cfg.dot}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dot}`} />
        </span>
      ) : (
        <Icon className={`flex-shrink-0 ${isSmall ? 'h-3 w-3' : 'h-3.5 w-3.5'}`} />
      )}
      {status.label}
      {(status.type === 'open' || status.type === 'closing') && status.daysLeft <= 30 && (
        <span className={`ml-0.5 font-bold ${isSmall ? 'text-[9px]' : 'text-[10px]'}`}>
          ({status.daysLeft}d left)
        </span>
      )}
    </span>
  );
}
