/**
 * Trust Markers Section
 * Stats counters and customer testimonials to build credibility.
 * Features animated counting numbers and review cards.
 */

'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Truck, IndianRupee, Star, Recycle, Quote } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/common/AnimatedSection';

/** Animated counter that counts up when in view */
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 1500;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 10000, suffix: '+', label: 'Pickups Done', icon: Truck },
  { value: 50, suffix: 'L+', label: 'Paid to Customers', icon: IndianRupee },
  { value: 500, suffix: '+', label: 'Tonnes Recycled', icon: Recycle },
  { value: 4.8, suffix: '', label: 'Average Rating', icon: Star },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Homeowner, Koramangala',
    text: 'Scrapwala made selling scrap so easy! The executive was on time, weighed everything fairly, and I got paid on the spot. Much better than the local kabadiwala.',
    rating: 5,
  },
  {
    name: 'Rajesh Gupta',
    role: 'Office Manager, Indiranagar',
    text: 'We generate a lot of paper and e-waste at our office. Scrapwala picks it up regularly and gives us transparent rates. Highly recommended for offices!',
    rating: 5,
  },
  {
    name: 'Anita Reddy',
    role: 'Apartment RWA, Whitefield',
    text: 'Our apartment society switched to Scrapwala last year. The booking system is super convenient and the rates are genuinely better than what we used to get.',
    rating: 5,
  },
];

export function TrustMarkersSection() {
  return (
    <>
      {/* Stats Section */}
      <section className="bg-surface-container-lowest px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <StaggerContainer
            className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:gap-10"
            staggerDelay={0.12}
          >
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <stat.icon className="h-7 w-7 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-on-surface sm:text-4xl">
                    {stat.label === 'Average Rating' ? (
                      <>{stat.value}</>
                    ) : stat.label === 'Paid to Customers' ? (
                      <>₹<AnimatedCounter value={stat.value} suffix={stat.suffix} /></>
                    ) : (
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    )}
                  </p>
                  <p className="mt-1 text-sm font-medium text-on-surface-variant">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-surface-container-low px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <AnimatedSection>
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block rounded-full bg-tertiary-highlight/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-tertiary">
                Testimonials
              </span>
              <h2 className="font-heading text-3xl font-bold text-on-surface sm:text-4xl">
                What Our Customers Say
              </h2>
            </div>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-3" staggerDelay={0.12}>
            {testimonials.map((t, index) => (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="relative rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6 shadow-sm"
                >
                  <Quote className="mb-4 h-8 w-8 text-primary/20" />
                  <p className="mb-6 text-sm leading-relaxed text-on-surface-variant">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{t.name}</p>
                      <p className="text-xs text-on-surface-variant">{t.role}</p>
                    </div>
                  </div>
                  {/* Star rating */}
                  <div className="absolute right-6 top-6 flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-tertiary-highlight text-tertiary-highlight" />
                    ))}
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </>
  );
}
