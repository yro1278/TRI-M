export default function AnalyticsLoading() {
  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-border/50" />
          <div>
            <div className="h-7 w-32 rounded bg-border/30 animate-pulse" />
            <div className="h-4 w-44 rounded bg-border/20 animate-pulse mt-1" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-card rounded-xl p-5 shadow-sm border border-border/30">
            <div className="h-4 w-28 rounded bg-border/30 animate-pulse mb-4" />
            <div className="h-56 rounded bg-border/10 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-2 bg-card rounded-xl p-5 shadow-sm border border-border/30">
          <div className="h-4 w-20 rounded bg-border/30 animate-pulse mb-4" />
          <div className="h-48 rounded bg-border/10 animate-pulse" />
        </div>
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border/30">
          <div className="h-4 w-24 rounded bg-border/30 animate-pulse mb-4" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border/10 last:border-0">
              <div className="h-3 w-16 rounded bg-border/20 animate-pulse" />
              <div className="text-right">
                <div className="h-4 w-14 rounded bg-border/20 animate-pulse ml-auto" />
                <div className="h-3 w-10 rounded bg-border/10 animate-pulse mt-1 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
