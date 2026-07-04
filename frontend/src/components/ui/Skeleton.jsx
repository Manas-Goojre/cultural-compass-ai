export function Skeleton({ className = "" }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

export function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-4" aria-hidden="true">
      <div className="flex justify-between gap-3">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonLines({ count = 4 }) {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i % 3 === 2 ? "w-4/6" : "w-full"}`} />
      ))}
    </div>
  );
}
