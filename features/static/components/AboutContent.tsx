/**
 * AboutContent Component
 * Company story, mission, values, and team section.
 */

'use client';

import { Recycle, Shield, IndianRupee, Clock, Heart, Leaf } from 'lucide-react';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/common/AnimatedSection';

const values = [
  { icon: Shield, title: 'Transparency', description: 'Digital weighing, real-time rates, no hidden deductions. What you see is what you get.' },
  { icon: IndianRupee, title: 'Best Rates', description: 'We offer the best market rates for your scrap — consistently higher than the local kabadiwala.' },
  { icon: Clock, title: 'Convenience', description: 'Book a pickup in minutes, from your phone. We come to your doorstep at your chosen time.' },
  { icon: Recycle, title: 'Sustainability', description: 'Every kilogram we collect is properly recycled, keeping waste out of landfills.' },
  { icon: Heart, title: 'Community', description: 'We employ and train local pickup executives, creating dignified jobs in the recycling sector.' },
  { icon: Leaf, title: 'Impact', description: '500+ tonnes recycled and counting. Together, we are making Bangalore cleaner and greener.' },
];

export function AboutContent() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Story */}
      <AnimatedSection>
        <div className="mb-16">
          <h2 className="mb-6 font-heading text-2xl font-bold text-on-surface sm:text-3xl">Our Story</h2>
          <div className="space-y-4 text-on-surface-variant leading-relaxed">
            <p>
              Scrapwala was born from a simple frustration — selling scrap in India shouldn&apos;t be a hassle.
              For decades, households and businesses have relied on the local kabadiwala, dealing with inconsistent rates,
              inaccurate weighing, and unpredictable schedules.
            </p>
            <p>
              We set out to build the <strong className="text-on-surface">Uber for scrap collection</strong> — a platform
              where anyone can schedule a doorstep pickup, see transparent rates, and get paid fairly for their recyclable waste.
            </p>
            <p>
              Starting in Bangalore, we&apos;re on a mission to formalize India&apos;s massive informal recycling economy,
              one pickup at a time. By combining technology with trained local executives, we&apos;re making recycling
              convenient, transparent, and rewarding.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Mission */}
      <AnimatedSection delay={0.1}>
        <div className="mb-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary-fixed/20 p-8 text-center sm:p-12">
          <h2 className="mb-4 font-heading text-2xl font-bold text-on-surface sm:text-3xl">Our Mission</h2>
          <p className="mx-auto max-w-2xl text-lg text-on-surface-variant">
            To make recycling <strong className="text-primary">accessible</strong>,{' '}
            <strong className="text-primary">transparent</strong>, and{' '}
            <strong className="text-primary">rewarding</strong> for every household and business in India.
          </p>
        </div>
      </AnimatedSection>

      {/* Values */}
      <AnimatedSection delay={0.2}>
        <h2 className="mb-8 text-center font-heading text-2xl font-bold text-on-surface sm:text-3xl">Our Values</h2>
      </AnimatedSection>
      <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.1}>
        {values.map((v) => (
          <StaggerItem key={v.title}>
            <div className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <v.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-on-surface">{v.title}</h3>
              <p className="text-sm leading-relaxed text-on-surface-variant">{v.description}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
