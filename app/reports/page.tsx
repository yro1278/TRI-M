"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Printer, TrendingUp, Truck, Calendar, FileText, FileSpreadsheet, AlertCircle, RefreshCw } from "lucide-react";
import { useSales, useOrders, useSuppliers } from "../data/use-store";
import type { SalesRecord, Supplier, Order } from "@/lib/api";

type ReportType = "sales" | "supplier";

function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="bg-card rounded-[20px] border border-border/20 p-6">
        <div className="h-4 w-32 rounded bg-border/30 animate-pulse mb-4" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card rounded-[20px] p-4 border border-border/20">
              <div className="h-3 w-16 rounded bg-border/30 animate-pulse mb-2" />
              <div className="h-6 w-20 rounded bg-border/30 animate-pulse" />
            </div>
          ))}
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
        <p className="text-sm font-medium text-foreground">Failed to load report data</p>
        <p className="text-xs text-muted/60 mt-1 mb-4">{message}</p>
        <button onClick={onRetry} className="btn-primary text-xs flex items-center gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      </div>
    </div>
  );
}

function SalesReportContent({ sales, orders }: { sales: SalesRecord[]; orders: Order[] }) {
  const totalRevenue = sales.reduce((s, r) => s + r.revenue, 0);
  const totalCost = sales.reduce((s, r) => s + r.cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const margin = ((totalProfit / totalRevenue) * 100).toFixed(1);
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Revenue", value: `$${totalRevenue.toLocaleString()}`, sub: "+12.5%" },
          { label: "Cost", value: `$${totalCost.toLocaleString()}`, sub: "+8.3%" },
          { label: "Profit", value: `$${totalProfit.toLocaleString()}`, sub: `+${margin}%` },
          { label: "Orders", value: totalOrders.toString(), sub: `${deliveredOrders} delivered` },
        ].map((s) => (
          <div key={s.label} className="card-hover bg-card rounded-[20px] p-4 border border-border/20 overflow-hidden"><div className="h-1 bg-gradient-to-r from-primary/35 to-primary/5 -mx-4 -mt-4 mb-3" />
            <p className="text-[11px] font-medium text-muted/70 uppercase tracking-[0.06em]">{s.label}</p>
            <p className="mt-1.5 text-lg font-semibold text-foreground tracking-tight">{s.value}</p>
            <p className="text-xs text-muted/60 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>
      {sales.length === 0 ? (
        <p className="text-sm text-muted/60 py-8 text-center">No sales data available</p>
      ) : (
      <div className="card-hover bg-card rounded-[20px] border border-border/20 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary/35 to-primary/5" />
        <table className="w-full text-left text-sm">
          <thead><tr className="text-xs text-muted/60 border-b border-border/10">
            <th className="p-3 font-medium">Month</th><th className="p-3 font-medium">Revenue</th><th className="p-3 font-medium">Cost</th>
            <th className="p-3 font-medium">Profit</th><th className="p-3 font-medium">Orders</th><th className="p-3 font-medium text-right">Margin</th>
          </tr></thead>
          <tbody>
            {sales.map((r) => {
              const profit = r.revenue - r.cost;
              const mg = ((profit / r.revenue) * 100).toFixed(1);
              return (
                <tr key={r.month} className="border-b border-border/5 last:border-0 hover:bg-border/10 transition-colors">
                  <td className="p-3 text-foreground">{r.month} {r.year}</td>
                  <td className="p-3 text-foreground">${r.revenue.toLocaleString()}</td>
                  <td className="p-3 text-foreground">${r.cost.toLocaleString()}</td>
                  <td className={`p-3 font-medium ${profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>${profit.toLocaleString()}</td>
                  <td className="p-3 text-muted/65">{r.orders}</td>
                  <td className="p-3 text-right text-foreground">{mg}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="card-hover bg-card rounded-[20px] p-4 border border-border/20 overflow-hidden"><div className="h-1 bg-gradient-to-r from-amber-400/35 to-amber-400/5 -mx-4 -mt-4 mb-3" /><p className="text-[11px] font-medium text-muted/70 uppercase tracking-[0.06em]">Pending</p><p className="mt-1.5 text-xl font-semibold text-amber-600 dark:text-amber-400">{orders.filter((o) => o.status === "pending" || o.status === "processing").length}</p></div>
        <div className="card-hover bg-card rounded-[20px] p-4 border border-border/20 overflow-hidden"><div className="h-1 bg-gradient-to-r from-emerald-400/35 to-emerald-400/5 -mx-4 -mt-4 mb-3" /><p className="text-[11px] font-medium text-muted/70 uppercase tracking-[0.06em]">Delivered</p><p className="mt-1.5 text-xl font-semibold text-emerald-600 dark:text-emerald-400">{deliveredOrders}</p></div>
        <div className="card-hover bg-card rounded-[20px] p-4 border border-border/20 overflow-hidden"><div className="h-1 bg-gradient-to-r from-primary/35 to-primary/5 -mx-4 -mt-4 mb-3" /><p className="text-[11px] font-medium text-muted/70 uppercase tracking-[0.06em]">Avg Order</p><p className="mt-1.5 text-xl font-semibold text-foreground">${(totalRevenue / (totalOrders || 1)).toFixed(0)}</p></div>
      </div>
    </div>
  );
}

function SupplierReportContent({ suppliers }: { suppliers: Supplier[] }) {
  const active = suppliers.filter((s) => s.status === "active");
  const avgScore = Math.round(suppliers.reduce((s, su) => s + su.evaluationScore, 0) / suppliers.length);
  const aGrade = suppliers.filter((s) => s.evaluationGrade === "A").length;
  const topPerformer = suppliers.reduce((best, s) => s.evaluationScore > best.evaluationScore ? s : best, suppliers[0]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total", value: suppliers.length.toString(), sub: `${active.length} active` },
          { label: "Avg SPI", value: `${avgScore}%`, sub: "Score" },
          { label: "A-Grade", value: aGrade.toString(), sub: "Top" },
          { label: "Best", value: topPerformer?.name || "—", sub: `${topPerformer?.evaluationScore || 0}%` },
        ].map((s) => (
          <div key={s.label} className="card-hover bg-card rounded-[20px] p-4 border border-border/20 overflow-hidden"><div className="h-1 bg-gradient-to-r from-primary/35 to-primary/5 -mx-4 -mt-4 mb-3" />
            <p className="text-[11px] font-medium text-muted/70 uppercase tracking-[0.06em]">{s.label}</p>
            <p className="mt-1.5 text-lg font-semibold text-foreground tracking-tight">{s.value}</p>
            <p className="text-xs text-muted/60 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>
      {suppliers.length === 0 ? (
        <p className="text-sm text-muted/60 py-8 text-center">No supplier data available</p>
      ) : (
      <div className="card-hover bg-card rounded-[20px] border border-border/20 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary/35 to-primary/5" />
        <table className="w-full text-left text-sm">
          <thead><tr className="text-xs text-muted/60 border-b border-border/10">
            <th className="p-3 font-medium">Supplier</th><th className="p-3 font-medium">Status</th><th className="p-3 font-medium">Orders</th>
            <th className="p-3 font-medium">On-Time</th><th className="p-3 font-medium">Quality</th><th className="p-3 font-medium">SPI</th>
            <th className="p-3 font-medium text-right">Grade</th>
          </tr></thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id} className="border-b border-border/5 last:border-0 hover:bg-border/10 transition-colors">
                <td className="p-3 text-foreground">{s.name}</td>
                <td className="p-3"><span className={`badge ${s.status === "active" ? "badge-green" : "badge-gray"}`}>{s.status}</span></td>
                <td className="p-3 text-muted/65">{s.totalOrders}</td>
                <td className="p-3 text-muted/65">{s.onTimeDelivery}%</td>
                <td className="p-3 text-muted/65">{s.qualityRating}%</td>
                <td className="p-3 font-medium text-foreground">{s.evaluationScore}%</td>
                <td className="p-3 text-right"><span className={`badge ${s.evaluationGrade === "A" ? "badge-green" : s.evaluationGrade === "B" ? "badge-blue" : "badge-amber"}`}>{s.evaluationGrade}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}

export default function ReportsPage() {
  const [type, setType] = useState<ReportType>("sales");
  const [period, setPeriod] = useState("2026");
  const storeSales = useSales();
  const storeSuppliers = useSuppliers();
  const storeOrders = useOrders();

  if (storeSales.loading || storeSuppliers.loading || storeOrders.loading) return <LoadingSkeleton />;
  if (storeSales.error || storeSuppliers.error || storeOrders.error) {
    return <ErrorState message={storeSales.error || storeSuppliers.error || storeOrders.error || ""} onRetry={() => { storeSales.refetch(); storeSuppliers.refetch(); storeOrders.refetch(); }} />;
  }

  const sales = storeSales.data;
  const suppliers = storeSuppliers.data;
  const orders = storeOrders.data;
  const generateDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const exportCSV = () => {
    const rows = [["Month", "Year", "Revenue", "Cost", "Profit", "Orders", "Margin"]];
    sales.forEach((r) => {
      const profit = r.revenue - r.cost;
      const mg = r.revenue > 0 ? ((profit / r.revenue) * 100).toFixed(1) : "0";
      rows.push([r.month, String(r.year), String(r.revenue), String(r.cost), String(profit), String(r.orders), mg]);
    });
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const data = {
      generatedAt: new Date().toISOString(),
      type: "sales",
      records: sales,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } } };
  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary to-primary/40" />
          <div><h1 className="text-2xl font-semibold tracking-tight text-foreground">Reports</h1><p className="text-sm text-muted/65 mt-0.5">Generate and export reports</p></div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="btn-secondary text-xs"><FileSpreadsheet className="h-3.5 w-3.5" /> CSV</button>
          <button onClick={exportJSON} className="btn-secondary text-xs"><FileText className="h-3.5 w-3.5" /> JSON</button>
          <button onClick={() => window.print()} className="btn-secondary text-xs"><Printer className="h-3.5 w-3.5" /> Print</button>
          <button className="btn-primary text-xs"><Download className="h-3.5 w-3.5" /> Export</button>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
        <div className="flex rounded-[12px] border border-border/30 overflow-hidden">
          {(["sales", "supplier"] as const).map((t) => (
            <button key={t} onClick={() => setType(t)}
              className={`px-3 py-1.5 text-sm font-medium transition-all ${type === t ? "bg-primary text-white" : "text-muted/70 hover:text-foreground hover:bg-border/20"}`}>
              {t === "sales" ? "Sales" : "Suppliers"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted/65">
          <Calendar className="h-3.5 w-3.5" />
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="bg-transparent text-foreground outline-none"><option>2026</option><option>2025</option></select>
        </div>
        <span className="text-xs text-muted/55">{generateDate}</span>
      </motion.div>

      <motion.div variants={fadeUp} className="card-hover bg-card rounded-[20px] border border-border/20 p-6 space-y-5 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary/35 to-primary/5 -mx-6 -mt-6 mb-4" />
        <div className="border-b border-border/10 pb-3">
          <div className="flex items-center gap-2">
            {type === "sales" ? <TrendingUp className="h-4 w-4 text-primary" /> : <Truck className="h-4 w-4 text-primary" />}
            <h2 className="text-sm font-semibold text-foreground">{type === "sales" ? "Sales Report" : "Supplier Report"}</h2>
          </div>
          <p className="text-xs text-muted/55 mt-0.5">Period: {period}</p>
        </div>
        {type === "sales" ? <SalesReportContent sales={sales} orders={orders} /> : <SupplierReportContent suppliers={suppliers} />}
      </motion.div>
    </motion.div>
  );
}
