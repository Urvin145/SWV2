/**
 * AdminDashboardClient
 * Full admin dashboard with KPI cards, status ring chart,
 * category progress bars, and recent bookings table.
 */

'use client';

import { useEffect, useState } from 'react';
import {
  Package,
  IndianRupee,
  TrendingUp,
  Truck,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

/* ────────── Types ────────── */
interface StatsData {
  totalBookings: number;
  statusCounts: Record<string, number>;
  totalRevenue: number;
  todayPickups: number;
  categoryStats: Record<string, number>;
  recent: {
    id: string;
    booking_number: string;
    customer_name: string;
    status: string;
    pickup_date: string;
    estimated_value: number | null;
    created_at: string;
  }[];
}

/* ────────── Status color map ────────── */
const STATUS_META: Record<string, { color: string; label: string; ring: string }> = {
  pending: { color: 'bg-amber-100 text-amber-700', label: 'Pending', ring: '#F59E0B' },
  confirmed: { color: 'bg-sky-100 text-sky-700', label: 'Confirmed', ring: '#0EA5E9' },
  scheduled: { color: 'bg-violet-100 text-violet-700', label: 'Scheduled', ring: '#8B5CF6' },
  completed: { color: 'bg-emerald-100 text-emerald-700', label: 'Completed', ring: '#10B981' },
  cancelled: { color: 'bg-red-100 text-red-700', label: 'Cancelled', ring: '#EF4444' },
};

/* ────────── SVG Ring Chart ────────── */
function StatusRing({ statusCounts, total }: { statusCounts: Record<string, number>; total: number }) {
  const size = 200;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const statuses = ['completed', 'scheduled', 'confirmed', 'pending', 'cancelled'];
  let cumulativeOffset = 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-container-high)"
          strokeWidth={strokeWidth}
        />
        {statuses.map((status) => {
          const count = statusCounts[status] ?? 0;
          if (count === 0) return null;
          const fraction = count / Math.max(total, 1);
          const dashLength = fraction * circumference;
          const gap = circumference - dashLength;
          const offset = cumulativeOffset;
          cumulativeOffset += dashLength;

          return (
            <circle
              key={status}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={STATUS_META[status]?.ring ?? '#999'}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${gap}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              className="transition-all duration-700"
            />
          );
        })}
        {/* Center text */}
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          className="rotate-90 origin-center fill-on-surface text-2xl font-bold"
          style={{ transformOrigin: `${size / 2}px ${size / 2}px` }}
        >
          {total}
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3">
        {statuses.map((s) => (
          <div key={s} className="flex items-center gap-1.5 text-xs">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: STATUS_META[s]?.ring }}
            />
            <span className="text-on-surface-variant">
              {STATUS_META[s]?.label} ({statusCounts[s] ?? 0})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────── Category Bar ────────── */
function CategoryBars({ stats }: { stats: Record<string, number> }) {
  const entries = Object.entries(stats).sort((a, b) => b[1] - a[1]);
  const max = entries.length > 0 ? entries[0][1] : 1;

  if (entries.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-on-surface-variant">
        No category data yet
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map(([name, count]) => (
        <div key={name}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-on-surface">{name}</span>
            <span className="text-on-surface-variant">{count} items</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-surface-container-high">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary-fixed-dim transition-all duration-700"
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ────────── Main Dashboard ────────── */
export function AdminDashboardClient() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/stats');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error || 'Failed to load stats');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <AlertTriangle className="h-10 w-10 text-tertiary-highlight" />
        <p className="text-on-surface-variant">{error}</p>
        <button
          onClick={fetchStats}
          className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-on-primary hover:bg-primary-container transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const kpiCards = [
    {
      label: 'Total Bookings',
      value: data.totalBookings,
      icon: Package,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Revenue Earned',
      value: `₹${data.totalRevenue.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'text-tertiary',
      bg: 'bg-tertiary-highlight/15',
    },
    {
      label: "Today's Pickups",
      value: data.todayPickups,
      icon: Truck,
      color: 'text-sky-600',
      bg: 'bg-sky-100',
    },
    {
      label: 'Completion Rate',
      value:
        data.totalBookings > 0
          ? `${Math.round(((data.statusCounts.completed ?? 0) / data.totalBookings) * 100)}%`
          : '—',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Dashboard</h1>
          <p className="text-sm text-on-surface-variant">
            Overview of your scrap collection operations
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container transition"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold text-on-surface">{card.value}</p>
                </div>
                <div className={`rounded-xl p-2.5 ${card.bg}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Status Distribution Ring */}
        <div className="rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-on-surface">Status Distribution</h2>
          <StatusRing statusCounts={data.statusCounts} total={data.totalBookings} />
        </div>

        {/* Category Breakdown */}
        <div className="rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-on-surface">Category Breakdown</h2>
          <CategoryBars stats={data.categoryStats} />
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-on-surface">Recent Bookings</h2>
        {data.recent.length === 0 ? (
          <p className="py-8 text-center text-sm text-on-surface-variant">No bookings yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/20">
                  <th className="pb-3 text-left font-medium text-on-surface-variant">Booking #</th>
                  <th className="pb-3 text-left font-medium text-on-surface-variant">Customer</th>
                  <th className="pb-3 text-left font-medium text-on-surface-variant">Pickup Date</th>
                  <th className="pb-3 text-left font-medium text-on-surface-variant">Est. Value</th>
                  <th className="pb-3 text-left font-medium text-on-surface-variant">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {data.recent.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-container/50 transition">
                    <td className="py-3 font-mono text-xs text-primary font-medium">
                      {b.booking_number}
                    </td>
                    <td className="py-3 text-on-surface">{b.customer_name}</td>
                    <td className="py-3 text-on-surface-variant">
                      {new Date(b.pickup_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 font-medium text-on-surface">
                      {b.estimated_value ? `₹${Number(b.estimated_value).toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_META[b.status]?.color ?? 'bg-gray-100 text-gray-700'}`}
                      >
                        {STATUS_META[b.status]?.label ?? b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
