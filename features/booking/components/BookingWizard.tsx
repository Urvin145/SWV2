/**
 * BookingWizard Component
 * Assembles the 4-step booking wizard with step indicator.
 * Renders the active step based on Zustand store state.
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { StepIndicator } from './StepIndicator';
import { ScrapSelector } from './ScrapSelector';
import { SchedulePicker } from './SchedulePicker';
import { DetailsForm } from './DetailsForm';
import { BookingPreview } from './BookingPreview';
import { useBookingStore } from '@/features/booking/store/bookingStore';

const stepComponents: Record<number, React.ComponentType> = {
  1: ScrapSelector,
  2: SchedulePicker,
  3: DetailsForm,
  4: BookingPreview,
};

const stepTitles: Record<number, string> = {
  1: 'What scrap do you have?',
  2: 'When should we pick up?',
  3: 'Tell us about yourself',
  4: 'Review & Confirm',
};

export function BookingWizard() {
  const { currentStep } = useBookingStore();
  const StepComponent = stepComponents[currentStep] || ScrapSelector;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Step Progress */}
      <StepIndicator currentStep={currentStep} />

      {/* Step Title */}
      <h2 className="mb-6 text-xl font-bold text-on-surface sm:text-2xl">
        {stepTitles[currentStep]}
      </h2>

      {/* Step Content with transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <StepComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
