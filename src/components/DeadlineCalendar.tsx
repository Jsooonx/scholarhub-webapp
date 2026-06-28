'use client';

import { useState, useTransition, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  Clock,
  X,
  Save,
  Loader2,
  Info,
  ExternalLink,
  CalendarDays,
  Check,
  Megaphone
} from 'lucide-react';
import {
  type ScholarshipApplication,
  updateApplicationDeadline,
  updateApplicationNotes,
  updateApplicationStatus,
  updateApplicationAnnouncement,
} from '@/app/actions/shortlist';
import { getDeadlineStatus, providerMeta, providerGroup } from '@/lib/scholarships';
import DatePicker from '@/components/DatePicker';

interface Props {
  applications: ScholarshipApplication[];
}

interface CalendarEvent {
  app: ScholarshipApplication;
  type: 'deadline' | 'announcement';
  date: Date;
  isVerified: boolean;
  isFallback: boolean;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const COLUMNS = [
  { id: 'shortlisted', title: 'Shortlisted' },
  { id: 'preparing', title: 'Preparing' },
  { id: 'applied', title: 'Applied' },
  { id: 'interviewing', title: 'Interviewing' },
  { id: 'accepted', title: 'Accepted 🎉' },
  { id: 'rejected', title: 'Rejected 💪' },
] as const;

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function getAppDeadline(app: ScholarshipApplication): Date | null {
  if (app.target_deadline) {
    return parseLocalDate(app.target_deadline);
  }
  if (app.scholarship) {
    const status = getDeadlineStatus(app.scholarship);
    if (status.type === 'open' || status.type === 'closing' || status.type === 'closed') {
      return status.deadline;
    }
  }
  return null;
}

function getDaysDifference(d: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

export default function DeadlineCalendar({ applications }: Props) {
  const router = useRouter();
  const [localApps, setLocalApps] = useState<ScholarshipApplication[]>(applications);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [selectedAppSlug, setSelectedAppSlug] = useState<string | null>(null);
  
  // Note editing local state
  const [noteText, setNoteText] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Sync state with parent props updates
  useEffect(() => {
    setLocalApps(applications);
  }, [applications]);

  // Keep noteText synced when selecting a different application
  const selectedApp = useMemo(() => {
    return localApps.find(a => a.scholarship_slug === selectedAppSlug);
  }, [localApps, selectedAppSlug]);

  useEffect(() => {
    if (selectedApp) {
      setNoteText(selectedApp.notes ?? '');
    } else {
      setNoteText('');
    }
  }, [selectedApp]);

  // Precompute calendar events (both deadlines and announcements)
  const calendarEvents = useMemo(() => {
    const events: CalendarEvent[] = [];
    localApps.forEach(app => {
      // 1. Deadline Event
      let deadlineDate: Date | null = null;
      let isDeadlineFallback = true;
      let isDeadlineVerified = false;

      if (app.target_deadline) {
        deadlineDate = parseLocalDate(app.target_deadline);
        isDeadlineFallback = false;
        isDeadlineVerified = app.is_deadline_verified;
      } else if (app.scholarship) {
        const status = getDeadlineStatus(app.scholarship);
        if (status.type === 'open' || status.type === 'closing' || status.type === 'closed') {
          deadlineDate = status.deadline;
          isDeadlineFallback = true;
          isDeadlineVerified = false;
        }
      }

      if (deadlineDate) {
        events.push({
          app,
          type: 'deadline',
          date: deadlineDate,
          isVerified: isDeadlineVerified,
          isFallback: isDeadlineFallback
        });
      }

      // 2. Announcement Event
      if (app.announcement_date) {
        const announcementDate = parseLocalDate(app.announcement_date);
        events.push({
          app,
          type: 'announcement',
          date: announcementDate,
          isVerified: app.is_announcement_verified,
          isFallback: false
        });
      }
    });
    return events;
  }, [localApps]);

  // Calendar cells generation (always 42 days for 6-row grid)
  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday=0, Monday=1...
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // start on Monday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];

    // Prev Month padding
    for (let i = startOffset - 1; i >= 0; i--) {
      cells.push({
        day: daysInPrevMonth - i,
        month: month === 0 ? 11 : month - 1,
        year: month === 0 ? year - 1 : year,
        isCurrentMonth: false,
      });
    }

    // Current Month days
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({
        day: i,
        month: month,
        year: year,
        isCurrentMonth: true,
      });
    }

    // Next Month padding
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      cells.push({
        day: i,
        month: month === 11 ? 0 : month + 1,
        year: month === 11 ? year + 1 : year,
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [year, month]);

  // Date Navigation handlers
  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleToday = () => {
    const d = new Date();
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };

  // Quick Action Handlers inside Modal
  const handleUpdateDeadlineDate = async (slug: string, dateStr: string) => {
    const app = localApps.find((a) => a.scholarship_slug === slug);
    if (!app) return;

    const previousApps = [...localApps];
    setLocalApps((current) =>
      current.map((a) => (a.scholarship_slug === slug ? { ...a, target_deadline: dateStr || null } : a))
    );

    startTransition(async () => {
      const result = await updateApplicationDeadline(slug, dateStr || null, app.is_deadline_verified);
      if (!result.ok) {
        setLocalApps(previousApps);
        alert(result.error || 'Failed to update target deadline date.');
      } else {
        router.refresh();
      }
    });
  };

  const handleUpdateDeadlineVerification = async (slug: string, isVerified: boolean) => {
    const app = localApps.find((a) => a.scholarship_slug === slug);
    if (!app) return;

    const previousApps = [...localApps];
    setLocalApps((current) =>
      current.map((a) => (a.scholarship_slug === slug ? { ...a, is_deadline_verified: isVerified } : a))
    );

    startTransition(async () => {
      const result = await updateApplicationDeadline(slug, app.target_deadline, isVerified);
      if (!result.ok) {
        setLocalApps(previousApps);
        alert(result.error || 'Failed to update verification status.');
      } else {
        router.refresh();
      }
    });
  };

  const handleUpdateAnnouncementDate = async (slug: string, dateStr: string) => {
    const app = localApps.find((a) => a.scholarship_slug === slug);
    if (!app) return;

    const previousApps = [...localApps];
    setLocalApps((current) =>
      current.map((a) => (a.scholarship_slug === slug ? { ...a, announcement_date: dateStr || null } : a))
    );

    startTransition(async () => {
      const result = await updateApplicationAnnouncement(slug, dateStr || null, app.is_announcement_verified);
      if (!result.ok) {
        setLocalApps(previousApps);
        alert(result.error || 'Failed to update target announcement date.');
      } else {
        router.refresh();
      }
    });
  };

  const handleUpdateAnnouncementVerification = async (slug: string, isVerified: boolean) => {
    const app = localApps.find((a) => a.scholarship_slug === slug);
    if (!app) return;

    const previousApps = [...localApps];
    setLocalApps((current) =>
      current.map((a) => (a.scholarship_slug === slug ? { ...a, is_announcement_verified: isVerified } : a))
    );

    startTransition(async () => {
      const result = await updateApplicationAnnouncement(slug, app.announcement_date, isVerified);
      if (!result.ok) {
        setLocalApps(previousApps);
        alert(result.error || 'Failed to update verification status.');
      } else {
        router.refresh();
      }
    });
  };

  const handleUpdateStatus = async (slug: string, status: ScholarshipApplication['status']) => {
    const previousApps = [...localApps];
    setLocalApps((current) =>
      current.map((a) => (a.scholarship_slug === slug ? { ...a, status } : a))
    );

    startTransition(async () => {
      const result = await updateApplicationStatus(slug, status);
      if (!result.ok) {
        setLocalApps(previousApps);
        alert(result.error || 'Failed to update application status.');
      } else {
        router.refresh();
      }
    });
  };

  const handleSaveNotes = async () => {
    if (!selectedAppSlug) return;
    setSavingNotes(true);

    const result = await updateApplicationNotes(selectedAppSlug, noteText);
    setSavingNotes(false);

    if (result.ok) {
      setLocalApps((current) =>
        current.map((app) => (app.scholarship_slug === selectedAppSlug ? { ...app, notes: noteText } : app))
      );
      router.refresh();
    } else {
      alert(result.error || 'Failed to save notes.');
    }
  };

  // Helper to check if calendar cell matches today
  const isToday = (cellYear: number, cellMonth: number, cellDay: number) => {
    const today = new Date();
    return today.getFullYear() === cellYear && today.getMonth() === cellMonth && today.getDate() === cellDay;
  };

  // Get matching app events for a day cell
  const getCellEvents = (cellYear: number, cellMonth: number, cellDay: number) => {
    return calendarEvents.filter(item => {
      return (
        item.date.getFullYear() === cellYear &&
        item.date.getMonth() === cellMonth &&
        item.date.getDate() === cellDay
      );
    });
  };

  // Get pill style classes based on status, event type, date proximity, and verification
  const getPillStyles = (item: CalendarEvent) => {
    const { app, type, date, isVerified, isFallback } = item;
    
    // Default base classes
    let colorClasses = 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100/70';
    let labelIcon = null;

    if (type === 'announcement') {
      colorClasses = 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100/70';
      labelIcon = <Megaphone className="h-2.5 w-2.5 flex-shrink-0 text-purple-600" />;
    } else if (app.status === 'applied' || app.status === 'accepted') {
      // Completed stages
      colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/70';
      labelIcon = <Check className="h-2.5 w-2.5 flex-shrink-0" />;
    } else if (date) {
      const diff = getDaysDifference(date);
      if (diff < 0) {
        // Closed/Past
        colorClasses = 'bg-slate-50 text-slate-400 border-slate-200/60 hover:bg-slate-100/40 line-through';
      } else if (diff <= 3) {
        // High Urgency (< 3 days)
        colorClasses = 'bg-rose-50 text-rose-800 border-rose-200 shadow-[0_0_8px_rgba(244,63,94,0.12)] hover:bg-rose-100/70';
      } else if (diff <= 7) {
        // Medium Urgency (< 7 days)
        colorClasses = 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/70';
      }
    }

    // Border and Opacity changes for estimated/unverified deadlines or announcements
    const borderStyle = (isFallback || !isVerified) ? 'border-dashed opacity-85' : 'border-solid';
    
    let fallbackIcon = null;
    if (type === 'deadline') {
      fallbackIcon = (isFallback || !isVerified) ? <HelpCircle className="h-2.5 w-2.5 flex-shrink-0 text-brand-muted" /> : null;
    } else {
      fallbackIcon = !isVerified ? <HelpCircle className="h-2.5 w-2.5 flex-shrink-0 text-brand-muted" /> : null;
    }

    return {
      className: `flex items-center gap-1 rounded-lg border px-1.5 py-0.5 text-[10px] font-medium transition-all cursor-pointer ${colorClasses} ${borderStyle}`,
      icon: labelIcon || fallbackIcon
    };
  };

  // Agenda View sorting (chronological, active upcoming first, then closed)
  const agendaList = useMemo(() => {
    return calendarEvents
      .sort((a, b) => {
        // Sort closed/past items below upcoming items
        const diffA = getDaysDifference(a.date);
        const diffB = getDaysDifference(b.date);
        
        if (diffA < 0 && diffB >= 0) return 1;
        if (diffA >= 0 && diffB < 0) return -1;
        
        // Otherwise simple ascending chronological sort
        return a.date.getTime() - b.date.getTime();
      });
  }, [calendarEvents]);

  // Statistics calculation
  const stats = useMemo(() => {
    const deadlinesOnly = calendarEvents.filter(i => i.type === 'deadline');
    const totalWithDeadlines = deadlinesOnly.length;
    const verifiedCount = deadlinesOnly.filter(i => i.isVerified).length;
    
    // Find nearest deadline
    const upcoming = deadlinesOnly
      .filter((i) => getDaysDifference(i.date) >= 0 && i.app.status !== 'applied' && i.app.status !== 'accepted')
      .sort((a, b) => a.date.getTime() - b.date.getTime());
      
    const nearest = upcoming.length > 0 ? upcoming[0] : null;

    return {
      totalWithDeadlines,
      verifiedCount,
      nearest
    };
  }, [calendarEvents]);

  return (
    <div className="flex flex-col gap-6 animate-page-enter">
      {/* Calendar Header / Quick Stats Panel */}
      <div className="flex flex-col gap-4 rounded-3xl border border-brand-border bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-cream text-brand-accent">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-brand-dark">Deadline Planner</h2>
            <p className="text-xs text-brand-muted">
              Map and plan verified key dates. {stats.verifiedCount} of {stats.totalWithDeadlines} deadlines verified.
            </p>
          </div>
        </div>

        {stats.nearest && (
          <div className="rounded-2xl bg-brand-cream/40 border border-brand-border px-4 py-2.5 text-xs text-brand-dark flex items-center gap-2 max-w-sm">
            <Clock className="h-4 w-4 text-brand-accent flex-shrink-0" />
            <div className="min-w-0">
              <span className="font-bold block text-[10px] text-brand-muted uppercase tracking-wider">Next Deadline</span>
              <span className="font-medium truncate block text-brand-dark">
                {stats.nearest.app.scholarship?.name} ({getDaysDifference(stats.nearest.date)} days left)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Monthly Grid (Desktop) */}
      <div className="hidden md:block rounded-3xl border border-brand-border bg-white p-6 shadow-sm">
        {/* Navigation Toolbar */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-serif text-2xl font-bold text-brand-dark">
            {MONTH_NAMES[month]} {year}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToday}
              className="rounded-full border border-brand-border bg-white px-3 py-1.5 text-xs font-semibold text-brand-dark hover:bg-brand-cream transition-colors"
            >
              Today
            </button>
            <div className="flex rounded-full border border-brand-border bg-brand-cream p-0.5">
              <button
                onClick={handlePrevMonth}
                className="rounded-full p-1.5 text-brand-dark hover:bg-white transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="rounded-full p-1.5 text-brand-dark hover:bg-white transition-colors"
                title="Next Month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Days of Week headers */}
        <div className="mb-2 grid grid-cols-7 gap-px text-center">
          {WEEKDAY_NAMES.map((day) => (
            <div key={day} className="text-xs font-bold text-brand-muted py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid cells */}
        <div className="grid grid-cols-7 gap-px bg-brand-border/60 border border-brand-border/60 rounded-2xl overflow-hidden">
          {calendarCells.map((cell, idx) => {
            const isCellToday = isToday(cell.year, cell.month, cell.day);
            const events = getCellEvents(cell.year, cell.month, cell.day);

            return (
              <div
                key={idx}
                className={`min-h-[120px] bg-white p-2.5 transition-colors flex flex-col gap-1.5 group/cell ${
                  !cell.isCurrentMonth ? 'bg-brand-cream/10 text-brand-muted/65' : 'text-brand-dark'
                }`}
              >
                {/* Cell Day Header */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                      isCellToday
                        ? 'bg-brand-dark text-white shadow-sm'
                        : !cell.isCurrentMonth
                        ? 'text-brand-muted/40'
                        : 'text-brand-dark'
                    }`}
                  >
                    {cell.day}
                  </span>
                  
                  {isCellToday && (
                    <span className="text-[9px] uppercase font-black text-brand-accent tracking-wider pr-1">
                      TODAY
                    </span>
                  )}
                </div>

                {/* Day Cell Event Pills */}
                <div 
                  data-lenis-prevent
                  className="flex flex-col gap-1 overflow-y-auto max-h-[85px] scrollbar-thin"
                >
                  {events.map((event) => {
                    const s = event.app.scholarship!;
                    const pill = getPillStyles(event);

                    return (
                      <motion.div
                        key={`${event.app.scholarship_slug}-${event.type}`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => setSelectedAppSlug(event.app.scholarship_slug)}
                        className={pill.className}
                        title={`${s.name} (${event.type === 'deadline' ? 'Deadline' : 'Announcement'}) - Click to edit`}
                      >
                        {pill.icon}
                        <span className="truncate flex-grow">
                          {event.type === 'announcement' ? `Result: ${s.name}` : s.name}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Agenda View (under 768px) */}
      <div className="block md:hidden rounded-3xl border border-brand-border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between border-b border-brand-border/60 pb-3">
          <h3 className="font-serif text-lg font-bold text-brand-dark">Timeline Agenda</h3>
          <span className="text-[10px] uppercase font-bold tracking-wider text-brand-muted bg-brand-cream px-2.5 py-1 rounded-full border border-brand-border">
            {agendaList.length} key dates
          </span>
        </div>

        {agendaList.length === 0 ? (
          <div className="py-12 text-center text-brand-muted">
            <CalendarIcon className="mx-auto h-8 w-8 text-brand-muted/40 mb-3" />
            <p className="text-sm italic">No upcoming events found.</p>
            <p className="text-xs mt-1">Set target dates inside your checklist or announcement panels in Board Tracker view.</p>
          </div>
        ) : (
          <div 
            data-lenis-prevent
            className="space-y-4 max-h-[500px] overflow-y-auto pr-1.5 scrollbar-thin"
          >
            {agendaList.map((item) => {
              const { app, date, isVerified, isFallback, type } = item;
              const s = app.scholarship!;
              const daysLeft = getDaysDifference(date);
              const isClosed = daysLeft < 0;
              
              const group = providerGroup(s.provider);
              const flag = providerMeta[group]?.flag ?? '🌍';
              
              const dayStr = date.getDate();
              const monthStr = date.toLocaleDateString('en-US', { month: 'short' });

              return (
                <div
                  key={`${app.scholarship_slug}-${type}`}
                  onClick={() => setSelectedAppSlug(app.scholarship_slug)}
                  className={`flex items-start gap-3 rounded-2xl border bg-brand-cream/10 p-3 hover:bg-brand-cream/30 hover:border-brand-dark/20 transition-all cursor-pointer ${
                    isClosed
                      ? 'border-brand-border opacity-70'
                      : type === 'announcement'
                      ? 'border-purple-200 bg-purple-50/10'
                      : daysLeft <= 3
                      ? 'border-rose-200 bg-rose-50/10'
                      : daysLeft <= 7
                      ? 'border-amber-200 bg-amber-50/10'
                      : 'border-brand-border'
                  }`}
                >
                  {/* Left: Date Display Block */}
                  <div className={`flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-white border border-brand-border shadow-sm text-brand-dark ${
                    type === 'announcement' ? 'border-purple-200' : ''
                  }`}>
                    <span className={`text-[10px] uppercase font-extrabold leading-none ${
                      type === 'announcement' ? 'text-purple-600' : 'text-brand-accent'
                    }`}>
                      {monthStr}
                    </span>
                    <span className="text-lg font-black tracking-tight leading-none mt-0.5">
                      {dayStr}
                    </span>
                  </div>

                  {/* Right: Info Area */}
                  <div className="min-w-0 flex-grow space-y-1">
                    <div className="flex items-center gap-1.5 justify-between">
                      <span className="text-[9px] font-bold text-brand-muted uppercase truncate">
                        {flag} {s.provider}
                      </span>
                      {isClosed ? (
                        <span className="text-[9px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full">
                          Passed
                        </span>
                      ) : (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                          type === 'announcement'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : daysLeft <= 3
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : daysLeft <= 7
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                          {type === 'announcement' ? 'Announcement' : daysLeft === 0 ? 'Due today' : daysLeft === 1 ? '1 day left' : `${daysLeft} days left`}
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif text-sm font-bold leading-snug text-brand-dark truncate">
                      {type === 'announcement' ? `Result: ${s.name}` : s.name}
                    </h4>
                    
                    {/* Verified indicator badge */}
                    <div className="flex items-center gap-2 text-[10px]">
                      {type === 'deadline' ? (
                        isFallback ? (
                          <span className="text-brand-muted italic flex items-center gap-1">
                            <HelpCircle className="h-3 w-3" /> Estimated Default
                          </span>
                        ) : isVerified ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Verified Target
                          </span>
                        ) : (
                          <span className="text-amber-700 font-semibold flex items-center gap-1">
                            <HelpCircle className="h-3 w-3 text-amber-500" /> Unverified Target
                          </span>
                        )
                      ) : (
                        isVerified ? (
                          <span className="text-purple-700 font-semibold flex items-center gap-1">
                            <Megaphone className="h-3 w-3 text-purple-500" /> Verified Announcement
                          </span>
                        ) : (
                          <span className="text-amber-700 font-semibold flex items-center gap-1">
                            <HelpCircle className="h-3 w-3 text-amber-500" /> Unverified Announcement
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Deadline & Details Modal */}
      <AnimatePresence>
        {selectedAppSlug && selectedApp && (() => {
          const s = selectedApp.scholarship!;
          const group = providerGroup(s.provider);
          const flag = providerMeta[group]?.flag ?? '🌍';
          
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedAppSlug(null)}
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', duration: 0.35, bounce: 0.05 }}
                className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-brand-border bg-brand-bg p-6 shadow-2xl z-10"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedAppSlug(null)}
                  className="absolute top-4 right-4 rounded-full p-1.5 text-brand-muted hover:bg-brand-cream hover:text-brand-dark transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Header info */}
                <div className="mb-4 pr-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted flex items-center gap-1.5">
                    {flag} {s.provider} · {s.funding_type}
                  </span>
                  <h3 className="font-serif text-lg font-bold leading-snug text-brand-dark mt-1">
                    {s.name}
                  </h3>
                </div>

                {/* Editor Content Area */}
                <div 
                  data-lenis-prevent
                  className="space-y-4 border-t border-brand-border/60 pt-4 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin"
                >
                  
                  {/* Stage Select */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">
                      Application Stage
                    </label>
                    <select
                      value={selectedApp.status}
                      onChange={(e) => void handleUpdateStatus(s.slug, e.target.value as ScholarshipApplication['status'])}
                      className="w-full text-xs bg-white border border-brand-border rounded-xl p-2.5 font-semibold text-brand-dark outline-none cursor-pointer hover:bg-brand-cream/30 transition-colors"
                    >
                      {COLUMNS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Two separate panels side-by-side or stacked */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Target Deadline Date Card */}
                    <div className="rounded-2xl border border-brand-border bg-white p-3 space-y-3 shadow-sm flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-brand-dark uppercase tracking-wider">
                            Target Deadline
                          </span>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedApp.is_deadline_verified}
                              onChange={(e) => void handleUpdateDeadlineVerification(s.slug, e.target.checked)}
                              className="rounded text-brand-accent border-brand-border focus:ring-brand-accent h-3.5 w-3.5 cursor-pointer"
                            />
                            <span className="text-[9px] font-bold text-brand-muted uppercase">Verified</span>
                          </label>
                        </div>

                        <DatePicker
                          value={selectedApp.target_deadline}
                          onChange={(dateStr) => void handleUpdateDeadlineDate(s.slug, dateStr)}
                          className="w-full"
                          placeholder="Set deadline"
                        />
                      </div>

                      <div className="text-[9px] text-brand-muted italic leading-tight flex items-start gap-1 pt-2 border-t border-brand-border/40 mt-auto">
                        <Info className="h-3.5 w-3.5 text-brand-accent flex-shrink-0 mt-0.5" />
                        <span>Verify timezone (GMT/EET) on official portal.</span>
                      </div>
                    </div>

                    {/* Result Announcement Date Card */}
                    <div className="rounded-2xl border border-brand-border bg-white p-3 space-y-3 shadow-sm flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
                            <Megaphone className="h-3.5 w-3.5 text-purple-650 text-purple-600" />
                            Announcement
                          </span>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedApp.is_announcement_verified}
                              onChange={(e) => void handleUpdateAnnouncementVerification(s.slug, e.target.checked)}
                              className="rounded text-brand-accent border-brand-border focus:ring-brand-accent h-3.5 w-3.5 cursor-pointer"
                            />
                            <span className="text-[9px] font-bold text-brand-muted uppercase">Verified</span>
                          </label>
                        </div>

                        <DatePicker
                          value={selectedApp.announcement_date}
                          onChange={(dateStr) => void handleUpdateAnnouncementDate(s.slug, dateStr)}
                          className="w-full"
                          placeholder="Set announcement"
                        />
                      </div>

                      <div className="text-[9px] text-brand-muted italic leading-tight flex items-start gap-1 pt-2 border-t border-brand-border/40 mt-auto">
                        <Info className="h-3.5 w-3.5 text-brand-accent flex-shrink-0 mt-0.5" />
                        <span>Verify result dates on the official portal.</span>
                      </div>
                    </div>
                  </div>

                  {/* Application Notes Text Area */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">
                        Quick Notes
                      </label>
                      {selectedApp.notes !== noteText && (
                        <span className="text-[9px] text-amber-600 font-bold bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                          unsaved changes
                        </span>
                      )}
                    </div>
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Enter essays, requirements, logins, URLs, portal info..."
                      rows={4}
                      className="w-full resize-none rounded-xl border border-brand-border bg-white p-3 text-xs text-brand-dark outline-none transition focus:ring-1 focus:ring-brand-accent/50 cursor-text leading-relaxed"
                    />
                    <div className="flex justify-end">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleSaveNotes}
                        disabled={savingNotes || selectedApp.notes === noteText}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-dark rounded-full hover:opacity-90 disabled:opacity-50 transition"
                      >
                        {savingNotes ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Save className="h-3 w-3" />
                        )}
                        Save Notes
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="mt-5 border-t border-brand-border/60 pt-4 flex items-center justify-between gap-3">
                  <Link
                    href={`/scholarships/${s.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-accent hover:underline"
                    onClick={() => setSelectedAppSlug(null)}
                  >
                    <span>View Scholarship Page</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>

                  <button
                    onClick={() => setSelectedAppSlug(null)}
                    className="px-4 py-2 text-xs font-bold border border-brand-border bg-white text-brand-dark rounded-full hover:bg-brand-cream transition-colors"
                  >
                    Close
                  </button>
                </div>

              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
