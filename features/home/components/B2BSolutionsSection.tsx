/**
 * B2B & Enterprise Solutions Section Component
 * Custom bulk scrap collection for IT Offices, Tech Parks, Apartment RWAs, Warehouses, and Factories.
 * Features: Certificate of Recycling, EPR Compliance, Scheduled Drives, and Dedicated Account Support.
 */

'use client';

import { motion } from 'framer-motion';
import { Building2, Building, Warehouse, FileCheck2, PhoneCall, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/common/AnimatedSection';
import { APP_CONFIG } from '@/constants/config';
import { ROUTES } from '@/constants/routes';

const solutions = [
  {
    icon: Building2,
    title: 'IT Parks & Tech Offices',
    badge: 'E-Waste & IT Assets',
    description:
      'Compliant disposal of decommissioned laptops, monitors, servers, cables, and office furniture with official Green Certificate of Destruction.',
    features: [
      'Certified Data Sanitization / Destruction',
      'Green Recycling & ESG Compliance Reports',
      'Dedicated logistics vehicle with GST invoicing',
    ],
    highlightColor: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20',
  },
  {
    icon: Building,
    title: 'Apartment Societies & RWAs',
    badge: 'Society Cleanout Drives',
    description:
      'Turn-key weekend scrap collection drives for residential gated communities and apartment complexes across Bangalore.',
    features: [
      'Pre-scheduled weekend pickup booths',
      'Individual resident payouts via instant UPI',
      'Special community fund contributions option',
    ],
    highlightColor: 'from-amber-500/10 to-orange-500/10 border-amber-500/20',
  },
  {
    icon: Warehouse,
    title: 'Warehouses & Industrial Units',
    badge: 'Bulk Packaging & Metals',
    description:
      'Heavy-duty scrap clearance for e-commerce hubs, distribution centers, and manufacturing units with certified weighbridge verification.',
    features: [
      'Multi-tonne pickup capacity',
      'Corrugated cardboard & shrink-wrap bulk rates',
      'Heavy structural steel, iron & copper processing',
    ],
    highlightColor: 'from-sky-500/10 to-blue-500/10 border-sky-500/20',
  },
];

export function B2BSolutionsSection() {
  const whatsappUrl = `https://wa.me/${APP_CONFIG.contact.whatsapp}?text=Hi%20Scrapwala%2C%20I%20am%20interested%20in%20B2B%20%2F%20Bulk%20scrap%20collection%20for%20my%20office%20%2F%20society.`;

  return (
    <section className="relative overflow-hidden bg-surface-container px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <AnimatedSection>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-tertiary-highlight/30 bg-tertiary-highlight/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-tertiary">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Commercial & Enterprise Solutions</span>
            </div>
            <h2 className="font-heading text-3xl font-extrabold text-on-surface sm:text-4xl lg:text-5xl">
              Tailored scrap management for{' '}
              <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
                businesses & societies
              </span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-on-surface-variant sm:text-lg">
              From corporate e-waste decommissioning to high-density apartment society drives, Scrapwala
              delivers institutional-grade logistics, digital audit trails, and top market valuations.
            </p>
          </div>
        </AnimatedSection>

        {/* 3 Core Solutions Cards */}
        <StaggerContainer className="grid grid-cols-1 gap-8 lg:grid-cols-3" staggerDelay={0.15}>
          {solutions.map((item) => (
            <StaggerItem key={item.title}>
              <motion.div
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={`flex h-full flex-col justify-between rounded-3xl border bg-surface-container-lowest p-8 shadow-sm transition-all duration-300 hover:shadow-xl ${item.highlightColor}`}
              >
                <div>
                  {/* Icon & Badge */}
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <item.icon className="h-7 w-7" />
                    </div>
                    <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-semibold text-on-surface-variant">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-on-surface">{item.title}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-on-surface-variant">
                    {item.description}
                  </p>

                  {/* Feature Checkmarks */}
                  <div className="space-y-3 border-t border-outline-variant/15 pt-6">
                    {item.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs font-medium text-on-surface">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA for card */}
                <div className="mt-8 pt-4">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-surface-container-low px-4 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-on-primary"
                  >
                    Request Custom Quote
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Corporate Trust Banner */}
        <AnimatedSection className="mt-12">
          <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-8 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="space-y-2 lg:col-span-8">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <FileCheck2 className="h-4 w-4" />
                  <span>ISO 9001 & State Pollution Control Board Compliant</span>
                </div>
                <h4 className="text-xl font-bold text-on-surface sm:text-2xl">
                  Need a customized EPR or regular scrap collection contract?
                </h4>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  Speak directly with our enterprise account manager. We offer GST-compliant invoices,
                  customized recycling certificates, and dedicated weekly/monthly pickup schedules.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">
                <Link
                  href={ROUTES.CONTACT}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-on-primary shadow-md transition-all hover:bg-primary-container"
                >
                  <PhoneCall className="h-4 w-4" />
                  Contact Enterprise Team
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
