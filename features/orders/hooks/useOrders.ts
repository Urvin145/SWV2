/**
 * useOrders Hook
 * TanStack Query hook for fetching orders by phone or booking number.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchOrders, type OrderSummary } from '@/features/orders/services/orderService';

export function useOrders(params: { phone?: string; number?: string } | null) {
  return useQuery<OrderSummary[]>({
    queryKey: ['orders', params?.phone, params?.number],
    queryFn: () => fetchOrders(params!),
    enabled: !!params && (!!params.phone || !!params.number),
    staleTime: 2 * 60 * 1000,
  });
}
