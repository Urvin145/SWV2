/**
 * FAQ Page
 * Accordion Q&A with 10+ questions and Schema.org FAQPage markup.
 */

import type { Metadata } from 'next';
import { PageHeader } from '@/components/common/PageHeader';
import { FAQAccordion } from '@/features/static/components/FAQAccordion';

export const metadata: Metadata = {
  title: 'FAQ — Frequently Asked Questions | Scrapwala',
  description:
    'Get answers to common questions about Scrapwala scrap collection service — pricing, scheduling, accepted items, payment, and more.',
};

const faqs = [
  { q: 'What types of scrap do you collect?', a: 'We collect paper (newspaper, cardboard, books), plastic (PET bottles, HDPE, mixed), metal (iron, copper, aluminium, steel, brass), e-waste (laptops, phones, wires, batteries), glass, old clothes, and tyres/rubber.' },
  { q: 'Is there a minimum quantity required?', a: 'No! We accept any quantity of scrap — even small amounts. Whether it\'s a few newspapers or a full garage cleanout, we\'ll pick it up.' },
  { q: 'How are the rates determined?', a: 'Our rates are based on current Bangalore market prices and are updated regularly. We guarantee transparent pricing — the rate you see on our website is the rate you get.' },
  { q: 'How does weighing work?', a: 'Our trained executive carries a calibrated digital weighing scale. Every item is weighed in front of you so there\'s complete transparency.' },
  { q: 'How do I get paid?', a: 'You get paid on the spot after your scrap is weighed. Payment is instant via cash or UPI — your choice.' },
  { q: 'What areas do you serve?', a: 'We currently serve all major areas in Bangalore including Koramangala, Indiranagar, HSR Layout, Whitefield, Electronic City, Marathahalli, and more. Enter your pincode during booking to check availability.' },
  { q: 'Can I cancel or reschedule a pickup?', a: 'Yes! You can cancel a pending or confirmed booking anytime from the "My Orders" page. To reschedule, cancel the current booking and create a new one with your preferred date and time.' },
  { q: 'Do I need to create an account?', a: 'No account needed! Our service works in guest mode. Just enter your phone number and address when booking, and use the same phone number to look up your orders later.' },
  { q: 'What happens to the scrap after pickup?', a: 'All collected scrap is sent to authorized recycling facilities. Paper goes to paper mills, metals to smelters, plastics to recycling plants, and e-waste to certified e-waste processors. Nothing goes to landfill.' },
  { q: 'Is the service free?', a: 'Absolutely! The pickup service is completely free. In fact, we pay YOU for your scrap at the best market rates.' },
  { q: 'How do I track my booking?', a: 'Go to the "My Orders" page and search using your phone number or booking number. You\'ll see the status, timeline, and full details of each booking.' },
  { q: 'Do you serve offices and businesses?', a: 'Yes! We work with offices, warehouses, factories, and apartment complexes. For bulk or regular pickups, contact us for customized rates and scheduling.' },
];

/** Schema.org FAQPage structured data */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div>
        <PageHeader title="Frequently Asked Questions" description="Everything you need to know about Scrapwala." />
        <FAQAccordion faqs={faqs} />
      </div>
    </>
  );
}
