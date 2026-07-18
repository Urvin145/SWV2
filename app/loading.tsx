/**
 * Global Loading Page
 * Displayed during page transitions and initial data loading.
 * Uses the Loader component with the Scrapwala brand animation.
 */

import { Loader } from '@/components/common/Loader';

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader size="lg" message="Loading..." />
    </div>
  );
}
