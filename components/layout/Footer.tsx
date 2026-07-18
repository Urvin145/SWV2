/**
 * Footer Component
 * Site-wide footer with company info, service links, legal links, and contact info.
 * Uses the Stitch design palette — inverse surface for dark footer background.
 */

import Link from 'next/link';
import { Recycle, Phone, Mail, MessageCircle } from 'lucide-react';
import { ROUTES, FOOTER_LINKS } from '@/constants/routes';
import { APP_CONFIG } from '@/constants/config';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-inverse-surface text-inverse-on-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href={ROUTES.HOME} className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-inverse-primary">
                <Recycle className="h-5 w-5 text-inverse-surface" />
              </div>
              <span className="text-xl font-bold">
                Scrap<span className="text-inverse-primary">wala</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-inverse-on-surface/70">
              {APP_CONFIG.description}
            </p>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-inverse-primary">
              Services
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-inverse-on-surface/70 transition-colors hover:text-inverse-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-inverse-primary">
              Company
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-inverse-on-surface/70 transition-colors hover:text-inverse-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-inverse-on-surface/70 transition-colors hover:text-inverse-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-inverse-primary">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${APP_CONFIG.contact.phone}`}
                  className="flex items-center gap-2 text-sm text-inverse-on-surface/70 transition-colors hover:text-inverse-primary"
                >
                  <Phone className="h-4 w-4" />
                  {APP_CONFIG.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${APP_CONFIG.contact.email}`}
                  className="flex items-center gap-2 text-sm text-inverse-on-surface/70 transition-colors hover:text-inverse-primary"
                >
                  <Mail className="h-4 w-4" />
                  {APP_CONFIG.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${APP_CONFIG.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-inverse-on-surface/70 transition-colors hover:text-inverse-primary"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-inverse-on-surface/10 pt-8 text-center">
          <p className="text-sm text-inverse-on-surface/50">
            © {currentYear} {APP_CONFIG.name}. All rights reserved. ♻️ Recycle. Reuse. Reward.
          </p>
        </div>
      </div>
    </footer>
  );
}
