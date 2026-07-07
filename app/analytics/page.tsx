"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { RefreshCw, AlertCircle, TrendingUp, BarChart3 } from "lucide-react";
import { useSales, useProducts } from "../data/use-store";
import type { SalesRecord } from "@/lib/api";
import { fadeUp, stagger } from "../components/page-wrapper";

const COLORS = ["#4f46e5", "#ec4899", "#10b981", "#f59e0b", "#8b5cf6", "#06b4d6"];

function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="space-y-2 mb-8">
        <div className="h-7 w-32 rounded bg-border/30 animate-pulse" />
        <div className="h-4 w-48 rounded bg-border/20 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-surface rounded-xl border border-border/50 p-5">
            <div className="h-4 w-24 rounded bg-border/30 animate-pulse mb-4" />
            <div className="h-48 rounded bg-border/10 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col items-center py-20">
        <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-red-50 mb-4">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <p className="text-sm font-medium text-foreground">Failed to load analytics</p>
        <p className="text-xs text-muted/60 mt-1 mb-4">{message}</p>
        <button onClick={onRetry} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark transition-all">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      </div>
    </div>
  );
}

function RevenueTrend({ sales }: { sales: SalesRecord[] }) {
  const data = sales.map((d) => ({ name: d.month.slice(0, 3), Revenue: d.revenue }));
  return (
    <div className="bg-surface rounded-xl border border-border/50 overflow-hidden">
      <div className="p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Revenue Trend</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.4} vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted)" }} dy={6} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted)" }} dx={-4} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "12px", boxShadow: "var(--shadow-lg)", padding: "8px 12px" }} />
              <Line type="monotone" dataKey="Revenue" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 3, fill: "var(--color-primary)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function CategoryPie({ data }: { data: { name: string; count: number }[] }) {
  return (
    <div className="bg-surface rounded-xl border border-border/50 overflow-hidden">
      <div className="p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Categories</h3>
        <div className="h-56 flex items-center gap-4">
          <ResponsiveContainer width="60%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="count" strokeWidth={0}>
                {data.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "12px", padding: "8px 12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {data.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs text-muted/60">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                {d.name} <span className="text-foreground font-medium">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfitAnalysis({ sales }: { sales: SalesRecord[] }) {
  const data = sales.map((d) => ({ name: d.month.slice(0, 3), Profit: d.revenue - d.cost }));
  return (
    <div className="bg-surface rounded-xl border border-border/50 overflow-hidden">
      <div className="p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Profit</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.4} vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted)" }} dy={6} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted)" }} dx={-4} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "12px", boxShadow: "var(--shadow-lg)", padding: "8px 12px" }} />
              <Bar dataKey="Profit" fill="#34d399" radius={[3, 3, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function PerformanceMetrics({ sales }: { sales: SalesRecord[] }) {
  const totalRev = sales.reduce((s, r) => s + r.revenue, 0);
  const totalCost = sales.reduce((s, r) => s + r.cost, 0);
  const totalOrders = sales.reduce((s, r) => s + r.orders, 0);
  const avgOrderValue = totalRev / (totalOrders || 1);
  const margin = ((totalRev - totalCost) / totalRev * 100).toFixed(1);

  const metrics = [
    { label: "Avg Order", value: `$${avgOrderValue.toFixed(0)}`, change: "+5.2%", up: true },
    { label: "Profit Margin", value: `${margin}%`, change: "+1.8%", up: true },
    { label: "Cost Ratio", value: `${((totalCost / totalRev) * 100).toFixed(1)}%`, change: "-0.5%", up: false },
  ];

  return (
    <div className="bg-surface rounded-xl border border-border/50 overflow-hidden">
      <div className="p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">Key Metrics</h3>
        <div className="space-y-2">
          {metrics.map((m) => (
            <div key={m.label} className="flex items-center justify-between border-b border-border/20 py-2 last:border-0">
              <span className="text-sm text-muted/70">{m.label}</span>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{m.value}</p>
                <span className={`text-xs ${m.up ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>{m.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const storeSales = useSales();
  const storeProducts = useProducts();

  if (storeSales.loading || storeProducts.loading) return <LoadingSkeleton />;
  if (storeSales.error || storeProducts.error) return <ErrorState message={storeSales.error || storeProducts.error || ""} onRetry={() => { storeSales.refetch(); storeProducts.refetch(); }} />;

  const sales = storeSales.data;
  const products = storeProducts.data;

  const catData = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return cats.map((name) => ({ name, count: products.filter((p) => p.category === name).length }));
  }, [products]);

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics</h1>
          <p className="text-sm text-muted/60 mt-1">Data-driven insights and performance metrics</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-muted/60">
          <RefreshCw className="h-3 w-3" /> Auto-refresh
        </span>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-6">
        <RevenueTrend sales={sales} />
        <CategoryPie data={catData} />
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-5 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-2"><ProfitAnalysis sales={sales} /></div>
        <PerformanceMetrics sales={sales} />
      </motion.div>

      {sales.length === 0 && products.length === 0 && (
        <motion.div variants={fadeUp} className="flex flex-col items-center py-16">
          <p className="text-sm text-muted/60">No data available yet. Seed the database to see analytics.</p>
        </motion.div>
      )}

      <motion.div variants={fadeUp} className="bg-surface rounded-xl border border-border/50 overflow-hidden">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Insights</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { text: "Revenue trending upward with 23% QoQ growth", type: "positive" },
              { text: "Supplier SPI average is 84%. Consider improvements.", type: "warning" },
              { text: "Profit margin at 48.2% is healthy.", type: "info" },
            ].map((i, idx) => (
              <div key={idx} className={`rounded-lg border p-3 text-xs ${
                i.type === "positive" ? "bg-emerald-50/50 border-emerald-200/50 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400" :
                i.type === "warning" ? "bg-amber-50/50 border-amber-200/50 text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400" :
                "bg-blue-50/50 border-blue-200/50 text-blue-800 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400"
              }`}>{i.text}</div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
