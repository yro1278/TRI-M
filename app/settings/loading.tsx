export default function SettingsLoading() {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-8 w-1 rounded-full bg-border/50" />
        <div>
          <div className="h-7 w-28 rounded bg-border/30 animate-pulse" />
          <div className="h-4 w-44 rounded bg-border/20 animate-pulse mt-1" />
        </div>
      </div>
      <div className="flex gap-2 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-9 w-28 rounded-md bg-border/20 animate-pulse" />
        ))}
      </div>
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border/30">
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="h-3 w-20 rounded bg-border/20 animate-pulse mb-1" />
              <div className="h-9 w-full rounded-md bg-border/20 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
