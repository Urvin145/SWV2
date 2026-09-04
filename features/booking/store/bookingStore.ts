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

/** Approx scrap weight range options (in kg) - preserved for backwards compatibility */
export const WEIGHT_RANGES = [
  { label: '1 – 10 kg', min: 1, max: 10 },
  { label: '10 – 100 kg', min: 10, max: 100 },
  { label: '100 – 500 kg', min: 100, max: 500 },
  { label: '500+ kg', min: 500, max: 2000 },
] as const;

export type TruckSizeId = 'micro' | 'mini' | 'medium' | 'large';

export interface TruckOption {
  id: TruckSizeId;
  title: string;
  vehicleType: string;
  subtitle: string;
  rangeLabel: string;
  minWeight: number;
  maxWeight: number;
  badge?: string;
}

export const TRUCK_OPTIONS: TruckOption[] = [
  {
    id: 'micro',
    title: '2-Wheeler / Bike',
    vehicleType: 'Bike / Doorstep Porter Bag',
    subtitle: 'Quick bag pickup, books, papers, small e-waste',
    rangeLabel: '1 – 10 kg',
    minWeight: 1,
    maxWeight: 10,
    badge: 'Light Bag',
  },
  {
    id: 'mini',
    title: 'Mini Truck',
    vehicleType: 'Tata Ace / 3-Wheeler Tempo',
    subtitle: 'Daily household scrap, cartons, multiple bags',
    rangeLabel: '10 – 100 kg',
    minWeight: 10,
    maxWeight: 100,
    badge: 'Most Popular',
  },
  {
    id: 'medium',
    title: 'Medium Truck',
    vehicleType: 'Tata 407 / 1.5T Pickup',
    subtitle: 'Apartment societies, office cleanouts, heavy appliances',
    rangeLabel: '100 – 500 kg',
    minWeight: 100,
    maxWeight: 500,
    badge: 'Societies & Offices',
  },
  {
    id: 'large',
    title: 'Large Truck',
    vehicleType: 'Heavy Commercial / Canter 3T+',
    subtitle: 'Factories, warehouse cleanout, bulk industrial metals',
    rangeLabel: '500+ kg',
    minWeight: 500,
    maxWeight: 2000,
    badge: 'Industrial & Bulk',
  },
];

export interface WeightRange {
  label: string;
  min: number;
  max: number;
}

interface BookingStore {
  /** Current wizard step (1-4) */
  currentStep: number;

  /** Step 1: Selected scrap items */
  selectedItems: SelectedScrapItem[];

  /** Step 1: Vehicle / Truck size selected by user */
  truckSize: TruckOption | null;

  /** Approx weight range selected by user (synced with truckSize) */
  weightRange: WeightRange | null;

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

  /** Vehicle / Truck size action */
  setTruckSize: (option: TruckOption | null) => void;

  /** Weight range action (backwards compatibility) */
  setWeightRange: (range: WeightRange | null) => void;

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
  city: 'Ahmedabad',
  state: 'Gujarat',
  pincode: '',
  customer_notes: '',
};

export const useBookingStore = create<BookingStore>((set, get) => ({
  currentStep: 1,
  selectedItems: [],
  truckSize: null,
  weightRange: null,
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

  clearItems: () => set({ selectedItems: [], estimatedValue: 0, weightRange: null, truckSize: null }),

  setTruckSize: (option) =>
    set({
      truckSize: option,
      weightRange: option
        ? { label: option.rangeLabel, min: option.minWeight, max: option.maxWeight }
        : null,
      estimatedValue: option ? (option.minWeight + option.maxWeight) / 2 : 0,
    }),

  setWeightRange: (range) =>
    set({
      weightRange: range,
      estimatedValue: range ? (range.min + range.max) / 2 : 0,
    }),

  setSchedule: (schedule) => set({ schedule }),

  setCustomer: (data) =>
    set((s) => ({ customer: { ...s.customer, ...data } })),

  resetWizard: () =>
    set({
      currentStep: 1,
      selectedItems: [],
      truckSize: null,
      weightRange: null,
      schedule: null,
      customer: { ...initialCustomer },
      estimatedValue: 0,
    }),
}));
