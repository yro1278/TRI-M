export default function SettingsLoading() {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-2 mb-8">
        <div className="h-7 w-28 rounded bg-border/30 animate-pulse" />
        <div className="h-4 w-44 rounded bg-border/20 animate-pulse" />
      </div>
      <div className="flex gap-2 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-9 w-28 rounded-lg bg-border/20 animate-pulse" />
        ))}
      </div>
      <div className="bg-surface rounded-xl border border-border/50 p-6">
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="h-3 w-20 rounded bg-border/20 animate-pulse mb-1" />
              <div className="h-9 w-full rounded-lg bg-border/20 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
