'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, Award, BookOpen, Briefcase, 
  Cpu, TrendingUp, Palette, Users, HeartPulse, Compass,
  CheckCircle2, XCircle, DollarSign, Globe, ArrowRight, Loader2, Undo2, Home
} from 'lucide-react';
import Link from 'next/link';
import { type Scholarship } from '@/lib/scholarships';
import { updateProfileQuizAnswers } from '@/app/actions/profile';
import ScholarshipCard from '@/components/ScholarshipCard';
import { type QuizAnswers, filterScholarships } from '@/lib/matching';

interface Props {
  initialAnswers: QuizAnswers | null;
  isAuthenticated: boolean;
}

export default function ScholarMatchQuiz({ initialAnswers, isAuthenticated }: Props) {
  const [step, setStep] = useState<number>(0);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [contentHeight, setContentHeight] = useState<number | 'auto'>('auto');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setContentHeight(el.offsetHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [transitionType, setTransitionType] = useState<'spring' | 'tween'>('spring');
  const lastStepRef = useRef<number>(0);

  useEffect(() => {
    if (step === stepsCount || lastStepRef.current === stepsCount) {
      setTransitionType('tween');
    } else {
      setTransitionType('spring');
    }
    lastStepRef.current = step;
  }, [step]);
  
  const [answers, setAnswers] = useState<QuizAnswers>({
    degree: 'master',
    field: 'any',
    experience: 'no',
    funding: 'fully',
    region: 'any'
  });

  const [activeDropdown, setActiveDropdown] = useState<'degree' | 'field' | 'experience' | 'funding' | 'region' | null>(null);

  useEffect(() => {
    if (!activeDropdown) return;
    const handleOutsideClick = () => {
      setActiveDropdown(null);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [activeDropdown]);

  const stepsCount = 5;

  // Load from sessionStorage on mount (or initialAnswers)
  useEffect(() => {
    if (initialAnswers) {
      setAnswers(initialAnswers);
      setStep(stepsCount); // Skip to results
      return;
    }

    const savedCompleted = sessionStorage.getItem('scholarMatchCompleted') === 'true';
    const savedAnswers = sessionStorage.getItem('scholarMatchAnswers');
    const savedStep = sessionStorage.getItem('scholarMatchStep');

    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch (e) {
        console.error('Failed to parse saved answers:', e);
      }
    }

    if (savedStep) {
      const parsedStep = parseInt(savedStep, 10);
      if (!isNaN(parsedStep) && parsedStep >= 0 && parsedStep <= stepsCount) {
        setStep(parsedStep);
      }
    } else if (savedCompleted) {
      setStep(stepsCount);
    }
  }, [initialAnswers]);

  // Sync to sessionStorage on updates
  useEffect(() => {
    sessionStorage.setItem('scholarMatchAnswers', JSON.stringify(answers));
    if (step > 0) {
      sessionStorage.setItem('scholarMatchStep', step.toString());
      if (step === stepsCount) {
        sessionStorage.setItem('scholarMatchCompleted', 'true');
      }
    } else {
      sessionStorage.removeItem('scholarMatchStep');
      sessionStorage.removeItem('scholarMatchCompleted');
    }
  }, [step, answers]);

  const nextStep = () => {
    if (step < stepsCount - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleComplete = async (finalAnswers?: QuizAnswers) => {
    const answersToSave = finalAnswers || answers;
    if (!isAuthenticated) {
      setStep(stepsCount); // Show result page
      return;
    }

    setSaving(true);
    setSaveError(null);

    const res = await updateProfileQuizAnswers(answersToSave);
    setSaving(false);

    if (res.success) {
      setStep(stepsCount);
    } else {
      setSaveError(res.error || 'Failed to save quiz results.');
    }
  };

  const currentResult = step === stepsCount ? filterScholarships(answers) : { matches: [], isFuzzy: false, fuzzyLevels: [] };
  const isResultsStep = step === stepsCount;

  return (
    <div 
      className={
        isResultsStep
          ? "w-full bg-brand-bg py-8 md:py-12 flex flex-col items-center justify-start min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100dvh-4.5rem)]"
          : "h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-4.5rem)] bg-brand-bg flex items-center justify-center overflow-hidden w-full py-4"
      }
    >
      <div 
        className={
          isResultsStep
            ? "w-full max-w-7xl mx-auto px-4 select-none flex flex-col justify-start"
            : "w-full max-w-4xl mx-auto px-4 select-none flex flex-col justify-center h-full max-h-full overflow-hidden"
        }
      >
        {/* Quiz Header Navigation */}
        <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-4 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold tracking-tight text-brand-dark">
            <img src="/images/logos/Scholarhub_logo.png" alt="ScholarHub Logo" className="h-7 w-7 rounded-md object-cover" />
            <span>Scholar<span className="text-brand-accent">Hub</span></span>
          </Link>
          
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-dark transition-colors cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <motion.div
          animate={{ height: isResultsStep ? 'auto' : contentHeight }}
          transition={
            transitionType === 'tween'
              ? { type: 'tween', duration: 0.35, ease: 'easeInOut' }
              : { type: 'spring', stiffness: 300, damping: 30 }
          }
          className="bg-white border border-brand-border rounded-3xl shadow-sm overflow-hidden"
        >
          <div 
            ref={containerRef} 
            className={
              isResultsStep
                ? "p-6 md:p-10 flex flex-col"
                : "p-6 md:p-10 flex flex-col max-h-[calc(100dvh-10rem)] overflow-y-auto navbar-dropdown-scroll"
            }
          >
          {saving ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 text-brand-accent animate-spin" />
            <p className="text-sm font-semibold text-brand-dark">Matching your profile with database...</p>
          </div>
        ) : step < stepsCount ? (
          <div className="max-w-2xl mx-auto w-full">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-xs text-brand-muted mb-2 font-medium">
                <span>Question {step + 1} of {stepsCount}</span>
                <span>{Math.round(((step + 1) / stepsCount) * 100)}% Complete</span>
              </div>
              <div className="h-1.5 w-full bg-brand-cream rounded-full overflow-hidden border border-brand-border/50">
                <motion.div 
                  className="h-full bg-brand-dark rounded-full"
                  animate={{ width: `${((step + 1) / stepsCount) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Wizard steps details */}
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-brand-dark leading-snug">
                      What degree level are you aiming for?
                    </h3>
                    <p className="text-xs text-brand-muted mt-1.5">Select the academic degree you wish to pursue abroad.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { val: 'bachelor', label: 'Bachelor', desc: 'Undergraduate study (S1)', icon: GraduationCap },
                      { val: 'master', label: 'Master', desc: 'Postgraduate study (S2)', icon: Award },
                      { val: 'phd', label: 'PhD / Doctoral', desc: 'Advanced research (S3)', icon: BookOpen },
                      { val: 'non-degree', label: 'Short Course', desc: 'Certificates & exchange programs', icon: Briefcase }
                    ].map(item => (
                      <button
                        key={item.val}
                        onClick={() => {
                          setAnswers({ ...answers, degree: item.val as any });
                          setTimeout(nextStep, 180);
                        }}
                        className={`flex items-start gap-4 p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 interactive-press ${
                          answers.degree === item.val
                            ? 'bg-brand-cream border-brand-dark/40 shadow-sm ring-1 ring-brand-dark/10'
                            : 'bg-white border-brand-border hover:border-brand-dark/10 hover:bg-brand-cream/30'
                        }`}
                      >
                        <div className={`p-2 rounded-xl border ${
                          answers.degree === item.val ? 'bg-brand-dark text-white' : 'bg-brand-cream/50 border-brand-border text-brand-dark'
                        }`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-brand-dark">{item.label}</p>
                          <p className="text-[11px] text-brand-muted mt-0.5 leading-snug">{item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-brand-dark leading-snug">
                      What is your desired field of study?
                    </h3>
                    <p className="text-xs text-brand-muted mt-1.5">Choose your academic discipline. Select General if not restricted.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { val: 'stem', label: 'STEM & IT', desc: 'Science, Tech, Engineering, Mathematics', icon: Cpu },
                      { val: 'business', label: 'Business & Economics', desc: 'Management, MBA, Finance', icon: TrendingUp },
                      { val: 'arts', label: 'Arts & Creative', desc: 'Design, Art, Music, Architecture', icon: Palette },
                      { val: 'social', label: 'Social & Humanities', desc: 'Law, Politics, Language, Sociology', icon: Users },
                      { val: 'medicine', label: 'Medicine & Health', desc: 'Medical, Nursing, Pharmacy', icon: HeartPulse },
                      { val: 'any', label: 'General / Any Field', desc: 'Applicable to all fields', icon: Compass }
                    ].map(item => (
                      <button
                        key={item.val}
                        onClick={() => {
                          setAnswers({ ...answers, field: item.val as any });
                          setTimeout(nextStep, 180);
                        }}
                        className={`flex items-start gap-4 p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 interactive-press ${
                          answers.field === item.val
                            ? 'bg-brand-cream border-brand-dark/40 shadow-sm ring-1 ring-brand-dark/10'
                            : 'bg-white border-brand-border hover:border-brand-dark/10 hover:bg-brand-cream/30'
                        }`}
                      >
                        <div className={`p-2 rounded-xl border ${
                          answers.field === item.val ? 'bg-brand-dark text-white' : 'bg-brand-cream/50 border-brand-border text-brand-dark'
                        }`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-brand-dark">{item.label}</p>
                          <p className="text-[11px] text-brand-muted mt-0.5 leading-snug">{item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-brand-dark leading-snug">
                      Do you have 2+ years of professional work experience?
                    </h3>
                    <p className="text-xs text-brand-muted mt-1.5">Some scholarships (like Chevening, DAAD EPOS) require work history.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { val: 'yes', label: 'Yes, I do', desc: 'Over 2 years of full-time professional experience', icon: CheckCircle2 },
                      { val: 'no', label: 'No / Fresh Graduate', desc: 'No work history or less than 2 years of experience', icon: XCircle }
                    ].map(item => (
                      <button
                        key={item.val}
                        onClick={() => {
                          setAnswers({ ...answers, experience: item.val as any });
                          setTimeout(nextStep, 180);
                        }}
                        className={`flex items-start gap-4 p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 interactive-press ${
                          answers.experience === item.val
                            ? 'bg-brand-cream border-brand-dark/40 shadow-sm ring-1 ring-brand-dark/10'
                            : 'bg-white border-brand-border hover:border-brand-dark/10 hover:bg-brand-cream/30'
                        }`}
                      >
                        <div className={`p-2 rounded-xl border ${
                          answers.experience === item.val ? 'bg-brand-dark text-white' : 'bg-brand-cream/50 border-brand-border text-brand-dark'
                        }`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-brand-dark">{item.label}</p>
                          <p className="text-[11px] text-brand-muted mt-0.5 leading-snug">{item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-brand-dark leading-snug">
                      What is your funding expectation?
                    </h3>
                    <p className="text-xs text-brand-muted mt-1.5">Fully Funded includes full tuition coverage and monthly stipends.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { val: 'fully', label: 'Strictly Fully Funded', desc: 'Only show grants that cover 100% tuition + living stipend', icon: DollarSign },
                      { val: 'any', label: 'Open to All', desc: 'Show fully funded, partial grants, and tuition discounts', icon: Compass }
                    ].map(item => (
                      <button
                        key={item.val}
                        onClick={() => {
                          setAnswers({ ...answers, funding: item.val as any });
                          setTimeout(nextStep, 180);
                        }}
                        className={`flex items-start gap-4 p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 interactive-press ${
                          answers.funding === item.val
                            ? 'bg-brand-cream border-brand-dark/40 shadow-sm ring-1 ring-brand-dark/10'
                            : 'bg-white border-brand-border hover:border-brand-dark/10 hover:bg-brand-cream/30'
                        }`}
                      >
                        <div className={`p-2 rounded-xl border ${
                          answers.funding === item.val ? 'bg-brand-dark text-white' : 'bg-brand-cream/50 border-brand-border text-brand-dark'
                        }`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-brand-dark">{item.label}</p>
                          <p className="text-[11px] text-brand-muted mt-0.5 leading-snug">{item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-brand-dark leading-snug">
                      Do you have a preferred destination region?
                    </h3>
                    <p className="text-xs text-brand-muted mt-1.5">Filter by location. Select Any Region to skip filters.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { val: 'any', label: 'Any Region (No filter)', desc: 'Show matching scholarships worldwide', icon: Globe },
                      { val: 'asia', label: 'Asia', desc: 'Japan, South Korea, Turkey, Singapore, China, etc.', icon: Compass },
                      { val: 'europe', label: 'Europe', desc: 'Germany, United Kingdom, France, Sweden, etc.', icon: Compass },
                      { val: 'americas', label: 'Americas', desc: 'United States, Canada', icon: Compass },
                      { val: 'oceania', label: 'Oceania', desc: 'Australia, New Zealand', icon: Compass }
                    ].map(item => (
                      <button
                        key={item.val}
                        onClick={() => {
                          const updated = { ...answers, region: item.val as any };
                          setAnswers(updated);
                          setTimeout(() => handleComplete(updated), 180);
                        }}
                        className={`flex items-start gap-4 p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 interactive-press ${
                          answers.region === item.val
                            ? 'bg-brand-cream border-brand-dark/40 shadow-sm ring-1 ring-brand-dark/10'
                            : 'bg-white border-brand-border hover:border-brand-dark/10 hover:bg-brand-cream/30'
                        }`}
                      >
                        <div className={`p-2 rounded-xl border ${
                          answers.region === item.val ? 'bg-brand-dark text-white' : 'bg-brand-cream/50 border-brand-border text-brand-dark'
                        }`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-brand-dark">{item.label}</p>
                          <p className="text-[11px] text-brand-muted mt-0.5 leading-snug">{item.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {saveError && (
              <div className="mt-4 p-3 border border-red-200 bg-red-50 text-red-700 text-xs rounded-xl font-medium">
                {saveError}
              </div>
            )}

            {/* Back button */}
            <div className="mt-8 flex justify-start flex-shrink-0">
              <button
                onClick={prevStep}
                disabled={step === 0}
                className="flex items-center gap-1 text-xs font-semibold text-brand-muted hover:text-brand-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <Undo2 className="h-3.5 w-3.5" /> Back
              </button>
            </div>
          </div>
        ) : (
          // Matches Results View
          <div className="space-y-6 w-full">
            {/* Result header */}
            <div className="max-w-3xl mx-auto text-center border-b border-brand-border pb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-dark text-white mb-3">
                Matches Found
              </span>
              <h3 className="font-serif text-3xl font-bold text-brand-dark">
                Your Personalized Recommendations
              </h3>
              <p className="text-xs text-brand-muted mt-2">
                Here are scholarships matching your profile. Adjust your options below to filter in real-time:
              </p>

              {/* Live Adjust Filters Panel */}
              <div className="mt-5 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto z-20 relative">
                {/* Degree Pill */}
                <FilterPill
                  label="Degree"
                  value={answers.degree === 'non-degree' ? 'Short Course' : answers.degree}
                  active={activeDropdown === 'degree'}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === 'degree' ? null : 'degree');
                  }}
                  options={[
                    { val: 'bachelor', label: 'Bachelor' },
                    { val: 'master', label: 'Master' },
                    { val: 'phd', label: 'PhD / Doctoral' },
                    { val: 'non-degree', label: 'Short Course' }
                  ]}
                  onChange={(val) => {
                    const updated = { ...answers, degree: val as any };
                    setAnswers(updated);
                    void handleComplete(updated);
                    setActiveDropdown(null);
                  }}
                />

                {/* Field Pill */}
                <FilterPill
                  label="Field"
                  value={answers.field === 'any' ? 'General' : answers.field}
                  active={activeDropdown === 'field'}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === 'field' ? null : 'field');
                  }}
                  options={[
                    { val: 'stem', label: 'STEM & IT' },
                    { val: 'business', label: 'Business & Econ' },
                    { val: 'arts', label: 'Arts & Creative' },
                    { val: 'social', label: 'Social & Human' },
                    { val: 'medicine', label: 'Medicine & Health' },
                    { val: 'any', label: 'General / Any' }
                  ]}
                  onChange={(val) => {
                    const updated = { ...answers, field: val as any };
                    setAnswers(updated);
                    void handleComplete(updated);
                    setActiveDropdown(null);
                  }}
                />

                {/* Experience Pill */}
                <FilterPill
                  label="Work Exp"
                  value={answers.experience === 'yes' ? '2+ Yrs' : 'None / Fresh'}
                  active={activeDropdown === 'experience'}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === 'experience' ? null : 'experience');
                  }}
                  options={[
                    { val: 'yes', label: '2+ Yrs Experience' },
                    { val: 'no', label: 'No/Less Experience' }
                  ]}
                  onChange={(val) => {
                    const updated = { ...answers, experience: val as any };
                    setAnswers(updated);
                    void handleComplete(updated);
                    setActiveDropdown(null);
                  }}
                />

                {/* Funding Pill */}
                <FilterPill
                  label="Funding"
                  value={answers.funding === 'fully' ? 'Strictly Fully' : 'All/Partial'}
                  active={activeDropdown === 'funding'}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === 'funding' ? null : 'funding');
                  }}
                  options={[
                    { val: 'fully', label: 'Strictly Fully' },
                    { val: 'any', label: 'Open to All' }
                  ]}
                  onChange={(val) => {
                    const updated = { ...answers, funding: val as any };
                    setAnswers(updated);
                    void handleComplete(updated);
                    setActiveDropdown(null);
                  }}
                />

                {/* Region Pill */}
                <FilterPill
                  label="Region"
                  value={answers.region === 'any' ? 'Any Region' : answers.region}
                  active={activeDropdown === 'region'}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === 'region' ? null : 'region');
                  }}
                  options={[
                    { val: 'any', label: 'Any Region' },
                    { val: 'asia', label: 'Asia' },
                    { val: 'europe', label: 'Europe' },
                    { val: 'americas', label: 'Americas' },
                    { val: 'oceania', label: 'Oceania' }
                  ]}
                  onChange={(val) => {
                    const updated = { ...answers, region: val as any };
                    setAnswers(updated);
                    void handleComplete(updated);
                    setActiveDropdown(null);
                  }}
                />
              </div>

              {currentResult.isFuzzy && (
                <div className="mt-5 p-3 inline-flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-100 text-[11px] text-amber-800 text-left max-w-lg font-medium leading-normal">
                  <span className="text-base">💡</span>
                  <span>
                    We adjusted constraints for <strong>{currentResult.fuzzyLevels.join(' & ')}</strong> to ensure you find opportunities, rather than showing empty results.
                  </span>
                </div>
              )}
            </div>

            {!isAuthenticated && (
              <div className="max-w-xl mx-auto p-5 rounded-2xl bg-brand-cream border border-brand-border/60 text-center shadow-sm">
                <h4 className="font-serif text-sm font-bold text-brand-dark mb-1">Want to save these results permanently?</h4>
                <p className="text-[11px] text-brand-muted mb-4">
                  Create a free account or sign in to save your academic profile, sync bookmarks, and track deadlines.
                </p>
                <Link
                  href="/login?next=/match"
                  className="inline-flex items-center justify-center rounded-full bg-brand-dark border border-brand-dark px-5 py-2.5 text-xs font-bold text-white hover:bg-white hover:text-brand-dark cursor-pointer interactive-press"
                >
                  Sign up / Sign in
                </Link>
              </div>
            )}

            {/* Grid of Results */}
            {currentResult.matches.length === 0 ? (
              <div className="text-center py-12 text-brand-muted">
                <p className="text-sm italic">No scholarships match your level and study field.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {currentResult.matches.slice(0, 9).map(s => (
                  <div key={s.slug} className="h-full flex flex-col">
                    <ScholarshipCard scholarship={s} variant="grid" quizAnswers={answers} />
                  </div>
                ))}
              </div>
            )}

            {/* Footer buttons */}
            <div className="flex justify-center gap-4 pt-6 border-t border-brand-border/40">
              <button
                onClick={() => setStep(0)}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-brand-border text-xs font-semibold rounded-full text-brand-dark bg-white hover:bg-brand-cream cursor-pointer transition-colors"
              >
                <Undo2 className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-45" />
                Retake Quiz
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-dark border border-brand-dark text-xs font-semibold rounded-full text-white hover:bg-white hover:text-brand-dark cursor-pointer text-center interactive-press"
              >
                Return Home
              </Link>
            </div>
          </div>
        )}
        </div>
      </motion.div>
    </div>
    </div>
  );
}

function FilterPill({
  label,
  value,
  active,
  onClick,
  options,
  onChange,
}: {
  label: string;
  value: string;
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
  options: { val: string; label: string }[];
  onChange: (val: string) => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-colors cursor-pointer select-none ${
          active
            ? 'bg-brand-dark text-white border-brand-dark'
            : 'bg-white text-brand-dark border-brand-border hover:bg-brand-cream'
        }`}
      >
        <span className="opacity-60 font-normal">
          {label}:
        </span>
        <span className="capitalize">{value}</span>
        <span className="text-[10px] ml-0.5 opacity-70">
          ▼
        </span>
      </button>

      {active && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-1.5 z-40 min-w-[150px] bg-white border border-brand-border rounded-xl shadow-xl py-1 overflow-hidden animate-fade-in">
          {options.map((opt) => (
            <button
              key={opt.val}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(opt.val);
              }}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-brand-dark hover:bg-brand-cream cursor-pointer transition-colors block"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
