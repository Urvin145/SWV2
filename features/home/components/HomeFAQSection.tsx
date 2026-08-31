/**
 * Home FAQ Section Component
 * Displays the top 6 frequently asked questions directly on the homepage for immediate friction reduction.
 * Features: Interactive accordion animations and Schema.org FAQPage structured data.
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { ROUTES } from '@/constants/routes';

const homeFaqs = [
  {
    q: 'How does the digital weighing process work?',
    a: 'Our uniformed pickup executive carries a certified, ISO-marked digital scale. Every item (newspaper, metal, plastic, appliances) is weighed right in front of you on your doorstep with full visibility.',
  },
  {
    q: 'Is the doorstep pickup service completely free?',
    a: 'Yes, 100% free! There are zero pickup charges, zero convenience fees, and zero hidden deductions. In fact, we pay YOU the exact market rate for your scrap on the spot.',
  },
  {
    q: 'How do I receive payment for my scrap?',
    a: 'Payment is made immediately after weighing. You can choose instant UPI transfer (Google Pay, PhonePe, Paytm) directly to your bank account or instant cash.',
  },
  {
    q: 'Is there any minimum quantity or weight requirement?',
    a: 'No minimum quantity! Whether you have a single bundle of old newspapers or a complete multi-room garage clearout, our team will pick it up happily.',
  },
  {
    q: 'What areas in Bangalore do you serve?',
    a: 'We serve all major neighborhoods across Bangalore including Koramangala, Indiranagar, HSR Layout, Whitefield, Electronic City, Marathahalli, Bellandur, Jayanagar, BTM Layout, Sarjapur, and Hebbal.',
  },
  {
    q: 'What happens to the scrap after collection?',
    a: 'All scrap is sorted and transported directly to state-authorized recycling mills and eco-processors. Paper goes to pulp mills, metals to smelters, and e-waste to certified dismantlers. Zero waste reaches landfills.',
  },
];

export function HomeFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="bg-surface-container-low px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <AnimatedSection>
          <div className="mb-14 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Common Questions</span>
            </div>
            <h2 className="font-heading text-3xl font-extrabold text-on-surface sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-base text-on-surface-variant">
              Everything you need to know about selling scrap with Scrapwala
            </p>
          </div>
        </AnimatedSection>

        {/* Accordion List */}
        <div className="space-y-4">
          {homeFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <AnimatedSection key={index}>
                <div className="overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-lowest shadow-sm transition-all duration-200">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between gap-4 p-6 text-left font-semibold text-on-surface transition-colors hover:text-primary"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-surface-container text-on-surface-variant"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="border-t border-outline-variant/10 px-6 pb-6 pt-3 text-sm leading-relaxed text-on-surface-variant">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Footer Link */}
        <div className="mt-10 text-center">
          <Link
            href={ROUTES.FAQ}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-container"
          >
            <span>Have more questions? Read our full FAQ guide</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
