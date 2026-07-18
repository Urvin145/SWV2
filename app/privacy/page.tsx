/**
 * Privacy Policy Page
 */

import type { Metadata } from 'next';
import { PageHeader } from '@/components/common/PageHeader';

export const metadata: Metadata = {
  title: 'Privacy Policy | Scrapwala',
  description: 'Learn how Scrapwala collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader title="Privacy Policy" description="Last updated: July 2026" />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <article className="space-y-8 text-sm leading-relaxed text-on-surface-variant">
          <Section title="1. Information We Collect">
            <p>When you use Scrapwala, we collect the following information:</p>
            <ul className="ml-4 mt-2 list-disc space-y-1">
              <li><strong className="text-on-surface">Personal Information:</strong> Name, phone number, and address provided during booking.</li>
              <li><strong className="text-on-surface">Booking Data:</strong> Scrap items selected, pickup dates, estimated weights.</li>
              <li><strong className="text-on-surface">Contact Submissions:</strong> Name, email, phone, and message from the contact form.</li>
              <li><strong className="text-on-surface">Photos:</strong> Optional scrap photos uploaded during booking.</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul className="ml-4 list-disc space-y-1">
              <li>To process and fulfill your scrap pickup bookings.</li>
              <li>To communicate pickup schedules, confirmations, and updates.</li>
              <li>To respond to your contact form inquiries.</li>
              <li>To improve our service and user experience.</li>
            </ul>
          </Section>

          <Section title="3. Data Storage & Security">
            <p>Your data is stored securely on Supabase cloud infrastructure with encryption at rest and in transit. We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
          </Section>

          <Section title="4. Data Retention">
            <p>We retain your booking data for operational and accounting purposes. Contact submissions are retained for up to 1 year. You may request deletion of your data by contacting us.</p>
          </Section>

          <Section title="5. Your Rights">
            <p>You have the right to access, correct, or delete your personal information. Contact us at <a href="mailto:hello@scrapwala.com" className="text-primary hover:underline">hello@scrapwala.com</a> to exercise these rights.</p>
          </Section>

          <Section title="6. Changes to This Policy">
            <p>We may update this privacy policy from time to time. Continued use of the service constitutes acceptance of the updated policy.</p>
          </Section>

          <Section title="7. Contact">
            <p>For privacy-related concerns, email us at <a href="mailto:hello@scrapwala.com" className="text-primary hover:underline">hello@scrapwala.com</a>.</p>
          </Section>
        </article>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (<section><h2 className="mb-3 text-lg font-bold text-on-surface">{title}</h2>{children}</section>);
}
