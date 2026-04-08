export function SkeletonCard() {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="h-40 shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-3/4 shimmer rounded" />
        <div className="h-4 w-1/2 shimmer rounded" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-20 shimmer rounded" />
          <div className="h-9 w-24 shimmer rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="glass-card rounded-xl p-6 space-y-3">
      <div className="flex justify-between">
        <div className="h-4 w-24 shimmer rounded" />
        <div className="h-8 w-8 shimmer rounded-lg" />
      </div>
      <div className="h-8 w-16 shimmer rounded" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="glass-card rounded-xl p-5 flex items-center gap-4">
      <div className="h-12 w-12 shimmer rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 shimmer rounded" />
        <div className="h-3 w-1/2 shimmer rounded" />
      </div>
      <div className="h-6 w-16 shimmer rounded-full" />
    </div>
  );
}
