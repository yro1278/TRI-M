export default function SuppliersLoading() {
  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-2 mb-8">
        <div className="h-7 w-32 rounded bg-border/30 animate-pulse" />
        <div className="h-4 w-48 rounded bg-border/20 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface rounded-xl border border-border/50 p-5">
            <div className="h-3 w-16 rounded bg-border/30 animate-pulse mb-2" />
            <div className="h-7 w-12 rounded bg-border/30 animate-pulse mb-1" />
            <div className="h-4 w-16 rounded bg-border/20 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface rounded-xl border border-border/50 p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-border/20 animate-pulse" />
                <div>
                  <div className="h-4 w-28 rounded bg-border/30 animate-pulse" />
                  <div className="h-3 w-20 rounded bg-border/20 animate-pulse mt-1" />
                </div>
              </div>
              <div className="h-5 w-14 rounded bg-border/20 animate-pulse" />
            </div>
            <div className="flex gap-2 mb-2">
              <div className="h-3 w-24 rounded bg-border/20 animate-pulse" />
              <div className="h-3 w-28 rounded bg-border/20 animate-pulse" />
            </div>
            <div className="h-8 w-full rounded-md bg-border/20 animate-pulse mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
