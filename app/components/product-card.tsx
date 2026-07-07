import { Star, Sparkles } from "lucide-react";
import type { Product } from "@/lib/api";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card-hover bg-surface rounded-xl border border-border/50 overflow-hidden">
      <div className="relative aspect-square bg-gradient-to-br from-border/20 to-border/5 flex items-center justify-center overflow-hidden">
        {product.badge && (
          <span className="badge badge-blue absolute left-2.5 top-2.5">{product.badge}</span>
        )}
        {!product.inStock && (
          <span className="badge badge-gray absolute left-2.5 top-2.5">Out of Stock</span>
        )}
        <span className="text-5xl opacity-20 select-none">{product.image}</span>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/70">{product.brand}</span>
          <span className="text-[10px] text-muted/50">{product.sku}</span>
        </div>
        <p className="text-sm font-medium text-foreground line-clamp-1">{product.name}</p>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-xs font-medium text-foreground">{product.rating}</span>
          <span className="text-xs text-muted/50">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-foreground">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted/50 line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>
        {product.inStock && (
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">In Stock \u00B7 {product.stock}</span>
          </div>
        )}
      </div>
    </div>
  );
}
