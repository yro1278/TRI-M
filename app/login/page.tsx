"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sparkles, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-emerald-500/[0.02] pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
        className="w-full max-w-sm relative"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto h-14 w-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark shadow-lg shadow-primary/20 mb-4"
          >
            <Sparkles className="h-7 w-7 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">TRI-M</h1>
          <p className="text-sm text-muted/60 mt-1">SME Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border/50 shadow-sm p-6 space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-600"
            >
              {error}
            </motion.div>
          )}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
            <input
              id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@merchflow.com" required
              className="mt-1 w-full rounded-lg border border-border/40 bg-surface/50 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted/40 focus:border-primary/30 focus:bg-surface transition-all"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
            <div className="relative mt-1">
              <input
                id="password" type={showPwd ? "text" : "password"} value={password}
                onChange={(e) => setPassword(e.target.value)} placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" required
                className="w-full rounded-lg border border-border/40 bg-surface/50 px-3 py-2 pr-9 text-sm text-foreground outline-none placeholder:text-muted/40 focus:border-primary/30 focus:bg-surface transition-all"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted/60 hover:text-foreground transition-colors">
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full rounded-lg bg-primary text-white text-sm font-medium py-2 hover:bg-primary-dark transition-all disabled:opacity-50 shadow-sm shadow-primary/10">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-muted/50 mt-6">
          Demo: <span className="text-muted/70 font-medium">admin@merchflow.com / admin123</span>
        </p>
      </motion.div>
    </div>
  );
}
