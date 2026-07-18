/**
 * Order Service
 * Supabase queries for fetching orders by phone, booking number, or ID.
 */

export interface OrderSummary {
  id: string;
  booking_number: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  pickup_date: string;
  estimated_value: number | null;
  actual_value: number | null;
  created_at: string;
  slot: {
    id: string;
    label: string;
    start_time: string;
    end_time: string;
  };
}

export interface OrderDetail {
  booking: OrderSummary & {
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state: string;
    pincode: string;
    weight_total: number | null;
    customer_notes: string | null;
    cancellation_reason: string | null;
    confirmed_at: string | null;
    completed_at: string | null;
    cancelled_at: string | null;
  };
  items: {
    id: string;
    estimated_weight: number;
    actual_weight: number | null;
    rate_applied: number;
    subtotal: number;
    scrap_item: {
      name: string;
      unit: string;
      image_url: string | null;
    };
  }[];
  statusLogs: {
    id: string;
    previous_status: string | null;
    new_status: string;
    notes: string | null;
    created_at: string;
  }[];
}

/**
 * Fetch orders by phone number or booking number.
 */
export async function fetchOrders(params: { phone?: string; number?: string }): Promise<OrderSummary[]> {
  const searchParams = new URLSearchParams();
  if (params.phone) searchParams.set('phone', params.phone);
  if (params.number) searchParams.set('number', params.number);

  const response = await fetch(`/api/bookings?${searchParams.toString()}`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to fetch orders');
  }

  return json.data;
}

/**
 * Fetch full order details by ID.
 */
export async function fetchOrderById(id: string): Promise<OrderDetail> {
  const response = await fetch(`/api/bookings/${id}`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Order not found');
  }

  return json.data;
}

/**
 * Cancel a booking.
 */
export async function cancelOrder(id: string, reason?: string): Promise<void> {
  const response = await fetch(`/api/bookings/${id}/cancel`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });

  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error || 'Failed to cancel booking');
  }
}
