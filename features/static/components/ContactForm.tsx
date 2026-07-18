/**
 * ContactForm Component
 * Contact form wired to /api/contact + phone/WhatsApp links.
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send, Phone, MessageCircle, Mail, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { cn } from '@/lib/utils';

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactFormValues>();

  const onSubmit = async (data: ContactFormValues) => {
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setSubmitted(true);
      reset();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
        {/* Contact Info */}
        <AnimatedSection className="lg:col-span-2" direction="left">
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 font-heading text-xl font-bold text-on-surface">Get in Touch</h3>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                Have a question about our service? Want to schedule a bulk pickup?
                We&apos;re here to help.
              </p>
            </div>

            <div className="space-y-4">
              <ContactInfo icon={Phone} label="Phone" value="+91-XXXXXXXXXX" href="tel:+91XXXXXXXXXX" />
              <ContactInfo icon={MessageCircle} label="WhatsApp" value="Chat with us" href="https://wa.me/91XXXXXXXXXX" />
              <ContactInfo icon={Mail} label="Email" value="hello@scrapwala.com" href="mailto:hello@scrapwala.com" />
              <ContactInfo icon={MapPin} label="Location" value="Bangalore, Karnataka" />
            </div>

            <div className="rounded-xl bg-surface-container p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">Working Hours</p>
              <p className="mt-1 text-sm font-semibold text-on-surface">Mon - Sat: 9 AM - 6 PM</p>
              <p className="text-sm text-on-surface-variant">Sunday: Closed</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Form */}
        <AnimatedSection className="lg:col-span-3" direction="right">
          {submitted ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-on-surface">Message Sent!</h3>
              <p className="text-on-surface-variant">We&apos;ll get back to you within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} className="mt-6 text-sm font-medium text-primary hover:underline">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6 shadow-sm sm:p-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Name" error={errors.name?.message}>
                  <input {...register('name', { required: 'Name is required' })} className={inputCls(!!errors.name)} placeholder="Your name" />
                </Field>
                <Field label="Email" error={errors.email?.message}>
                  <input {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })} type="email" className={inputCls(!!errors.email)} placeholder="you@example.com" />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Phone" error={errors.phone?.message}>
                  <input {...register('phone', { required: 'Phone is required' })} type="tel" className={inputCls(!!errors.phone)} placeholder="+91 9876543210" />
                </Field>
                <Field label="Subject" error={errors.subject?.message}>
                  <input {...register('subject', { required: 'Subject is required' })} className={inputCls(!!errors.subject)} placeholder="e.g. Bulk pickup inquiry" />
                </Field>
              </div>
              <Field label="Message" error={errors.message?.message}>
                <textarea {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'At least 10 characters' } })} rows={4} className={cn(inputCls(!!errors.message), 'resize-none')} placeholder="Tell us what you need..." />
              </Field>

              {error && <p className="text-sm text-error">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-on-primary shadow-md shadow-primary/20 transition-all hover:bg-primary-container disabled:opacity-70"
              >
                {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" />Sending...</> : <><Send className="h-4 w-4" />Send Message</>}
              </button>
            </form>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
}

function ContactInfo({ icon: Icon, label, value, href }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-xs font-medium text-on-surface-variant">{label}</p>
        <p className="text-sm font-semibold text-on-surface">{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noopener noreferrer" className="block transition-opacity hover:opacity-80">{content}</a> : <div>{content}</div>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (<div><label className="mb-1.5 block text-sm font-medium text-on-surface">{label}</label>{children}{error && <p className="mt-1 text-xs text-error">{error}</p>}</div>);
}

function inputCls(hasErr: boolean) {
  return cn('w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-sm text-on-surface placeholder-on-surface-variant/50 transition-all focus:outline-none focus:ring-2', hasErr ? 'border-error focus:ring-error/20' : 'border-outline-variant/20 focus:border-primary focus:ring-primary/20');
}
