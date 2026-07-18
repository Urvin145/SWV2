/**
 * Step 2: SchedulePicker
 * Date picker (next 7 days) + time slot chips fetched from Supabase.
 */

'use client';

import { useState, useMemo } from 'react';
import { CalendarDays, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useSlots } from '@/features/booking/hooks/useSlots';
import { useBookingStore } from '@/features/booking/store/bookingStore';
import { cn } from '@/lib/utils';

/** Generate the next N days starting from today */
function getNextDays(count: number) {
  const days: { date: string; label: string; dayName: string; isToday: boolean }[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-IN', { weekday: 'short' });
    const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

    days.push({ date: dateStr, label, dayName, isToday: i === 0 });
  }
  return days;
}

export function SchedulePicker() {
  const { schedule, setSchedule, nextStep, prevStep } = useBookingStore();
  const [selectedDate, setSelectedDate] = useState(schedule?.pickup_date ?? '');
  const [selectedSlotId, setSelectedSlotId] = useState(schedule?.slot_id ?? '');

  const days = useMemo(() => getNextDays(7), []);
  const { data: slots = [], isLoading: slotsLoading } = useSlots(selectedDate || null);

  const selectedSlot = slots.find((s) => s.id === selectedSlotId);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlotId(''); // reset slot when date changes
  };

  const handleNext = () => {
    if (!selectedDate || !selectedSlotId || !selectedSlot) return;
    setSchedule({
      pickup_date: selectedDate,
      slot_id: selectedSlotId,
      slot_label: selectedSlot.label,
    });
    nextStep();
  };

  const canProceed = selectedDate && selectedSlotId;

  return (
    <div>
      {/* Date Selection */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2 text-on-surface">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Select Pickup Date</h3>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {days.map((day) => (
            <button
              key={day.date}
              onClick={() => handleDateSelect(day.date)}
              className={cn(
                'flex flex-col items-center rounded-xl border-2 px-3 py-3 text-center transition-all',
                selectedDate === day.date
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-outline-variant/15 bg-surface-container-lowest hover:border-primary/30',
              )}
            >
              <span className={cn('text-[10px] font-medium uppercase', selectedDate === day.date ? 'text-primary' : 'text-on-surface-variant')}>
                {day.isToday ? 'Today' : day.dayName}
              </span>
              <span className={cn('mt-0.5 text-lg font-bold', selectedDate === day.date ? 'text-primary' : 'text-on-surface')}>
                {day.label.split(' ')[0]}
              </span>
              <span className={cn('text-[10px]', selectedDate === day.date ? 'text-primary' : 'text-on-surface-variant')}>
                {day.label.split(' ')[1]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Time Slot Selection */}
      {selectedDate && (
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-on-surface">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Select Time Slot</h3>
          </div>

          {slotsLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-surface-container" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <p className="rounded-xl bg-surface-container p-4 text-center text-sm text-on-surface-variant">
              No slots available for this date. Please select another date.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => slot.is_available && setSelectedSlotId(slot.id)}
                  disabled={!slot.is_available}
                  className={cn(
                    'rounded-xl border-2 px-4 py-3 text-left transition-all',
                    selectedSlotId === slot.id
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : slot.is_available
                        ? 'border-outline-variant/15 bg-surface-container-lowest hover:border-primary/30'
                        : 'cursor-not-allowed border-outline-variant/10 bg-surface-container opacity-50',
                  )}
                >
                  <p className={cn('text-sm font-semibold', selectedSlotId === slot.id ? 'text-primary' : 'text-on-surface')}>
                    {slot.label}
                  </p>
                  <p className={cn('text-xs', slot.is_available ? 'text-on-surface-variant' : 'text-error')}>
                    {slot.is_available
                      ? `${slot.remaining} slot${slot.remaining !== 1 ? 's' : ''} remaining`
                      : 'Fully booked'}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between rounded-xl border border-outline-variant/15 bg-surface-container-lowest p-5">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 rounded-xl border border-outline-variant/20 px-6 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={cn(
            'flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold transition-all',
            canProceed
              ? 'bg-primary text-on-primary shadow-md shadow-primary/20 hover:bg-primary-container'
              : 'cursor-not-allowed bg-surface-container text-on-surface-variant',
          )}
        >
          Next: Your Details
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
