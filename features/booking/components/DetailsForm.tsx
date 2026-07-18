/**
 * Step 3: DetailsForm
 * Customer details: name, phone (validated), address, optional notes.
 * Uses Zod validation and react-hook-form.
 */

'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, User, Phone, MapPin, MessageSquare } from 'lucide-react';
import { useBookingStore } from '@/features/booking/store/bookingStore';
import { cn } from '@/lib/utils';

const detailsSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  customer_phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number'),
  address_line_1: z.string().min(5, 'Enter your complete address'),
  address_line_2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  customer_notes: z.string().optional(),
});

type DetailsFormValues = z.infer<typeof detailsSchema>;

export function DetailsForm() {
  const { customer, setCustomer, nextStep, prevStep } = useBookingStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DetailsFormValues>({
    defaultValues: {
      customer_name: customer.customer_name,
      customer_phone: customer.customer_phone,
      address_line_1: customer.address_line_1,
      address_line_2: customer.address_line_2,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
      customer_notes: customer.customer_notes,
    },
  });

  const onSubmit = (data: DetailsFormValues) => {
    setCustomer(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-6">
        {/* Name & Phone */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            icon={User}
            label="Full Name"
            error={errors.customer_name?.message}
          >
            <input
              {...register('customer_name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })}
              type="text"
              placeholder="Your full name"
              className={inputClass(!!errors.customer_name)}
            />
          </FormField>

          <FormField
            icon={Phone}
            label="Phone Number"
            error={errors.customer_phone?.message}
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">+91</span>
              <input
                {...register('customer_phone', { required: 'Phone is required', pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit number' } })}
                type="tel"
                maxLength={10}
                placeholder="9876543210"
                className={cn(inputClass(!!errors.customer_phone), 'pl-12')}
              />
            </div>
          </FormField>
        </div>

        {/* Address */}
        <FormField
          icon={MapPin}
          label="Address Line 1"
          error={errors.address_line_1?.message}
        >
          <input
            {...register('address_line_1', { required: 'Address is required', minLength: { value: 5, message: 'At least 5 characters' } })}
            type="text"
            placeholder="House/Flat no., Building, Street"
            className={inputClass(!!errors.address_line_1)}
          />
        </FormField>

        <FormField label="Address Line 2 (optional)">
          <input
            {...register('address_line_2')}
            type="text"
            placeholder="Landmark, Area"
            className={inputClass(false)}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <FormField label="City" error={errors.city?.message}>
            <input
              {...register('city', { required: 'City is required' })}
              type="text"
              className={inputClass(!!errors.city)}
            />
          </FormField>

          <FormField label="State" error={errors.state?.message}>
            <input
              {...register('state', { required: 'State is required' })}
              type="text"
              className={inputClass(!!errors.state)}
            />
          </FormField>

          <FormField label="Pincode" error={errors.pincode?.message}>
            <input
              {...register('pincode', { required: 'Pincode is required', pattern: { value: /^\d{6}$/, message: '6-digit pincode' } })}
              type="text"
              maxLength={6}
              placeholder="560001"
              className={inputClass(!!errors.pincode)}
            />
          </FormField>
        </div>

        {/* Notes */}
        <FormField
          icon={MessageSquare}
          label="Special Instructions (optional)"
        >
          <textarea
            {...register('customer_notes')}
            rows={3}
            placeholder="e.g., Ring the doorbell twice, come to 2nd floor, guard gate entry..."
            className={cn(inputClass(false), 'resize-none')}
          />
        </FormField>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-5">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-2 rounded-xl border border-outline-variant/20 px-6 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-on-primary shadow-md shadow-primary/20 transition-all hover:bg-primary-container"
        >
          Next: Review
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

/** Reusable form field wrapper */
function FormField({
  icon: Icon,
  label,
  error,
  children,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-on-surface">
        {Icon && <Icon className="h-4 w-4 text-primary" />}
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return cn(
    'w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-sm text-on-surface placeholder-on-surface-variant/50 transition-all focus:outline-none focus:ring-2',
    hasError
      ? 'border-error focus:border-error focus:ring-error/20'
      : 'border-outline-variant/20 focus:border-primary focus:ring-primary/20',
  );
}
