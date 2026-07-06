export default function OrdersLoading() {
  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-8 w-1 rounded-full bg-border/50" />
        <div>
          <div className="h-7 w-24 rounded bg-border/30 animate-pulse" />
          <div className="h-4 w-32 rounded bg-border/20 animate-pulse mt-1" />
        </div>
      </div>
      <div className="bg-card rounded-xl shadow-sm border border-border/30 overflow-hidden">
        <div className="p-3 border-b border-border/20">
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-7 w-16 rounded-md bg-border/20 animate-pulse" />
            ))}
          </div>
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 border-b border-border/10 last:border-0">
            <div className="h-4 w-20 rounded bg-border/20 animate-pulse" />
            <div className="h-4 w-24 rounded bg-border/20 animate-pulse" />
            <div className="h-4 w-8 rounded bg-border/20 animate-pulse" />
            <div className="h-4 w-16 rounded bg-border/20 animate-pulse" />
            <div className="h-4 w-20 rounded bg-border/20 animate-pulse" />
            <div className="h-4 w-16 rounded bg-border/20 animate-pulse" />
            <div className="h-5 w-16 rounded bg-border/20 animate-pulse ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
