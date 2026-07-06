import { Package, ShoppingCart, Users, DollarSign, Truck } from "lucide-react";
import type { Activity } from "@/lib/api";

const iconMap: Record<string, typeof ShoppingCart> = {
  order: ShoppingCart, product: Package, supplier: Truck, customer: Users, payment: DollarSign,
};

const iconStyles: Record<string, { bg: string; gradient: string }> = {
  order: { bg: "bg-blue-50 text-blue-600", gradient: "from-blue-500/20 to-blue-500/5" },
  product: { bg: "bg-indigo-50 text-indigo-600", gradient: "from-indigo-500/20 to-indigo-500/5" },
  supplier: { bg: "bg-amber-50 text-amber-600", gradient: "from-amber-500/20 to-amber-500/5" },
  customer: { bg: "bg-emerald-50 text-emerald-600", gradient: "from-emerald-500/20 to-emerald-500/5" },
  payment: { bg: "bg-violet-50 text-violet-600", gradient: "from-violet-500/20 to-violet-500/5" },
};

export default function ActivityFeed({ activities }: { activities: Activity[] }) {
  return (
    <div className="space-y-1">
      {activities.map((act) => {
        const Icon = iconMap[act.type] || ShoppingCart;
        const style = iconStyles[act.type] || iconStyles.product;
        return (
          <div key={act.id} className="flex items-start gap-3 py-2.5 border-b border-border/5 last:border-0 group">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${style.gradient} ${style.bg} ring-1 ring-primary/5`}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground group-hover:text-primary transition-colors">{act.text}</p>
              <p className="text-xs text-muted/30 mt-0.5">{act.time}</p>
            </div>
            {act.amount && (
              <span className="shrink-0 text-sm font-semibold text-foreground">{act.amount}</span>
            )}
          </div>
        );
      })}
      {activities.length === 0 && (
        <p className="text-sm text-muted/30 py-6 text-center">No recent activity</p>
      )}
    </div>
  );
}
