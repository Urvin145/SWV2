/**
 * StepIndicator Component
 * Visual progress bar showing the 4 booking wizard steps.
 * Active step is highlighted, completed steps show a checkmark.
 */

'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { number: 1, label: 'Select Scrap' },
  { number: 2, label: 'Schedule' },
  { number: 3, label: 'Your Details' },
  { number: 4, label: 'Review' },
];

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.number} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-300',
                    isCompleted && 'bg-primary text-on-primary shadow-md shadow-primary/20',
                    isActive && 'bg-primary text-on-primary shadow-lg shadow-primary/30 ring-4 ring-primary/20',
                    !isCompleted && !isActive && 'bg-surface-container text-on-surface-variant',
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : step.number}
                </div>
                {/* Label */}
                <span
                  className={cn(
                    'mt-2 text-xs font-medium transition-colors',
                    isActive ? 'text-primary' : isCompleted ? 'text-on-surface' : 'text-on-surface-variant',
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="mx-2 mb-6 h-0.5 flex-1">
                  <div
                    className={cn(
                      'h-full rounded-full transition-colors duration-300',
                      isCompleted ? 'bg-primary' : 'bg-outline-variant/30',
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
