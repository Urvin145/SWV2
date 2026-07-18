/**
 * CTA Section
 * Bottom call-to-action section on the homepage.
 * Full-width primary background with centered text and action button.
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { AnimatedSection } from '@/components/common/AnimatedSection';

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-container to-primary px-4 py-20 sm:px-6 lg:px-8">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-on-primary/20" />
        <div className="absolute -bottom-10 -right-10 h-60 w-60 rounded-full bg-on-primary/10" />
        <div className="absolute left-1/4 top-1/2 h-20 w-20 rounded-full bg-on-primary/15" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <AnimatedSection>
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-on-primary/20 backdrop-blur-sm"
          >
            <Sparkles className="h-8 w-8 text-on-primary" />
          </motion.div>

          <h2 className="font-heading text-3xl font-bold text-on-primary sm:text-4xl">
            Ready to sell your scrap?
          </h2>
          <p className="mt-4 text-lg text-on-primary/80">
            Schedule your first pickup today. It&apos;s free, fast, and pays you fairly.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="mt-10 inline-block"
          >
            <Link
              href={ROUTES.BOOK}
              className="inline-flex items-center gap-3 rounded-xl bg-surface-container-lowest px-10 py-4 text-lg font-bold text-primary shadow-2xl transition-all hover:shadow-xl"
            >
              Schedule Your First Pickup
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>

          <p className="mt-6 text-sm text-on-primary/60">
            No login required • Free pickup • Best market rates
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
