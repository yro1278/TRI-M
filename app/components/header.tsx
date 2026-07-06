"use client";

import Image from "next/image";
import { Search, ShoppingCart, Bell, Menu, Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "./theme-provider";

export default function Header({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 glass">
      <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2 lg:hidden">
          <button onClick={onMenuClick} className="rounded-xl p-1.5 text-muted/40 hover:text-foreground hover:bg-border/30 transition-all focus-ring">
            <Menu className="h-4 w-4" />
          </button>
          <Link href="/" className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-dark">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              <span className="text-foreground/80">TRI-M</span>
            </span>
          </Link>
        </div>

        <div className="hidden flex-1 sm:block sm:max-w-xs">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/25 transition-colors group-focus-within:text-primary/50" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full rounded-xl border border-border/30 bg-surface/40 py-1.5 pl-10 pr-10 text-sm text-foreground outline-none placeholder:text-muted/20 transition-all focus:border-primary/20 focus:bg-surface focus:shadow-sm"
            />
            <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-lg bg-border/30 px-1.5 py-0.5 text-[10px] font-medium text-muted/25 sm:inline">⌘K</kbd>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          <button onClick={toggle} className="rounded-xl p-2 text-muted/35 hover:text-foreground hover:bg-border/30 transition-all focus-ring">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className="relative rounded-xl p-2 text-muted/35 hover:text-foreground hover:bg-border/30 transition-all focus-ring">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background animate-pulse-dot" />
          </button>
          <a href="/cart" className="relative rounded-xl p-2 text-muted/35 hover:text-foreground hover:bg-border/30 transition-all focus-ring">
            <ShoppingCart className="h-4 w-4" />
          </a>
          <div className="ml-2 pl-2 border-l border-border/20 flex items-center gap-2">
            <div className="h-8 w-8 overflow-hidden rounded-xl ring-2 ring-border/30 transition-all hover:ring-primary/30">
              <Image
                src="https://ui-avatars.com/api/?name=Jane+Cooper&background=2563eb&color=fff&size=40"
                alt="" width={32} height={32}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";
