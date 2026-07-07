"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Moon, Sun, Bell, Sparkles, Search } from "lucide-react";
import { useTheme } from "./theme-provider";
import Link from "next/link";

export default function Header({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { theme, toggle } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-surface border-b border-border shadow-sm">
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="rounded-xl p-1.5 text-muted/50 hover:text-foreground hover:bg-border/30 transition-all lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-dark">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight text-foreground">TRI-M</span>
          </Link>
        </div>

        {/* Global Search */}
        <div className="hidden sm:block flex-1 max-w-md mx-auto">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/40 group-focus-within:text-primary/60 transition-colors" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, suppliers, sales..."
              className="w-full rounded-xl border border-border/35 bg-surface py-1.5 pl-9 pr-10 text-sm text-foreground outline-none placeholder:text-muted/40 transition-all hover:border-border/60 focus:border-primary/30 focus:shadow-md focus:shadow-primary/5"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md bg-border/40 px-1.5 py-0.5 text-[10px] font-medium text-muted/50">⌘K</kbd>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={toggle}
            className="rounded-xl p-2 text-muted/50 hover:text-foreground hover:bg-border/30 transition-all"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className="relative rounded-xl p-2 text-muted/50 hover:text-foreground hover:bg-border/30 transition-all">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-surface animate-pulse-dot" />
          </button>
        </div>
      </div>
    </header>
  );
}
