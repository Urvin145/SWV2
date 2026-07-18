/**
 * Hero Section Component
 * Main hero banner for the homepage.
 * Features: headline, tagline, dual CTA buttons, floating decorative elements.
 * Matches Stitch "Customer Home & Rate Preview" design.
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Recycle, Leaf, Sparkles } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-surface-container-low to-primary-fixed/20 px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
      {/* Floating decorative elements */}
      <motion.div
        className="absolute right-10 top-20 hidden text-primary/10 lg:block"
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Recycle className="h-32 w-32" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-20 hidden text-primary-fixed/30 lg:block"
        animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <Leaf className="h-24 w-24" />
      </motion.div>
      <motion.div
        className="absolute right-1/3 top-1/3 hidden text-tertiary-highlight/20 lg:block"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <Sparkles className="h-16 w-16" />
      </motion.div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
            >
              <Recycle className="h-4 w-4" />
              <span>Uber for Scrap Collection</span>
            </motion.div>

            <h1 className="font-heading text-4xl font-bold leading-[1.1] tracking-tight text-on-surface sm:text-5xl lg:text-6xl">
              Turn your scrap
              <br />
              into <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">cash</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-on-surface-variant">
              Schedule a doorstep scrap pickup in minutes. We collect paper, plastic, metal,
              e-waste and more — at the <strong className="text-on-surface">best market rates</strong>.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={ROUTES.BOOK}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-on-primary shadow-lg shadow-primary/25 transition-all hover:bg-primary-container hover:shadow-xl"
                >
                  Book a Pickup
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={ROUTES.RATES}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary/30 bg-surface-container-lowest px-8 py-4 text-base font-semibold text-primary transition-all hover:border-primary hover:bg-primary/5"
                >
                  View Scrap Rates
                </Link>
              </motion.div>
            </div>

            {/* Trust micro-badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-8 flex items-center gap-3 text-sm text-on-surface-variant"
            >
              <div className="flex -space-x-2">
                {['🏠', '🏢', '🏭'].map((emoji, i) => (
                  <span
                    key={i}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface-container-lowest bg-surface-container text-sm"
                  >
                    {emoji}
                  </span>
                ))}
              </div>
              <span>
                Trusted by <strong className="text-on-surface">10,000+</strong> homes & businesses
              </span>
            </motion.div>
          </motion.div>

          {/* Right side — visual card */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main card */}
              <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-8 shadow-xl">
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-container">
                    <Recycle className="h-10 w-10 text-on-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-on-surface">Today&apos;s Top Rates</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Newspaper', rate: '₹14/kg', emoji: '📰' },
                    { name: 'Copper', rate: '₹425/kg', emoji: '🔩' },
                    { name: 'Iron', rate: '₹28/kg', emoji: '⚙️' },
                    { name: 'Aluminium', rate: '₹105/kg', emoji: '🥫' },
                  ].map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between rounded-lg bg-surface-container-low px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{item.emoji}</span>
                        <span className="font-medium text-on-surface">{item.name}</span>
                      </div>
                      <span className="font-bold text-primary">{item.rate}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">♻️</span>
                  <div>
                    <p className="text-xs text-on-surface-variant">Recycled</p>
                    <p className="font-bold text-primary">500+ Tonnes</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
