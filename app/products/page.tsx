"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X, Plus, Edit2, Trash2, Grid3X3, List, AlertCircle, RefreshCw } from "lucide-react";
import ProductCard from "../components/product-card";
import ProductForm from "../components/product-form";
import { useProducts } from "../data/use-store";
import { addProduct, updateProduct, deleteProduct } from "../data/store";
import type { Product } from "@/lib/api";

function LoadingSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-8 w-1 rounded-full bg-border/50" />
        <div>
          <div className="h-7 w-32 rounded bg-border/30 animate-pulse" />
          <div className="h-4 w-48 rounded bg-border/20 animate-pulse mt-2" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-card rounded-xl border border-border/20 overflow-hidden">
            <div className="aspect-square bg-border/10 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-20 rounded bg-border/30 animate-pulse" />
              <div className="h-4 w-32 rounded bg-border/30 animate-pulse" />
              <div className="h-3 w-16 rounded bg-border/20 animate-pulse" />
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
        <p className="text-sm font-medium text-foreground">Failed to load products</p>
        <p className="text-xs text-muted/60 mt-1 mb-4">{message}</p>
        <button onClick={onRetry} className="btn-primary text-xs flex items-center gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const storeProducts = useProducts();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  if (storeProducts.loading) return <LoadingSkeleton />;
  if (storeProducts.error) return <ErrorState message={storeProducts.error} onRetry={storeProducts.refetch} />;

  const products = storeProducts.data;
  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const filtered = products
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async (data: Omit<Product, "id" | "createdAt">) => {
    setLoading(true);
    if (editing) await updateProduct(editing.id, data);
    else await addProduct(data);
    setEditing(null);
    setShowForm(false);
    setLoading(false);
    storeProducts.refetch();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      storeProducts.refetch();
    }
  };

  const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } } };
  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary to-primary/40" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Products</h1>
            <p className="text-sm text-muted/65 mt-0.5">{filtered.length} of {products.length} products</p>
          </div>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-xs">
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-[12px] px-2.5 py-1 text-sm font-medium transition-all ${
                activeCategory === cat ? "bg-primary text-white shadow-sm" : "text-muted/70 hover:text-foreground hover:bg-border/20"
              }`}>
              {cat} <span className="text-xs opacity-60">({cat === "All" ? products.length : products.filter((p) => p.category === cat).length})</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/55 group-focus-within:text-primary/50 transition-colors" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-48 rounded-[12px] border border-border/40 bg-surface/50 py-1.5 pl-8 pr-7 text-sm text-foreground outline-none transition-all focus:border-primary/20 focus:bg-surface focus:shadow-sm" />
            {search && <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted/55 hover:text-foreground"><X className="h-3.5 w-3.5" /></button>}
          </div>
          <div className="rounded-[12px] border border-border/30 overflow-hidden">
            <button onClick={() => setViewMode("grid")} className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-primary text-white" : "text-muted/60 hover:bg-border/20"}`}><Grid3X3 className="h-3.5 w-3.5" /></button>
            <button onClick={() => setViewMode("list")} className={`border-l border-border/30 p-1.5 transition-colors ${viewMode === "list" ? "bg-primary text-white" : "text-muted/60 hover:bg-border/20"}`}><List className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20">
            <div className="h-10 w-10 flex items-center justify-center rounded-[12px] bg-border/20 mb-3">
              <Search className="h-5 w-5 text-muted/60" />
            </div>
            <p className="text-sm text-foreground">No products found</p>
            <p className="text-xs text-muted/60 mt-1">Try adjusting your search</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
                <div className="absolute right-2 top-2 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditing(product); setShowForm(true); }} className="bg-background/80 backdrop-blur-sm rounded-[12px] p-1.5 text-muted/70 hover:text-primary transition-colors"><Edit2 className="h-3 w-3" /></button>
                  <button onClick={() => handleDelete(product.id)} className="bg-background/80 backdrop-blur-sm rounded-[12px] p-1.5 text-muted/70 hover:text-red-500 transition-colors"><Trash2 className="h-3 w-3" /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-hover bg-card rounded-[20px] border border-border/20 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary/35 to-primary/5" />
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-muted/60 border-b border-border/10">
                  <th className="p-3 font-medium">Product</th><th className="p-3 font-medium">SKU</th><th className="p-3 font-medium">Category</th>
                  <th className="p-3 font-medium">Price</th><th className="p-3 font-medium">Cost</th><th className="p-3 font-medium">Stock</th>
                  <th className="p-3 font-medium">Status</th><th className="p-3 font-medium text-right"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-border/5 last:border-0 hover:bg-border/10 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-[12px] bg-gradient-to-br from-primary/[0.08] to-primary/[0.02] text-xs font-medium text-primary ring-1 ring-primary/10">{p.image}</div>
                        <div><p className="text-sm text-foreground">{p.name}</p><p className="text-xs text-muted/60">{p.brand}</p></div>
                      </div>
                    </td>
                    <td className="p-3 text-muted/65">{p.sku}</td>
                    <td className="p-3"><span className="badge badge-gray">{p.category}</span></td>
                    <td className="p-3 text-sm text-foreground">${p.price.toFixed(2)}</td>
                    <td className="p-3 text-muted/65">${p.cost.toFixed(2)}</td>
                    <td className="p-3"><span className={`text-sm ${p.stock < 20 ? "text-red-500" : "text-foreground"}`}>{p.stock}</span></td>
                    <td className="p-3">
                      <span className={`badge ${p.inStock ? "badge-green" : "badge-red"}`}>
                        <span className={`h-1 w-1 rounded-full ${p.inStock ? "bg-emerald-500" : "bg-red-500"}`} />
                        {p.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => { setEditing(p); setShowForm(true); }} className="rounded p-1 text-muted/55 hover:text-primary transition-colors"><Edit2 className="h-3.5 w-3.5" /></button>
                      <button onClick={() => handleDelete(p.id)} className="rounded p-1 text-muted/55 hover:text-red-500 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {showForm && <ProductForm initial={editing || undefined} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />}
    </motion.div>
  );
}
