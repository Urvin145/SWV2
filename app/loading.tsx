/**
 * Global Loading Page
 * Lightweight minimal spinner fallback for streaming routes.
 */

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
