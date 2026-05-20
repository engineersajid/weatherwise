export function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Current Weather Card Skeleton */}
      <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-slate-800" />
              <div className="h-7 w-48 rounded-lg bg-slate-800" />
            </div>
            <div className="h-4 w-32 rounded-lg bg-slate-800" />
            <div className="mt-6 flex items-baseline gap-1">
              <div className="h-20 w-24 rounded-2xl bg-slate-800" />
              <div className="h-8 w-8 rounded-lg bg-slate-800" />
            </div>
            <div className="h-8 w-36 rounded-full bg-slate-800" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4 w-full md:min-w-[240px]">
            <div className="h-20 rounded-2xl bg-slate-800" />
            <div className="h-20 rounded-2xl bg-slate-800" />
          </div>
        </div>
      </div>

      {/* 7-Day Outlook List Skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-32 rounded-lg bg-slate-800 mb-2" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 rounded-2xl border border-white/5 bg-slate-900/20 p-4" />
        ))}
      </div>
    </div>
  );
}
