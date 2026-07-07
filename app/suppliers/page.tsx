"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Star, Phone, Mail, Award, AlertCircle, RefreshCw } from "lucide-react";
import { useSuppliers } from "../data/use-store";
import type { Supplier } from "@/lib/api";

function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-[20px] p-5 border border-border/20">
            <div className="h-3 w-16 rounded bg-border/30 animate-pulse mb-3" />
            <div className="h-6 w-12 rounded bg-border/30 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-card rounded-[20px] p-5 border border-border/20">
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
        <button onClick={onRetry} className="btn-primary text-xs flex items-center gap-1.5">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-card rounded-[20px] shadow-lg border border-border/20 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{s.logo}</span>
            <div><p className="text-sm font-semibold text-foreground">{s.name}</p><p className="text-xs text-muted/65">Since {s.since}</p></div>
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
              <span className="w-20 text-muted/65">{m.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-border/20"><div className={`h-1.5 rounded-full ${m.color}`} style={{ width: `${s[m.key as keyof Supplier] as number}%` }} /></div>
              <span className="w-6 text-right text-muted/65">{s[m.key as keyof Supplier] as number}%</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-border/10 flex items-center justify-between">
          <span className="text-xs text-muted/60">SPI Score</span>
          <span className="text-sm font-bold text-primary">{s.evaluationScore}%</span>
        </div>
      </div>
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
      { label: "Active", value: active.toString(), change: `${suppliers.length > 0 ? ((active / suppliers.length) * 100).toFixed(0) : 0}%`, up: true, icon: Award },
      { label: "Avg Score", value: `${avgScore}%`, change: "+2.1%", up: true, icon: Star },
      { label: "A-Grade", value: aGrade.toString(), change: "+1", up: true, icon: Star },
      { label: "Total", value: suppliers.length.toString(), change: "Stable", up: true, icon: Award },
    ];
  }, [suppliers]);

  const filtered = suppliers.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.contact.toLowerCase().includes(search.toLowerCase()));

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
          <div><h1 className="text-2xl font-semibold tracking-tight text-foreground">Suppliers</h1><p className="text-sm text-muted/65 mt-0.5">Manage supplier performance</p></div>
        </div>
        <button className="btn-primary text-xs"><Plus className="h-3.5 w-3.5" /> Add</button>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="card-hover bg-card rounded-[20px] p-5 border border-border/20 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary/35 to-primary/5 -mx-5 -mt-5 mb-4" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-muted/70 uppercase tracking-[0.06em]">{k.label}</span>
                <div className={`rounded-[12px] p-1.5 ring-1 ${iconColors[i % 4].bg} ${iconColors[i % 4].ring}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <p className="text-xl font-semibold text-foreground tracking-tight">{k.value}</p>
              <span className={`badge mt-2 ${k.up ? "badge-green" : "badge-red"}`}>{k.change}</span>
            </div>
          );
        })}
      </motion.div>

      <motion.div variants={fadeUp} className="relative mb-6 group">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/55 group-focus-within:text-primary/50 transition-colors" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-56 rounded-[12px] border border-border/40 bg-surface/50 py-1.5 pl-8 pr-3 text-sm text-foreground outline-none transition-all focus:border-primary/20 focus:bg-surface focus:shadow-sm" />
      </motion.div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20">
          <div className="h-10 w-10 flex items-center justify-center rounded-[12px] bg-border/20 mb-3">
            <Search className="h-5 w-5 text-muted/60" />
          </div>
          <p className="text-sm text-foreground">No suppliers found</p>
        </div>
      ) : (
      <motion.div variants={fadeUp} className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {filtered.map((s) => (
          <div key={s.id} className="card-hover bg-card rounded-[20px] p-5 border border-border/20 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary/35 to-primary/5 -mx-5 -mt-5 mb-4" />
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{s.logo}</span>
                <div><p className="text-sm font-semibold text-foreground">{s.name}</p><p className="text-xs text-muted/65">{s.contact}</p></div>
              </div>
              <span className={`badge ${s.status === "active" ? "badge-green" : s.status === "inactive" ? "badge-gray" : "badge-red"}`}>{s.status}</span>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted/65 mb-3">
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
            <button onClick={() => setEvaluating(s)} className="btn-secondary w-full mt-3 text-xs">View Evaluation</button>
          </div>
        ))}
      </motion.div>
      )}

      {evaluating && <EvaluationScorecard supplier={evaluating} onClose={() => setEvaluating(null)} />}
    </motion.div>
  );
}
