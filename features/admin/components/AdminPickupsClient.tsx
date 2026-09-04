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
  truck_size?: string | null;
  estimated_price_range?: string | null;
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
  const [searchQuery, setSearchQuery] = useState('');

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
    return sum + (isNaN(w) ? 0 : w * item.rate_applied);
  }, 0);

  const totalKg = booking.items.reduce((sum, item) => {
    if (item.scrap_item.unit === 'kg') {
      const w = parseFloat(weights[item.id] || '0');
      return sum + (isNaN(w) ? 0 : w);
    }
    return sum;
  }, 0);

  const itemsWeighedCount = booking.items.filter((item) => {
    const w = parseFloat(weights[item.id] || '0');
    return !isNaN(w) && w > 0;
  }).length;

  const filteredItems = booking.items.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.scrap_item.name.toLowerCase().includes(q) ||
      item.scrap_item.category.name.toLowerCase().includes(q)
    );
  });

  const handleFillAllEstimates = () => {
    const updated: Record<string, string> = {};
    for (const item of booking.items) {
      updated[item.id] = String(item.estimated_weight);
    }
    setWeights(updated);
  };

  const handleClearAll = () => {
    const updated: Record<string, string> = {};
    for (const item of booking.items) {
      updated[item.id] = '0';
    }
    setWeights(updated);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const items = booking.items.map((item) => ({
        booking_item_id: item.id,
        actual_weight: parseFloat(weights[item.id] || '0') || 0,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/60 p-3 sm:p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="shrink-0 p-4 sm:p-5 border-b border-outline-variant/15 bg-surface-container/30 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-on-surface">Record Doorstep Weights</h3>
              <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-semibold">
                {booking.items.length} {booking.items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              #{booking.booking_number} — <span className="font-semibold text-on-surface">{booking.customer_name}</span> ({booking.customer_phone})
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-surface-container transition text-on-surface-variant hover:text-on-surface"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Toolbar (Search & Bulk Fill) */}
        <div className="shrink-0 px-4 sm:px-5 py-2.5 bg-surface-container-lowest border-b border-outline-variant/10 flex flex-wrap items-center justify-between gap-2">
          {booking.items.length > 3 ? (
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-on-surface-variant" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scrap item..."
                className="w-full rounded-lg border border-outline-variant/20 bg-surface-container/40 pl-8 pr-3 py-1 text-xs text-on-surface outline-none focus:border-primary focus:bg-surface-container-lowest"
              />
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant">
              Enter measured weights from digital scale for each scrap item below:
            </p>
          )}

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleFillAllEstimates}
              className="rounded-md border border-outline-variant/20 bg-surface-container/40 px-2.5 py-1 text-[11px] font-medium text-on-surface hover:bg-surface-container transition"
            >
              Copy All Estimates
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="rounded-md border border-outline-variant/20 bg-surface-container/40 px-2 py-1 text-[11px] font-medium text-on-surface-variant hover:text-error hover:bg-surface-container transition"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Scrollable Items Weight Entry Bar */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5 min-h-0">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-sm text-on-surface-variant">
              No scrap items match &ldquo;{searchQuery}&rdquo;
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const currentWeight = weights[item.id] ?? '';
              const numWeight = parseFloat(currentWeight || '0');
              const subtotal = (isNaN(numWeight) ? 0 : numWeight) * item.rate_applied;

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-outline-variant/15 bg-surface-container/40 p-3 sm:p-3.5 transition hover:border-outline-variant/40"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Item Information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-on-surface-variant">#{idx + 1}</span>
                        <span className="font-semibold text-sm text-on-surface truncate">{item.scrap_item.name}</span>
                        <span className="rounded-md bg-surface-container-high px-2 py-0.5 text-[10px] font-medium text-on-surface-variant">
                          {item.scrap_item.category.name}
                        </span>
                        <span className="rounded-md bg-primary/10 text-primary px-2 py-0.5 text-[11px] font-bold">
                          ₹{item.rate_applied}/{item.scrap_item.unit}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-on-surface-variant">
                        <span>Customer Est: <strong className="text-on-surface">{item.estimated_weight} {item.scrap_item.unit}</strong></span>
                        {parseFloat(currentWeight || '0') !== item.estimated_weight && (
                          <button
                            type="button"
                            onClick={() => setWeights({ ...weights, [item.id]: String(item.estimated_weight) })}
                            className="text-[11px] font-semibold text-primary hover:underline"
                          >
                            (Use Est)
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Weight Input Bar & Real-time Subtotal */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t border-outline-variant/10 sm:border-0">
                      <div className="relative flex items-center">
                        <div className="pointer-events-none absolute left-2.5 flex items-center text-primary">
                          <Scale className="h-4 w-4" />
                        </div>
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={currentWeight}
                          onWheel={(e) => (e.target as HTMLInputElement).blur()}
                          onChange={(e) => setWeights({ ...weights, [item.id]: e.target.value })}
                          className="w-32 sm:w-36 rounded-lg border border-outline-variant/30 bg-surface-container-lowest pl-8 pr-10 py-1.5 text-sm font-semibold text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          placeholder="0.0"
                        />
                        <span className="pointer-events-none absolute right-2.5 text-xs font-semibold text-on-surface-variant">
                          {item.scrap_item.unit}
                        </span>
                      </div>

                      <div className="w-20 text-right">
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Subtotal</p>
                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{subtotal.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sticky Modal Footer with Live Grand Total */}
        <div className="shrink-0 p-4 sm:p-5 border-t border-outline-variant/15 bg-surface-container/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 text-xs text-on-surface-variant">
              <span className="rounded-md bg-surface-container px-2 py-1 font-semibold text-on-surface">
                {itemsWeighedCount} of {booking.items.length} Weighed
              </span>
              {totalKg > 0 && (
                <span>
                  Total Weight: <strong className="text-on-surface font-bold">{totalKg.toFixed(1)} kg</strong>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 sm:text-right">
              <span className="text-xs font-medium text-on-surface-variant">Total Doorstep Payout:</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                ₹{totalValue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {error && (
            <p className="mb-3 text-sm text-error font-medium">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-outline-variant/30 py-2.5 text-sm font-medium text-on-surface-variant hover:bg-surface-container transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-50 shadow-md shadow-emerald-600/20"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Save &amp; Complete Pickup
            </button>
          </div>
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
      } else {
        alert(json.error || 'Failed to update booking status');
      }
    } catch {
      alert('Network error while updating booking status');
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
                      {b.actual_value != null ? (
                        <>
                          <p className="text-base font-extrabold text-emerald-600">
                            ₹{Number(b.actual_value).toLocaleString('en-IN')}
                          </p>
                          <p className="text-[10px] font-semibold text-emerald-700">Total Payout</p>
                        </>
                      ) : b.estimated_value && b.estimated_value > 50 ? (
                        <>
                          <p className="text-sm font-semibold text-on-surface">
                            ₹{Number(b.estimated_value).toLocaleString('en-IN')}
                          </p>
                          <p className="text-[10px] text-on-surface-variant">est. value</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-primary">
                            {b.truck_size ? b.truck_size.replace(/\(.*\)/, '').trim() : 'Doorstep Weigh'}
                          </p>
                          <p className="text-[10px] text-on-surface-variant">
                            {b.estimated_price_range ? b.estimated_price_range : 'Pending Weighing'}
                          </p>
                        </>
                      )}
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
                      {/* Customer details & Vehicle */}
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
                        <div>
                          <p className="text-xs font-medium text-on-surface-variant">Phone</p>
                          <p className="text-on-surface">{b.customer_phone}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-on-surface-variant">Vehicle / Load Size</p>
                          <p className="font-semibold text-primary">{b.truck_size ?? b.estimated_price_range ?? 'Standard'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-on-surface-variant">Address</p>
                          <p className="text-on-surface">
                            {b.address_line_1}
                            {b.address_line_2 ? `, ${b.address_line_2}` : ''}, {b.city} — {b.pincode}
                          </p>
                        </div>
                        {b.customer_notes && (
                          <div className="sm:col-span-3">
                            <p className="text-xs font-medium text-on-surface-variant">Notes</p>
                            <p className="text-on-surface">{b.customer_notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Items & Total Calculation */}
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                            Items Breakdown ({b.items.length})
                          </p>
                          {b.status === 'completed' || b.actual_value != null ? (
                            <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 text-[11px] font-bold">
                              ✓ Digital Scales Weighed
                            </span>
                          ) : (
                            <span className="rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-0.5 text-[11px] font-bold">
                              Doorstep Weighing Pending
                            </span>
                          )}
                        </div>

                        <div className={cn('space-y-1.5', b.items.length > 5 && 'max-h-72 overflow-y-auto pr-1')}>
                          {b.items.map((item) => {
                            const isMeasured = item.actual_weight != null;
                            return (
                              <div
                                key={item.id}
                                className="flex items-center justify-between rounded-lg bg-surface-container-lowest px-3.5 py-2.5 text-sm border border-outline-variant/10"
                              >
                                <div>
                                  <span className="font-medium text-on-surface">{item.scrap_item.name}</span>
                                  <span className="ml-1.5 text-xs text-on-surface-variant">
                                    ({item.scrap_item.category.name})
                                  </span>
                                </div>
                                <div className="text-right text-xs">
                                  {isMeasured ? (
                                    <>
                                      <p className="text-on-surface font-medium">
                                        <span className="font-bold text-on-surface">{item.actual_weight} {item.scrap_item.unit}</span>
                                        {' × ₹'}{item.rate_applied}
                                      </p>
                                      <p className="font-extrabold text-emerald-600 text-sm">₹{Number(item.subtotal).toLocaleString('en-IN')}</p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="text-primary font-semibold">
                                        Rate: ₹{item.rate_applied} / {item.scrap_item.unit}
                                      </p>
                                      <p className="text-on-surface-variant text-[11px]">Doorstep digital weighing</p>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Calculation & Total Box */}
                        {b.status === 'completed' || b.actual_value != null ? (
                          <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/40 p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                              <div>
                                <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                                  Total Doorstep Calculation
                                </p>
                                <p className="text-xs text-on-surface-variant mt-1">
                                  {b.items
                                    .filter((i) => i.actual_weight != null)
                                    .map((i) => `${i.actual_weight} ${i.scrap_item.unit} × ₹${i.rate_applied} (₹${i.subtotal})`)
                                    .join(' + ')}
                                </p>
                                {b.weight_total ? (
                                  <p className="text-xs font-semibold text-on-surface mt-1.5">
                                    Total Weight: <span className="text-primary font-bold">{b.weight_total} kg</span>
                                  </p>
                                ) : null}
                              </div>
                              <div className="sm:text-right border-t border-emerald-200/60 dark:border-emerald-800/40 sm:border-0 pt-2 sm:pt-0">
                                <p className="text-xs font-medium text-emerald-900 dark:text-emerald-300">Total Payout Calculated</p>
                                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                  ₹{Number(b.actual_value ?? b.items.reduce((s, i) => s + (Number(i.subtotal) || 0), 0)).toLocaleString('en-IN')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3 rounded-xl bg-surface-container/60 border border-outline-variant/15 p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="text-xs">
                              <p className="font-bold text-on-surface">Doorstep Digital Scale Calculation</p>
                              <p className="text-on-surface-variant mt-0.5">
                                Rates are locked. Exact total payout will be calculated when the pickup agent records actual weights.
                              </p>
                            </div>
                            <div className="sm:text-right shrink-0">
                              <span className="inline-block rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                                Vehicle: {b.truck_size ?? b.estimated_price_range ?? 'Standard'}
                              </span>
                            </div>
                          </div>
                        )}
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
