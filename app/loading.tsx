/**
 * Global Loading Page
 * Displayed during page transitions and initial data loading.
 * Uses the SweetLoader component with the Scrapwala electric mini-tempo animation.
 */

import { SweetLoader } from '@/components/common/SweetLoader';

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <SweetLoader
        message="Assigning your pickup buddy..."
        submessage="Preparing your eco-friendly scrap collection experience"
      />
    </div>
  );
}
