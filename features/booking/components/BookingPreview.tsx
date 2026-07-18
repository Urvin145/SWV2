/**
 * Step 4: BookingPreview
 * Full summary of the booking with edit buttons and confirm action.
 * Shows items, schedule, customer details, and estimated value.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit2, ShoppingBag, CalendarDays, User, MapPin, Loader2, CheckCircle } from 'lucide-react';
import { useBookingStore } from '@/features/booking/store/bookingStore';
import { useCreateBooking } from '@/features/booking/hooks/useCreateBooking';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

export function BookingPreview() {
  const router = useRouter();
  const { selectedItems, schedule, customer, estimatedValue, setStep, prevStep, resetWizard } = useBookingStore();
  const createBooking = useCreateBooking();
  const [bookingNumber, setBookingNumber] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!schedule) return;

    try {
      const result = await createBooking.mutateAsync({
        customer,
        schedule,
        items: selectedItems,
      });

      setBookingNumber(result.booking_number);
      // Wait a moment to show success, then redirect
      setTimeout(() => {
        resetWizard();
        router.push(ROUTES.BOOK_COMPLETED);
      }, 2000);
    } catch (err) {
      console.error('Booking failed:', err);
    }
  };

  // Success state
  if (bookingNumber) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
        >
          <CheckCircle className="h-10 w-10 text-primary" />
        </motion.div>
        <h2 className="mb-2 text-2xl font-bold text-on-surface">Booking Confirmed!</h2>
        <p className="mb-2 text-on-surface-variant">Your booking number is</p>
        <p className="mb-6 rounded-lg bg-primary/10 px-6 py-2 text-lg font-bold text-primary">
          {bookingNumber}
        </p>
        <p className="text-sm text-on-surface-variant">Redirecting to confirmation page...</p>
      </motion.div>
    );
  }

  return (
    <div>
      <p className="mb-6 text-sm text-on-surface-variant">
        Please review your booking details before confirming.
      </p>

      <div className="space-y-5">
        {/* Items Summary */}
        <SummaryCard
          icon={ShoppingBag}
          title="Selected Items"
          onEdit={() => setStep(1)}
        >
          <div className="space-y-2">
            {selectedItems.map((item) => (
              <div key={item.scrap_item_id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span>{item.emoji}</span>
                  <span className="text-on-surface">{item.name}</span>
                  <span className="text-on-surface-variant">
                    × {item.estimated_weight} {item.unit}
                  </span>
                </div>
                <span className="font-medium text-on-surface">
                  {formatCurrency(item.estimated_weight * item.rate_applied)}
                </span>
              </div>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-outline-variant/15 pt-3">
              <span className="font-semibold text-on-surface">Estimated Total</span>
              <span className="text-lg font-bold text-primary">{formatCurrency(estimatedValue)}</span>
            </div>
          </div>
        </SummaryCard>

        {/* Schedule Summary */}
        <SummaryCard
          icon={CalendarDays}
          title="Pickup Schedule"
          onEdit={() => setStep(2)}
        >
          {schedule && (
            <div className="text-sm">
              <p className="text-on-surface">
                <strong>Date:</strong> {formatDate(schedule.pickup_date)}
              </p>
              <p className="text-on-surface">
                <strong>Time:</strong> {schedule.slot_label}
              </p>
            </div>
          )}
        </SummaryCard>

        {/* Customer Summary */}
        <SummaryCard
          icon={User}
          title="Your Details"
          onEdit={() => setStep(3)}
        >
          <div className="text-sm">
            <p className="text-on-surface">
              <strong>{customer.customer_name}</strong>
            </p>
            <p className="text-on-surface-variant">+91 {customer.customer_phone}</p>
          </div>
        </SummaryCard>

        {/* Address Summary */}
        <SummaryCard icon={MapPin} title="Pickup Address" onEdit={() => setStep(3)}>
          <p className="text-sm text-on-surface">
            {customer.address_line_1}
            {customer.address_line_2 && `, ${customer.address_line_2}`}
            <br />
            {customer.city}, {customer.state} - {customer.pincode}
          </p>
          {customer.customer_notes && (
            <p className="mt-2 text-xs italic text-on-surface-variant">
              Note: {customer.customer_notes}
            </p>
          )}
        </SummaryCard>
      </div>

      {/* Error message */}
      {createBooking.isError && (
        <div className="mt-4 rounded-xl border border-error/20 bg-error-container/30 p-4 text-sm text-error">
          {createBooking.error?.message || 'Failed to create booking. Please try again.'}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-5">
        <button
          type="button"
          onClick={prevStep}
          disabled={createBooking.isPending}
          className="flex items-center gap-2 rounded-xl border border-outline-variant/20 px-6 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={handleConfirm}
          disabled={createBooking.isPending}
          className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-on-primary shadow-lg shadow-primary/25 transition-all hover:bg-primary-container disabled:opacity-70"
        >
          {createBooking.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating Booking...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Confirm Booking
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/** Reusable summary card with edit button */
function SummaryCard({
  icon: Icon,
  title,
  onEdit,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold text-on-surface">{title}</h4>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
        >
          <Edit2 className="h-3 w-3" />
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}
