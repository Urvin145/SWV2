/**
 * AdminPickupsClient
 * Full pickup management with search, status filters, status updates,
 * and a completion modal for recording actual weights.
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Search,
  Filter,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Scale,
  Check,
  ArrowRight,
  X,
  RefreshCw,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ────────── Types ────────── */
interface BookingItem {
  id: string;
  estimated_weight: number;
  actual_weight: number | null;
  rate_applied: number;
  subtotal: number;
  scrap_item: {
    id: string;
    name: string;
    slug: string;
    unit: string;
    category: { name: string; slug: string };
  };
}

interface Booking {
  id: string;
  booking_number: string;
  customer_name: string;
  customer_phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  pincode: string;
  status: string;
  pickup_date: string;
  estimated_value: number | null;
  actual_value: number | null;
  weight_total: number | null;
  customer_notes: string | null;
  created_at: string;
  slot: { id: string; label: string; start_time: string; end_time: string } | null;
  items: BookingItem[];
}

/* ────────── Status meta ────────── */
const STATUS_META: Record<string, { color: string; label: string; bgLight: string }> = {
  pending: { color: 'bg-amber-500', label: 'Pending', bgLight: 'bg-amber-100 text-amber-700' },
  confirmed: { color: 'bg-sky-500', label: 'Confirmed', bgLight: 'bg-sky-100 text-sky-700' },
  scheduled: { color: 'bg-violet-500', label: 'Scheduled', bgLight: 'bg-violet-100 text-violet-700' },
  completed: { color: 'bg-emerald-500', label: 'Completed', bgLight: 'bg-emerald-100 text-emerald-700' },
  cancelled: { color: 'bg-red-500', label: 'Cancelled', bgLight: 'bg-red-100 text-red-700' },
};

const NEXT_STATUS: Record<string, string | null> = {
  pending: 'confirmed',
  confirmed: 'scheduled',
  scheduled: null, // use complete modal instead
  completed: null,
  cancelled: null,
};

const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'scheduled', 'completed', 'cancelled'];

/* ────────── Complete Pickup Modal ────────── */
function CompletePickupModal({
  booking,
  onClose,
  onComplete,
}: {
  booking: Booking;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [weights, setWeights] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Init weights from estimated
  useEffect(() => {
    const initial: Record<string, string> = {};
    for (const item of booking.items) {
      initial[item.id] = String(item.estimated_weight);
    }
    setWeights(initial);
  }, [booking.items]);

  const totalValue = booking.items.reduce((sum, item) => {
    const w = parseFloat(weights[item.id] || '0');
    return sum + w * item.rate_applied;
  }, 0);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const items = booking.items.map((item) => ({
        booking_item_id: item.id,
        actual_weight: parseFloat(weights[item.id] || '0'),
      }));

      const res = await fetch(`/api/admin/bookings/${booking.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      onComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to complete booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-on-surface">Complete Pickup</h3>
            <p className="text-sm text-on-surface-variant">
              #{booking.booking_number} — {booking.customer_name}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-surface-container transition">
            <X className="h-5 w-5 text-on-surface-variant" />
          </button>
        </div>

        {/* Items weight entry */}
        <div className="space-y-3">
          {booking.items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-outline-variant/15 bg-surface-container p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-on-surface">{item.scrap_item.name}</p>
                  <p className="text-xs text-on-surface-variant">
                    {item.scrap_item.category.name} · ₹{item.rate_applied}/{item.scrap_item.unit}
                  </p>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Est: {item.estimated_weight} {item.scrap_item.unit}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-primary" />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={weights[item.id] || ''}
                  onChange={(e) => setWeights({ ...weights, [item.id]: e.target.value })}
                  className="flex-1 rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-3 py-1.5 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                  placeholder="Actual weight"
                />
                <span className="text-xs text-on-surface-variant">{item.scrap_item.unit}</span>
              </div>
              <p className="mt-1 text-right text-xs font-medium text-primary">
                ₹{(parseFloat(weights[item.id] || '0') * item.rate_applied).toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-primary/10 p-4">
          <span className="text-sm font-medium text-on-surface">Total Payout</span>
          <span className="text-xl font-bold text-primary">₹{totalValue.toLocaleString('en-IN')}</span>
        </div>

        {error && (
          <p className="mt-3 text-sm text-error">{error}</p>
        )}

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-outline-variant/30 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-medium text-on-primary hover:bg-primary-container transition disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Mark Complete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────────── Main Pickups Page ────────── */
export function AdminPickupsClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');

  // Expanded row
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Complete modal
  const [completeBooking, setCompleteBooking] = useState<Booking | null>(null);

  // Action states
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (searchDebounced) params.set('search', searchDebounced);

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setBookings(json.data);
        setTotal(json.total ?? json.data.length);
      } else {
        setError(json.error);
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchDebounced]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusAdvance = async (booking: Booking) => {
    const nextStatus = NEXT_STATUS[booking.status];
    if (!nextStatus) return;

    setActionLoading(booking.id);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchBookings();
      }
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Manage Pickups</h1>
          <p className="text-sm text-on-surface-variant">{total} bookings found</p>
        </div>
        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container transition"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by booking #, phone, or name..."
            className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest py-2.5 pl-10 pr-4 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition',
                statusFilter === s
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/20 hover:bg-surface-container',
              )}
            >
              {s === 'all' ? 'All' : STATUS_META[s]?.label ?? s}
            </button>
          ))}
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-error-container/50 p-4 text-sm text-on-error-container">
          <AlertTriangle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Bookings list */}
      {!loading && !error && (
        <div className="space-y-3">
          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest py-16">
              <Filter className="h-10 w-10 text-on-surface-variant/40" />
              <p className="text-sm text-on-surface-variant">No bookings match your filters</p>
            </div>
          ) : (
            bookings.map((b) => {
              const isExpanded = expandedId === b.id;
              const nextStatus = NEXT_STATUS[b.status];

              return (
                <div
                  key={b.id}
                  className="overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-lowest shadow-sm transition hover:shadow-md"
                >
                  {/* Row header */}
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : b.id)}
                    className="flex w-full items-center gap-4 p-4 text-left"
                  >
                    {/* Status dot */}
                    <div className={cn('h-2.5 w-2.5 rounded-full shrink-0', STATUS_META[b.status]?.color)} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-medium text-primary">
                          #{b.booking_number}
                        </span>
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium',
                            STATUS_META[b.status]?.bgLight,
                          )}
                        >
                          {STATUS_META[b.status]?.label}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-sm font-medium text-on-surface">
                        {b.customer_name}
                      </p>
                    </div>

                    <div className="hidden text-right sm:block">
                      <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(b.pickup_date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                      {b.slot && (
                        <p className="text-[10px] text-on-surface-variant/70">{b.slot.label}</p>
                      )}
                    </div>

                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-semibold text-on-surface">
                        {b.estimated_value ? `₹${Number(b.estimated_value).toLocaleString('en-IN')}` : '—'}
                      </p>
                      <p className="text-[10px] text-on-surface-variant">est. value</p>
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-on-surface-variant" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-on-surface-variant" />
                    )}
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-outline-variant/15 bg-surface-container/30 p-4 space-y-4">
                      {/* Customer details */}
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
                        <div>
                          <p className="text-xs font-medium text-on-surface-variant">Phone</p>
                          <p className="text-on-surface">{b.customer_phone}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-on-surface-variant">Address</p>
                          <p className="text-on-surface">
                            {b.address_line_1}
                            {b.address_line_2 ? `, ${b.address_line_2}` : ''}, {b.city} — {b.pincode}
                          </p>
                        </div>
                        {b.customer_notes && (
                          <div className="sm:col-span-2">
                            <p className="text-xs font-medium text-on-surface-variant">Notes</p>
                            <p className="text-on-surface">{b.customer_notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Items */}
                      <div>
                        <p className="mb-2 text-xs font-medium text-on-surface-variant">Items</p>
                        <div className="space-y-1.5">
                          {b.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between rounded-lg bg-surface-container-lowest px-3 py-2 text-sm"
                            >
                              <div>
                                <span className="font-medium text-on-surface">{item.scrap_item.name}</span>
                                <span className="ml-1.5 text-xs text-on-surface-variant">
                                  ({item.scrap_item.category.name})
                                </span>
                              </div>
                              <div className="text-right text-xs">
                                <p className="text-on-surface">
                                  {item.actual_weight ?? item.estimated_weight} {item.scrap_item.unit}
                                  {' × ₹'}{item.rate_applied}
                                </p>
                                <p className="font-medium text-primary">₹{item.subtotal}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {nextStatus && (
                          <button
                            onClick={() => handleStatusAdvance(b)}
                            disabled={actionLoading === b.id}
                            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-container transition disabled:opacity-50"
                          >
                            {actionLoading === b.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <ArrowRight className="h-3.5 w-3.5" />
                            )}
                            Move to {STATUS_META[nextStatus]?.label}
                          </button>
                        )}

                        {b.status === 'scheduled' && (
                          <button
                            onClick={() => setCompleteBooking(b)}
                            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition"
                          >
                            <Scale className="h-3.5 w-3.5" />
                            Record Weights & Complete
                          </button>
                        )}

                        {['pending', 'confirmed', 'scheduled'].includes(b.status) && (
                          <button
                            onClick={async () => {
                              setActionLoading(b.id);
                              await fetch(`/api/admin/bookings/${b.id}/status`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: 'cancelled', notes: 'Cancelled by admin' }),
                              });
                              setActionLoading(null);
                              fetchBookings();
                            }}
                            className="flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                          >
                            <X className="h-3.5 w-3.5" />
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Complete modal */}
      {completeBooking && (
        <CompletePickupModal
          booking={completeBooking}
          onClose={() => setCompleteBooking(null)}
          onComplete={() => {
            setCompleteBooking(null);
            fetchBookings();
          }}
        />
      )}
    </div>
  );
}
