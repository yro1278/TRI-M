"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, AlertCircle, RefreshCw } from "lucide-react";
import { useOrders } from "../data/use-store";
import { updateOrderStatus } from "../data/store";

const statusColors: Record<string, string> = {
  pending: "badge-amber",
  processing: "badge-blue",
  shipped: "badge-gray",
  delivered: "badge-green",
  cancelled: "badge-red",
};

function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-8 w-1 rounded-full bg-border/50" />
        <div>
          <div className="h-7 w-24 rounded bg-border/30 animate-pulse" />
          <div className="h-4 w-36 rounded bg-border/20 animate-pulse mt-2" />
        </div>
      </div>
      <div className="bg-card rounded-[20px] border border-border/20 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary/35 to-primary/5" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-border/5">
            <div className="h-4 w-24 rounded bg-border/30 animate-pulse" />
            <div className="h-4 w-20 rounded bg-border/20 animate-pulse" />
            <div className="h-4 w-12 rounded bg-border/20 animate-pulse" />
            <div className="h-4 w-16 rounded bg-border/30 animate-pulse ml-auto" />
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
        <p className="text-sm font-medium text-foreground">Failed to load orders</p>
        <p className="text-xs text-muted/60 mt-1 mb-4">{message}</p>
        <button onClick={onRetry} className="btn-primary text-xs flex items-center gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const storeOrders = useOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  if (storeOrders.loading) return <LoadingSkeleton />;
  if (storeOrders.error) return <ErrorState message={storeOrders.error} onRetry={storeOrders.refetch} />;

  const orders = [...storeOrders.data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleStatus = async (id: number, status: string) => {
    await updateOrderStatus(id, status);
    storeOrders.refetch();
  };

  const filtered = orders.filter((o) => {
    const matchSearch = o.orderNo.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } } };
  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div variants={fadeUp} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary to-primary/40" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Orders</h1>
            <p className="text-sm text-muted/65 mt-0.5">{orders.length} total orders</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
        <div className="relative group">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/55 group-focus-within:text-primary/50 transition-colors" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-56 rounded-[12px] border border-border/40 bg-surface/50 py-1.5 pl-8 pr-3 text-sm text-foreground outline-none transition-all focus:border-primary/20 focus:bg-surface focus:shadow-sm" />
        </div>
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {(["all", "pending", "processing", "shipped", "delivered", "cancelled"] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`shrink-0 rounded-[12px] px-2.5 py-1 text-xs font-medium transition-all ${
                statusFilter === s ? "bg-primary text-white shadow-sm" : "text-muted/70 hover:text-foreground hover:bg-border/20"
              }`}>
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20">
          <div className="h-10 w-10 flex items-center justify-center rounded-[12px] bg-border/20 mb-3">
            <Package className="h-5 w-5 text-muted/60" />
          </div>
          <p className="text-sm text-foreground">No orders found</p>
        </div>
      ) : (
        <div className="card-hover bg-card rounded-[20px] border border-border/20 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary/35 to-primary/5" />
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-muted/60 border-b border-border/10">
                <th className="p-3 font-medium">Order</th><th className="p-3 font-medium">Customer</th><th className="p-3 font-medium">Items</th>
                <th className="p-3 font-medium">Total</th><th className="p-3 font-medium">Date</th><th className="p-3 font-medium">Payment</th>
                <th className="p-3 font-medium">Status</th><th className="p-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b border-border/5 last:border-0 hover:bg-border/10 transition-colors">
                  <td className="p-3 font-medium text-foreground">{o.orderNo}</td>
                  <td className="p-3 text-foreground">{o.customer}</td>
                  <td className="p-3 text-muted/65">{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
                  <td className="p-3 font-medium text-foreground">${o.total.toFixed(2)}</td>
                  <td className="p-3 text-muted/65">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-muted/65">{o.paymentMethod}</td>
                  <td className="p-3"><span className={`badge ${statusColors[o.status]}`}>{o.status}</span></td>
                  <td className="p-3 text-right">
                    <select value={o.status} onChange={(e) => handleStatus(o.id, e.target.value)}
                      className="rounded-[12px] border border-border/30 bg-surface px-2 py-1 text-xs text-foreground outline-none focus:border-primary/30 transition-colors">
                      <option value="pending">Pending</option><option value="processing">Processing</option>
                      <option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </motion.div>
    </motion.div>
  );
}
