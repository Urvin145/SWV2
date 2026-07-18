/**
 * How It Works Section
 * 3-step visual flow showing the pickup process.
 * Steps: Select Scrap → Schedule Pickup → Get Paid
 */

'use client';

import { Recycle, CalendarCheck, IndianRupee } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/common/AnimatedSection';

const steps = [
  {
    step: '01',
    icon: Recycle,
    title: 'Select Your Scrap',
    description:
      'Browse our categories and select what you want to sell — paper, plastic, metal, e-waste, and more. Estimate the weight for a price preview.',
    color: 'bg-primary/10 text-primary',
  },
  {
    step: '02',
    icon: CalendarCheck,
    title: 'Schedule a Pickup',
    description:
      'Choose a date and time slot that works for you. Our trained executive will come right to your doorstep — no minimum quantity needed.',
    color: 'bg-tertiary-highlight/10 text-tertiary',
  },
  {
    step: '03',
    icon: IndianRupee,
    title: 'Get Paid Instantly',
    description:
      'We weigh your scrap on the spot with a digital scale. You see the weight, you see the rate, and you get paid at the best market price.',
    color: 'bg-primary-fixed/30 text-primary-container',
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-surface-container-lowest px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              Simple Process
            </span>
            <h2 className="font-heading text-3xl font-bold text-on-surface sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-3 text-on-surface-variant">
              Sell your scrap in three simple steps
            </p>
          </div>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 gap-8 md:grid-cols-3" staggerDelay={0.15}>
          {steps.map((item) => (
            <StaggerItem key={item.step}>
              <div className="group relative rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                {/* Step number badge */}
                <span className="absolute -top-3.5 left-6 rounded-full bg-primary px-3.5 py-1 text-xs font-bold text-on-primary shadow-md shadow-primary/20">
                  Step {item.step}
                </span>

                {/* Icon */}
                <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${item.color} transition-transform duration-300 group-hover:scale-110`}>
                  <item.icon className="h-7 w-7" />
                </div>

                {/* Content */}
                <h3 className="mb-3 text-lg font-bold text-on-surface">{item.title}</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  {item.description}
                </p>

                {/* Connector line (visible on desktop between cards) */}
                {item.step !== '03' && (
                  <div className="absolute -right-4 top-1/2 hidden h-0.5 w-8 bg-outline-variant/30 md:block" />
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
