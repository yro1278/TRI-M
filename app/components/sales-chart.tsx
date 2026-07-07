"use client";

import { useSales } from "../data/use-store";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
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
    <div className="bg-surface rounded-2xl shadow-lg border border-border/40 overflow-hidden h-full">
      <div className="p-6 sm:p-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-foreground tracking-tight">Monthly Sales Overview</h3>
            <p className="text-sm text-muted/60 mt-1">Revenue performance over the year</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-xs font-medium text-muted/70">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Revenue
            </span>
            <span className="flex items-center gap-2 text-xs font-medium text-muted/70">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Profit
            </span>
          </div>
        </div>
        {storeSales.loading ? (
          <div className="h-72 flex items-center justify-center">
            <div className="h-full w-full rounded-xl bg-border/10 animate-pulse" />
          </div>
        ) : storeSales.error ? (
          <div className="h-72 flex items-center justify-center">
            <p className="text-sm text-muted/60">Failed to load chart data</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-72 flex items-center justify-center">
            <p className="text-sm text-muted/60">No sales data available</p>
          </div>
        ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" strokeOpacity={0.25} vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted)" }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted)" }} dx={-4} />
              <Tooltip
                cursor={{ stroke: "var(--color-border)", strokeDasharray: "4 4" }}
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "16px",
                  fontSize: "13px",
                  boxShadow: "var(--shadow-xl)",
                  padding: "12px 16px",
                  backdropFilter: "blur(12px)",
                }}
                labelStyle={{ fontWeight: 600, marginBottom: 6, color: "var(--color-foreground)" }}
              />
              <Area type="monotone" dataKey="Revenue" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#revenueGradient)" dot={false} activeDot={{ r: 5, fill: "var(--color-primary)", stroke: "var(--color-card)", strokeWidth: 3 }} />
              <Area type="monotone" dataKey="Profit" stroke="#34d399" strokeWidth={2.5} fill="url(#profitGradient)" dot={false} activeDot={{ r: 5, fill: "#34d399", stroke: "var(--color-card)", strokeWidth: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        )}
      </div>
    </div>
  );
}
