/**
 * useOrderDetails Hook
 * TanStack Query hook for fetching a single order's full details.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchOrderById, type OrderDetail } from '@/features/orders/services/orderService';

export function useOrderDetails(id: string | null) {
  return useQuery<OrderDetail>({
    queryKey: ['order', id],
    queryFn: () => fetchOrderById(id!),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}
