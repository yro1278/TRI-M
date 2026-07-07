"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Star, Phone, Mail, Award, AlertCircle, RefreshCw } from "lucide-react";
import { useSuppliers } from "../data/use-store";
import type { Supplier } from "@/lib/api";
import { fadeUp, stagger } from "../components/page-wrapper";

const iconColors = [
  { bg: "bg-indigo-50 text-indigo-600", ring: "ring-indigo-500/10" },
  { bg: "bg-emerald-50 text-emerald-600", ring: "ring-emerald-500/10" },
  { bg: "bg-amber-50 text-amber-600", ring: "ring-amber-500/10" },
  { bg: "bg-blue-50 text-blue-600", ring: "ring-blue-500/10" },
];

function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="space-y-2 mb-8">
        <div className="h-7 w-32 rounded bg-border/30 animate-pulse" />
        <div className="h-4 w-48 rounded bg-border/20 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface rounded-xl border border-border/50 p-5">
            <div className="h-3 w-16 rounded bg-border/30 animate-pulse mb-3" />
            <div className="h-6 w-12 rounded bg-border/30 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface rounded-xl border border-border/50 p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-8 w-8 rounded-xl bg-border/20 animate-pulse" />
              <div>
                <div className="h-4 w-32 rounded bg-border/30 animate-pulse" />
                <div className="h-3 w-24 rounded bg-border/20 animate-pulse mt-1" />
              </div>
            </div>
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
        <p className="text-sm font-medium text-foreground">Failed to load suppliers</p>
        <p className="text-xs text-muted/60 mt-1 mb-4">{message}</p>
        <button onClick={onRetry} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark transition-all">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      </div>
    </div>
  );
}

function EvaluationScorecard({ supplier: s, onClose }: { supplier: Supplier; onClose: () => void }) {
  type MetricKey = "onTimeDelivery" | "qualityRating" | "pricingCompetitiveness" | "responseTime" | "orderAccuracy";
  const metrics: { label: string; key: MetricKey; weight: string; color: string }[] = [
    { label: "On-Time Delivery", key: "onTimeDelivery", weight: "30%", color: "bg-emerald-500" },
    { label: "Product Quality", key: "qualityRating", weight: "25%", color: "bg-blue-500" },
    { label: "Pricing", key: "pricingCompetitiveness", weight: "20%", color: "bg-amber-500" },
    { label: "Response Time", key: "responseTime", weight: "15%", color: "bg-purple-500" },
    { label: "Order Accuracy", key: "orderAccuracy", weight: "10%", color: "bg-rose-500" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm bg-surface rounded-xl shadow-xl border border-border/50 p-6" onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{s.logo}</span>
            <div><p className="text-sm font-semibold text-foreground">{s.name}</p><p className="text-xs text-muted/60">Since {s.since}</p></div>
          </div>
          <span className={`badge ${s.evaluationGrade === "A" ? "badge-green" : s.evaluationGrade === "B" ? "badge-blue" : "badge-amber"}`}>
            {s.evaluationGrade}
          </span>
        </div>
        <div className="flex items-center justify-center mb-4">
          <div className="relative h-16 w-16 flex items-center justify-center">
            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-border)" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-primary)" strokeWidth="8" strokeDasharray={`${s.evaluationScore * 2.64} 264`} strokeLinecap="round" />
            </svg>
            <span className="absolute text-lg font-bold text-foreground">{s.evaluationScore}</span>
          </div>
        </div>
        <div className="space-y-1.5">
          {metrics.map((m) => (
            <div key={m.label} className="flex items-center gap-2 text-xs">
              <span className="w-20 text-muted/60">{m.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-border/30"><div className={`h-1.5 rounded-full ${m.color}`} style={{ width: `${s[m.key as keyof Supplier] as number}%` }} /></div>
              <span className="w-6 text-right text-muted/60">{s[m.key as keyof Supplier] as number}%</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-border/20 flex items-center justify-between">
          <span className="text-xs text-muted/60">SPI Score</span>
          <span className="text-sm font-bold text-primary">{s.evaluationScore}%</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function SuppliersPage() {
  const storeSuppliers = useSuppliers();
  const [search, setSearch] = useState("");
  const [evaluating, setEvaluating] = useState<Supplier | null>(null);

  if (storeSuppliers.loading) return <LoadingSkeleton />;
  if (storeSuppliers.error) return <ErrorState message={storeSuppliers.error} onRetry={storeSuppliers.refetch} />;

  const suppliers = storeSuppliers.data;

  const kpis = useMemo(() => {
    const active = suppliers.filter((s) => s.status === "active").length;
    const avgScore = suppliers.length > 0 ? Math.round(suppliers.reduce((s, su) => s + su.evaluationScore, 0) / suppliers.length) : 0;
    const aGrade = suppliers.filter((s) => s.evaluationGrade === "A").length;
    return [
      { label: "Active", value: active.toString(), change: `${suppliers.length > 0 ? ((active / suppliers.length) * 100).toFixed(0) : 0}%`, up: true, icon: Award, color: "#6366f1" },
      { label: "Avg Score", value: `${avgScore}%`, change: "+2.1%", up: true, icon: Star, color: "#059669" },
      { label: "A-Grade", value: aGrade.toString(), change: "+1", up: true, icon: Star, color: "#d97706" },
      { label: "Total", value: suppliers.length.toString(), change: "Stable", up: true, icon: Award, color: "#0891b2" },
    ];
  }, [suppliers]);

  const filtered = suppliers.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.contact.toLowerCase().includes(search.toLowerCase()));

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Suppliers</h1>
          <p className="text-sm text-muted/60 mt-1">Manage supplier performance and evaluation</p>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="card-hover bg-surface rounded-xl border border-border/50 overflow-hidden">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-muted/70 uppercase tracking-wider">{k.label}</span>
                  <div className="rounded-lg p-1.5" style={{ backgroundColor: `${k.color}15` }}>
                    <Icon className="h-3.5 w-3.5" style={{ color: k.color }} />
                  </div>
                </div>
                <p className="text-xl font-bold text-foreground tracking-tight">{k.value}</p>
                <span className={`badge mt-2 ${k.up ? "badge-green" : "badge-red"}`}>{k.change}</span>
              </div>
            </div>
          );
        })}
      </motion.div>

      <motion.div variants={fadeUp} className="relative mb-6 group">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/55 group-focus-within:text-primary/50 transition-colors" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search suppliers..." className="w-56 rounded-lg border border-border/40 bg-surface/50 py-1.5 pl-8 pr-3 text-sm text-foreground outline-none transition-all focus:border-primary/30 focus:bg-surface" />
      </motion.div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-border/20 mb-3">
            <Search className="h-5 w-5 text-muted/60" />
          </div>
          <p className="text-sm text-foreground">No suppliers found</p>
        </div>
      ) : (
      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {filtered.map((s) => (
          <div key={s.id} className="card-hover bg-surface rounded-xl border border-border/50 overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{s.logo}</span>
                  <div><p className="text-sm font-semibold text-foreground">{s.name}</p><p className="text-xs text-muted/60">{s.contact}</p></div>
                </div>
                <span className={`badge ${s.status === "active" ? "badge-green" : s.status === "inactive" ? "badge-gray" : "badge-red"}`}>{s.status}</span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-muted/60 mb-3">
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{s.phone}</span>
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{s.email}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {(s.categories || []).map((c: string) => <span key={c} className="badge badge-gray">{c}</span>)}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /><span className="text-xs text-foreground">{s.rating}</span></div>
                <span className={`ml-auto badge ${s.evaluationGrade === "A" ? "badge-green" : s.evaluationGrade === "B" ? "badge-blue" : "badge-amber"}`}>
                  {s.evaluationGrade} — {s.evaluationScore}%
                </span>
              </div>
              <button onClick={() => setEvaluating(s)} className="w-full mt-3 rounded-lg border border-border/40 px-3 py-1.5 text-xs font-medium text-muted/70 hover:text-foreground hover:bg-border/20 transition-all">View Evaluation</button>
            </div>
          </div>
        ))}
      </motion.div>
      )}

      {evaluating && <EvaluationScorecard supplier={evaluating} onClose={() => setEvaluating(null)} />}
    </motion.div>
  );
}
