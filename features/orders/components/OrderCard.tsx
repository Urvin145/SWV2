/**
 * OrderCard Component
 * Compact card showing order summary: booking number, status, date, items count, value.
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import { type BookingStatus } from '@/types/common.types';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { OrderSummary } from '@/features/orders/services/orderService';

interface OrderCardProps {
  order: OrderSummary;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Link
        href={`/orders/${order.id}`}
        className="group block rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-5 shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-bold text-primary">{order.booking_number}</span>
          <StatusBadge status={order.status as BookingStatus} />
        </div>

        <div className="mb-3 flex items-center gap-2 text-sm text-on-surface-variant">
          <CalendarDays className="h-4 w-4" />
          <span>{formatDate(order.pickup_date)}</span>
          <span className="text-outline-variant">•</span>
          <span>{order.slot?.label}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-on-surface-variant">Estimated Value</p>
            <p className="text-lg font-bold text-on-surface">
              {order.estimated_value ? formatCurrency(order.estimated_value) : '—'}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            View Details
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
