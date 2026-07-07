"use client";

import { useSales } from "../data/use-store";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

export default function SalesChart() {
  const storeSales = useSales();
  const data = storeSales.data;
  const chartData = data.map((d) => ({
    name: d.month.slice(0, 3),
    Revenue: d.revenue,
    Cost: d.cost,
    Profit: d.revenue - d.cost,
  }));

  return (
    <div className="card-hover bg-card rounded-[20px] border border-border/20 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-primary/40 to-primary/5" />
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Monthly Sales Trend</h3>
            <p className="text-xs text-muted/35 mt-0.5">Revenue performance over the year</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-muted/35">
              <span className="h-2 w-2 rounded-sm bg-primary" /> Revenue
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted/35">
              <span className="h-2 w-2 rounded-sm bg-emerald-400" /> Profit
            </span>
          </div>
        </div>
        {storeSales.loading ? (
          <div className="h-56 sm:h-64 flex items-center justify-center">
            <div className="h-52 w-full rounded bg-border/10 animate-pulse" />
          </div>
        ) : storeSales.error ? (
          <div className="h-56 sm:h-64 flex items-center justify-center">
            <p className="text-xs text-muted/60">Failed to load chart data</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-56 sm:h-64 flex items-center justify-center">
            <p className="text-xs text-muted/60">No sales data available</p>
          </div>
        ) : (
        <div className="h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={4} barCategoryGap="16%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.3} vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted)" }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted)" }} dx={-4} />
              <Tooltip
                cursor={{ fill: "var(--color-border)", opacity: 0.1 }}
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  boxShadow: "var(--shadow-xl)",
                  padding: "10px 14px",
                }}
                labelStyle={{ fontWeight: 600, marginBottom: 4 }}
              />
              <Bar dataKey="Revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="Profit" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        )}
      </div>
    </div>
  );
}
