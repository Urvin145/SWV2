/**
 * Booking Store (Zustand)
 * Manages the 4-step booking wizard state.
 *
 * Steps:
 * 1. Scrap Selection — category + items (select only, no weight)
 * 2. Approx Price Range — user picks an estimated price range
 * 3. Schedule — date + time slot
 * 4. Customer Details — name, phone, address, notes
 * 5. Review & Confirm — summary + submit
 */

import { create } from 'zustand';

export interface SelectedScrapItem {
  scrap_item_id: string;
  name: string;
  slug: string;
  categoryName: string;
  unit: string;
  estimated_weight: number;
  rate_applied: number;
  emoji: string;
}

export interface ScheduleData {
  pickup_date: string; // YYYY-MM-DD
  slot_id: string;
  slot_label: string;
}

export interface CustomerData {
  customer_name: string;
  customer_phone: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  pincode: string;
  customer_notes: string;
}

/** Approx price range options */
export const PRICE_RANGES = [
  { label: '₹100 – ₹500', min: 100, max: 500 },
  { label: '₹500 – ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 – ₹3,000', min: 1000, max: 3000 },
  { label: '₹3,000 – ₹5,000', min: 3000, max: 5000 },
  { label: '₹5,000 – ₹10,000', min: 5000, max: 10000 },
  { label: '₹10,000+', min: 10000, max: 50000 },
] as const;

export interface PriceRange {
  label: string;
  min: number;
  max: number;
}

interface BookingStore {
  /** Current wizard step (1-4) */
  currentStep: number;

  /** Step 1: Selected scrap items */
  selectedItems: SelectedScrapItem[];

  /** Approx price range selected by user */
  priceRange: PriceRange | null;

  /** Step 2: Schedule */
  schedule: ScheduleData | null;

  /** Step 3: Customer details */
  customer: CustomerData;

  /** Computed estimated value (kept for backward compatibility) */
  estimatedValue: number;

  /** Actions */
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  /** Step 1 actions */
  addItem: (item: SelectedScrapItem) => void;
  removeItem: (scrapItemId: string) => void;
  updateItemWeight: (scrapItemId: string, weight: number) => void;
  clearItems: () => void;

  /** Price range action */
  setPriceRange: (range: PriceRange | null) => void;

  /** Step 2 actions */
  setSchedule: (schedule: ScheduleData) => void;

  /** Step 3 actions */
  setCustomer: (data: Partial<CustomerData>) => void;

  /** Reset entire wizard */
  resetWizard: () => void;
}

const initialCustomer: CustomerData = {
  customer_name: '',
  customer_phone: '',
  address_line_1: '',
  address_line_2: '',
  city: 'Bangalore',
  state: 'Karnataka',
  pincode: '',
  customer_notes: '',
};

export const useBookingStore = create<BookingStore>((set, get) => ({
  currentStep: 1,
  selectedItems: [],
  priceRange: null,
  schedule: null,
  customer: { ...initialCustomer },
  estimatedValue: 0,

  setStep: (step) => set({ currentStep: Math.max(1, Math.min(4, step)) }),
  nextStep: () => set((s) => ({ currentStep: Math.min(4, s.currentStep + 1) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(1, s.currentStep - 1) })),

  addItem: (item) =>
    set((s) => {
      const exists = s.selectedItems.find((i) => i.scrap_item_id === item.scrap_item_id);
      if (exists) return s;
      const newItems = [...s.selectedItems, item];
      return { selectedItems: newItems };
    }),

  removeItem: (scrapItemId) =>
    set((s) => {
      const newItems = s.selectedItems.filter((i) => i.scrap_item_id !== scrapItemId);
      return { selectedItems: newItems };
    }),

  updateItemWeight: (scrapItemId, weight) =>
    set((s) => {
      const newItems = s.selectedItems.map((i) =>
        i.scrap_item_id === scrapItemId ? { ...i, estimated_weight: weight } : i,
      );
      return { selectedItems: newItems };
    }),

  clearItems: () => set({ selectedItems: [], estimatedValue: 0, priceRange: null }),

  setPriceRange: (range) =>
    set({
      priceRange: range,
      estimatedValue: range ? (range.min + range.max) / 2 : 0,
    }),

  setSchedule: (schedule) => set({ schedule }),

  setCustomer: (data) =>
    set((s) => ({ customer: { ...s.customer, ...data } })),

  resetWizard: () =>
    set({
      currentStep: 1,
      selectedItems: [],
      priceRange: null,
      schedule: null,
      customer: { ...initialCustomer },
      estimatedValue: 0,
    }),
}));
