"use client";

import { useState } from "react";
import type { Product } from "@/lib/api";

interface Props {
  onClose: () => void;
  onSave: (p: Omit<Product, "id" | "createdAt">) => void;
  initial?: Product;
}

const defaultForm = {
  name: "", brand: "", price: 0, cost: 0, originalPrice: undefined as number | undefined,
  rating: 0, reviews: 0, badge: "", image: "📦", category: "Electronics",
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
      badge: form.badge, image: form.image || "📦", category: form.category,
      inStock: form.stock > 0, stock: Number(form.stock), sku: form.sku,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-card rounded-xl shadow-lg border border-border/30 p-5" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-sm font-semibold text-foreground mb-4">{initial ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-muted/50">Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded border border-border/50 bg-surface px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary/30" />
            </div>
            <div>
              <label className="text-xs text-muted/50">Brand</label>
              <input required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="mt-1 w-full rounded border border-border/50 bg-surface px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary/30" />
            </div>
            <div>
              <label className="text-xs text-muted/50">SKU</label>
              <input required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="mt-1 w-full rounded border border-border/50 bg-surface px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary/30" />
            </div>
            <div>
              <label className="text-xs text-muted/50">Price</label>
              <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="mt-1 w-full rounded border border-border/50 bg-surface px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary/30" />
            </div>
            <div>
              <label className="text-xs text-muted/50">Cost</label>
              <input type="number" step="0.01" min="0" value={form.cost} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} className="mt-1 w-full rounded border border-border/50 bg-surface px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary/30" />
            </div>
            <div>
              <label className="text-xs text-muted/50">Stock</label>
              <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value), inStock: Number(e.target.value) > 0 })} className="mt-1 w-full rounded border border-border/50 bg-surface px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary/30" />
            </div>
            <div>
              <label className="text-xs text-muted/50">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded border border-border/50 bg-surface px-2.5 py-1.5 text-sm text-foreground outline-none">
                {["Electronics", "Fashion", "Home & Living", "Sports", "Beauty", "Accessories"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted/50">Badge</label>
              <input value={form.badge || ""} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Sale" className="mt-1 w-full rounded border border-border/50 bg-surface px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary/30" />
            </div>
            <div>
              <label className="text-xs text-muted/50">Emoji</label>
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="mt-1 w-full rounded border border-border/50 bg-surface px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary/30" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded border border-border/50 py-1.5 text-sm text-muted/60 hover:bg-border/30">Cancel</button>
            <button type="submit" className="flex-1 rounded bg-primary py-1.5 text-sm font-medium text-white hover:bg-primary-dark">{initial ? "Save" : "Add"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
