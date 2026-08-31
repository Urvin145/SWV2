/**
 * Comparison Section Component
 * High-contrast comparison between Traditional Street Kabadiwala and Scrapwala's Modern Tech-enabled Service.
 * Highlights: Calibrated Digital Scales, Live Verified Rates, Guaranteed Slots, Instant UPI/Cash, and 100% Green Recycling.
 */

'use client';

import { Check, X, Scale, Clock, ShieldAlert, Sparkles, IndianRupee, Leaf } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';

const comparisonPoints = [
  {
    feature: 'Weighing Accuracy',
    icon: Scale,
    traditional: 'Faulty spring or manual pan scale (10% to 20% loss)',
    scrapwala: 'ISO-certified digital scale calibrated before your eyes',
  },
  {
    feature: 'Price Transparency',
    icon: IndianRupee,
    traditional: 'Arbitrary daily guessing, aggressive lowballing',
    scrapwala: 'Live Bangalore market rates updated daily on website',
  },
  {
    feature: 'Convenience & Time',
    icon: Clock,
    traditional: 'Waiting for random vendors shouting in the street',
    scrapwala: 'Guaranteed 2-hour doorstep slot booked in 60 seconds',
  },
  {
    feature: 'Payment Method',
    icon: Sparkles,
    traditional: 'Cash shortage excuses, loose change disputes',
    scrapwala: 'Instant on-the-spot payment via UPI or Cash (your choice)',
  },
  {
    feature: 'Environmental Impact',
    icon: Leaf,
    traditional: 'Unregulated dumping, informal burning, landfill overflow',
    scrapwala: '100% authorized recycling through state-certified mills',
  },
  {
    feature: 'Trust & Safety',
    icon: ShieldAlert,
    traditional: 'Unverified strangers entering private residential spaces',
    scrapwala: 'Background-verified, uniformed executives with digital ID',
  },
];

export function ComparisonSection() {
  return (
    <section className="bg-surface-container-lowest px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <AnimatedSection>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              The Scrapwala Advantage
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-on-surface sm:text-4xl lg:text-5xl">
              Why thousands of Bangaloreans switched to{' '}
              <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
                Scrapwala
              </span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-on-surface-variant sm:text-lg">
              Say goodbye to unfair weighing, bargaining, and unreliable street vendors. Experience the
              modern standard of doorstep recycling.
            </p>
          </div>
        </AnimatedSection>

        {/* Comparison Table / Cards */}
        <AnimatedSection>
          <div className="overflow-hidden rounded-3xl border border-outline-variant/20 bg-surface-container-lowest shadow-lg">
            {/* Table Header */}
            <div className="grid grid-cols-12 border-b border-outline-variant/15 bg-surface-container-low text-sm font-bold">
              <div className="col-span-4 p-4 sm:col-span-4 sm:p-6 text-on-surface">
                Key Parameters
              </div>
              <div className="col-span-4 border-l border-outline-variant/15 p-4 sm:col-span-4 sm:p-6 text-red-700 dark:text-red-400">
                <span className="hidden sm:inline">Traditional </span>Local Kabadiwala
              </div>
              <div className="col-span-4 border-l border-primary/20 bg-primary/10 p-4 sm:col-span-4 sm:p-6 text-primary">
                Scrapwala Doorstep
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-outline-variant/10 text-xs sm:text-sm">
              {comparisonPoints.map((row, idx) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-12 items-center transition-colors ${
                    idx % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low/40'
                  }`}
                >
                  {/* Parameter Name */}
                  <div className="col-span-4 flex items-center gap-2 p-4 sm:p-6 font-semibold text-on-surface">
                    <row.icon className="hidden h-4 w-4 text-primary sm:block flex-shrink-0" />
                    <span>{row.feature}</span>
                  </div>

                  {/* Traditional */}
                  <div className="col-span-4 flex items-start gap-2 border-l border-outline-variant/15 p-4 sm:p-6 text-on-surface-variant">
                    <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                    <span className="leading-snug">{row.traditional}</span>
                  </div>

                  {/* Scrapwala */}
                  <div className="col-span-4 flex items-start gap-2 border-l border-primary/20 bg-primary/5 p-4 sm:p-6 font-medium text-on-surface">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary font-bold" />
                    <span className="leading-snug text-primary-container font-semibold">{row.scrapwala}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
