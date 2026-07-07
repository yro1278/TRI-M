export default function RootLoading() {
  return (
    <div className="animate-fade-in max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
      <div className="space-y-3 mb-10">
        <div className="h-4 w-48 rounded-lg bg-border/30 animate-pulse" />
        <div className="h-10 w-96 rounded-lg bg-border/20 animate-pulse" />
        <div className="h-5 w-[600px] rounded-lg bg-border/20 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-5 mb-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl shadow-sm border border-border/40 p-6">
            <div className="h-4 w-24 rounded-lg bg-border/30 animate-pulse mb-4" />
            <div className="h-9 w-32 rounded-lg bg-border/20 animate-pulse mb-3" />
            <div className="h-4 w-20 rounded-lg bg-border/20 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 mb-8">
        <div className="lg:col-span-3 bg-surface rounded-2xl shadow-sm border border-border/40 p-7">
          <div className="h-5 w-40 rounded-lg bg-border/30 animate-pulse mb-5" />
          <div className="h-72 rounded-xl bg-border/10 animate-pulse" />
        </div>
        <div className="lg:col-span-2 bg-surface rounded-2xl shadow-sm border border-border/40 p-7">
          <div className="h-5 w-36 rounded-lg bg-border/30 animate-pulse mb-5" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-border/10 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
