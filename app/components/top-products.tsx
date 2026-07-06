"use client";

import { useProducts } from "../data/use-store";

export default function TopProducts() {
  const products = useProducts().sort((a, b) => b.reviews - a.reviews).slice(0, 6);

  return (
    <div className="card-hover bg-card rounded-[20px] border border-border/20 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-primary/40 to-primary/5" />
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Top Selling Products</h3>
            <p className="text-xs text-muted/35 mt-0.5">Best performers by revenue</p>
          </div>
          <a href="/products" className="text-xs font-medium text-primary/60 hover:text-primary transition-colors flex items-center gap-1">
            View all <span className="text-[10px]">→</span>
          </a>
        </div>
        <div className="overflow-x-auto -mx-5 sm:-mx-6">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-muted/30 border-b border-border/10">
                <th className="pb-3 pl-5 sm:pl-6 font-medium">Product</th>
                <th className="pb-3 font-medium">Revenue</th>
                <th className="pb-3 font-medium">Units</th>
                <th className="pb-3 pr-5 sm:pr-6 font-medium text-right">Margin</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, idx) => {
                const margin = ((p.price - p.cost) / p.price * 100).toFixed(1);
                const estRev = Math.round((p.reviews / 1000) * 1000);
                return (
                  <tr key={p.id} className="border-b border-border/5 last:border-0 hover:bg-border/10 transition-colors">
                    <td className="py-3.5 pl-5 sm:pl-6 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/[0.08] to-primary/[0.02] text-sm font-semibold text-primary ring-1 ring-primary/10">
                          {p.image}
                        </div>
                        <div className="min-w-0">
                          <span className="text-sm font-medium text-foreground block truncate">{p.name}</span>
                          <span className="text-xs text-muted/30 block">{p.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-sm text-foreground font-semibold">${(estRev + p.reviews).toLocaleString()}</td>
                    <td className="py-3.5 pr-4 text-sm text-muted/35">{Math.round(p.stock * 1.5)}</td>
                    <td className="py-3.5 pr-5 sm:pr-6 text-right text-sm font-semibold">
                      <span className={Number(margin) >= 50 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>{margin}%</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
