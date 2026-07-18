/**
 * OrderTimeline Component
 * Visual timeline showing booking status changes with timestamps.
 */

'use client';

import { cn } from '@/lib/utils';

interface StatusLog {
  id: string;
  previous_status: string | null;
  new_status: string;
  notes: string | null;
  created_at: string;
}

const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: 'bg-tertiary-highlight', label: 'Booking Created' },
  confirmed: { color: 'bg-primary', label: 'Confirmed' },
  scheduled: { color: 'bg-secondary', label: 'Scheduled for Pickup' },
  completed: { color: 'bg-primary', label: 'Pickup Completed' },
  cancelled: { color: 'bg-error', label: 'Cancelled' },
};

interface OrderTimelineProps {
  logs: StatusLog[];
}

export function OrderTimeline({ logs }: OrderTimelineProps) {
  if (logs.length === 0) return null;

  return (
    <div className="space-y-0">
      {logs.map((log, index) => {
        const config = statusConfig[log.new_status] ?? { color: 'bg-outline', label: log.new_status };
        const isLast = index === logs.length - 1;
        const date = new Date(log.created_at);

        return (
          <div key={log.id} className="flex gap-4">
            {/* Timeline line + dot */}
            <div className="flex flex-col items-center">
              <div className={cn('h-3 w-3 shrink-0 rounded-full', config.color, isLast && 'ring-4 ring-opacity-20', isLast && log.new_status === 'completed' && 'ring-primary/20', isLast && log.new_status === 'cancelled' && 'ring-error/20')} />
              {!isLast && <div className="h-full w-0.5 bg-outline-variant/20" />}
            </div>

            {/* Content */}
            <div className={cn('pb-6', isLast && 'pb-0')}>
              <p className="text-sm font-semibold text-on-surface">{config.label}</p>
              {log.notes && (
                <p className="mt-0.5 text-xs text-on-surface-variant">{log.notes}</p>
              )}
              <p className="mt-1 text-xs text-outline">
                {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                {' at '}
                {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
