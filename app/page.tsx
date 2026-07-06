"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp, DollarSign, Package, Truck, ShoppingCart, Users, BarChart3, Heart,
  ArrowUpRight, ArrowDownRight, Search, Bell, Plus, Calendar, ChevronRight,
  Wallet, RefreshCw, Download, FileText,
} from "lucide-react";
import SalesChart from "./components/sales-chart";
import ActivityFeed from "./components/activity-feed";
import TopProducts from "./components/top-products";
import { useProducts, useOrders, useSuppliers, useActivities } from "./data/use-store";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import Image from "next/image";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function Sparkline({ data, color = "#10b981", className = "" }: { data: number[]; color?: string; className?: string }) {
  const width = 80;
  const height = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const d = `M${points.join(" L")}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const kpiConfig = [
  { label: "Total Sales", icon: DollarSign, color: "#2563eb", bg: "bg-blue-50", change: "+15.2%", up: true, sparkColor: "#2563eb" },
  { label: "Revenue", icon: TrendingUp, color: "#059669", bg: "bg-emerald-50", change: "+12.5%", up: true, sparkColor: "#059669" },
  { label: "Profit", icon: Wallet, color: "#7c3aed", bg: "bg-violet-50", change: "+18.3%", up: true, sparkColor: "#7c3aed" },
  { label: "Products", icon: Package, color: "#d97706", bg: "bg-amber-50", change: "+5.7%", up: true, sparkColor: "#d97706" },
  { label: "Suppliers", icon: Truck, color: "#0891b2", bg: "bg-cyan-50", change: "+8.2%", up: true, sparkColor: "#0891b2" },
  { label: "Inventory Value", icon: BarChart3, color: "#dc2626", bg: "bg-red-50", change: "+3.1%", up: true, sparkColor: "#dc2626" },
  { label: "Orders", icon: ShoppingCart, color: "#2563eb", bg: "bg-blue-50", change: "+22.4%", up: true, sparkColor: "#2563eb" },
  { label: "Satisfaction", icon: Heart, color: "#ec4899", bg: "bg-pink-50", change: "+2.1%", up: true, sparkColor: "#ec4899" },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const products = useProducts();
  const orders = useOrders();
  const suppliers = useSuppliers();
  const activities = useActivities();

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalSuppliers = suppliers.length;
  const totalProfit = orders.reduce((s, o) => s + o.total, 0) - orders.reduce((s, o) => s + o.items.reduce((si, i) => si + (i.price * i.quantity * 0.6), 0), 0);
  const avgSatisfaction = 94;
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing");
  const lowStock = products.filter((p) => p.inStock && p.stock < 20).length;
  const inventoryValue = products.reduce((s, p) => s + p.price * p.stock, 0);

  const kpis = [
    { ...kpiConfig[0], value: `$${(totalRevenue * 1.4).toLocaleString()}`, secondary: `${totalOrders} transactions`, data: [30, 45, 38, 52, 48, 60, 55, 62, 58, 70, 68, 75] },
    { ...kpiConfig[1], value: `$${totalRevenue.toLocaleString()}`, secondary: `${totalOrders} orders`, data: [25, 40, 35, 48, 42, 55, 50, 58, 52, 65, 60, 68] },
    { ...kpiConfig[2], value: `$${Math.round(totalProfit).toLocaleString()}`, secondary: `From ${totalOrders} orders`, data: [15, 22, 18, 28, 24, 32, 28, 35, 30, 38, 34, 42] },
    { ...kpiConfig[3], value: totalProducts.toString(), secondary: `${products.filter(p => p.inStock).length} active`, data: [20, 25, 22, 28, 26, 30, 28, 32, 30, 35, 38, 42] },
    { ...kpiConfig[4], value: totalSuppliers.toString(), secondary: `${suppliers.filter(s => s.status === "active").length} active`, data: [8, 10, 9, 12, 11, 14, 13, 15, 14, 16, 15, 18] },
    { ...kpiConfig[5], value: `$${(inventoryValue / 1000).toFixed(0)}K`, secondary: `${lowStock} low stock items`, data: [40, 38, 42, 39, 44, 41, 45, 42, 46, 43, 47, 44] },
    { ...kpiConfig[6], value: totalOrders.toString(), secondary: `${pendingOrders.length} pending`, data: [45, 52, 48, 58, 55, 62, 58, 65, 60, 72, 68, 78] },
    { ...kpiConfig[7], value: `${avgSatisfaction}%`, secondary: "+2.1% vs last month", data: [88, 90, 89, 91, 90, 92, 91, 93, 92, 94, 93, 94] },
  ];

  const dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } };
  const itemAnim = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } } };
  const kpiAnim = { hidden: { opacity: 0, y: 12 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.05 + i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }) };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Welcome Header */}
      <motion.div variants={itemAnim} className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-muted/75 font-medium">{dateStr}</span>
            </div>
            <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-foreground">
              {getGreeting()}, Jane <span className="text-primary">Cooper</span>
            </h1>
            <p className="text-sm text-muted/70 mt-1">Here&apos;s your merchandising overview for today.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/60" />
              <input type="text" placeholder="Search..." className="w-56 rounded-xl border border-border/40 bg-surface/50 py-2 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted/55 transition-all focus:border-primary/20 focus:bg-surface focus:shadow-sm" />
            </div>
            <button className="relative rounded-xl p-2 text-muted/70 hover:text-foreground hover:bg-border/30 transition-all focus-ring">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background animate-pulse-dot" />
            </button>
            <div className="h-9 w-9 overflow-hidden rounded-xl ring-2 ring-border/40 transition-all hover:ring-primary/30">
              <Image
                src="https://ui-avatars.com/api/?name=Jane+Cooper&background=2563eb&color=fff&size=40"
                alt="" width={36} height={36}
                className="h-full w-full object-cover"
              />
            </div>
            <button className="btn-primary gap-1.5 text-xs sm:text-sm px-3 sm:px-4 py-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Order</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 mb-6">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            custom={i}
            variants={kpiAnim}
            initial="hidden"
            animate="visible"
            className="card-hover-lg bg-card rounded-[20px] border border-border/20 overflow-hidden"
          >
            {/* Gradient accent bar */}
            <div className="h-1" style={{ background: `linear-gradient(90deg, ${kpi.color}44, ${kpi.color}11)` }} />
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-muted/70 uppercase tracking-[0.08em]">{kpi.label}</span>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`rounded-xl p-2 ${kpi.bg}`}
                >
                  <kpi.icon className="h-3.5 w-3.5" style={{ color: kpi.color }} />
                </motion.div>
              </div>
              <div className="flex items-end justify-between mb-2">
                <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{kpi.value}</p>
                <Sparkline data={kpi.data} color={kpi.sparkColor} className="hidden sm:block" />
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                  kpi.up ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                }`}>
                  {kpi.up ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                  {kpi.change}
                </span>
                <span className="text-xs text-muted/60">{kpi.secondary}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <motion.div variants={itemAnim} className="grid grid-cols-1 gap-5 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-2"><SalesChart /></div>
        <div className="card-hover bg-card rounded-[20px] border border-border/20 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Activity</h3>
            <span className="flex items-center gap-1.5 text-xs text-muted/65">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" /> Live
            </span>
          </div>
          <ActivityFeed activities={activities.slice(0, 6)} />
        </div>
      </motion.div>

      {/* Bottom Grid */}
      <motion.div variants={itemAnim} className="grid grid-cols-1 gap-5 lg:grid-cols-3 mb-6">
        {/* Pending Orders */}
        <div className="card-hover bg-card rounded-[20px] border border-border/20 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <h3 className="text-sm font-semibold text-foreground">Pending Orders</h3>
            </div>
            <Link href="/orders" className="text-xs font-medium text-primary/60 hover:text-primary transition-colors">View all</Link>
          </div>
          {pendingOrders.length === 0 ? (
            <p className="text-sm text-muted/60">No pending orders</p>
          ) : (
            <div className="space-y-1">
              {pendingOrders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-border/10 transition-colors -mx-1">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{o.orderNo}</p>
                    <p className="text-xs text-muted/65 mt-0.5 truncate">{o.customer} — ${o.total.toFixed(2)}</p>
                  </div>
                  <span className={`badge shrink-0 ${
                    o.status === "pending" ? "badge-amber" : o.status === "processing" ? "badge-blue" : "badge-green"
                  }`}>
                    <span className={`h-1 w-1 rounded-full ${
                      o.status === "pending" ? "bg-amber-500" : o.status === "processing" ? "bg-blue-500" : "bg-green-500"
                    }`} />
                    {o.status}
                  </span>
                </div>
              ))}
              {pendingOrders.length > 5 && (
                <div className="pt-2 border-t border-border/10">
                  <Link href="/orders" className="flex items-center justify-center gap-1 text-xs text-muted/65 hover:text-primary transition-colors py-1">
                    View all {pendingOrders.length} pending orders <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Low Stock */}
        <div className="card-hover bg-card rounded-[20px] border border-border/20 p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <h3 className="text-sm font-semibold text-foreground">Low Stock</h3>
            <span className="ml-auto badge badge-red text-[10px]">{lowStock} items</span>
          </div>
          {products.filter((p) => p.inStock && p.stock < 20).slice(0, 5).length === 0 ? (
            <p className="text-sm text-muted/60">All stocked up</p>
          ) : (
            <div className="space-y-1">
              {products.filter((p) => p.inStock && p.stock < 20).slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-border/10 transition-colors -mx-1">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-xs font-semibold text-amber-600 ring-1 ring-amber-500/10">
                      {p.image}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">{p.name}</p>
                      <p className="text-xs text-muted/65">{p.sku}</p>
                    </div>
                  </div>
                  <span className="shrink-0 inline-flex items-center justify-center rounded-xl bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">{p.stock}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Suppliers */}
        <div className="card-hover bg-card rounded-[20px] border border-border/20 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <h3 className="text-sm font-semibold text-foreground">Top Suppliers</h3>
            </div>
            <Link href="/suppliers" className="text-xs font-medium text-primary/60 hover:text-primary transition-colors">Manage</Link>
          </div>
          <div className="space-y-1">
            {suppliers.filter((s) => s.status === "active").sort((a, b) => b.evaluationScore - a.evaluationScore).slice(0, 4).map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-border/10 transition-colors -mx-1">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xs font-semibold text-indigo-600 ring-1 ring-indigo-500/10">
                    {s.logo}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">{s.name}</p>
                    <p className="text-xs text-muted/65 truncate">{s.categories?.slice(0, 2).join(", ")}</p>
                  </div>
                </div>
                <span className={`badge shrink-0 ${
                  s.evaluationGrade === "A" ? "badge-green" :
                  s.evaluationGrade === "B" ? "badge-blue" : "badge-amber"
                }`}>{s.evaluationGrade}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Top Products & Quick Actions */}
      <motion.div variants={itemAnim} className="grid grid-cols-1 gap-5 lg:grid-cols-4 mb-6">
        <div className="lg:col-span-3"><TopProducts /></div>
        <div className="card-hover bg-card rounded-[20px] border border-border/20 p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: "New Product", icon: Package, href: "/products", desc: "Add inventory item" },
              { label: "Create Order", icon: ShoppingCart, href: "/orders", desc: "New sales order" },
              { label: "Generate Report", icon: FileText, href: "/reports", desc: "Export data" },
              { label: "View Analytics", icon: TrendingUp, href: "/analytics", desc: "Full insights" },
            ].map((action) => (
              <Link key={action.label} href={action.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-border/10 transition-colors group">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{action.label}</p>
                  <p className="text-xs text-muted/60">{action.desc}</p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted/75 group-hover:text-primary/50 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div variants={itemAnim} className="flex items-center justify-between text-xs text-muted/55 border-t border-border/10 pt-5">
        <span>TRI-M inc v2.0 — Enterprise Edition</span>
        <div className="flex items-center gap-3">
          <span>Last updated: {dateStr}</span>
          <button className="hover:text-primary transition-colors flex items-center gap-1">
            <RefreshCw className="h-3 w-3" /> Refresh
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
