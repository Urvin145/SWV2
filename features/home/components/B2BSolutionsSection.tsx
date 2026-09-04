/**
 * B2B & Enterprise Solutions Section Component
 * Custom bulk scrap collection for IT Offices, Tech Parks, Apartment RWAs, Warehouses, and Factories.
 * Features: High-resolution operational imagery, live statistics, compliance certifications, and direct WhatsApp quote trigger.
 */

'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Building, 
  Warehouse, 
  FileCheck2, 
  PhoneCall, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/common/AnimatedSection';
import { APP_CONFIG } from '@/constants/config';
import { ROUTES } from '@/constants/routes';

const solutions = [
  {
    icon: Building2,
    title: 'IT Parks & Tech Offices',
    badge: 'E-Waste & IT Assets',
    image: '/images/b2b/office-ewaste.jpg',
    imageAlt: 'IT park office e-waste collection and decommissioning in Ahmedabad',
    stat: '100% Certified Data Sanitized',
    description:
      'Compliant doorstep decommissioning of laptops, servers, monitors, and networking equipment with official Green Certificate of Destruction.',
    features: [
      'NIST-compliant data sanitization & hard drive degaussing',
      'EPR compliance & State Pollution Board reports',
      'Dedicated locked logistics truck with GST invoicing',
    ],
    accentGradient: 'from-emerald-500/20 to-teal-500/5',
    tagColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
  },
  {
    icon: Building,
    title: 'Apartment Societies & RWAs',
    badge: 'Weekend Cleanout Drives',
    image: '/images/b2b/society-drive.jpg',
    imageAlt: 'Ahmedabad apartment society scrap collection drive booth',
    stat: 'Over 120+ RWAs Enrolled',
    description:
      'Turn-key weekend scrap collection drives for gated communities. We set up certified weighing booths and pay residents directly via UPI.',
    features: [
      'Zero cost to the society — full logistics provided',
      'Instant on-the-spot UPI payout to individual residents',
      'Optional RWA maintenance fund revenue sharing',
    ],
    accentGradient: 'from-amber-500/20 to-orange-500/5',
    tagColor: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20',
  },
  {
    icon: Warehouse,
    title: 'Warehouses & Industrial Units',
    badge: 'Bulk Packaging & Heavy Metals',
    image: '/images/b2b/warehouse-industrial.jpg',
    imageAlt: 'Modern industrial recycling and scrap logistics warehouse in Ahmedabad',
    stat: 'Up to 20-Tonne Daily Lift',
    description:
      'Heavy scrap clearance for e-commerce fulfilment centers, logistics hubs, and factories with certified weighbridge verification.',
    features: [
      'High-volume corrugated cardboard & packaging shrink wrap',
      'Heavy structural steel, iron, copper & alloy clearance',
      'Dedicated account manager with pre-scheduled pickups',
    ],
    accentGradient: 'from-sky-500/20 to-blue-500/5',
    tagColor: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20',
  },
];

const enterpriseStats = [
  { value: '45+', label: 'Tech Parks & Offices' },
  { value: '120+', label: 'Gated Societies (RWAs)' },
  { value: '100%', label: 'Zero-Landfill Guarantee' },
  { value: 'ISO 9001', label: 'Certified Operations' },
];

export function B2BSolutionsSection() {
  const whatsappUrl = `https://wa.me/${APP_CONFIG.contact.whatsapp}?text=Hi%20Scrapwala%2C%20I%20am%20interested%20in%20B2B%20%2F%20Bulk%20scrap%20collection%20for%20my%20office%20%2F%20society.`;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-surface via-surface-container-low to-surface px-4 py-24 sm:px-6 lg:px-8">
      {/* Background Decorative Glow */}
      <div className="pointer-events-none absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-tertiary-highlight/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <AnimatedSection>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <ShieldCheck className="h-4 w-4" />
              <span>Commercial & Enterprise Solutions</span>
            </div>
            <h2 className="font-heading text-3xl font-extrabold text-on-surface sm:text-4xl lg:text-5xl">
              Professional scrap management for{' '}
              <span className="bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
                workplaces & communities
              </span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-on-surface-variant sm:text-lg">
              From corporate IT asset disposition to high-density apartment society drives, Scrapwala
              combines certified digital scale logistics, auditable ESG documentation, and top market rates.
            </p>
          </div>
        </AnimatedSection>

        {/* 3 Visual Solution Cards */}
        <StaggerContainer className="grid grid-cols-1 gap-8 lg:grid-cols-3" staggerDelay={0.15}>
          {solutions.map((item) => (
            <StaggerItem key={item.title}>
              <motion.div
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-outline-variant/20 bg-surface-container-lowest shadow-md transition-all duration-300 hover:border-primary/40 hover:shadow-2xl"
              >
                {/* Visual Image Header with Overlay */}
                <div className="relative h-56 w-full overflow-hidden bg-surface-container">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-900 shadow-md backdrop-blur-md">
                      <item.icon className="h-3.5 w-3.5 text-primary" />
                      {item.badge}
                    </span>
                  </div>

                  {/* Bottom Image Stat Pill */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-semibold text-white">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-black/50 px-2.5 py-1 backdrop-blur-sm">
                      <Sparkles className="h-3 w-3 text-amber-400" />
                      {item.stat}
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="flex flex-1 flex-col justify-between p-7 sm:p-8">
                  <div>
                    <h3 className="mb-3 text-xl font-bold text-on-surface group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="mb-6 text-sm leading-relaxed text-on-surface-variant">
                      {item.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-3 border-t border-outline-variant/15 pt-5">
                      {item.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs font-medium text-on-surface">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                          <span className="leading-snug">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <div className="mt-8 pt-4">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-on-primary hover:shadow-lg hover:shadow-primary/20"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Request Enterprise Quote</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Enterprise Live Stats Bar */}
        <AnimatedSection className="mt-14">
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6 sm:grid-cols-4 sm:p-8 shadow-sm">
            {enterpriseStats.map((stat, idx) => (
              <div key={idx} className="text-center p-2">
                <div className="text-2xl font-black text-primary sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-medium text-on-surface-variant">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Corporate Trust & Callback Banner */}
        <AnimatedSection className="mt-8">
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary-fixed/20 to-primary/5 p-8 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="space-y-3 lg:col-span-8">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <FileCheck2 className="h-4 w-4" />
                  <span>KSPCB & ISO 9001 Compliant Recycler</span>
                </div>
                <h4 className="text-xl font-bold text-on-surface sm:text-2xl">
                  Need an EPR compliance partner or regular scrap contract?
                </h4>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  Speak directly with our Ahmedabad institutional account manager. We offer GST-compliant invoices,
                  customized recycling certificates, weighbridge verification, and customized periodic schedules.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:justify-end">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-on-primary shadow-md shadow-primary/25 transition-all hover:bg-primary-container hover:shadow-lg"
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
                <Link
                  href={ROUTES.CONTACT}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-surface-container-lowest px-5 py-3.5 text-sm font-semibold text-primary transition-all hover:bg-primary/5"
                >
                  <PhoneCall className="h-4 w-4" />
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
