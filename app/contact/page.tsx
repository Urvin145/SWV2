/**
 * Contact Page
 * Contact form + phone/WhatsApp links.
 */

import type { Metadata } from 'next';
import { PageHeader } from '@/components/common/PageHeader';
import { ContactForm } from '@/features/static/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us — Get in Touch | Scrapwala',
  description: 'Contact Scrapwala for scrap pickup inquiries, bulk orders, or partnerships. Reach us by phone, WhatsApp, or the contact form.',
};

export default function ContactPage() {
  return (
    <div>
      <PageHeader title="Contact Us" description="We'd love to hear from you. Reach out anytime." />
      <ContactForm />
    </div>
  );
}
