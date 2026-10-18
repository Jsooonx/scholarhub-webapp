'use client';

import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
  type Transition,
  type Variants,
} from 'framer-motion';
import {
  ChevronDown,
  LoaderCircle,
  LogOut,
  Monitor,
  Moon,
  Sun,
  SunMoon,
} from 'lucide-react';

export type UserStatus = 'available' | 'busy' | 'away';
export type ThemePreference = 'light' | 'dark' | 'system';

export interface UserMenuUser {
  name: string;
  email: string;
  plan?: string;
  avatarSrc?: string;
  avatarSrcSet?: string;
}

export interface UserMenuItem {
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
  keys?: string[];
  onSelect?: () => void;
}

export interface UserMenuProps {
  user: UserMenuUser;
  /** Presence status. Passing `status` or `onStatusChange` shows the presence dot and an inline status switch. */
  status?: UserStatus;
  defaultStatus?: UserStatus;
  onStatusChange?: (status: UserStatus) => void;
  theme?: ThemePreference;
  defaultTheme?: ThemePreference;
  onThemeChange?: (theme: ThemePreference) => void;
  showTheme?: boolean;
  /** Account destinations with optional shortcut hints, such as ["⌘", ","]. */
  items?: UserMenuItem[];
  onSignOut?: () => void | Promise<unknown>;
  signOutKeys?: string[];
  align?: 'start' | 'center' | 'end';
  /** Shows the name and a chevron beside the avatar on desktop (640px+). */
  showName?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  portal?: boolean;
  ref?: Ref<HTMLButtonElement>;
  className?: string;
}

type Highlight = { top: number; height: number; tone?: string; glide: boolean };
type OpenReason = 'first' | 'last' | 'pointer' | null;

const compactQuery = '(max-width: 639px)';
const subscribeCompact = (change: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const query = window.matchMedia(compactQuery);
  query.addEventListener?.('change', change);
  window.addEventListener('resize', change);
  return () => {
    query.removeEventListener?.('change', change);
    window.removeEventListener('resize', change);
  };
};
const getCompactSnapshot = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 640 || window.matchMedia(compactQuery).matches;
};
const subscribeNothing = () => () => {};

export const userStatuses: { value: UserStatus; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'busy', label: 'Busy' },
  { value: 'away', label: 'Away' },
];

const themes: { value: ThemePreference; label: string; icon: ReactNode }[] = [
  { value: 'light', label: 'Light', icon: <Sun size={14} strokeWidth={1.75} aria-hidden="true" /> },
  { value: 'dark', label: 'Dark', icon: <Moon size={14} strokeWidth={1.75} aria-hidden="true" /> },
  { value: 'system', label: 'System', icon: <Monitor size={14} strokeWidth={1.75} aria-hidden="true" /> },
];

const motionTokens = {
  duration: { instant: 0.12, fast: 0.16, exit: 0.18, standard: 0.24 },
  ease: {
    enter: [0.16, 1, 0.3, 1] as [number, number, number, number],
    standard: [0.22, 1, 0.36, 1] as [number, number, number, number],
    exit: [0.4, 0, 1, 1] as [number, number, number, number],
  },
  spring: {
    snappy: { type: 'spring' as const, visualDuration: 0.26, bounce: 0.12 },
    smooth: { type: 'spring' as const, visualDuration: 0.36, bounce: 0 },
  },
} as const;

const enter = [...motionTokens.ease.enter] as [number, number, number, number];
const standard = [...motionTokens.ease.standard] as [number, number, number, number];
const exitEase = [...motionTokens.ease.exit] as [number, number, number, number];

const panelMotion: Variants = {
  closed: { opacity: 0, scale: 0.94 },
  open: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      visualDuration: 0.3,
      bounce: 0,
      opacity: { duration: motionTokens.duration.fast, ease: enter },
      delayChildren: 0.03,
      staggerChildren: 0.016,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: motionTokens.duration.instant, ease: exitEase },
  },
};

const sheetMotion: Variants = {
  closed: { y: '100%' },
  open: {
    y: 0,
    transition: {
      ...motionTokens.spring.smooth,
      visualDuration: 0.36,
      delayChildren: 0.06,
      staggerChildren: 0.02,
    },
  },
  exit: { y: '100%', transition: { duration: 0.22, ease: exitEase } },
};

const stillMotion: Variants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: motionTokens.duration.instant } },
  exit: { opacity: 0, transition: { duration: motionTokens.duration.instant } },
};

const rowMotion: Variants = {
  closed: { opacity: 0, y: 3 },
  open: { opacity: 1, y: 0, transition: { duration: 0.2, ease: enter } },
};

export function PresenceDot({
  status,
  className = '',
}: {
  status: UserStatus | 'offline';
  className?: string;
}) {
  return (
    <span
      className={`relative inline-block w-2.5 h-2.5 rounded-full flex-none ring-2 ring-[#FAF9F5] shadow-xs transition-colors duration-200 ${
        status === 'available'
          ? 'bg-emerald-500'
          : status === 'busy'
          ? 'bg-rose-500'
          : status === 'away'
          ? 'bg-amber-500'
          : 'bg-stone-400'
      } ${className}`}
      aria-hidden="true"
    >
      {(status === 'away' || status === 'offline') && (
        <span className="absolute inset-0 m-auto w-1 h-1 rounded-full bg-[#FAF9F5]" />
      )}
      {status === 'busy' && (
        <span className="absolute inset-0 m-auto w-1.5 h-0.5 rounded-xs bg-[#FAF9F5]" />
      )}
    </span>
  );
}

function Portrait({ user }: { user: UserMenuUser }) {
  const [failed, setFailed] = useState<string>();
  if (!user.avatarSrc || failed === user.avatarSrc) {
    const raw = user.name || user.email || 'Scholar';
    const parts = raw.trim().split(/[\s@._-]+/).filter(Boolean);
    const initials =
      parts.length >= 2 && parts[0] && parts[1]
        ? ((parts[0][0] || '') + (parts[1][0] || '')).toUpperCase()
        : (raw.slice(0, 2) || 'SH').toUpperCase();

    return (
      <span className="grid place-items-center w-full h-full rounded-full bg-brand-accent text-white font-bold text-xs select-none">
        {initials}
      </span>
    );
  }
  return (
    <img
      src={user.avatarSrc}
      srcSet={user.avatarSrcSet}
      alt=""
      className="w-full h-full rounded-full object-cover select-none"
      decoding="async"
      draggable={false}
      onError={() => setFailed(user.avatarSrc)}
    />
  );
}

function Face({
  user,
  status,
  size = 'sm',
}: {
  user: UserMenuUser;
  status?: UserStatus;
  size?: 'sm' | 'md';
}) {
  const dim = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';
  return (
    <span className={`relative inline-grid flex-none ${dim} rounded-full`}>
      <Portrait user={user} />
      {status && (
        <span className="absolute -bottom-0.5 -right-0.5">
          <PresenceDot status={status} />
        </span>
      )}
    </span>
  );
}

function Rise({ text, reduced }: { text: string; reduced: boolean }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={text}
        className="inline-block whitespace-nowrap"
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: '0.35em', filter: 'blur(2px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={
          reduced
            ? { opacity: 0, transition: { duration: 0 } }
            : { opacity: 0, y: '-0.35em', filter: 'blur(2px)', transition: { duration: 0.16, ease: standard } }
        }
        transition={reduced ? { duration: 0 } : { duration: 0.24, ease: enter }}
      >
        {text}
      </motion.span>
    </AnimatePresence>
  );
}

function Keys({ keys }: { keys: string[] }) {
  return (
    <kbd className="inline-flex flex-none items-center gap-0.5 ml-auto text-[10px] text-brand-muted/70 font-mono" aria-hidden="true">
      {keys.map((k, i) => (
        <kbd
          key={`${k}-${i}`}
          className="inline-block min-w-[1.1em] px-1 py-0.5 rounded bg-black/5 border border-brand-border/60 text-center text-brand-muted"
        >
          {k}
        </kbd>
      ))}
    </kbd>
  );
}

function Segmented<T extends string>({
  label,
  icon,
  value,
  options,
  onChange,
  variants,
}: {
  label: string;
  icon: ReactNode;
  value: T;
  options: { value: T; label: string; icon: ReactNode }[];
  onChange: (value: T) => void;
  variants?: Variants;
}) {
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  return (
    <motion.div
      className="relative flex h-9 items-center gap-2.5 px-2 text-xs"
      data-stop="group"
      data-label={label}
      variants={variants}
    >
      <span className="inline-grid w-4 flex-none place-items-center text-brand-muted" aria-hidden="true">
        {icon}
      </span>
      <span className="flex-1 text-xs font-medium text-brand-dark" aria-hidden="true">
        {label}
      </span>
      <div
        className="relative isolate inline-grid h-7 flex-none grid-flow-col auto-cols-[28px] p-0.5 rounded-lg bg-black/5 border border-brand-border/50"
        role="group"
        aria-label={label}
      >
        <span
          className="absolute z-[-1] top-0.5 bottom-0.5 left-0.5 w-7 rounded-md bg-white shadow-xs border border-brand-border/60 transition-transform duration-200 ease-out"
          style={{ transform: `translateX(${index * 100}%)` }}
          aria-hidden="true"
        />
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="menuitemradio"
            tabIndex={-1}
            aria-checked={option.value === value}
            aria-label={option.label}
            title={option.label}
            className={`grid place-items-center rounded-md transition-colors cursor-pointer ${
              option.value === value ? 'text-brand-dark font-semibold' : 'text-brand-muted hover:text-brand-dark'
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.icon}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

const getStops = (root: HTMLElement | null) =>
  Array.from(root?.querySelectorAll<HTMLElement>('[data-stop]') ?? []);

function focusStop(stop: HTMLElement | undefined) {
  if (!stop) return;
  const target =
    stop.dataset.stop === 'group'
      ? stop.querySelector<HTMLElement>('[aria-checked="true"]') ?? stop.querySelector<HTMLElement>('button')
      : stop;
  target?.focus({ preventScroll: true });
}

export function UserMenu({
  user,
  status: statusProp,
  defaultStatus = 'available',
  onStatusChange,
  theme: themeProp,
  defaultTheme = 'system',
  onThemeChange,
  showTheme = false,
  items = [],
  onSignOut,
  signOutKeys,
  align = 'end',
  showName = false,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  portal = true,
  ref,
  className = '',
}: UserMenuProps) {
  const id = useId();
  const menuId = `${id}-menu`;
  const triggerId = `${id}-trigger`;
  const reduced = !!useReducedMotion();
  const hydrated = useSyncExternalStore(subscribeNothing, () => true, () => false);
  const compact = useSyncExternalStore(subscribeCompact, getCompactSnapshot, () => false);

  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const [innerStatus, setInnerStatus] = useState(defaultStatus);
  const [innerTheme, setInnerTheme] = useState(defaultTheme);
  const [signingOut, setSigningOut] = useState(false);
  const [highlight, setHighlight] = useState<Highlight | null>(null);

  const open = openProp ?? innerOpen;
  const showStatus = statusProp !== undefined || onStatusChange !== undefined;
  const status = statusProp ?? innerStatus;
  const theme = themeProp ?? innerTheme;

  const rootRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const reason = useRef<OpenReason>(null);
  const typed = useRef({ text: '', timer: 0 });
  const mounted = useRef(true);
  const pending = useRef(false);

  const sheet = hydrated && compact;
  const inline = !portal && !sheet;

  const isHoveringTrigger = useRef(false);
  const isHoveringPanel = useRef(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const checkIsHovered = () => {
    if (isHoveringTrigger.current || isHoveringPanel.current) return true;
    if (typeof document === 'undefined') return false;
    const isTriggerHovered =
      rootRef.current?.matches(':hover') || triggerRef.current?.matches(':hover');
    const isSurfaceHovered = surfaceRef.current?.matches(':hover');
    return !!(isTriggerHovered || isSurfaceHovered);
  };

  const handleTriggerEnter = () => {
    if (sheet) return;
    isHoveringTrigger.current = true;
    clearHoverTimeout();
    if (!open) {
      setOpen(true, 'pointer');
    }
  };

  const handleTriggerLeave = () => {
    if (sheet) return;
    isHoveringTrigger.current = false;
    clearHoverTimeout();
    hoverTimeoutRef.current = setTimeout(() => {
      if (!checkIsHovered()) {
        close(false);
      }
    }, 80);
  };

  const handlePanelEnter = () => {
    if (sheet) return;
    isHoveringPanel.current = true;
    clearHoverTimeout();
  };

  const handlePanelLeave = () => {
    if (sheet) return;
    isHoveringPanel.current = false;
    clearHoverTimeout();
    hoverTimeoutRef.current = setTimeout(() => {
      if (!checkIsHovered()) {
        close(false);
      }
    }, 80);
  };

  useEffect(() => {
    mounted.current = true;
    const current = typed.current;
    return () => {
      mounted.current = false;
      if (typeof window !== 'undefined') window.clearTimeout(current.timer);
      clearHoverTimeout();
    };
  }, []);

  function setTriggerRef(node: HTMLButtonElement | null) {
    triggerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as { current: HTMLButtonElement | null }).current = node;
  }

  function setOpen(next: boolean, why: OpenReason = null) {
    reason.current = next ? why : null;
    if (next) setSigningOut(pending.current);
    setHighlight(null);
    setInnerOpen(next);
    onOpenChange?.(next);
  }

  function close(returnFocus: boolean) {
    isHoveringTrigger.current = false;
    isHoveringPanel.current = false;
    clearHoverTimeout();
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus({ preventScroll: true });
  }

  // Focus management on open
  useEffect(() => {
    if (!open) return;
    const why = reason.current;
    reason.current = null;
    if (!why) return;
    const frame = requestAnimationFrame(() => {
      const stops = getStops(listRef.current);
      if (why === 'first') focusStop(stops[0]);
      else if (why === 'last') focusStop(stops.at(-1));
      else surfaceRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [open, sheet]);

  // Desktop panel placement & flipping calculation
  useLayoutEffect(() => {
    if (!open || sheet) return;
    const place = () => {
      const panel = surfaceRef.current;
      const trigger = triggerRef.current;
      if (!panel || !trigger) return;
      const rect = trigger.getBoundingClientRect();
      const width = panel.offsetWidth;
      const height = panel.offsetHeight;
      let left: number;
      let top: number;
      if (inline) {
        const root = rootRef.current?.getBoundingClientRect();
        left = (root?.left ?? 0) + panel.offsetLeft;
        top = (root?.top ?? 0) + panel.offsetTop;
      } else {
        const wanted =
          align === 'start'
            ? rect.left
            : align === 'center'
            ? rect.left + rect.width / 2 - width / 2
            : rect.right - width;
        left = Math.min(Math.max(12, wanted), window.innerWidth - width - 12);
        const below = rect.bottom + 8;
        top =
          below + height > window.innerHeight - 12 && rect.top - 8 - height > 12
            ? rect.top - 8 - height
            : below;
        panel.style.left = `${left}px`;
        panel.style.top = `${top}px`;
      }
      const faceCenter = rect.left + Math.min(rect.width, 40) / 2;
      const originX = align === 'end' && rect.width > 40 ? rect.right - 20 - left : faceCenter - left;
      panel.style.setProperty('--origin-x', `${Math.min(Math.max(0, originX), width)}px`);
      panel.style.setProperty('--origin-y', top < rect.top ? `${height}px` : '0px');
    };

    place();
    if (inline) return;
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, sheet, inline, align]);

  // Outside click closes desktop panel
  useEffect(() => {
    if (!open || sheet) return;
    const onPointerDown = (event: globalThis.PointerEvent) => {
      const target = event.target as Node;
      if (surfaceRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      close(false);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [open, sheet]);

  // Lock body scroll on mobile bottom sheet
  useEffect(() => {
    if (!open || !sheet) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previous;
    };
  }, [open, sheet]);

  function changeStatus(value: UserStatus) {
    setInnerStatus(value);
    onStatusChange?.(value);
  }

  function changeTheme(value: ThemePreference) {
    setInnerTheme(value);
    onThemeChange?.(value);
  }

  function signOut() {
    if (pending.current) return;
    const result = onSignOut?.();
    if (!result || typeof (result as Promise<unknown>).then !== 'function') {
      close(true);
      return;
    }
    pending.current = true;
    setSigningOut(true);
    const done = () => {
      pending.current = false;
      if (mounted.current) close(false);
    };
    (result as Promise<unknown>).then(done, done);
  }

  function updateHighlight(stop: HTMLElement | null, glide = true) {
    if (!stop) {
      setHighlight(null);
      return;
    }
    setHighlight((current) => ({
      top: stop.offsetTop,
      height: stop.offsetHeight,
      tone: stop.dataset.tone,
      glide: glide && current !== null,
    }));
  }

  function onListFocus(event: FocusEvent<HTMLDivElement>) {
    const stop = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>('[data-stop]') : null;
    updateHighlight(stop);
  }

  function onItemPointerMove(event: PointerEvent<HTMLElement> | MouseEvent<HTMLElement>) {
    if ('pointerType' in event && event.pointerType === 'touch') return;
    const stop = event.currentTarget;
    if (document.activeElement !== stop) {
      stop.focus({ preventScroll: true });
    }
    updateHighlight(stop);
  }

  function onListPointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === 'touch' || !highlight) return;
    const group = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>('[data-stop="group"]') : null;
    if (!group || group.contains(document.activeElement)) return;
    setHighlight(null);
    surfaceRef.current?.focus({ preventScroll: true });
  }

  function onListPointerLeave(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === 'touch') return;
    setHighlight(null);
    surfaceRef.current?.focus({ preventScroll: true });
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const stops = getStops(listRef.current);
    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const current = active?.closest<HTMLElement>('[data-stop]') ?? null;
    const index = current ? stops.indexOf(current) : -1;
    const step = (to: HTMLElement | undefined) => {
      event.preventDefault();
      focusStop(to);
    };

    switch (event.key) {
      case 'ArrowDown':
        return step(stops[(index + 1) % stops.length]);
      case 'ArrowUp':
        return step(stops[index <= 0 ? stops.length - 1 : index - 1]);
      case 'Home':
        return step(stops[0]);
      case 'End':
        return step(stops.at(-1));
      case 'Escape':
      case 'Tab':
        event.preventDefault();
        return close(true);
      case 'ArrowLeft':
      case 'ArrowRight': {
        if (current?.dataset.stop !== 'group') return;
        event.preventDefault();
        const segments = Array.from(current.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'));
        const at = Math.max(0, segments.findIndex((s) => s.getAttribute('aria-checked') === 'true'));
        const next = segments[(at + (event.key === 'ArrowRight' ? 1 : -1) + segments.length) % segments.length];
        next?.focus({ preventScroll: true });
        next?.click();
        return;
      }
    }

    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey || event.key === ' ') return;
    const memory = typed.current;
    window.clearTimeout(memory.timer);
    memory.text += event.key.toLowerCase();
    memory.timer = window.setTimeout(() => {
      memory.text = '';
    }, 500);
    const ordered = [...stops.slice(index + 1), ...stops.slice(0, index + 1)];
    const search = memory.text.length > 1 && current?.dataset.label?.toLowerCase().startsWith(memory.text) ? [current] : ordered;
    const match = search.find((s) => s.dataset.label?.toLowerCase().startsWith(memory.text));
    if (match) step(match);
  }

  function onTriggerClick(event: MouseEvent<HTMLButtonElement>) {
    clearHoverTimeout();
    if (sheet) {
      if (open) {
        close(false);
      } else {
        setOpen(true, 'pointer');
      }
      return;
    }
    if (open) {
      close(false);
    } else {
      setOpen(true, event.detail === 0 ? 'first' : 'pointer');
    }
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    setOpen(true, event.key === 'ArrowDown' ? 'first' : 'last');
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.y > 80 || info.velocity.y > 500) close(true);
  }

  const row = reduced ? undefined : rowMotion;
  const menuProps = { id: menuId, role: 'menu', 'aria-labelledby': triggerId, tabIndex: -1, onKeyDown };

  const content = (
    <>
      {/* Identity Header */}
      <motion.div
        className="flex items-center gap-2.5 px-2 py-2 mb-1 border-b border-brand-border/60"
        variants={row}
      >
        <Face user={user} status={showStatus ? status : undefined} size="md" />
        <div className="grid min-w-0 flex-1 gap-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-semibold text-xs sm:text-sm text-brand-dark truncate leading-tight">
              {user.name}
            </span>
            {user.plan && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-brand-accent/10 text-brand-accent border border-brand-accent/20 leading-none shrink-0">
                {user.plan}
              </span>
            )}
          </div>
          <span className="text-[11px] text-brand-muted truncate leading-tight" title={user.email}>
            {user.email}
          </span>
        </div>
      </motion.div>

      {/* Menu List */}
      <div
        ref={listRef}
        className="relative flex flex-col gap-0.5"
        onFocus={onListFocus}
        onPointerMove={onListPointerMove}
        onPointerLeave={onListPointerLeave}
      >
        {/* Gliding Spring Highlight */}
        <motion.span
          className={`absolute inset-x-0 rounded-md pointer-events-none ${
            highlight?.tone === 'danger' ? 'bg-red-500/10' : 'bg-black/[0.05]'
          }`}
          aria-hidden="true"
          initial={false}
          animate={highlight ? { y: highlight.top, height: highlight.height, opacity: 1 } : { opacity: 0 }}
          transition={{
            y: highlight?.glide && !reduced ? motionTokens.spring.snappy : { duration: 0 },
            height: highlight?.glide && !reduced ? motionTokens.spring.snappy : { duration: 0 },
            opacity: { duration: reduced ? 0 : motionTokens.duration.instant },
          }}
        />

        {/* Item Rows */}
        {items.map((item) => (
          <motion.button
            key={item.label}
            type="button"
            role="menuitem"
            tabIndex={-1}
            className="relative flex w-full h-8 sm:h-8 items-center gap-2.5 px-2.5 rounded-md text-xs font-medium text-brand-dark cursor-pointer outline-none select-none transition-colors"
            data-stop="item"
            data-label={item.label}
            variants={row}
            onPointerMove={onItemPointerMove}
            onPointerEnter={onItemPointerMove}
            onMouseEnter={onItemPointerMove}
            onClick={() => {
              close(true);
              item.onSelect?.();
            }}
          >
            <span className="inline-grid w-4 flex-none place-items-center text-brand-accent" aria-hidden="true">
              {item.icon}
            </span>
            <span className="relative inline-flex min-w-0 flex-1 truncate">{item.label}</span>
            {item.badge}
            {item.keys && <Keys keys={item.keys} />}
          </motion.button>
        ))}

        {/* Optional Status / Theme Segmented Rows */}
        {(showTheme || showStatus) && (
          <>
            <div className="h-px bg-brand-border/60 my-1 -mx-1.5" role="separator" />
            {showStatus && (
              <Segmented
                label="Status"
                icon={<PresenceDot status={status} />}
                value={status}
                onChange={changeStatus}
                options={userStatuses.map((opt) => ({
                  ...opt,
                  icon: <PresenceDot status={opt.value} />,
                }))}
                variants={row}
              />
            )}
            {showTheme && (
              <Segmented
                label="Theme"
                icon={<SunMoon size={15} strokeWidth={1.75} />}
                value={theme}
                onChange={changeTheme}
                options={themes}
                variants={row}
              />
            )}
          </>
        )}

        <div className="h-px bg-brand-border/60 my-1 -mx-1.5" role="separator" />

        {/* Sign Out Button */}
        <motion.button
          type="button"
          role="menuitem"
          tabIndex={-1}
          className="relative flex w-full h-8 sm:h-8 items-center gap-2.5 px-2.5 rounded-md text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer outline-none select-none transition-colors"
          data-stop="item"
          data-tone="danger"
          data-label="Sign out"
          variants={row}
          aria-busy={signingOut || undefined}
          onPointerMove={onItemPointerMove}
          onPointerEnter={onItemPointerMove}
          onMouseEnter={onItemPointerMove}
          onClick={signOut}
        >
          <span className="inline-grid w-4 flex-none place-items-center" aria-hidden="true">
            {signingOut ? (
              <LoaderCircle className="animate-spin text-red-600" size={15} strokeWidth={2} />
            ) : (
              <LogOut size={15} strokeWidth={1.75} />
            )}
          </span>
          <span className="relative inline-flex min-w-0 flex-1 font-semibold">
            <Rise text={signingOut ? 'Signing out...' : 'Sign out'} reduced={reduced} />
          </span>
          {signOutKeys && <Keys keys={signOutKeys} />}
        </motion.button>
      </div>
    </>
  );

  const panel = (
    <AnimatePresence>
      {open && !sheet && (
        <motion.div
          key="panel"
          ref={surfaceRef}
          {...menuProps}
          onMouseEnter={handlePanelEnter}
          onMouseLeave={handlePanelLeave}
          className="fixed top-0 left-0 z-60 w-64 max-w-[calc(100vw-24px)] p-1.5 rounded-xl border border-brand-border bg-brand-bg/95 backdrop-blur-md shadow-2xl text-left outline-none before:absolute before:-top-3.5 before:inset-x-0 before:h-3.5 before:content-['']"
          style={
            {
              transformOrigin: 'var(--origin-x, 100%) var(--origin-y, 0px)',
            } as CSSProperties
          }
          variants={reduced ? stillMotion : panelMotion}
          initial="closed"
          animate="open"
          exit="exit"
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const bottomSheet = (
    <AnimatePresence>
      {open && sheet && (
        <motion.div
          key="scrim"
          className="fixed inset-0 z-70 bg-black/40 backdrop-blur-xs"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.1 : 0.2, ease: standard }}
          onClick={() => close(true)}
        />
      )}
      {open && sheet && (
        <motion.div
          key="sheet"
          ref={surfaceRef}
          {...menuProps}
          className="fixed bottom-0 inset-x-0 z-71 max-h-[88dvh] overflow-y-auto overscroll-contain bg-brand-bg border-t border-brand-border rounded-t-2xl p-4 pb-[calc(28px+env(safe-area-inset-bottom,16px))] shadow-2xl text-left outline-none"
          aria-modal="true"
          variants={reduced ? stillMotion : sheetMotion}
          initial="closed"
          animate="open"
          exit="exit"
          drag={reduced ? false : 'y'}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.04, bottom: 0.8 }}
          dragMomentum={false}
          onDragEnd={onDragEnd}
        >
          <span className="block w-9 h-1 mx-auto mb-3 rounded-full bg-brand-muted/30 cursor-grab" aria-hidden="true" />
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <span
      ref={rootRef}
      className="relative inline-flex flex-none align-middle"
      onMouseEnter={handleTriggerEnter}
      onMouseLeave={handleTriggerLeave}
    >
      <button
        ref={setTriggerRef}
        id={triggerId}
        type="button"
        className={`relative inline-flex h-8 sm:h-9 items-center gap-2 p-0.5 sm:px-1.5 sm:py-1 rounded-full border border-brand-border/60 bg-white/70 hover:bg-white text-brand-dark cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent active:scale-95 ${className}`}
        data-state={open ? 'open' : 'closed'}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`Account menu, ${user.name}`}
        onClick={onTriggerClick}
        onKeyDown={onTriggerKeyDown}
      >
        <Face user={user} status={showStatus ? status : undefined} size="sm" />
        {showName && (
          <span className="hidden sm:inline-flex items-center gap-1.5 pr-1 min-w-0">
            <span className="max-w-[7.5rem] truncate text-xs font-semibold text-brand-dark leading-none">
              {user.name}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-brand-muted transition-transform duration-200 ${
                open ? 'rotate-180 text-brand-dark' : ''
              }`}
              aria-hidden="true"
            />
          </span>
        )}
      </button>
      {sheet
        ? createPortal(bottomSheet, document.body)
        : inline
        ? panel
        : hydrated
        ? createPortal(panel, document.body)
        : null}
    </span>
  );
}

export default UserMenu;
