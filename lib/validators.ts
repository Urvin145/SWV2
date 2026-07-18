/**
 * Zod Validation Schemas
 * Reusable validation schemas used across the application.
 * Each feature may extend these with feature-specific schemas.
 */

import { z } from 'zod';

/** Indian phone number validation (10 digits, optionally prefixed with +91) */
export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be 10 digits')
  .max(13, 'Invalid phone number')
  .regex(/^(\+91)?[6-9]\d{9}$/, 'Enter a valid Indian phone number');

/** Basic address validation */
export const addressSchema = z.object({
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z
    .string()
    .length(6, 'Pincode must be 6 digits')
    .regex(/^\d{6}$/, 'Enter a valid pincode'),
});

/** Contact form validation */
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: phoneSchema.optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

/** Type inference helpers */
export type PhoneInput = z.infer<typeof phoneSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
