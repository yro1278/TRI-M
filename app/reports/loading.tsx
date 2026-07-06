export default function ReportsLoading() {
  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-border/50" />
          <div>
            <div className="h-7 w-28 rounded bg-border/30 animate-pulse" />
            <div className="h-4 w-44 rounded bg-border/20 animate-pulse mt-1" />
          </div>
        </div>
      </div>
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border/30">
        <div className="h-5 w-32 rounded bg-border/30 animate-pulse mb-5" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl p-4 border border-border/30">
              <div className="h-3 w-16 rounded bg-border/20 animate-pulse mb-2" />
              <div className="h-6 w-20 rounded bg-border/30 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="h-64 rounded bg-border/10 animate-pulse" />
      </div>
    </div>
  );
}
