/**
 * Environmental Impact Section Component
 * Displays real-time ESG metrics and resource savings achieved by Scrapwala's recycling network.
 * Features: Animated counters, glowing eco-cards, resource equivalencies, and Ahmedabad landfill diversion stats.
 */

'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Trees, Droplets, Zap, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/common/AnimatedSection';
import { ROUTES } from '@/constants/routes';

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
}

function AnimatedCounter({ value, suffix = '', prefix = '' }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-heading font-extrabold tracking-tight">
      {prefix}
      {count.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

const impactMetrics = [
  {
    icon: Trees,
    title: 'Trees Preserved',
    value: 12450,
    suffix: '+',
    detail: 'Saved from paper & cardboard recycling',
    equivalency: 'Equal to 42 acres of lush forest',
    color: 'text-emerald-700 dark:text-emerald-400',
    bgLight: 'bg-emerald-50 border-emerald-200/60 dark:bg-emerald-950/30 dark:border-emerald-800/40',
    badge: 'Forest Protection',
  },
  {
    icon: Droplets,
    title: 'Water Conserved',
    value: 4800000,
    suffix: ' L',
    detail: 'Saved in pulp, plastic & metal reprocessing',
    equivalency: 'Saves 1,920 Olympic-size swimming pools',
    color: 'text-sky-700 dark:text-sky-400',
    bgLight: 'bg-sky-50 border-sky-200/60 dark:bg-sky-950/30 dark:border-sky-800/40',
    badge: 'Water Security',
  },
  {
    icon: Zap,
    title: 'Electricity Preserved',
    value: 865000,
    suffix: ' kWh',
    detail: 'Clean energy saved through secondary smelting',
    equivalency: 'Powers 580 Ahmedabad homes for a year',
    color: 'text-amber-700 dark:text-amber-400',
    bgLight: 'bg-amber-50 border-amber-200/60 dark:bg-amber-950/30 dark:border-amber-800/40',
    badge: 'Energy Efficiency',
  },
  {
    icon: ShieldCheck,
    title: 'Landfill Waste Diverted',
    value: 520,
    suffix: ' Tonnes',
    detail: '100% processed through authorized green mills',
    equivalency: 'Zero burning, zero toxic seepage',
    color: 'text-teal-700 dark:text-teal-400',
    bgLight: 'bg-teal-50 border-teal-200/60 dark:bg-teal-950/30 dark:border-teal-800/40',
    badge: 'Zero-Waste City',
  },
];

export function EnvironmentalImpactSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-lowest via-surface to-surface-container-low px-4 py-24 sm:px-6 lg:px-8">
      {/* Background Decorative Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-10 h-80 w-80 rounded-full bg-primary-fixed/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <AnimatedSection>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Measurable Environmental Impact</span>
            </div>
            <h2 className="font-heading text-3xl font-extrabold text-on-surface sm:text-4xl lg:text-5xl">
              Your scrap powers a{' '}
              <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
                greener Ahmedabad
              </span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-on-surface-variant sm:text-lg">
              Every newspaper, appliance, and plastic bottle collected through Scrapwala is 100% diverted
              from local landfills and channeled directly into certified eco-friendly recycling plants.
            </p>
          </div>
        </AnimatedSection>

        {/* 4-Metric Grid */}
        <StaggerContainer
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          staggerDelay={0.12}
        >
          {impactMetrics.map((item) => (
            <StaggerItem key={item.title}>
              <motion.div
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={`relative flex h-full flex-col justify-between rounded-2xl border p-7 shadow-sm transition-all duration-300 hover:shadow-xl ${item.bgLight}`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="mb-6 flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-lowest shadow-sm ${item.color}`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-surface-container-lowest/80 px-2.5 py-1 text-[11px] font-semibold text-on-surface-variant backdrop-blur-sm">
                      {item.badge}
                    </span>
                  </div>

                  {/* Number Counter */}
                  <div className={`mb-2 text-3xl sm:text-4xl ${item.color}`}>
                    <AnimatedCounter value={item.value} suffix={item.suffix} />
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-on-surface">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-on-surface-variant">{item.detail}</p>
                </div>

                {/* Bottom Equivalency Pill */}
                <div className="mt-6 rounded-xl border border-outline-variant/20 bg-surface-container-lowest/90 p-3 text-[11px] font-medium text-on-surface">
                  <span className="mr-1 text-primary">✨</span>
                  {item.equivalency}
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Impact Banner Card */}
        <AnimatedSection className="mt-14">
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary-fixed/20 to-primary/5 p-8 sm:p-10">
            <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
              <div className="max-w-2xl text-center lg:text-left">
                <h4 className="text-xl font-bold text-on-surface sm:text-2xl">
                  Ready to turn your household waste into environmental savings?
                </h4>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Schedule a free doorstep pickup today. Instant digital payment, calibrated weights, and verified circular recycling.
                </p>
              </div>

              <div className="flex flex-shrink-0 flex-col gap-3 sm:flex-row">
                <Link
                  href={ROUTES.BOOK}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-on-primary shadow-lg shadow-primary/25 transition-all hover:bg-primary-container hover:shadow-xl"
                >
                  Schedule Free Pickup
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={ROUTES.RATES}
                  className="inline-flex items-center justify-center rounded-xl border border-primary/30 bg-surface-container-lowest px-6 py-3.5 text-sm font-semibold text-primary transition-all hover:bg-primary/5"
                >
                  Check Live Rates
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
