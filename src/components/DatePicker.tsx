'use client';

import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  value: string | null; // Format: YYYY-MM-DD
  onChange: (dateStr: string) => void;
  className?: string;
  placeholder?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export default function DatePicker({ value, onChange, className = '', placeholder = 'Set date' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{
    top?: number;
    bottom?: number;
    left: number;
  } | null>(null);

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isOpen) {
      setIsOpen(false);
      setCoords(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      
      // Determine upward vs downward (popover height is approx 280px)
      const fitsBelow = windowHeight - rect.bottom >= 280;
      
      // Horizontal placement to prevent screen cutoff
      let left = rect.left;
      if (left + 240 > windowWidth) {
        left = Math.max(16, windowWidth - 240 - 16);
      }
      
      if (fitsBelow) {
        setCoords({
          top: rect.bottom + 6,
          left
        });
      } else {
        setCoords({
          bottom: windowHeight - rect.top + 6,
          left
        });
      }
      setIsOpen(true);
    }
  };

  // Initialize navigation state from current value or today
  const [navDate, setNavDate] = useState(() => {
    if (value) {
      const [y, m, d] = value.split('-').map(Number);
      return new Date(y, m - 1, 1);
    }
    return new Date();
  });

  const year = navDate.getFullYear();
  const month = navDate.getMonth();

  // Timezone-safe label formatting
  const formattedLabel = useMemo(() => {
    if (!value) return placeholder ?? 'Set date';
    const [y, m, d] = value.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }, [value, placeholder]);

  // Calendar cells calculation
  const cells = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday=0, Monday=1...
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Start on Monday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const result = [];

    // Prev Month padding
    for (let i = startOffset - 1; i >= 0; i--) {
      result.push({
        day: daysInPrevMonth - i,
        month: month === 0 ? 11 : month - 1,
        year: month === 0 ? year - 1 : year,
        isCurrentMonth: false
      });
    }

    // Current Month days
    for (let i = 1; i <= daysInMonth; i++) {
      result.push({
        day: i,
        month,
        year,
        isCurrentMonth: true
      });
    }

    // Next Month padding to fill grid
    const totalCells = result.length <= 35 ? 35 : 42; // standard 5 or 6 row layout
    const remaining = totalCells - result.length;
    for (let i = 1; i <= remaining; i++) {
      result.push({
        day: i,
        month: month === 11 ? 0 : month + 1,
        year: month === 11 ? year + 1 : year,
        isCurrentMonth: false
      });
    }

    return result;
  }, [year, month]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNavDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNavDate(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (cell: typeof cells[number], e: React.MouseEvent) => {
    e.stopPropagation();
    const yStr = cell.year;
    const mStr = String(cell.month + 1).padStart(2, '0');
    const dStr = String(cell.day).padStart(2, '0');
    onChange(`${yStr}-${mStr}-${dStr}`);
    setIsOpen(false);
    setCoords(null);
  };

  const isSelected = (cellDay: number, cellMonth: number, cellYear: number) => {
    if (!value) return false;
    const [y, m, d] = value.split('-').map(Number);
    return cellYear === y && cellMonth === m - 1 && cellDay === d;
  };

  const isToday = (cellDay: number, cellMonth: number, cellYear: number) => {
    const today = new Date();
    return cellYear === today.getFullYear() && cellMonth === today.getMonth() && cellDay === today.getDate();
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <Button
        type="button"
        onClick={handleOpen}
        variant="secondary"
        size="sm"
        shape="control"
        className="min-w-[125px] w-full justify-between rounded-xl"
      >
        <span className="truncate">{formattedLabel}</span>
        <Calendar className="h-3.5 w-3.5 text-brand-muted flex-shrink-0" />
      </Button>

      {/* Popover via Portal */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <>
          {/* Transparent Backdrop to close on clicking outside */}
          <div
            className="fixed inset-0 z-[9998] cursor-default"
            onClick={() => {
              setIsOpen(false);
              setCoords(null);
            }}
          />

          <div
            style={{
              position: 'fixed',
              top: coords?.top !== undefined ? `${coords.top}px` : undefined,
              bottom: coords?.bottom !== undefined ? `${coords.bottom}px` : undefined,
              left: `${coords?.left ?? 0}px`,
              width: '240px',
              zIndex: 9999,
            }}
            className="rounded-2xl border border-brand-border bg-white p-3 shadow-xl animate-fade-in select-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-brand-dark px-1">
                {MONTH_NAMES[month]} {year}
              </span>
              <div className="flex gap-0.5">
                <Button
                  type="button"
                  onClick={handlePrevMonth}
                  variant="ghost"
                  size="icon-xs"
                  shape="square"
                  className="rounded-lg"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  onClick={handleNextMonth}
                  variant="ghost"
                  size="icon-xs"
                  shape="square"
                  className="rounded-lg"
                  aria-label="Next month"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-px mb-1 text-center">
              {WEEKDAYS.map((w) => (
                <span key={w} className="text-[9px] font-bold text-brand-muted py-0.5">
                  {w}
                </span>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {cells.map((cell, idx) => {
                const selected = isSelected(cell.day, cell.month, cell.year);
                const today = isToday(cell.day, cell.month, cell.year);

                return (
                  <Button
                    key={idx}
                    type="button"
                    onClick={(e) => handleSelectDay(cell, e)}
                    variant={selected ? 'primary' : 'ghost'}
                    size="icon-xs"
                    shape="circle"
                    className={`!h-7 !min-h-7 !w-7 rounded-full text-[10px] font-semibold transition-all ${
                      selected
                        ? ''
                        : today
                        ? '!border-brand-accent/50 !bg-brand-cream !text-brand-accent'
                        : cell.isCurrentMonth
                        ? '!text-brand-dark hover:!bg-brand-cream'
                        : '!text-brand-muted/30 hover:!bg-brand-cream/50'
                    }`}
                  >
                    {cell.day}
                  </Button>
                );
              })}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
