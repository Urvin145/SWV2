/**
 * Pincode Checker Bar Component
 * Quick interactive service availability lookup for Ahmedabad pincodes.
 * Features instant validation, available slots preview, and direct 1-click schedule trigger.
 */

'use client';

import { useState } from 'react';
import { MapPin, CheckCircle2, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

// Popular Ahmedabad localities with pincodes
const KNOWN_AHMEDABAD_PINCODES: Record<string, string> = {
  '380001': 'Lal Darwaja',
  '380004': 'Maninagar',
  '380006': 'Navrangpura',
  '380007': 'Paldi',
  '380009': 'Ambawadi',
  '380013': 'Shahibaug',
  '380015': 'Satellite',
  '380051': 'Vastrapur',
  '380052': 'Bodakdev',
  '380054': 'Thaltej',
  '380058': 'Prahlad Nagar',
  '380059': 'Jodhpur',
  '382330': 'Naroda',
  '382345': 'Chandkheda',
  '382350': 'Motera',
  '382418': 'Gota',
  '382421': 'Sola',
  '382424': 'Science City',
  '382470': 'Bopal',
  '382481': 'South Bopal',
};

export function PincodeCheckerBar() {
  const [pincode, setPincode] = useState('');
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [areaName, setAreaName] = useState('');

  const handleCheck = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 6);
    setPincode(cleaned);

    if (cleaned.length === 6) {
      if (cleaned.startsWith('380') || cleaned.startsWith('382') || cleaned.startsWith('383')) {
        const area = KNOWN_AHMEDABAD_PINCODES[cleaned] || 'Ahmedabad Area';
        setAreaName(area);
        setStatus('valid');
      } else {
        setStatus('invalid');
      }
    } else {
      setStatus('idle');
    }
  };

  return (
    <div className="w-full max-w-xl">
      <div className="relative rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-2 shadow-lg transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Input field with icon */}
          <div className="flex flex-1 items-center gap-3 px-3 py-1.5">
            <MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
            <input
              type="text"
              value={pincode}
              onChange={(e) => handleCheck(e.target.value)}
              placeholder="Enter 6-digit Ahmedabad Pincode (e.g. 380015)"
              className="w-full bg-transparent text-sm font-medium text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
              maxLength={6}
            />
          </div>

          {/* Action Button */}
          <Link
            href={ROUTES.BOOK}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition-all hover:bg-primary-container"
          >
            <span>Check Slots</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Live Feedback Pill */}
        {status === 'valid' && (
          <div className="mt-2 flex items-center justify-between rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Doorstep pickup available in <strong>{areaName}</strong> today!</span>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-bold text-primary">
              <Sparkles className="h-3 w-3" /> Free Pickup
            </span>
          </div>
        )}

        {status === 'invalid' && (
          <div className="mt-2 flex items-center gap-1.5 rounded-xl bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span>We currently operate exclusively in Ahmedabad (Pincodes starting with 380/382/383).</span>
          </div>
        )}
      </div>
    </div>
  );
}
