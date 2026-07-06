"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, DollarSign, ShoppingCart, Percent, Calendar, ArrowUp, ArrowDown } from "lucide-react";
import { useSales, useOrders } from "../data/use-store";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line,
} from "recharts";

export default function SalesPage() {
  const sales = useSales();
  const orders = useOrders();
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("monthly");

  const totalRevenue = sales.reduce((s, r) => s + r.revenue, 0);
  const totalCost = sales.reduce((s, r) => s + r.cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const margin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : "0";
  const totalOrders = orders.length;

  const kpis = [
    { label: "Revenue", value: `$${totalRevenue.toLocaleString()}`, change: "+12.5%", up: true, icon: DollarSign },
    { label: "Profit", value: `$${totalProfit.toLocaleString()}`, change: "+15.3%", up: true, icon: TrendingUp },
    { label: "Orders", value: totalOrders.toString(), change: "+8.2%", up: true, icon: ShoppingCart },
    { label: "Margin", value: `${margin}%`, change: "+2.1%", up: true, icon: Percent },
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

  const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } } };
  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

  const iconColors = [
    { bg: "bg-indigo-50 text-indigo-600", ring: "ring-indigo-500/10" },
    { bg: "bg-emerald-50 text-emerald-600", ring: "ring-emerald-500/10" },
    { bg: "bg-amber-50 text-amber-600", ring: "ring-amber-500/10" },
    { bg: "bg-blue-50 text-blue-600", ring: "ring-blue-500/10" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary to-primary/40" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sales Management</h1>
            <p className="text-sm text-muted/65 mt-0.5">Track and analyze sales performance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-muted/60" />
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="bg-transparent text-sm text-muted/70 outline-none">
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="card-hover bg-card rounded-[20px] p-5 border border-border/20 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary/35 to-primary/5 -mx-5 -mt-5 mb-4" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-muted/70 uppercase tracking-[0.06em]">{kpi.label}</span>
                <div className={`rounded-[12px] p-1.5 ring-1 ${iconColors[i % 4].bg} ${iconColors[i % 4].ring}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <p className="text-2xl font-semibold text-foreground tracking-tight">{kpi.value}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium ${
                  kpi.up ? "badge-green" : "badge-red"
                }`}>
                  {kpi.up ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />}
                  {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2 card-hover bg-card rounded-[20px] p-5 border border-border/20 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary/35 to-primary/5 -mx-5 -mt-5 mb-4" />
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Revenue vs Cost</h3>
              <p className="text-xs text-muted/65 mt-0.5">Monthly comparison</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-muted/65">
                <span className="h-2 w-2 rounded-sm bg-primary" /> Revenue
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted/65">
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

        <div className="card-hover bg-card rounded-[20px] p-5 border border-border/20 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-400/35 to-emerald-400/5 -mx-5 -mt-5 mb-4" />
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
      </motion.div>

      <motion.div variants={fadeUp} className="card-hover bg-card rounded-[20px] border border-border/20 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary/35 to-primary/5" />
        <div className="flex items-center justify-between p-4 border-b border-border/10">
          <h3 className="text-sm font-semibold text-foreground">Recent Transactions</h3>
          <div className="relative group">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/55 group-focus-within:text-primary/50 transition-colors" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="w-48 rounded-[12px] border border-border/40 bg-surface/50 py-1.5 pl-8 pr-3 text-sm text-foreground outline-none transition-all focus:border-primary/20 focus:bg-surface focus:shadow-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-muted/60 border-b border-border/10">
                <th className="p-3 font-medium">Order</th>
                <th className="p-3 font-medium">Customer</th>
                <th className="p-3 font-medium">Items</th>
                <th className="p-3 font-medium">Amount</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id} className="border-b border-border/5 last:border-0 hover:bg-border/10 transition-colors">
                  <td className="p-3 font-medium text-foreground">{o.orderNo}</td>
                  <td className="p-3 text-foreground">{o.customer}</td>
                  <td className="p-3 text-muted/65">{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
                  <td className="p-3 font-medium text-foreground">${o.total.toFixed(2)}</td>
                  <td className="p-3 text-muted/65">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className={`badge ${
                      o.status === "delivered" ? "badge-green" :
                      o.status === "shipped" ? "badge-gray" :
                      o.status === "processing" ? "badge-blue" :
                      o.status === "cancelled" ? "badge-red" :
                      "badge-amber"
                    }`}>
                      <span className={`h-1 w-1 rounded-full ${
                        o.status === "delivered" ? "bg-emerald-500" :
                        o.status === "shipped" ? "bg-gray-500" :
                        o.status === "processing" ? "bg-blue-500" :
                        o.status === "cancelled" ? "bg-red-500" :
                        "bg-amber-500"
                      }`} />
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
