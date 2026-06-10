'use client';

import { motion } from 'framer-motion';

export default function NewsletterFooter() {
  return (
    <section className="py-16 border-t border-brand-border bg-brand-cream relative overflow-hidden">

      {/* Background soft gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-bg/50 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">

        {/* Fan-out Country Flags Stack */}
        <div className="flex justify-center items-center h-40 mb-8 select-none relative w-80">

          {/* Left flag card */}
          <motion.div
            initial={{ opacity: 0, rotate: -20, x: -50 }}
            whileInView={{ opacity: 1, rotate: -12, x: -60 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="absolute w-20 h-28 rounded-xl overflow-hidden border-2 border-white shadow-lg bg-cover bg-center"
            style={{
              backgroundImage: `url('/images/universities/germany_heidelberg.jpg')`,
            }}
          />

          {/* Right flag card */}
          <motion.div
            initial={{ opacity: 0, rotate: 20, x: 50 }}
            whileInView={{ opacity: 1, rotate: 12, x: 60 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="absolute w-20 h-28 rounded-xl overflow-hidden border-2 border-white shadow-lg bg-cover bg-center"
            style={{
              backgroundImage: `url('/images/universities/turkey_istanbul.jpg')`,
            }}
          />

          {/* Middle card (on top) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="absolute w-24 h-32 rounded-xl overflow-hidden border-2 border-white shadow-xl bg-cover bg-center z-10"
            style={{
              backgroundImage: `url('/images/universities/japan_tokyo.jpg')`,
            }}
          />
        </div>

        {/* Text Content */}
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark mb-3 tracking-tight">
          Never miss a new scholarship
        </h2>

        <p className="text-xs sm:text-sm text-brand-muted max-w-lg mb-8 leading-relaxed">
          Get notified when new scholarships are added - tailored to your country, degree level, and field of study. Delivered to your inbox, no spam.
        </p>

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-md flex flex-col gap-3">
          <div className="flex gap-2 w-full">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 min-w-0 px-4 py-2.5 text-xs rounded-full border border-brand-border bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark/20"
              required
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-xs font-semibold rounded-full text-white bg-brand-dark hover:opacity-90 transition-opacity"
            >
              Notify me
            </button>
          </div>

          {/* Checkbox Consent */}
          <div className="flex items-start justify-center gap-2 mt-2">
            <input
              id="consent"
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-brand-border text-brand-dark focus:ring-brand-dark/20 mt-0.5"
              required
            />
            <label htmlFor="consent" className="text-[10px] text-brand-muted text-left max-w-sm leading-snug">
              By checking this box, you agree to receive scholarship updates from ScholarHub. You can unsubscribe at any time.
            </label>
          </div>
        </form>

      </div>
    </section>
  );
}
