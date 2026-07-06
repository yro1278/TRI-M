"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, Check, CreditCard } from "lucide-react";
import { getProducts, placeOrder } from "../data/store";

interface CartItem {
  productId: number;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [customer, setCustomer] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [ordered, setOrdered] = useState(false);
  const [orderNo, setOrderNo] = useState("");

  useEffect(() => {
    getProducts().then((products) => {
      setItems([
        { productId: 1, name: "Wireless Noise-Cancelling Headphones", brand: "SonicWave", price: 249.99, quantity: 1, image: "🎧", sku: "SNC-001" },
        { productId: 2, name: "Premium Cotton Hoodie", brand: "UrbanCore", price: 89.99, quantity: 2, image: "👕", sku: "UC-042" },
        { productId: 7, name: "Portable Bluetooth Speaker", brand: "BassDrop", price: 79.99, quantity: 1, image: "🔊", sku: "BD-770" },
      ].filter((c) => products.some((p) => p.id === c.productId)));
    });
  }, []);

  const updateQty = (productId: number, delta: number) => {
    setItems((prev) => prev.map((item) => item.productId === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };
  const removeItem = (productId: number) => setItems((prev) => prev.filter((item) => item.productId !== productId));

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 250 ? 0 : 15.99;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    const order = await placeOrder(
      items.map((i) => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity })),
      customer || "Guest", email || "guest@example.com", paymentMethod
    );
    setOrderNo(order.orderNo);
    setOrdered(true);
    setItems([]);
  };

  const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } } };
  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };

  if (ordered) {
    return (
      <motion.div variants={container} initial="hidden" animate="visible" className="flex flex-col items-center justify-center py-24 max-w-6xl mx-auto px-4">
        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 mb-4">
          <Check className="h-5 w-5 text-emerald-600" />
        </div>
        <h1 className="text-lg font-semibold text-foreground">Order Placed!</h1>
        <p className="text-sm text-muted/60 mt-1">Order <span className="font-medium text-foreground">{orderNo}</span> confirmed.</p>
        <div className="flex gap-3 mt-6">
          <Link href="/orders" className="rounded border border-border/50 px-4 py-1.5 text-sm text-muted/60 hover:text-primary">View Orders</Link>
          <Link href="/products" className="rounded bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-dark">Continue</Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
          <Link href="/" className="rounded p-1 text-muted/40 hover:text-foreground"><ArrowLeft className="h-4 w-4" /></Link>
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-primary to-primary/40" />
            <div><h1 className="text-2xl font-semibold text-foreground">{checkoutMode ? "Checkout" : "Cart"}</h1><p className="text-sm text-muted/50 mt-0.5">{items.length} item{items.length !== 1 ? "s" : ""}</p></div>
          </div>
        </motion.div>

      {items.length === 0 && !checkoutMode ? (
        <div className="flex flex-col items-center py-20">
          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-border/30 mb-3">
            <ShoppingBag className="h-5 w-5 text-muted/40" />
          </div>
          <p className="text-sm text-foreground">Cart is empty</p>
          <Link href="/products" className="mt-4 rounded bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-dark">Browse</Link>
        </div>
      ) : checkoutMode ? (
        <motion.div variants={fadeUp} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="card-hover bg-card rounded-xl shadow-sm border border-border/30 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Customer</h3>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted/50">Name</label><input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Your name" className="mt-1 w-full rounded border border-border/50 bg-surface px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary/30" /></div>
                <div><label className="text-xs text-muted/50">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="mt-1 w-full rounded border border-border/50 bg-surface px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary/30" /></div>
                <div className="col-span-2"><label className="text-xs text-muted/50">Payment</label>
                  <div className="flex gap-2 mt-1">{["Credit Card", "PayPal", "Wire"].map((m) => (<button key={m} onClick={() => setPaymentMethod(m)} className={`flex-1 rounded border py-1.5 text-xs transition-all ${paymentMethod === m ? "border-primary/50 bg-primary/5 text-primary" : "border-border/50 text-muted/60 hover:border-primary/30"}`}>{m}</button>))}</div>
                </div>
              </div>
            </div>
            <div className="card-hover bg-card rounded-xl shadow-sm border border-border/30 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Summary</h3>
              {items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between border-b border-border/10 py-2 last:border-0">
                  <div className="flex items-center gap-2"><span>{item.image}</span><div><p className="text-sm text-foreground">{item.name}</p><p className="text-xs text-muted/40">x{item.quantity}</p></div></div>
                  <span className="text-sm text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="sticky top-20 card-hover bg-card rounded-xl shadow-sm border border-border/30 p-5">
              <h3 className="text-sm font-semibold text-foreground">Total</h3>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted/50">Subtotal</span><span className="text-foreground">${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted/50">Shipping</span><span className="text-foreground">{shipping === 0 ? <span className="text-emerald-600">Free</span> : `$${shipping.toFixed(2)}`}</span></div>
                <div className="border-t border-border/20 pt-2"><div className="flex justify-between"><span className="text-sm font-semibold text-foreground">Total</span><span className="text-lg font-bold text-foreground">${total.toFixed(2)}</span></div></div>
                <button onClick={handleCheckout} className="w-full rounded bg-primary py-2 text-sm font-medium text-white hover:bg-primary-dark flex items-center justify-center gap-1.5"><CreditCard className="h-3.5 w-3.5" /> Pay</button>
                <button onClick={() => setCheckoutMode(false)} className="w-full text-center text-xs text-muted/50 hover:text-primary">Back</button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="card-hover bg-card rounded-xl shadow-sm border border-border/30 p-4">
                <div className="flex items-start gap-3">
                  <div className="h-14 w-14 shrink-0 flex items-center justify-center rounded bg-border/20 text-xl">{item.image}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div><p className="text-xs text-primary">{item.brand}</p><p className="text-sm font-medium text-foreground">{item.name}</p><p className="text-xs text-muted/40">{item.sku}</p></div>
                      <button onClick={() => removeItem(item.productId)} className="rounded p-1 text-muted/30 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center rounded border border-border/50">
                        <button onClick={() => updateQty(item.productId, -1)} className="p-1 text-muted/50 hover:text-foreground"><Minus className="h-3 w-3" /></button>
                        <span className="w-7 text-center text-sm text-foreground">{item.quantity}</span>
                        <button onClick={() => updateQty(item.productId, 1)} className="p-1 text-muted/50 hover:text-foreground"><Plus className="h-3 w-3" /></button>
                      </div>
                      <p className="text-sm font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="sticky top-20 card-hover bg-card rounded-xl shadow-sm border border-border/30 p-5">
              <h3 className="text-sm font-semibold text-foreground">Summary</h3>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted/50">Subtotal</span><span className="text-foreground">${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted/50">Shipping</span><span className="text-foreground">{shipping === 0 ? <span className="text-emerald-600">Free</span> : `$${shipping.toFixed(2)}`}</span></div>
                <div className="flex gap-2">
                  <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Promo" className="flex-1 rounded border border-border/50 bg-surface px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-primary/30" />
                  <button className="rounded border border-border/50 px-2.5 py-1.5 text-sm text-muted/60 hover:border-primary/30 hover:text-primary">Apply</button>
                </div>
                <div className="border-t border-border/20 pt-2">
                  <div className="flex justify-between"><span className="text-sm font-semibold text-foreground">Total</span><span className="text-lg font-bold text-foreground">${total.toFixed(2)}</span></div>
                  {subtotal < 250 && <p className="text-xs text-muted/30 mt-1">Add ${(250 - subtotal).toFixed(2)} for free shipping</p>}
                </div>
                <button onClick={() => setCheckoutMode(true)} className="w-full rounded bg-primary py-2 text-sm font-medium text-white hover:bg-primary-dark">Checkout</button>
                <Link href="/products" className="block text-center text-xs text-muted/50 hover:text-primary">Continue Shopping</Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
