/**
 * Pincode Checker Bar Component
 * Quick interactive service availability lookup for Bangalore pincodes.
 * Features instant validation, available slots preview, and direct 1-click schedule trigger.
 */

'use client';

import { useState } from 'react';
import { MapPin, CheckCircle2, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

// Popular Bangalore localities with pincodes
const KNOWN_BANGALORE_PINCODES: Record<string, string> = {
  '560034': 'Koramangala',
  '560038': 'Indiranagar',
  '560102': 'HSR Layout',
  '560066': 'Whitefield',
  '560100': 'Electronic City',
  '560037': 'Marathahalli',
  '560103': 'Bellandur',
  '560011': 'Jayanagar',
  '560076': 'BTM Layout',
  '560035': 'Sarjapur Road',
  '560024': 'Hebbal',
  '560064': 'Yelahanka',
  '560010': 'Rajajinagar',
  '560085': 'Banashankari',
  '560003': 'Malleshwaram',
};

export function PincodeCheckerBar() {
  const [pincode, setPincode] = useState('');
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [areaName, setAreaName] = useState('');

  const handleCheck = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 6);
    setPincode(cleaned);

    if (cleaned.length === 6) {
      if (cleaned.startsWith('560')) {
        const area = KNOWN_BANGALORE_PINCODES[cleaned] || 'Bangalore Area';
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
              placeholder="Enter 6-digit Bangalore Pincode (e.g. 560034)"
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
            <span>We currently operate exclusively in Bangalore (Pincodes starting with 560XXX).</span>
          </div>
        )}
      </div>
    </div>
  );
}
