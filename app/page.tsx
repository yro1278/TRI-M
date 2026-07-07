"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  DollarSign, Package, Truck, AlertTriangle, TrendingUp, ArrowUpRight, ArrowDownRight,
  ShoppingCart, AlertCircle, RefreshCw, BarChart3, Clock, Receipt, Box,
  Sparkles, Layers, Building2,
} from "lucide-react";
import SalesChart from "./components/sales-chart";
import { useProducts, useOrders, useSuppliers, useDashboardKPI } from "./data/use-store";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

function Sparkline({ data, color = "#10b981", className = "" }: { data: number[]; color?: string; className?: string }) {
  const width = 80;
  const height = 28;
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
        <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${width},${height} L0,${height} Z`} fill={`url(#sg-${color.replace("#", "")})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const ease = [0.16, 1, 0.3, 1] as const;
const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemAnim = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } };
const kpiAnim = { hidden: { opacity: 0, y: 16 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5, ease } }) };

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
      <div className="flex flex-col items-center justify-center py-32">
        <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-danger/10 mb-6">
          <AlertCircle className="h-8 w-8 text-danger" />
        </div>
        <p className="text-lg font-bold text-foreground">Failed to load dashboard</p>
        <p className="text-sm text-muted/60 mt-1 mb-6 max-w-sm text-center">{message}</p>
        <button onClick={onRetry} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
      <div className="space-y-3 mb-10">
        <div className="h-4 w-48 rounded-lg bg-border/30 animate-pulse" />
        <div className="h-10 w-96 rounded-lg bg-border/20 animate-pulse" />
        <div className="h-5 w-[600px] rounded-lg bg-border/20 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-5 mb-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl shadow-sm border border-border/40 p-6">
            <div className="h-4 w-24 rounded-lg bg-border/30 animate-pulse mb-4" />
            <div className="h-9 w-32 rounded-lg bg-border/20 animate-pulse mb-3" />
            <div className="h-4 w-20 rounded-lg bg-border/20 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 mb-8">
        <div className="lg:col-span-3 bg-surface rounded-2xl shadow-sm border border-border/40 p-7">
          <div className="h-5 w-40 rounded-lg bg-border/30 animate-pulse mb-5" />
          <div className="h-72 rounded-xl bg-border/10 animate-pulse" />
        </div>
        <div className="lg:col-span-2 bg-surface rounded-2xl shadow-sm border border-border/40 p-7">
          <div className="h-5 w-36 rounded-lg bg-border/30 animate-pulse mb-5" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-border/10 animate-pulse" />
            ))}
          </div>
        </div>
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
  const lowStockItems = allProducts.filter((p) => p.inStock && p.stock < 20);
  const activeSuppliers = allSuppliers.filter((s) => s.status === "active");

  const recentTransactions = useMemo(() =>
    [...allOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
    [allOrders]
  );

  const kpis = [
    {
      label: "Total Sales",
      value: dataAvailable ? `$${(summary.totalRevenue || totalRevenue * 1.4).toLocaleString()}` : "\u2014",
      change: "+15.2%",
      up: true,
      icon: DollarSign,
      gradient: "from-blue-500/20 to-blue-500/5",
      iconColor: "text-blue-500",
      ring: "ring-blue-500/20",
      trend: kpiData.data.monthlyTrends.map((m) => m.revenue).length > 1 ? kpiData.data.monthlyTrends.map((m) => m.revenue) : [30, 45, 38, 52, 48, 60, 55, 62, 58, 70, 68, 75],
      trendColor: "#3b82f6",
    },
    {
      label: "Total Revenue",
      value: dataAvailable ? `$${(summary.totalRevenue || totalRevenue).toLocaleString()}` : "\u2014",
      change: "+12.5%",
      up: true,
      icon: TrendingUp,
      gradient: "from-emerald-500/20 to-emerald-500/5",
      iconColor: "text-emerald-500",
      ring: "ring-emerald-500/20",
      trend: kpiData.data.monthlyTrends.map((m) => m.revenue).length > 1 ? kpiData.data.monthlyTrends.map((m) => m.revenue) : [25, 40, 35, 48, 42, 55, 50, 58, 52, 65, 60, 68],
      trendColor: "#34d399",
    },
    {
      label: "Total Products",
      value: dataAvailable ? (summary.activeProducts || totalProducts).toString() : "\u2014",
      change: "+5.7%",
      up: true,
      icon: Package,
      gradient: "from-amber-500/20 to-amber-500/5",
      iconColor: "text-amber-500",
      ring: "ring-amber-500/20",
      trend: [20, 25, 22, 28, 26, 30, 28, 32, 30, 35, 38, 42],
      trendColor: "#f59e0b",
    },
    {
      label: "Active Suppliers",
      value: dataAvailable ? activeSuppliers.length.toString() : "\u2014",
      change: "+8.2%",
      up: true,
      icon: Building2,
      gradient: "from-cyan-500/20 to-cyan-500/5",
      iconColor: "text-cyan-500",
      ring: "ring-cyan-500/20",
      trend: [8, 10, 9, 12, 11, 14, 13, 15, 14, 16, 15, 18],
      trendColor: "#06b6d4",
    },
    {
      label: "Low Stock Products",
      value: dataAvailable ? lowStockItems.length.toString() : "\u2014",
      change: lowStockItems.length > 3 ? "+2" : "-1",
      up: lowStockItems.length <= 3,
      icon: AlertTriangle,
      gradient: "from-red-500/20 to-red-500/5",
      iconColor: "text-red-500",
      ring: "ring-red-500/20",
      trend: [5, 4, 6, 3, 5, 4, 3, 2, 4, 3, 5, lowStockItems.length],
      trendColor: "#ef4444",
    },
  ];

  const dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const supplierChartData = allSuppliers
    .filter((s) => s.status === "active")
    .slice(0, 6)
    .map((s) => ({
      name: s.name.split(" ")[0],
      Score: s.evaluationScore,
      Quality: s.qualityRating,
    }));

  if (isLoading) return <DashboardSkeleton />;

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
      {/* Hero Section */}
      <motion.div variants={itemAnim} className="mb-10">
        <div className="flex items-center gap-2 text-sm font-medium text-muted/60 mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{dateStr}</span>
        </div>
        <h1 className="text-[34px] sm:text-[40px] font-extrabold tracking-[-0.02em] leading-tight text-foreground">
          {getGreeting()}, Tyrone Alariao
        </h1>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-5 mb-8">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            custom={i}
            variants={kpiAnim}
            initial="hidden"
            animate="visible"
            className="group relative bg-surface rounded-2xl shadow-sm border border-border/40 overflow-hidden hover:shadow-xl hover:shadow-black/5 hover:border-border/60 hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent via-transparent to-primary/[0.02] rounded-full -translate-y-12 translate-x-12 group-hover:to-primary/[0.04] transition-all duration-500" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-muted/60 uppercase tracking-widest">{kpi.label}</span>
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${kpi.gradient} ring-1 ${kpi.ring}`}>
                  <kpi.icon className={`h-4.5 w-4.5 ${kpi.iconColor}`} />
                </div>
              </div>
              <div className="flex items-end justify-between gap-2">
                <div>
                  <p className="text-[32px] font-bold text-foreground tracking-tight leading-none">{kpi.value}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      kpi.up
                        ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"
                        : "bg-red-500/10 text-red-500 dark:text-red-400"
                    }`}>
                      {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {kpi.change}
                    </span>
                    <span className="text-xs text-muted/40">vs last month</span>
                  </div>
                </div>
                <Sparkline data={kpi.trend} color={kpi.trendColor} className="hidden sm:block opacity-40 group-hover:opacity-80 transition-opacity duration-300 shrink-0" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Section */}
      <motion.div variants={itemAnim} className="grid grid-cols-1 gap-6 lg:grid-cols-5 mb-8">
        {/* Monthly Sales Overview - 70% */}
        <div className="lg:col-span-3">
          <SalesChart />
        </div>

        {/* Supplier Performance - 30% */}
        <div className="lg:col-span-2 bg-surface rounded-2xl shadow-sm border border-border/40 overflow-hidden">
          <div className="p-6 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-foreground tracking-tight">Supplier Performance</h3>
                <p className="text-sm text-muted/60 mt-1">Score by supplier</p>
              </div>
              <Link href="/suppliers" className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors">View all</Link>
            </div>
            {supplierChartData.length === 0 ? (
              <p className="text-sm text-muted/50 py-16 text-center">No supplier data</p>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={supplierChartData} barGap={4} barCategoryGap="24%" layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.2} horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted)" }} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted)" }} width={70} />
                    <Tooltip
                      cursor={{ fill: "var(--color-border)", opacity: 0.08 }}
                      contentStyle={{
                        background: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "16px",
                        fontSize: "13px",
                        boxShadow: "var(--shadow-xl)",
                        padding: "12px 16px",
                        backdropFilter: "blur(12px)",
                      }}
                      labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                    />
                    <Bar dataKey="Score" fill="var(--color-primary)" radius={[0, 6, 6, 0]} maxBarSize={18} />
                    <Bar dataKey="Quality" fill="#34d399" radius={[0, 6, 6, 0]} maxBarSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Bottom Section */}
      <motion.div variants={itemAnim} className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        {/* Recent Transactions */}
        <div className="bg-surface rounded-2xl shadow-sm border border-border/40 overflow-hidden">
          <div className="p-6 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20">
                  <Receipt className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground tracking-tight">Recent Transactions</h3>
                  <p className="text-xs text-muted/60 mt-0.5">Latest 5 orders</p>
                </div>
              </div>
              <Link href="/orders" className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors">View all</Link>
            </div>
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-muted/50 py-10 text-center">No transactions yet</p>
            ) : (
              <div className="space-y-1">
                {recentTransactions.map((o, idx) => (
                  <div key={o.id} className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-border/20 transition-colors -mx-1">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-border/30 text-xs font-bold text-muted/50">
                        {String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{o.orderNo}</p>
                        <p className="text-xs text-muted/60 mt-0.5 truncate">{o.customer}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-bold text-foreground">${o.total.toFixed(2)}</span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${
                        o.status === "delivered" ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400" :
                        o.status === "shipped" ? "bg-gray-500/10 text-gray-500 dark:text-gray-400" :
                        o.status === "processing" ? "bg-blue-500/10 text-blue-500 dark:text-blue-400" :
                        o.status === "cancelled" ? "bg-red-500/10 text-red-500 dark:text-red-400" : "bg-amber-500/10 text-amber-500 dark:text-amber-400"
                      }`}>{o.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-surface rounded-2xl shadow-sm border border-border/40 overflow-hidden">
          <div className="p-6 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/5 ring-1 ring-red-500/20">
                  <AlertTriangle className="h-4.5 w-4.5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground tracking-tight">Low Stock Alerts</h3>
                  <p className="text-xs text-muted/60 mt-0.5">Products below threshold</p>
                </div>
              </div>
              <Link href="/products" className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors">Manage</Link>
            </div>
            {lowStockItems.length === 0 ? (
              <p className="text-sm text-emerald-500 py-10 text-center font-medium">All products are well stocked</p>
            ) : (
              <div className="space-y-1">
                {lowStockItems.slice(0, 5).map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-border/20 transition-colors -mx-1">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/5 ring-1 ring-amber-500/20 text-sm font-bold text-amber-500">
                        <Box className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                        <p className="text-xs text-muted/60">SKU: {p.sku}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="w-16 h-2 rounded-full bg-border/30 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min((p.stock / 20) * 100, 100)}%`,
                            background: p.stock <= 5
                              ? "linear-gradient(90deg, #ef4444, #f87171)"
                              : "linear-gradient(90deg, #f59e0b, #fbbf24)",
                          }}
                        />
                      </div>
                      <span className={`text-sm font-bold ${p.stock <= 5 ? "text-red-500" : "text-amber-500"}`}>{p.stock}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Business Insights */}
        <div className="bg-surface rounded-2xl shadow-sm border border-border/40 overflow-hidden">
          <div className="p-6 sm:p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 ring-1 ring-emerald-500/20">
                <BarChart3 className="h-4.5 w-4.5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground tracking-tight">Business Insights</h3>
                <p className="text-xs text-muted/60 mt-0.5">Performance summary</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                {
                  label: "Average Order Value",
                  icon: DollarSign,
                  value: `$${(totalRevenue / (totalOrders || 1)).toFixed(0)}`,
                  change: "+5.2%",
                  up: true,
                  gradient: "from-blue-500/20 to-blue-500/5",
                  iconColor: "text-blue-500",
                },
                {
                  label: "Profit Margin",
                  icon: TrendingUp,
                  value: `${((summary.totalRevenue - summary.totalCost) / (summary.totalRevenue || 1) * 100).toFixed(1)}%`,
                  change: "+2.1%",
                  up: true,
                  gradient: "from-emerald-500/20 to-emerald-500/5",
                  iconColor: "text-emerald-500",
                },
                {
                  label: "Supplier SPI Average",
                  icon: Layers,
                  value: `${Math.round(allSuppliers.reduce((s, su) => s + su.evaluationScore, 0) / (allSuppliers.length || 1))}%`,
                  change: "+1.8%",
                  up: true,
                  gradient: "from-cyan-500/20 to-cyan-500/5",
                  iconColor: "text-cyan-500",
                },
                {
                  label: "Pending Orders",
                  icon: Clock,
                  value: allOrders.filter((o) => o.status === "pending" || o.status === "processing").length.toString(),
                  change: "-3",
                  up: false,
                  gradient: "from-amber-500/20 to-amber-500/5",
                  iconColor: "text-amber-500",
                },
              ].map((insight) => (
                <div key={insight.label} className="flex items-center justify-between rounded-xl bg-border/20 px-4 py-3 hover:bg-border/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${insight.gradient} ring-1 ${insight.gradient.replace("from-", "ring-").replace("/20", "/15")}`}>
                      <insight.icon className={`h-4 w-4 ${insight.iconColor}`} />
                    </div>
                    <span className="text-sm font-medium text-muted/80">{insight.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{insight.value}</p>
                    <span className={`text-xs font-semibold ${insight.up ? "text-emerald-500" : "text-red-500"}`}>
                      {insight.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div variants={itemAnim} className="flex items-center justify-between text-sm border-t border-border/30 pt-6 mt-2">
        <div className="flex items-center gap-3 text-muted/50">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary-dark">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
          <span className="font-semibold text-muted/70">TRI-M</span>
          <span className="text-muted/30">|</span>
          <span className="text-muted/50">SME Management System</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-muted/40">{dateStr}</span>
          <button onClick={handleRetry} className="inline-flex items-center gap-1.5 text-muted/50 hover:text-primary transition-colors font-medium">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
