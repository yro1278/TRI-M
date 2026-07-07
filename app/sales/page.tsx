"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, DollarSign, ShoppingCart, Percent, Calendar, ArrowUp, ArrowDown, AlertCircle, RefreshCw } from "lucide-react";
import { useSales, useOrders } from "../data/use-store";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line,
} from "recharts";
import { fadeUp, stagger } from "../components/page-wrapper";

function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="space-y-2 mb-8">
        <div className="h-7 w-40 rounded bg-border/30 animate-pulse" />
        <div className="h-4 w-56 rounded bg-border/20 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface rounded-xl border border-border/50 p-5">
            <div className="h-3 w-16 rounded bg-border/30 animate-pulse mb-3" />
            <div className="h-6 w-20 rounded bg-border/30 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border/50 p-5">
          <div className="h-4 w-24 rounded bg-border/30 animate-pulse mb-4" />
          <div className="h-56 rounded bg-border/10 animate-pulse" />
        </div>
        <div className="bg-surface rounded-xl border border-border/50 p-5">
          <div className="h-4 w-20 rounded bg-border/30 animate-pulse mb-4" />
          <div className="h-56 rounded bg-border/10 animate-pulse" />
        </div>
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
        <p className="text-sm font-medium text-foreground">Failed to load sales data</p>
        <p className="text-xs text-muted/60 mt-1 mb-4">{message}</p>
        <button onClick={onRetry} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark transition-all">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      </div>
    </div>
  );
}

export default function SalesPage() {
  const storeSales = useSales();
  const storeOrders = useOrders();
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("monthly");

  if (storeSales.loading || storeOrders.loading) return <LoadingSkeleton />;
  if (storeSales.error || storeOrders.error) return <ErrorState message={storeSales.error || storeOrders.error || ""} onRetry={() => { storeSales.refetch(); storeOrders.refetch(); }} />;

  const sales = storeSales.data;
  const orders = storeOrders.data;

  const totalRevenue = sales.reduce((s, r) => s + r.revenue, 0);
  const totalCost = sales.reduce((s, r) => s + r.cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const margin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : "0";
  const totalOrders = orders.length;

  const kpis = [
    { label: "Revenue", value: `$${totalRevenue.toLocaleString()}`, change: "+12.5%", up: true, icon: DollarSign, color: "#2563eb" },
    { label: "Profit", value: `$${totalProfit.toLocaleString()}`, change: "+15.3%", up: true, icon: TrendingUp, color: "#059669" },
    { label: "Orders", value: totalOrders.toString(), change: "+8.2%", up: true, icon: ShoppingCart, color: "#d97706" },
    { label: "Margin", value: `${margin}%`, change: "+2.1%", up: true, icon: Percent, color: "#0891b2" },
  ];

  const chartData = sales.map((d) => ({
    name: d.month.slice(0, 3),
    Revenue: d.revenue,
    Cost: d.cost,
    Profit: d.revenue - d.cost,
  }));

  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => !search || o.orderNo.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20);
  }, [orders, search]);

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div variants={fadeUp} className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Sales Management</h1>
        <p className="text-sm text-muted/60 mt-1">Track and analyze sales performance</p>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="card-hover bg-surface rounded-xl border border-border/50 overflow-hidden">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-muted/70 uppercase tracking-wider">{kpi.label}</span>
                  <div className="rounded-lg p-1.5" style={{ backgroundColor: `${kpi.color}15` }}>
                    <Icon className="h-3.5 w-3.5" style={{ color: kpi.color }} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground tracking-tight">{kpi.value}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium ${
                    kpi.up ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                  }`}>
                    {kpi.up ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
                    {kpi.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2 bg-surface rounded-xl border border-border/50 overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Revenue vs Cost</h3>
                <p className="text-xs text-muted/60 mt-0.5">Monthly comparison</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs text-muted/60">
                  <span className="h-2 w-2 rounded-sm bg-primary" /> Revenue
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted/60">
                  <span className="h-2 w-2 rounded-sm bg-rose-400" /> Cost
                </span>
              </div>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={2} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.4} vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted)" }} dy={6} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted)" }} dx={-4} />
                  <Tooltip cursor={{ fill: "var(--color-border)", opacity: 0.15 }}
                    contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "12px", boxShadow: "var(--shadow-lg)", padding: "8px 12px" }}
                  />
                  <Bar dataKey="Revenue" fill="var(--color-primary)" radius={[3, 3, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="Cost" fill="#f43f5e" radius={[3, 3, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-border/50 overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Monthly Profit</h3>
              <span className="text-xs text-muted/60">Trend</span>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.4} vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted)" }} dy={6} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted)" }} dx={-4} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "12px", fontSize: "12px", boxShadow: "var(--shadow-lg)", padding: "8px 12px" }} />
                  <Line type="monotone" dataKey="Profit" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: "#10b981" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="bg-surface rounded-xl border border-border/50 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <h3 className="text-sm font-semibold text-foreground">Recent Transactions</h3>
          <div className="relative group">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/55 group-focus-within:text-primary/50 transition-colors" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="w-48 rounded-lg border border-border/40 bg-surface/50 py-1.5 pl-8 pr-3 text-sm text-foreground outline-none transition-all focus:border-primary/30 focus:bg-surface"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-muted/60 border-b border-border/30">
                <th className="p-3 font-medium">Order</th>
                <th className="p-3 font-medium">Customer</th>
                <th className="p-3 font-medium">Items</th>
                <th className="p-3 font-medium">Amount</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-sm text-muted/60">No transactions found</td></tr>
              ) : (
              filteredOrders.map((o) => (
                <tr key={o.id} className="border-b border-border/10 last:border-0 hover:bg-border/20 transition-colors">
                  <td className="p-3 font-medium text-foreground">{o.orderNo}</td>
                  <td className="p-3 text-foreground">{o.customer}</td>
                  <td className="p-3 text-muted/70">{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
                  <td className="p-3 font-medium text-foreground">${o.total.toFixed(2)}</td>
                  <td className="p-3 text-muted/70">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className={`badge ${
                      o.status === "delivered" ? "badge-green" :
                      o.status === "shipped" ? "badge-gray" :
                      o.status === "processing" ? "badge-blue" :
                      o.status === "cancelled" ? "badge-red" :
                      "badge-amber"
                    }`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
