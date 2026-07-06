export default function ProductsLoading() {
  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-border/50" />
          <div>
            <div className="h-7 w-32 rounded bg-border/30 animate-pulse" />
            <div className="h-4 w-40 rounded bg-border/20 animate-pulse mt-1" />
          </div>
        </div>
        <div className="h-9 w-20 rounded-md bg-border/30 animate-pulse" />
      </div>
      <div className="flex items-center gap-2 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-20 rounded-md bg-border/20 animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-card rounded-xl shadow-sm border border-border/30 overflow-hidden">
            <div className="aspect-square bg-border/10 animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-3 w-16 rounded bg-border/20 animate-pulse" />
              <div className="h-4 w-32 rounded bg-border/30 animate-pulse" />
              <div className="h-3 w-24 rounded bg-border/20 animate-pulse" />
              <div className="h-8 w-full rounded bg-border/20 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
