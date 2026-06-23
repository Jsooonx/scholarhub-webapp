'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  type ScholarshipApplication,
  type ChecklistItem,
  updateApplicationStatus,
  updateApplicationNotes,
  updateApplicationChecklist,
  removeFromShortlist,
} from '@/app/actions/shortlist';
import { getDeadlineStatus, getScholarshipLogo, providerMeta, providerGroup } from '@/lib/scholarships';
import DeadlineStatusComponent from '@/components/DeadlineStatus';
import {
  FileText,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Calendar,
  Save,
  MessageSquare,
  CornerDownRight,
  MoreVertical,
  ListTodo,
  CheckSquare,
  Square,
  Plus,
} from 'lucide-react';

interface Props {
  initialApplications: ScholarshipApplication[];
}

const COLUMNS = [
  { id: 'shortlisted', title: 'Shortlisted', desc: 'Saved programs', bg: 'bg-slate-50/50', border: 'border-slate-200' },
  { id: 'preparing', title: 'Preparing', desc: 'Writing essays/docs', bg: 'bg-amber-50/20', border: 'border-amber-200/50' },
  { id: 'applied', title: 'Applied', desc: 'Submitted applications', bg: 'bg-indigo-50/20', border: 'border-indigo-200/50' },
  { id: 'interviewing', title: 'Interviewing', desc: 'Doing interviews', bg: 'bg-blue-50/20', border: 'border-blue-200/50' },
  { id: 'accepted', title: 'Accepted 🎉', desc: 'Offer received', bg: 'bg-emerald-50/20', border: 'border-emerald-200/50' },
  { id: 'rejected', title: 'Rejected 💪', desc: 'Next time!', bg: 'bg-rose-50/20', border: 'border-rose-200/50' },
] as const;

const DEFAULT_CHECKLIST_ITEMS = [
  { id: 'cv', text: '👤 CV / Resume', completed: false },
  { id: 'transcript', text: '📄 Academic Transcript', completed: false },
  { id: 'motivation', text: '✍️ Motivation Letter / SOP', completed: false },
  { id: 'recommendation', text: '✉️ Recommendation Letters', completed: false },
];

type ColumnId = typeof COLUMNS[number]['id'];

export default function ApplicationTracker({ initialApplications }: Props) {
  const router = useRouter();
  const [apps, setApps] = useState<ScholarshipApplication[]>(initialApplications);
  const [draggingSlug, setDraggingSlug] = useState<string | null>(null);
  const [expandedNotesSlug, setExpandedNotesSlug] = useState<string | null>(null);
  const [expandedChecklistSlug, setExpandedChecklistSlug] = useState<string | null>(null);
  const [activeTextareaSlug, setActiveTextareaSlug] = useState<string | null>(null);
  const [activeInputSlug, setActiveInputSlug] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [newChecklistItemText, setNewChecklistItemText] = useState<Record<string, string>>({});
  const [savingNotesSlug, setSavingNotesSlug] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Optimistic status update helper
  const moveApplication = async (slug: string, nextStatus: ColumnId) => {
    // 1. Optimistic UI update
    const previousApps = [...apps];
    setApps((current) =>
      current.map((app) => (app.scholarship_slug === slug ? { ...app, status: nextStatus } : app))
    );

    // 2. Server Action
    startTransition(async () => {
      const result = await updateApplicationStatus(slug, nextStatus);
      if (!result.ok) {
        // Rollback on failure
        setApps(previousApps);
        alert(result.error || 'Failed to update application stage.');
      } else {
        router.refresh();
      }
    });
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, slug: string) => {
    setDraggingSlug(slug);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', slug);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, columnId: ColumnId) => {
    e.preventDefault();
    const slug = e.dataTransfer.getData('text/plain');
    if (!slug) return;
    if (draggingSlug === slug) {
      void moveApplication(slug, columnId);
    }
    setDraggingSlug(null);
  };

  // Notes actions
  const handleSaveNotes = async (slug: string) => {
    const noteText = editingNotes[slug] ?? '';
    setSavingNotesSlug(slug);

    const result = await updateApplicationNotes(slug, noteText);
    setSavingNotesSlug(null);

    if (result.ok) {
      setApps((current) =>
        current.map((app) => (app.scholarship_slug === slug ? { ...app, notes: noteText } : app))
      );
      setExpandedNotesSlug(null);
      router.refresh();
    } else {
      alert(result.error || 'Failed to save notes.');
    }
  };

  // Checklist actions
  const handleToggleChecklist = async (slug: string, itemId: string) => {
    const app = apps.find((a) => a.scholarship_slug === slug);
    if (!app) return;

    const currentChecklist = app.checklist || DEFAULT_CHECKLIST_ITEMS.map(item => ({ ...item }));
    const updatedChecklist = currentChecklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    const previousApps = [...apps];
    setApps((current) =>
      current.map((a) => (a.scholarship_slug === slug ? { ...a, checklist: updatedChecklist } : a))
    );

    const result = await updateApplicationChecklist(slug, updatedChecklist);
    if (!result.ok) {
      setApps(previousApps);
      alert(result.error || 'Failed to update checklist.');
    } else {
      router.refresh();
    }
  };

  const handleAddChecklistItem = async (slug: string) => {
    const text = newChecklistItemText[slug]?.trim();
    if (!text) return;

    const app = apps.find((a) => a.scholarship_slug === slug);
    if (!app) return;

    const currentChecklist = app.checklist || DEFAULT_CHECKLIST_ITEMS.map(item => ({ ...item }));
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    const updatedChecklist = [...currentChecklist, newItem];

    const previousApps = [...apps];
    setApps((current) =>
      current.map((a) => (a.scholarship_slug === slug ? { ...a, checklist: updatedChecklist } : a))
    );
    setNewChecklistItemText((prev) => ({ ...prev, [slug]: '' }));

    const result = await updateApplicationChecklist(slug, updatedChecklist);
    if (!result.ok) {
      setApps(previousApps);
      alert(result.error || 'Failed to add checklist item.');
    } else {
      router.refresh();
    }
  };

  const handleRemoveChecklistItem = async (slug: string, itemId: string) => {
    const app = apps.find((a) => a.scholarship_slug === slug);
    if (!app) return;

    const currentChecklist = app.checklist || DEFAULT_CHECKLIST_ITEMS.map(item => ({ ...item }));
    const updatedChecklist = currentChecklist.filter((item) => item.id !== itemId);

    const previousApps = [...apps];
    setApps((current) =>
      current.map((a) => (a.scholarship_slug === slug ? { ...a, checklist: updatedChecklist } : a))
    );

    const result = await updateApplicationChecklist(slug, updatedChecklist);
    if (!result.ok) {
      setApps(previousApps);
      alert(result.error || 'Failed to remove checklist item.');
    } else {
      router.refresh();
    }
  };

  const handleRemove = async (slug: string) => {
    if (confirm('Are you sure you want to remove this scholarship from your tracker?')) {
      const result = await removeFromShortlist(slug);
      if (result.ok) {
        setApps((current) => current.filter((app) => app.scholarship_slug !== slug));
        router.refresh();
      } else {
        alert(result.error || 'Failed to remove scholarship.');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <LayoutGroup id="kanban-board">
        {/* Kanban Board Container */}
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin select-none">
          {COLUMNS.map((col) => {
            const colApps = apps.filter((app) => app.status === col.id);

            return (
              <div
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`flex w-72 flex-shrink-0 flex-col rounded-3xl border p-4 transition-colors ${col.bg} ${col.border} ${
                  draggingSlug ? 'border-dashed border-brand-accent/40 bg-brand-cream/10' : ''
                }`}
              >
                {/* Column Header */}
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-brand-dark">{col.title}</h3>
                    <p className="text-[10px] text-brand-muted">{col.desc}</p>
                  </div>
                  <span className="grid h-6 min-w-6 place-items-center rounded-full bg-brand-cream px-1.5 text-xs font-bold text-brand-dark border border-brand-border">
                    {colApps.length}
                  </span>
                </div>

                {/* Cards list */}
                <div className="flex flex-grow flex-col gap-3 min-h-[400px]">
                  <AnimatePresence mode="popLayout">
                    {colApps.length === 0 ? (
                      <motion.div
                        key="empty"
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-grow items-center justify-center rounded-2xl border border-dashed border-brand-border/40 py-8 text-center"
                      >
                        <p className="text-[11px] text-brand-muted italic">Drag cards here</p>
                      </motion.div>
                    ) : (
                      colApps.map((app) => {
                        const s = app.scholarship;
                        if (!s) return null;

                        const group = providerGroup(s.provider);
                        const flag = providerMeta[group]?.flag ?? '🌍';
                        const logoUrl = getScholarshipLogo(s);
                        const status = getDeadlineStatus(s);
                        const hasNotes = Boolean(app.notes?.trim());
                        const isNotesExpanded = expandedNotesSlug === s.slug;

                        return (
                          <motion.div
                            key={s.slug}
                            layout
                            layoutId={s.slug}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", duration: 0.35, bounce: 0.05 }}
                            draggable={activeTextareaSlug !== s.slug && activeInputSlug !== s.slug}
                            onDragStart={(e: any) => handleDragStart(e, s.slug)}
                            className={`group/card relative rounded-2xl border border-brand-border bg-white p-4 shadow-sm hover:border-brand-dark/20 hover:shadow-md cursor-grab active:cursor-grabbing ${
                              draggingSlug === s.slug ? 'opacity-40' : ''
                            }`}
                          >
                            {/* Provider info & controls */}
                            <div className="mb-2 flex items-start justify-between gap-2">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-brand-muted">
                                {s.provider}
                              </span>
                              
                              {/* Trash / delete trigger */}
                              <motion.button
                                whileTap={{ scale: 0.92 }}
                                onClick={() => void handleRemove(s.slug)}
                                className="text-brand-muted hover:text-red-600 transition-colors p-1"
                                title="Remove application"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </motion.button>
                            </div>

                            {/* Title */}
                            <Link href={`/scholarships/${s.slug}`} className="block group-hover/card:underline">
                              <h4 className="font-serif text-sm font-semibold leading-snug text-brand-dark line-clamp-2">
                                {s.name}
                              </h4>
                            </Link>

                            {/* Middle info */}
                            <div className="mt-3 flex flex-wrap gap-1.5 items-center justify-between">
                              <div className="flex flex-wrap gap-1.5 items-center">
                                <span className="inline-flex items-center rounded-full bg-brand-cream border border-brand-border px-1.5 py-0.5 text-[9px] text-brand-dark font-medium">
                                  {s.funding_type}
                                </span>
                                <DeadlineStatusComponent status={status} size="sm" />
                              </div>

                              {/* Checklist progress badge */}
                              {app.checklist && app.checklist.length > 0 && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-brand-muted">
                                  <CheckSquare className="h-3 w-3 text-brand-accent" />
                                  <span>
                                    {app.checklist.filter(i => i.completed).length}/{app.checklist.length}
                                  </span>
                                </span>
                              )}
                            </div>

                            {/* Bottom Actions Row */}
                            <div className="mt-4 border-t border-brand-border/60 pt-3 space-y-2">
                              {/* Row 1: Toggles */}
                              <div className="flex items-center gap-4">
                                {/* Notes toggle */}
                                <motion.button
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => {
                                    if (isNotesExpanded) {
                                      setExpandedNotesSlug(null);
                                    } else {
                                      setExpandedNotesSlug(s.slug);
                                      setExpandedChecklistSlug(null);
                                      setEditingNotes((prev) => ({
                                        ...prev,
                                        [s.slug]: app.notes ?? '',
                                      }));
                                    }
                                  }}
                                  className={`inline-flex items-center gap-1.5 text-xs transition-colors ${
                                    hasNotes || isNotesExpanded
                                      ? 'text-brand-accent font-semibold'
                                      : 'text-brand-muted hover:text-brand-dark'
                                  }`}
                                >
                                  <FileText className="h-3.5 w-3.5" />
                                  <span>{hasNotes ? 'Notes' : 'Add Notes'}</span>
                                </motion.button>

                                {/* Checklist toggle */}
                                <motion.button
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => {
                                    if (expandedChecklistSlug === s.slug) {
                                      setExpandedChecklistSlug(null);
                                    } else {
                                      setExpandedChecklistSlug(s.slug);
                                      setExpandedNotesSlug(null);
                                    }
                                  }}
                                  className={`inline-flex items-center gap-1.5 text-xs transition-colors ${
                                    expandedChecklistSlug === s.slug
                                      ? 'text-brand-accent font-semibold'
                                      : 'text-brand-muted hover:text-brand-dark'
                                  }`}
                                >
                                  <ListTodo className="h-3.5 w-3.5" />
                                  <span>Checklist</span>
                                </motion.button>
                              </div>

                              {/* Row 2: Stage selector & navigation */}
                              <div className="flex items-center justify-between gap-1.5 bg-brand-cream/30 p-1.5 rounded-xl border border-brand-border/40">
                                <span className="text-[9px] font-bold text-brand-muted uppercase pl-1">Stage</span>
                                <div className="flex items-center gap-1 flex-grow justify-end">
                                  {/* Prev Stage arrow */}
                                  {COLUMNS.findIndex((c) => c.id === col.id) > 0 && (
                                    <motion.button
                                      whileTap={{ scale: 0.92 }}
                                      onClick={() => {
                                        const idx = COLUMNS.findIndex((c) => c.id === col.id);
                                        void moveApplication(s.slug, COLUMNS[idx - 1].id);
                                      }}
                                      className="p-1 rounded bg-white border border-brand-border text-brand-dark hover:bg-brand-dark hover:text-white transition-colors flex-shrink-0"
                                      title="Move left"
                                    >
                                      <ChevronLeft className="h-3 w-3" />
                                    </motion.button>
                                  )}

                                  {/* Mobile helper dropdown / select */}
                                  <select
                                    value={col.id}
                                    onChange={(e) => void moveApplication(s.slug, e.target.value as ColumnId)}
                                    className="text-[10px] bg-white border border-brand-border rounded px-1 py-0.5 font-semibold text-brand-dark outline-none cursor-pointer hover:bg-brand-cream/80 min-w-[90px]"
                                  >
                                    {COLUMNS.map((c) => (
                                      <option key={c.id} value={c.id}>
                                        {c.title.replace(' 🎉', '').replace(' 💪', '')}
                                      </option>
                                    ))}
                                  </select>

                                  {/* Next Stage arrow */}
                                  {COLUMNS.findIndex((c) => c.id === col.id) < COLUMNS.length - 1 && (
                                    <motion.button
                                      whileTap={{ scale: 0.92 }}
                                      onClick={() => {
                                        const idx = COLUMNS.findIndex((c) => c.id === col.id);
                                        void moveApplication(s.slug, COLUMNS[idx + 1].id);
                                      }}
                                      className="p-1 rounded bg-white border border-brand-border text-brand-dark hover:bg-brand-dark hover:text-white transition-colors flex-shrink-0"
                                      title="Move right"
                                    >
                                      <ChevronRight className="h-3 w-3" />
                                    </motion.button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Collapsible Notes Editor Panel */}
                            <AnimatePresence>
                              {isNotesExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{
                                    height: { type: "spring", duration: 0.28, bounce: 0 },
                                    opacity: { duration: 0.15, ease: "linear" }
                                  }}
                                  style={{ overflow: 'hidden' }}
                                >
                                  <div className="mt-3 rounded-xl border border-brand-border/60 bg-brand-cream/30 p-2.5 space-y-2">
                                    <label className="block">
                                      <span className="text-[9px] font-bold text-brand-muted uppercase block mb-1">
                                        Application notes
                                      </span>
                                      <textarea
                                        value={editingNotes[s.slug] ?? ''}
                                        onChange={(e) =>
                                          setEditingNotes((prev) => ({
                                            ...prev,
                                            [s.slug]: e.target.value,
                                          }))
                                        }
                                        onFocus={() => setActiveTextareaSlug(s.slug)}
                                        onBlur={() => setActiveTextareaSlug(null)}
                                        onMouseEnter={() => setActiveTextareaSlug(s.slug)}
                                        onMouseLeave={(e) => {
                                          if (document.activeElement !== e.currentTarget) {
                                            setActiveTextareaSlug(null);
                                          }
                                        }}
                                        onDragStart={(e) => e.stopPropagation()}
                                        placeholder="Paste essay links, portal login, requirements, or application checklist..."
                                        rows={4}
                                        className="w-full resize-none rounded-lg border border-brand-border bg-white p-2 text-xs text-brand-dark outline-none transition focus:ring-1 focus:ring-brand-accent/50 cursor-text"
                                      />
                                    </label>
                                    
                                    <div className="flex justify-end gap-2">
                                      <motion.button
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setExpandedNotesSlug(null)}
                                        className="px-2.5 py-1 text-[10px] font-medium border border-brand-border rounded-full hover:bg-brand-cream transition"
                                      >
                                        Cancel
                                      </motion.button>
                                      <motion.button
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => void handleSaveNotes(s.slug)}
                                        disabled={savingNotesSlug === s.slug}
                                        className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-semibold text-white bg-brand-dark rounded-full hover:opacity-90 disabled:opacity-50 transition"
                                      >
                                        {savingNotesSlug === s.slug ? (
                                          <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                          <Save className="h-3 w-3" />
                                        )}
                                        Save
                                      </motion.button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Collapsible Checklist Panel */}
                            <AnimatePresence>
                              {expandedChecklistSlug === s.slug && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{
                                    height: { type: "spring", duration: 0.28, bounce: 0 },
                                    opacity: { duration: 0.15, ease: "linear" }
                                  }}
                                  style={{ overflow: 'hidden' }}
                                >
                                  <div className="mt-3 rounded-xl border border-brand-border/60 bg-brand-cream/30 p-2.5 space-y-3">
                                    {/* Checklist header with progress bar */}
                                    {(() => {
                                      const checklist = app.checklist || DEFAULT_CHECKLIST_ITEMS;
                                      const completedCount = checklist.filter(i => i.completed).length;
                                      const totalCount = checklist.length;
                                      const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

                                      return (
                                        <div className="space-y-1.5">
                                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                                            <span>Document Checklist</span>
                                            <span>{completedCount}/{totalCount} Completed</span>
                                          </div>
                                          
                                          {/* Progress bar container */}
                                          <div className="h-1.5 w-full rounded-full bg-brand-cream border border-brand-border/40 overflow-hidden">
                                            <motion.div
                                              initial={{ width: 0 }}
                                              animate={{ width: `${percentage}%` }}
                                              transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                              className={`h-full rounded-full ${percentage === 100 ? 'bg-emerald-500' : 'bg-brand-accent'}`}
                                            />
                                          </div>
                                        </div>
                                      );
                                    })()}

                                    {/* Checklist items list */}
                                    <div className="space-y-1 max-h-48 overflow-y-auto pr-0.5 scrollbar-thin">
                                      {(app.checklist || DEFAULT_CHECKLIST_ITEMS).map((item) => (
                                        <div
                                          key={item.id}
                                          className="flex items-center justify-between group/item p-1.5 rounded-lg hover:bg-brand-cream/40 transition-colors"
                                        >
                                          <div className="flex items-center gap-2 flex-grow min-w-0">
                                            <button
                                              onClick={() => void handleToggleChecklist(s.slug, item.id)}
                                              className="text-brand-muted hover:text-brand-accent transition-colors flex-shrink-0"
                                            >
                                              {item.completed ? (
                                                <CheckSquare className="h-4 w-4 text-brand-accent" />
                                              ) : (
                                                <Square className="h-4 w-4" />
                                              )}
                                            </button>
                                            <span
                                              className={`text-xs truncate ${
                                                item.completed
                                                  ? 'text-brand-muted line-through decoration-brand-muted/60'
                                                  : 'text-brand-dark font-medium'
                                              }`}
                                            >
                                              {item.text}
                                            </span>
                                          </div>
                                          
                                          <button
                                            onClick={() => void handleRemoveChecklistItem(s.slug, item.id)}
                                            className="text-brand-muted/40 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all p-0.5"
                                            title="Delete item"
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Add custom item input */}
                                    <div className="flex gap-1.5 border-t border-brand-border/40 pt-2.5">
                                      <input
                                        type="text"
                                        value={newChecklistItemText[s.slug] ?? ''}
                                        onChange={(e) =>
                                          setNewChecklistItemText((prev) => ({
                                            ...prev,
                                            [s.slug]: e.target.value,
                                          }))
                                        }
                                        onFocus={() => setActiveInputSlug(s.slug)}
                                        onBlur={() => setActiveInputSlug(null)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault();
                                            void handleAddChecklistItem(s.slug);
                                          }
                                        }}
                                        placeholder="Add custom task..."
                                        className="flex-grow rounded-lg border border-brand-border bg-white px-2 py-1 text-xs text-brand-dark outline-none transition focus:ring-1 focus:ring-brand-accent/50 cursor-text"
                                      />
                                      <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => void handleAddChecklistItem(s.slug)}
                                        className="grid h-7 w-7 place-items-center rounded-lg bg-brand-dark text-white hover:opacity-90 transition-opacity"
                                      >
                                        <Plus className="h-4 w-4" />
                                      </motion.button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}
