"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Product } from "@/lib/api";

interface Props {
  onClose: () => void;
  onSave: (p: Omit<Product, "id" | "createdAt">) => void;
  initial?: Product;
}

const defaultForm = {
  name: "", brand: "", price: 0, cost: 0, originalPrice: undefined as number | undefined,
  rating: 0, reviews: 0, badge: "", image: "\uD83D\uDCE6", category: "Electronics",
  inStock: true, stock: 0, sku: "",
};

export default function ProductForm({ onClose, onSave, initial }: Props) {
  const [form, setForm] = useState(initial ? { ...initial } : defaultForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.brand || !form.sku) return;
    onSave({
      name: form.name, brand: form.brand, price: Number(form.price), cost: Number(form.cost),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      rating: Number(form.rating) || 0, reviews: Number(form.reviews) || 0,
      badge: form.badge, image: form.image || "\uD83D\uDCE6", category: form.category,
      inStock: form.stock > 0, stock: Number(form.stock), sku: form.sku,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-surface rounded-xl shadow-xl border border-border/50 p-5" onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">{initial ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-muted/50 hover:text-foreground transition-colors"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-muted/60 font-medium">Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-lg border border-border/40 bg-surface/50 px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary/30 transition-all" />
            </div>
            <div>
              <label className="text-xs text-muted/60 font-medium">Brand</label>
              <input required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="mt-1 w-full rounded-lg border border-border/40 bg-surface/50 px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary/30 transition-all" />
            </div>
            <div>
              <label className="text-xs text-muted/60 font-medium">SKU</label>
              <input required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="mt-1 w-full rounded-lg border border-border/40 bg-surface/50 px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary/30 transition-all" />
            </div>
            <div>
              <label className="text-xs text-muted/60 font-medium">Price</label>
              <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-border/40 bg-surface/50 px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary/30 transition-all" />
            </div>
            <div>
              <label className="text-xs text-muted/60 font-medium">Cost</label>
              <input type="number" step="0.01" min="0" value={form.cost} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-border/40 bg-surface/50 px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary/30 transition-all" />
            </div>
            <div>
              <label className="text-xs text-muted/60 font-medium">Stock</label>
              <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value), inStock: Number(e.target.value) > 0 })} className="mt-1 w-full rounded-lg border border-border/40 bg-surface/50 px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary/30 transition-all" />
            </div>
            <div>
              <label className="text-xs text-muted/60 font-medium">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded-lg border border-border/40 bg-surface/50 px-2.5 py-1.5 text-sm text-foreground outline-none transition-all">
                {["Electronics", "Fashion", "Home & Living", "Sports", "Beauty", "Accessories"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted/60 font-medium">Badge</label>
              <input value={form.badge || ""} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Sale" className="mt-1 w-full rounded-lg border border-border/40 bg-surface/50 px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary/30 transition-all" />
            </div>
            <div>
              <label className="text-xs text-muted/60 font-medium">Emoji</label>
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="mt-1 w-full rounded-lg border border-border/40 bg-surface/50 px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary/30 transition-all" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-border/40 py-1.5 text-sm text-muted/60 hover:bg-border/20 transition-all">Cancel</button>
            <button type="submit" className="flex-1 rounded-lg bg-primary py-1.5 text-sm font-medium text-white hover:bg-primary-dark transition-all">{initial ? "Save" : "Add"}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
