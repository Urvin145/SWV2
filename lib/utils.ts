/**
 * Utility Functions
 * Core utility functions used across the Scrapwala application.
 * Includes className merging (cn), currency formatting, and other helpers.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with conflict resolution.
 * Combines clsx (conditional classes) with tailwind-merge (deduplication).
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-primary text-white', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as Indian Rupee currency.
 *
 * @example
 * formatCurrency(1500) // "₹1,500"
 * formatCurrency(25.5) // "₹25.50"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a weight value with appropriate unit.
 *
 * @example
 * formatWeight(2.5) // "2.5 kg"
 */
export function formatWeight(weight: number, unit: string = 'kg'): string {
  return `${weight} ${unit}`;
}

/**
 * Format a date string to a readable format.
 *
 * @example
 * formatDate('2026-07-16') // "16 Jul 2026"
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Format a date string to a relative time string.
 *
 * @example
 * formatRelativeDate('2026-07-15T10:00:00Z') // "Yesterday"
 */
export function formatRelativeDate(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(date);
}

/**
 * Format a time string (HH:mm) to 12-hour format.
 *
 * @example
 * formatTime('14:30') // "2:30 PM"
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Generate a booking number with format: SW-YYYYMMDD-NNN
 */
export function generateBookingNumber(sequence: number = 1): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const seqStr = sequence.toString().padStart(3, '0');
  return `SW-${dateStr}-${seqStr}`;
}

/**
 * Truncate a string to a maximum length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}
