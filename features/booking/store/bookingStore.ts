/**
 * Booking Store (Zustand)
 * Manages the 4-step booking wizard state.
 *
 * Steps:
 * 1. Scrap Selection — category + items with estimated weights
 * 2. Schedule — date + time slot
 * 3. Customer Details — name, phone, address, notes
 * 4. Review & Confirm — summary + submit
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

interface BookingStore {
  /** Current wizard step (1-4) */
  currentStep: number;

  /** Step 1: Selected scrap items */
  selectedItems: SelectedScrapItem[];

  /** Step 2: Schedule */
  schedule: ScheduleData | null;

  /** Step 3: Customer details */
  customer: CustomerData;

  /** Computed estimated value */
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
      return {
        selectedItems: newItems,
        estimatedValue: newItems.reduce((sum, i) => sum + i.estimated_weight * i.rate_applied, 0),
      };
    }),

  removeItem: (scrapItemId) =>
    set((s) => {
      const newItems = s.selectedItems.filter((i) => i.scrap_item_id !== scrapItemId);
      return {
        selectedItems: newItems,
        estimatedValue: newItems.reduce((sum, i) => sum + i.estimated_weight * i.rate_applied, 0),
      };
    }),

  updateItemWeight: (scrapItemId, weight) =>
    set((s) => {
      const newItems = s.selectedItems.map((i) =>
        i.scrap_item_id === scrapItemId ? { ...i, estimated_weight: weight } : i,
      );
      return {
        selectedItems: newItems,
        estimatedValue: newItems.reduce((sum, i) => sum + i.estimated_weight * i.rate_applied, 0),
      };
    }),

  clearItems: () => set({ selectedItems: [], estimatedValue: 0 }),

  setSchedule: (schedule) => set({ schedule }),

  setCustomer: (data) =>
    set((s) => ({ customer: { ...s.customer, ...data } })),

  resetWizard: () =>
    set({
      currentStep: 1,
      selectedItems: [],
      schedule: null,
      customer: { ...initialCustomer },
      estimatedValue: 0,
    }),
}));
