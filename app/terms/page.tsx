/**
 * Terms of Service Page
 */

import type { Metadata } from 'next';
import { PageHeader } from '@/components/common/PageHeader';

export const metadata: Metadata = {
  title: 'Terms of Service | Scrapwala',
  description: 'Terms and conditions for using Scrapwala scrap collection service.',
};

export default function TermsPage() {
  return (
    <div>
      <PageHeader title="Terms of Service" description="Last updated: July 2026" />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <article className="space-y-8 text-sm leading-relaxed text-on-surface-variant">
          <Section title="1. Service Description">
            <p>Scrapwala provides a doorstep scrap collection service. Users can book pickups through our platform, and our trained executives collect, weigh, and pay for recyclable materials.</p>
          </Section>

          <Section title="2. Booking & Cancellation">
            <ul className="ml-4 list-disc space-y-1">
              <li>Bookings can be made without creating an account.</li>
              <li>You may cancel a pending or confirmed booking at any time.</li>
              <li>Cancelled bookings cannot be restored — you will need to create a new booking.</li>
              <li>We reserve the right to cancel or reschedule bookings due to operational constraints.</li>
            </ul>
          </Section>

          <Section title="3. Pricing & Payment">
            <ul className="ml-4 list-disc space-y-1">
              <li>Rates displayed on the platform are indicative and based on current market prices.</li>
              <li>Final payment is determined by the actual weight and quality of scrap at the time of pickup.</li>
              <li>Payment is made on-the-spot via cash or UPI.</li>
            </ul>
          </Section>

          <Section title="4. User Responsibilities">
            <ul className="ml-4 list-disc space-y-1">
              <li>Provide accurate contact information and address.</li>
              <li>Ensure someone is present at the address during the scheduled pickup time.</li>
              <li>Do not include hazardous materials (chemicals, medical waste, explosives) in your scrap.</li>
            </ul>
          </Section>

          <Section title="5. Limitation of Liability">
            <p>Scrapwala is not liable for any indirect, incidental, or consequential damages arising from the use of our service. Our total liability is limited to the amount paid for the specific transaction in question.</p>
          </Section>

          <Section title="6. Intellectual Property">
            <p>All content, design, and branding on the Scrapwala platform are owned by Scrapwala. Unauthorized use is prohibited.</p>
          </Section>

          <Section title="7. Governing Law">
            <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Bangalore, Karnataka.</p>
          </Section>

          <Section title="8. Contact">
            <p>For questions about these terms, email <a href="mailto:hello@scrapwala.com" className="text-primary hover:underline">hello@scrapwala.com</a>.</p>
          </Section>
        </article>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (<section><h2 className="mb-3 text-lg font-bold text-on-surface">{title}</h2>{children}</section>);
}
