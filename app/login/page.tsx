"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" style={{backgroundImage: "radial-gradient(var(--bg-dot-color) 1px, transparent 1px)", backgroundSize: "32px 32px"}}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-sm mb-4">
            <Package className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">TRI-M</h1>
          <p className="text-sm text-muted/50 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-sm border border-border/30 p-6 space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-600">{error}</div>
          )}
          <div>
            <label htmlFor="email" className="text-sm text-foreground">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@merchflow.com" required
              className="mt-1 w-full rounded-md border border-border/50 bg-surface px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted/30 focus:border-primary/30" />
          </div>
          <div>
            <label htmlFor="password" className="text-sm text-foreground">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
              className="mt-1 w-full rounded-md border border-border/50 bg-surface px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted/30 focus:border-primary/30" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full rounded-md bg-primary text-white text-sm font-medium py-2 hover:bg-primary-dark transition-colors disabled:opacity-50 shadow-sm">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-muted/30 mt-6">
          Demo: <span className="text-muted/50">admin@merchflow.com / admin123</span>
        </p>
      </motion.div>
    </div>
  );
}
