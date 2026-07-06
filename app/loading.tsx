export default function RootLoading() {
  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="h-8 w-1 rounded-full bg-border/50" />
        <div>
          <div className="h-7 w-40 rounded bg-border/30 animate-pulse" />
          <div className="h-4 w-56 rounded bg-border/20 animate-pulse mt-2" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-xl p-5 shadow-sm border border-border/30">
            <div className="flex items-center justify-between mb-3">
              <div className="h-3 w-16 rounded bg-border/30 animate-pulse" />
              <div className="h-7 w-7 rounded-lg bg-border/20 animate-pulse" />
            </div>
            <div className="h-8 w-24 rounded bg-border/30 animate-pulse" />
            <div className="h-4 w-20 rounded bg-border/20 animate-pulse mt-2" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2 bg-card rounded-xl p-5 shadow-sm border border-border/30">
          <div className="h-4 w-24 rounded bg-border/30 animate-pulse mb-4" />
          <div className="h-52 rounded bg-border/10 animate-pulse" />
        </div>
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border/30">
          <div className="h-4 w-20 rounded bg-border/30 animate-pulse mb-4" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="h-6 w-6 rounded bg-border/20 animate-pulse" />
              <div className="flex-1">
                <div className="h-3 w-32 rounded bg-border/20 animate-pulse" />
                <div className="h-2 w-20 rounded bg-border/10 animate-pulse mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
