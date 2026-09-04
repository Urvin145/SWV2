/**
 * OrderDetailClient Component
 * Full order details page: booking info, items breakdown, timeline, cancel action.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CalendarDays, MapPin, Phone, User, Package, Loader2, XCircle, Scale } from 'lucide-react';
import Link from 'next/link';
import { useOrderDetails } from '@/features/orders/hooks/useOrderDetails';
import { OrderTimeline } from './OrderTimeline';
import { StatusBadge } from '@/components/common/StatusBadge';
import { type BookingStatus } from '@/types/common.types';
import { cancelOrder } from '@/features/orders/services/orderService';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

interface OrderDetailClientProps {
  orderId: string;
}

export function OrderDetailClient({ orderId }: OrderDetailClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useOrderDetails(orderId);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const cancelMutation = useMutation({
    mutationFn: () => cancelOrder(orderId, cancelReason || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setShowCancelDialog(false);
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded bg-surface-container" />
          <div className="h-40 animate-pulse rounded-xl bg-surface-container" />
          <div className="h-60 animate-pulse rounded-xl bg-surface-container" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 text-center sm:px-6 lg:px-8">
        <p className="mb-4 text-on-surface-variant">Order not found or failed to load.</p>
        <Link href={ROUTES.ORDERS} className="font-medium text-primary hover:underline">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const { booking, items, statusLogs } = data;
  const canCancel = ['pending', 'confirmed'].includes(booking.status);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href={ROUTES.ORDERS}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-on-surface">{booking.booking_number}</h1>
          <p className="text-sm text-on-surface-variant">
            Created {formatDate(booking.created_at)}
          </p>
        </div>
        <StatusBadge status={booking.status as BookingStatus} />
      </div>

      <div className="space-y-5">
        {/* Pickup Info */}
        <InfoCard title="Pickup Details" icon={CalendarDays}>
          <InfoRow label="Date" value={formatDate(booking.pickup_date)} />
          <InfoRow label="Time" value={booking.slot?.label ?? '—'} />
          <InfoRow label="Status" value={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)} />
          {(booking.truck_size || booking.estimated_price_range) && (
            <InfoRow label="Vehicle Size" value={booking.truck_size ?? booking.estimated_price_range ?? '—'} />
          )}
        </InfoCard>

        {/* Customer Info */}
        <InfoCard title="Customer" icon={User}>
          <InfoRow label="Name" value={booking.customer_name} />
          <InfoRow label="Phone" value={`+91 ${booking.customer_phone}`} />
        </InfoCard>

        {/* Address */}
        <InfoCard title="Pickup Address" icon={MapPin}>
          <p className="text-sm text-on-surface">
            {booking.address_line_1}
            {booking.address_line_2 && `, ${booking.address_line_2}`}
            <br />
            {booking.city}, {booking.state} - {booking.pincode}
          </p>
          {booking.customer_notes && (
            <p className="mt-2 text-xs italic text-on-surface-variant">
              Note: {booking.customer_notes}
            </p>
          )}
        </InfoCard>

        {/* Items */}
        <InfoCard title="Selected Scrap Items" icon={Package}>
          <div className="space-y-2">
            {items.map((item) => {
              const isCompleted = booking.status === 'completed' && item.actual_weight != null;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sm py-2 border-b border-outline-variant/10 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary/60" />
                    <div>
                      <span className="font-medium text-on-surface">{item.scrap_item?.name}</span>
                      {isCompleted && (
                        <span className="ml-2 text-xs font-semibold text-primary">
                          × {item.actual_weight} {item.scrap_item?.unit}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {isCompleted ? (
                      <span className="font-bold text-on-surface">
                        {formatCurrency(item.subtotal)}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        ₹{item.rate_applied} / {item.scrap_item?.unit}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Payout / Total Section */}
            {booking.status === 'completed' && booking.actual_value != null ? (
              <div className="mt-3 flex items-center justify-between border-t border-outline-variant/15 pt-3">
                <div>
                  <span className="font-bold text-on-surface">Final Payout</span>
                  <p className="text-xs text-on-surface-variant">Weighed with digital scale</p>
                </div>
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(booking.actual_value)}
                </span>
              </div>
            ) : (
              <div className="mt-4 rounded-xl bg-surface-container/60 p-3.5 border border-outline-variant/15">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface">
                    <Scale className="h-4 w-4 text-emerald-600" />
                    <span>Doorstep Digital Weighing</span>
                  </div>
                  <span className="rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                    Pay at Doorstep
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Exact weight and total payout will be calculated at your doorstep by our pickup agent using certified digital scales.
                </p>
                {(booking.truck_size || booking.estimated_price_range) && (
                  <div className="mt-2.5 flex items-center justify-between border-t border-outline-variant/10 pt-2 text-xs">
                    <span className="text-on-surface-variant font-medium">Assigned Vehicle:</span>
                    <span className="font-bold text-primary">{booking.truck_size ?? booking.estimated_price_range}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </InfoCard>

        {/* Timeline */}
        {statusLogs.length > 0 && (
          <div className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-5">
            <h3 className="mb-4 text-sm font-semibold text-on-surface">Status Timeline</h3>
            <OrderTimeline logs={statusLogs} />
          </div>
        )}

        {/* Cancel Button */}
        {canCancel && !showCancelDialog && (
          <button
            onClick={() => setShowCancelDialog(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-error/30 py-3 text-sm font-semibold text-error transition-all hover:bg-error/5"
          >
            <XCircle className="h-4 w-4" />
            Cancel Booking
          </button>
        )}

        {/* Cancel Dialog */}
        {showCancelDialog && (
          <div className="rounded-xl border border-error/20 bg-error-container/10 p-5">
            <h4 className="mb-2 font-semibold text-error">Cancel this booking?</h4>
            <p className="mb-4 text-sm text-on-surface-variant">This action cannot be undone.</p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation (optional)"
              rows={2}
              className="mb-4 w-full resize-none rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-3 py-2 text-sm text-on-surface placeholder-on-surface-variant/50 focus:border-error focus:outline-none focus:ring-2 focus:ring-error/20"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                disabled={cancelMutation.isPending}
                className="flex-1 rounded-lg border border-outline-variant/20 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container"
              >
                Keep Booking
              </button>
              <button
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-error py-2.5 text-sm font-semibold text-on-primary hover:bg-error/90 disabled:opacity-70"
              >
                {cancelMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Yes, Cancel'
                )}
              </button>
            </div>
            {cancelMutation.isError && (
              <p className="mt-2 text-xs text-error">{cancelMutation.error?.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-on-surface">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-on-surface-variant">{label}</span>
      <span className="font-medium text-on-surface">{value}</span>
    </div>
  );
}
