export default function OrdersLoading() {
  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-2 mb-8">
        <div className="h-7 w-24 rounded bg-border/30 animate-pulse" />
        <div className="h-4 w-36 rounded bg-border/20 animate-pulse" />
      </div>
      <div className="bg-surface rounded-xl border border-border/50 overflow-hidden">
        <div className="p-3 border-b border-border/30">
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-7 w-16 rounded-lg bg-border/20 animate-pulse" />
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
