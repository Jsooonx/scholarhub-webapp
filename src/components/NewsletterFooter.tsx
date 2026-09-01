'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2 } from 'lucide-react';
import SplitText from '@/components/SplitText';
import { Button } from '@/components/ui/button';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterFooter() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
      setEmail('');
      setConsent(false);
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  };

  return (
    <section className="py-16 border-t border-brand-border bg-brand-cream relative overflow-hidden">

      {/* Background soft gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-bg/50 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">

        {/* Fan-out Country Image Stack */}
        <div className="flex justify-center items-center h-40 mb-8 select-none relative w-80">
          <motion.div
            initial={{ opacity: 0, rotate: -20, x: -50 }}
            whileInView={{ opacity: 1, rotate: -12, x: -60 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="absolute w-20 h-28 rounded-xl overflow-hidden border-2 border-white shadow-lg bg-cover bg-center"
            style={{ backgroundImage: `url('/images-optimized/universities/GE_HeidelbergU.webp')` }}
          />
          <motion.div
            initial={{ opacity: 0, rotate: 20, x: 50 }}
            whileInView={{ opacity: 1, rotate: 12, x: 60 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="absolute w-20 h-28 rounded-xl overflow-hidden border-2 border-white shadow-lg bg-cover bg-center"
            style={{ backgroundImage: `url('/images-optimized/universities/TU_METU.webp')` }}
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="absolute w-24 h-32 rounded-xl overflow-hidden border-2 border-white shadow-xl bg-cover bg-center z-10"
            style={{ backgroundImage: `url('/images-optimized/universities/JP_UofTokyo.webp')` }}
          />
        </div>

        {/* Text */}
        <SplitText
          text="Never miss a new scholarship"
          className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark mb-3 tracking-tight"
          tag="h2"
          delay={30}
          duration={0.6}
          ease="power2.out"
          threshold={0.1}
        />
        <p className="text-xs sm:text-sm text-brand-muted max-w-lg mb-8 leading-relaxed">
          Get notified when new scholarships are added. Delivered to your inbox, no spam.
        </p>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-sm font-semibold text-brand-dark">You are subscribed.</p>
              <p className="text-xs text-brand-muted">We will notify you when new scholarships are added.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="w-full max-w-md flex flex-col gap-3"
              initial={{ opacity: 1 }}
            >
              <div className="flex gap-2 w-full">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === 'loading'}
                  className="flex-1 min-w-0 px-4 py-2.5 text-xs rounded-full border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark/20 disabled:opacity-50"
                />
                <Button
                  type="submit"
                  disabled={status === 'loading' || !consent}
                  variant="primary"
                  size="sm"
                  loading={status === 'loading'}
                  className="shrink-0"
                >
                  {status === 'loading' ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    'Notify me'
                  )}
                </Button>
              </div>

              {/* Error message */}
              {status === 'error' && (
                <p className="text-[11px] text-red-500 text-center">{errorMsg}</p>
              )}

              {/* Consent */}
              <div className="flex items-start justify-center gap-2 mt-1">
                <input
                  id="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                  className="h-3.5 w-3.5 rounded border-brand-border text-brand-dark focus:ring-brand-dark/20 mt-0.5 cursor-pointer"
                />
                <label htmlFor="consent" className="text-[10px] text-brand-muted text-left max-w-sm leading-snug cursor-pointer">
                  By checking this box, you agree to receive scholarship updates from ScholarHub. You can unsubscribe at any time.
                </label>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
