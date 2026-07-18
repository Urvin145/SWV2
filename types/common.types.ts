/**
 * Common TypeScript Types
 * Shared type definitions used across the Scrapwala application.
 */

/** Generic API response wrapper */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

/** Pagination metadata */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Paginated API response */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/** Booking status enum matching database */
export type BookingStatus = 'pending' | 'confirmed' | 'scheduled' | 'completed' | 'cancelled';

/** Customer type enum */
export type CustomerType =
  | 'household'
  | 'apartment'
  | 'corporate'
  | 'office'
  | 'shop'
  | 'factory';

/** Status badge variant mapping */
export const BOOKING_STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' }
> = {
  pending: { label: 'Pending', variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'default' },
  scheduled: { label: 'Scheduled', variant: 'secondary' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
};
