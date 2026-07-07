"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  DollarSign, Package, Truck, TrendingUp,
  ArrowUpRight, ArrowDownRight,
  RefreshCw, AlertCircle, Clock,
} from "lucide-react";
import SalesChart from "./components/sales-chart";
import { useProducts, useOrders, useSuppliers, useDashboardKPI } from "./data/use-store";

function Sparkline({ data, color = "#10b981", className = "" }: { data: number[]; color?: string; className?: string }) {
  const width = 72;
  const height = 24;
  if (!data || data.length < 2) return null;
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
      <defs>
        <linearGradient id={`sf-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${width},${height} L0,${height} Z`} fill={`url(#sf-${color.replace("#", "")})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="h-3 w-48 rounded bg-border/20 animate-pulse" />
          <div className="h-6 w-64 rounded bg-border/30 animate-pulse" />
          <div className="h-3 w-36 rounded bg-border/20 animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-56 rounded-xl bg-border/20 animate-pulse" />
          <div className="h-9 w-9 rounded-xl bg-border/20 animate-pulse" />
          <div className="h-9 w-9 rounded-xl bg-border/20 animate-pulse" />
          <div className="h-9 w-28 rounded-xl bg-border/20 animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-[20px] border border-border/20 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-3 w-20 rounded bg-border/30 animate-pulse" />
              <div className="h-8 w-8 rounded-xl bg-border/20 animate-pulse" />
            </div>
            <div className="h-7 w-28 rounded bg-border/30 animate-pulse mb-2" />
            <div className="h-4 w-20 rounded bg-border/20 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-2 bg-card rounded-[20px] border border-border/20 p-6">
          <div className="h-4 w-32 rounded bg-border/30 animate-pulse mb-4" />
          <div className="h-56 rounded bg-border/10 animate-pulse" />
        </div>
        <div className="bg-card rounded-[20px] border border-border/20 p-6">
          <div className="h-4 w-28 rounded bg-border/30 animate-pulse mb-4" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border/5 last:border-0">
              <div className="flex-1">
                <div className="h-3 w-32 rounded bg-border/20 animate-pulse" />
                <div className="h-2 w-20 rounded bg-border/10 animate-pulse mt-1" />
              </div>
              <div className="h-5 w-16 rounded-full bg-border/20 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-red-50 mb-5">
          <AlertCircle className="h-7 w-7 text-red-500" />
        </div>
        <p className="text-base font-semibold text-foreground">Failed to load dashboard</p>
        <p className="text-sm text-muted/60 mt-1 mb-5 max-w-sm text-center">{message}</p>
        <button onClick={onRetry} className="btn-primary text-xs flex items-center gap-1.5 px-4 py-2">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const kpiData = useDashboardKPI();
  const products = useProducts();
  const orders = useOrders();
  const suppliers = useSuppliers();

  const isLoading = kpiData.loading || products.loading || orders.loading || suppliers.loading;
  const hasError = kpiData.error || products.error || orders.error || suppliers.error;
  const errorMessage = kpiData.error || products.error || orders.error || suppliers.error || "";
  const handleRetry = () => {
    kpiData.refetch();
    products.refetch();
    orders.refetch();
    suppliers.refetch();
  };

  if (hasError && !isLoading) return <ErrorState message={errorMessage} onRetry={handleRetry} />;

  const dataAvailable = !isLoading;
  const summary = kpiData.data.summary;

  const allProducts = products.data;
  const allOrders = orders.data;
  const allSuppliers = suppliers.data;

  const totalRevenue = allOrders.reduce((s, o) => s + o.total, 0);
  const totalOrders = allOrders.length;
  const totalProducts = allProducts.length;
  const totalSuppliers = allSuppliers.length;

  const recentTransactions = useMemo(() =>
    [...allOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [allOrders]
  );

  const lowStockItems = useMemo(() =>
    allProducts.filter((p) => p.inStock && p.stock < 20).slice(0, 5),
    [allProducts]
  );

  const kpis = [
    {
      label: "Total Sales",
      value: dataAvailable ? `$${(summary.totalRevenue || totalRevenue * 1.4).toLocaleString()}` : "\u2014",
      change: "+15.2%",
      up: true,
      icon: DollarSign,
      color: "#2563eb",
      bg: "bg-blue-50",
      data: kpiData.data.monthlyTrends.map((m) => m.revenue).length > 1 ? kpiData.data.monthlyTrends.map((m) => m.revenue) : [30, 45, 38, 52, 48, 60, 55, 62, 58, 70, 68, 75],
    },
    {
      label: "Revenue",
      value: dataAvailable ? `$${(summary.totalRevenue || totalRevenue).toLocaleString()}` : "\u2014",
      change: "+12.5%",
      up: true,
      icon: TrendingUp,
      color: "#059669",
      bg: "bg-emerald-50",
      data: kpiData.data.monthlyTrends.map((m) => m.revenue).length > 1 ? kpiData.data.monthlyTrends.map((m) => m.revenue) : [25, 40, 35, 48, 42, 55, 50, 58, 52, 65, 60, 68],
    },
    {
      label: "Products",
      value: dataAvailable ? (summary.activeProducts || totalProducts).toString() : "\u2014",
      change: "+5.7%",
      up: true,
      icon: Package,
      color: "#d97706",
      bg: "bg-amber-50",
      data: [20, 25, 22, 28, 26, 30, 28, 32, 30, 35, 38, 42],
    },
    {
      label: "Active Suppliers",
      value: dataAvailable ? allSuppliers.filter((s) => s.status === "active").length.toString() : "\u2014",
      change: "+8.2%",
      up: true,
      icon: Truck,
      color: "#0891b2",
      bg: "bg-cyan-50",
      data: [8, 10, 9, 12, 11, 14, 13, 15, 14, 16, 15, 18],
    },
  ];

  const dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const itemAnim = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } } };
  const kpiAnim = { hidden: { opacity: 0, y: 12 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }) };

  if (isLoading) return <DashboardSkeleton />;

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <motion.div variants={itemAnim} className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[15px] text-muted/55 font-medium tracking-wide mb-3">{dateStr}</p>
            <h1 className="text-4xl sm:text-[36px] font-bold tracking-tight leading-tight text-foreground">
              {getGreeting()}, Tyrone Alariao
            </h1>
            <p className="text-[17px] text-muted/60 font-normal leading-relaxed mt-3 max-w-2xl">Manage your merchandising operations, monitor sales, inventory, supplier performance, and business insights from one centralized dashboard.</p>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            custom={i}
            variants={kpiAnim}
            initial="hidden"
            animate="visible"
            className="card-hover-lg bg-card rounded-[20px] border border-border/20 overflow-hidden group"
          >
            <div className="h-1" style={{ background: `linear-gradient(90deg, ${kpi.color}, ${kpi.color}22)` }} />
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted/65 uppercase tracking-[0.08em]">{kpi.label}</span>
                <div className={`rounded-xl p-2 ${kpi.bg} ring-1 ring-black/[0.03] dark:ring-white/[0.06]`}>
                  <kpi.icon className="h-3.5 w-3.5" style={{ color: kpi.color }} />
                </div>
              </div>
              <div className="flex items-end justify-between mb-2">
                <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">{kpi.value}</p>
                <Sparkline data={kpi.data} color={kpi.color} className="hidden sm:block opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  kpi.up ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                }`}>
                  {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.change}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <motion.div variants={itemAnim} className="grid grid-cols-1 gap-5 lg:grid-cols-3 mb-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2">
          <SalesChart />
        </div>

        {/* Recent Transactions */}
        <div className="card-hover bg-card rounded-[20px] border border-border/20 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary/40 to-primary/5" />
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-foreground">Recent Transactions</h3>
              <Link href="/orders" className="text-xs font-medium text-primary/60 hover:text-primary transition-colors">View all</Link>
            </div>
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-muted/50 py-8 text-center">No transactions yet</p>
            ) : (
              <div className="space-y-1">
                {recentTransactions.map((o) => (
                  <div key={o.id} className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-border/10 transition-colors -mx-1">
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-medium text-foreground truncate">{o.orderNo}</p>
                      <p className="text-sm text-muted/65 mt-0.5 truncate">{o.customer}</p>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-base font-semibold text-foreground">${o.total.toFixed(2)}</span>
                      <span className={`badge shrink-0 ${
                        o.status === "delivered" ? "badge-green" :
                        o.status === "shipped" ? "badge-gray" :
                        o.status === "processing" ? "badge-blue" :
                        o.status === "cancelled" ? "badge-red" : "badge-amber"
                      }`}>{o.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Low Stock Alerts */}
      <motion.div variants={itemAnim} className="mb-6">
        <div className="card-hover bg-card rounded-[20px] border border-border/20 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-red-400/50 to-red-400/5" />
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <Clock className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-base font-semibold text-foreground">Low Stock Alerts</h3>
              </div>
              <Link href="/products" className="text-xs font-medium text-primary/60 hover:text-primary transition-colors">Manage</Link>
            </div>
            {lowStockItems.length === 0 ? (
              <p className="text-sm text-emerald-600 dark:text-emerald-400 py-8 text-center">All products are well stocked</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-sm text-muted/50 border-b border-border/10">
                      <th className="pb-3 font-semibold">Product</th>
                      <th className="pb-3 font-semibold">SKU</th>
                      <th className="pb-3 font-semibold">Stock</th>
                      <th className="pb-3 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockItems.map((p) => (
                      <tr key={p.id} className="border-b border-border/5 last:border-0 hover:bg-border/10 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-xs font-semibold text-amber-600 ring-1 ring-amber-500/10">
                              {p.image}
                            </div>
                            <span className="text-base font-medium text-foreground truncate">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-base text-muted/65">{p.sku}</td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-20 h-1.5 rounded-full bg-border/30 overflow-hidden">
                              <div className="h-full rounded-full bg-red-500" style={{ width: `${Math.min((p.stock / 20) * 100, 100)}%` }} />
                            </div>
                            <span className="text-base font-semibold text-red-600 dark:text-red-400">{p.stock}</span>
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <span className="badge badge-red">Low Stock</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div variants={itemAnim} className="flex items-center justify-between text-sm text-muted/55 border-t border-border/10 pt-5">
        <span className="font-medium">TRI-M inc v2.0 — Enterprise Edition</span>
        <div className="flex items-center gap-3">
          <span>Last updated: {dateStr}</span>
          <button onClick={handleRetry} className="hover:text-primary transition-colors flex items-center gap-1">
            <RefreshCw className="h-3 w-3" /> Refresh
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
