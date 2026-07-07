"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings, ChevronLeft, Tag, Truck, Percent,
  Plus, FileText, TrendingUp, DollarSign, Search, Star, History, ChevronDown, ChevronRight,
  HelpCircle, LogOut, User, Building2, Sparkles, Bell, ExternalLink, PanelRightClose,
  Bookmark, Clock, Command, Keyboard, Home,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts, useOrders } from "../data/use-store";
import { useTheme } from "./theme-provider";
import Image from "next/image";

type NavChild = {
  label: string;
  href: string;
  badge?: string;
};

type NavItem = {
  label: string;
  icon: typeof LayoutDashboard;
  href?: string;
  badge?: string | number;
  shortcut?: string;
  children?: NavChild[];
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard, shortcut: "⌘1" },
      {
        label: "Inventory", icon: Package, shortcut: "⌘2",
        children: [
          { label: "Products", href: "/products" },
          { label: "Categories", href: "#" },
          { label: "Stock Levels", href: "#" },
        ],
      },
      {
        label: "Sales", icon: DollarSign, shortcut: "⌘3",
        children: [
          { label: "Orders", href: "/orders" },
          { label: "Transactions", href: "/sales" },
        ],
      },
      {
        label: "Suppliers", icon: Truck, shortcut: "⌘4",
        children: [
          { label: "Supplier List", href: "/suppliers" },
          { label: "Evaluation", href: "/suppliers" },
          { label: "Performance", href: "/suppliers" },
        ],
      },
    ],
  },
  {
    label: "Analytics",
    items: [
      { label: "Sales Analytics", href: "/analytics", icon: TrendingUp, badge: "Beta" },
      { label: "KPI Dashboard", href: "/", icon: LayoutDashboard },
      { label: "BI Reports", href: "/reports", icon: FileText },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Reports", href: "/reports", icon: FileText },
      { label: "Users", href: "/settings", icon: User },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

const pinnedDefaults = ["Dashboard", "Sales", "Orders"];
const recentDefaults = ["Products", "Suppliers", "Analytics"];

const workspaceOptions = [
  { label: "TRI-M inc", active: true },
  { label: "Demo Store", active: false },
  { label: "Test Workspace", active: false },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set(["Orders"]));
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [pinnedItems, setPinnedItems] = useState<string[]>(pinnedDefaults);
  const [recentItems] = useState<string[]>(recentDefaults);
  const [activeParent, setActiveParent] = useState<string | null>(null);

  const pathname = usePathname();
  const products = useProducts();
  const orders = useOrders();
  const { theme } = useTheme();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const pendingCount = orders.data?.filter((o) => o.status === "pending" || o.status === "processing").length ?? 0;
  const productCount = products.data?.length ?? 0;

  const isActive = (href: string) => {
    if (href === "#") return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]);
  };

  const isChildActive = (children: NavChild[]) =>
    children.some((c) => pathname.startsWith(c.href.split("?")[0]));

  useEffect(() => {
    for (const section of navSections) {
      for (const item of section.items) {
        if (item.href && isActive(item.href)) {
          setActiveParent(item.label);
          return;
        }
        if (item.children && isChildActive(item.children)) {
          setActiveParent(item.label);
          setExpandedMenus((prev) => new Set(prev).add(item.label));
          return;
        }
      }
    }
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (workspaceRef.current && !workspaceRef.current.contains(e.target as Node))
        setShowWorkspaceMenu(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setShowProfileMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
        const keyMap: Record<string, string> = {
          "1": "/", "2": "/sales", "3": "/products", "4": "/orders",
          "5": "/suppliers", "6": "/analytics", "7": "/reports",
        };
        const href = keyMap[e.key];
        if (href) {
          e.preventDefault();
          window.location.href = href;
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setCollapsed((c) => !c);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const togglePinned = (label: string) => {
    setPinnedItems((prev) =>
      prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label]
    );
  };

  const toggleExpand = (label: string) => {
    setExpandedMenus((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const sidebarVariants = {
    expanded: { width: 256, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } },
    collapsed: { width: 60, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } },
  };

  const pillVariants = {
    initial: { scaleX: 0, opacity: 0 },
    animate: { scaleX: 1, opacity: 1, transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const } },
    exit: { scaleX: 0, opacity: 0, transition: { duration: 0.15 } },
  };

  const rotationVariants = {
    collapsed: { rotate: 0 },
    expanded: { rotate: 90 },
  };

  const staggerVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.03, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const },
    }),
  };

  const sidebarContent = (
    <motion.aside
      variants={sidebarVariants}
      initial={collapsed ? "collapsed" : "expanded"}
      animate={collapsed ? "collapsed" : "expanded"}
      className="relative isolate flex h-full flex-col glass-sidebar overflow-hidden"
    >

      {/* Logo — centered, no collapse button, no shifting */}
      <div className="flex h-14 items-center justify-center shrink-0">
        <button onClick={() => setCollapsed(!collapsed)} className="flex items-center justify-center shrink-0 cursor-pointer">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-dark">
            <Sparkles className="h-3.5 w-3.5 text-white shrink-0" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-sm font-semibold tracking-tight whitespace-nowrap overflow-hidden ml-2 shrink-0"
              >
                TRI-M
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Workspace Selector */}
      {!collapsed && (
        <div className="px-2 pt-2 shrink-0" ref={workspaceRef}>
          <div className="relative">
            <button
              onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted/75 hover:text-foreground hover:bg-border/20 transition-all"
            >
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate flex-1 text-left font-medium">TRI-M inc</span>
              <motion.div
                animate={{ rotate: showWorkspaceMenu ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-3 w-3" />
              </motion.div>
            </button>
            <AnimatePresence>
              {showWorkspaceMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-2 right-2 top-full mt-1 z-50 rounded-xl bg-card border border-border/40 shadow-lg py-1"
                >
                  {workspaceOptions.map((ws) => (
                    <button
                      key={ws.label}
                      className={`flex w-full items-center gap-2 px-3 py-1.5 text-xs transition-colors ${
                        ws.active ? "text-foreground font-medium bg-primary/5" : "text-muted/75 hover:text-foreground hover:bg-border/20"
                      }`}
                    >
                      <div className={`h-1.5 w-1.5 rounded-full ${ws.active ? "bg-primary" : "bg-border"}`} />
                      {ws.label}
                      {ws.active && <span className="ml-auto text-[10px] text-primary/60 font-medium">Active</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Search */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden shrink-0"
          >
            <div className="px-2 pt-2">
              <div className="relative group">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/55 group-focus-within:text-primary/50 transition-colors" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-lg border border-border/30 bg-surface/40 py-1.5 pl-8 pr-8 text-xs text-foreground outline-none placeholder:text-muted/75 transition-all focus:border-primary/20 focus:bg-surface focus:shadow-sm"
                />
                <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-border/30 px-1 py-0.5 text-[10px] font-medium text-muted/55">⌘K</kbd>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Scrollable Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 scrollbar-hide">
        {/* Pinned Section */}
        {!collapsed && pinnedItems.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 px-2 mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-amber-400/50 to-amber-400/10" />
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted/55">Pinned</span>
              <span className="h-px flex-1 bg-gradient-to-r from-border/40 to-transparent" />
              <Star className="h-2.5 w-2.5 text-amber-400/40" />
            </div>
            <div className="space-y-0.5">
              {pinnedItems.map((label, i) => {
                const allItems = navSections.flatMap((s) => s.items);
                const item = allItems.find((n) => n.label === label);
                if (!item) return null;
                const active = item.href ? isActive(item.href) : false;
                const Icon = item.icon;
                return (
                  <motion.div
                    key={label}
                    custom={i}
                    variants={staggerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {item.href && (
                      <Link
                        href={item.href}
                        onMouseEnter={() => setHoveredItem(label)}
                        onMouseLeave={() => setHoveredItem(null)}
className={`group relative flex items-center gap-2.5 rounded-lg text-sm transition-all duration-150 ${
                             collapsed ? "justify-center p-2" : "px-2 py-1.5"
                        } ${
                          active ? "text-primary font-medium" : "text-muted/65 hover:text-foreground"
                        }`}
                      >
                        {active && !collapsed && (
                          <motion.span
                            layoutId="activePill"
                            className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/[0.08] to-transparent border-l-2 border-l-primary"
                            variants={pillVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                          />
                        )}
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative z-10"
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                        </motion.div>
                        {!collapsed && (
                          <span className="relative z-10 truncate">{item.label}</span>
                        )}
                        {!collapsed && hoveredItem === label && (
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); togglePinned(label); }}
                            className="ml-auto relative z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
                          </button>
                        )}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Nav Sections */}
        {navSections.map((section) => {
          const filteredItems = section.items.filter(
            (item) =>
              !searchQuery ||
              item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.children?.some((c) => c.label.toLowerCase().includes(searchQuery.toLowerCase()))
          );
          if (filteredItems.length === 0) return null;
          return (
            <div key={section.label} className="mb-5 last:mb-0">
              {!collapsed && (
                <div className="flex items-center gap-2 px-2 mb-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-primary/40 to-primary/10" />
                  <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted/55">
                    {section.label}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-border/40 to-transparent" />
                </div>
              )}
              <ul className="space-y-0.5">
                {filteredItems.map((item) => {
                  const active = item.href ? isActive(item.href) : false;
                  const childActive = item.children ? isChildActive(item.children) : false;
                  const isExpanded = expandedMenus.has(item.label);
                  const hasChildren = item.children && item.children.length > 0;
                  const Icon = item.icon;

                  return (
                    <li key={item.label}>
                      {hasChildren ? (
                        <>
                          <button
                            onClick={() => toggleExpand(item.label)}
                            onMouseEnter={() => setHoveredItem(item.label)}
                            onMouseLeave={() => setHoveredItem(null)}
className={`group relative flex w-full items-center gap-2.5 rounded-lg text-sm transition-all duration-150 ${
                               collapsed ? "justify-center p-2" : "px-2 py-1.5"
                            } ${
                              active || childActive ? "text-primary font-medium" : "text-muted/65 hover:text-foreground"
                            }`}
                            title={collapsed ? item.label : undefined}
                          >
                            {(active || childActive) && !collapsed && (
                              <motion.span
                                layoutId="activePill"
                                className="absolute inset-0 rounded-lg bg-primary/[0.07] border border-primary/10"
                                variants={pillVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                              />
                            )}
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="relative z-10"
                            >
                              <Icon className="h-4 w-4 shrink-0" />
                            </motion.div>
                            {!collapsed && (
                              <>
                                <span className="relative z-10 flex-1 text-left truncate">{item.label}</span>
                                {item.badge && (
                                  <span className={`relative z-10 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                                    item.badge === "New" || item.badge === "Beta"
                                      ? "bg-primary/10 text-primary"
                                      : "bg-border/40 text-muted/70"
                                  }`}>{item.badge}</span>
                                )}
                                <motion.div
                                  variants={rotationVariants}
                                  animate={isExpanded ? "expanded" : "collapsed"}
                                  transition={{ duration: 0.2 }}
                                  className="relative z-10"
                                >
                                  <ChevronRight className="h-3 w-3 text-muted/75" />
                                </motion.div>
                              </>
                            )}
                          </button>
                          <AnimatePresence initial={false}>
                            {!collapsed && isExpanded && item.children && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="ml-5 mt-0.5 space-y-0.5 border-l border-border/20 pl-2">
                                  {item.children.map((child) => {
                                    const childActive = pathname === child.href || pathname.startsWith(child.href.split("?")[0]);
                                    return (
                                      <Link
                                        key={child.label}
                                        href={child.href}
                                        onClick={onClose}
className={`group relative flex items-center gap-2 rounded-md px-2 py-1 text-sm transition-all ${
                                           childActive ? "text-primary font-medium bg-gradient-to-r from-primary/[0.04] to-transparent" : "text-muted/60 hover:text-foreground"
                                        }`}
                                      >
                                        <span className={`h-1 w-1.5 rounded-full transition-colors ${
                                          childActive ? "bg-primary" : "bg-border/40 group-hover:bg-border"
                                        }`} />
                                        <span>{child.label}</span>
                                        {child.badge && (
                                          <span className="ml-auto rounded-full bg-primary/10 text-primary px-1 py-0.5 text-[10px] font-semibold">{child.badge}</span>
                                        )}
                                      </Link>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : item.href ? (
                        <Link
                          href={item.href}
                          onClick={onClose}
                          onMouseEnter={() => setHoveredItem(item.label)}
                          onMouseLeave={() => setHoveredItem(null)}
                          className={`group relative flex items-center gap-2.5 rounded-lg text-xs transition-all duration-150 ${
                            collapsed ? "justify-center p-2" : "px-2 py-1.5"
                          } ${
                            active ? "text-primary font-medium" : "text-muted/65 hover:text-foreground"
                          }`}
                          title={collapsed ? item.label : undefined}
                        >
                          {active && !collapsed && (
                            <motion.span
                              layoutId="activePill"
                              className="absolute inset-0 rounded-lg bg-primary/[0.07] border border-primary/10"
                              variants={pillVariants}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                            />
                          )}
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative z-10"
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                          </motion.div>
                          {!collapsed && (
                            <>
                              <span className="relative z-10 flex-1 truncate">{item.label}</span>
                              {item.badge && (
                                <span className={`relative z-10 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                                  item.badge === "New" || item.badge === "Beta"
                                    ? "bg-primary/10 text-primary"
                                    : "bg-border/40 text-muted/70"
                                }`}>{item.badge}</span>
                              )}
                              {item.label === "Orders" && pendingCount > 0 && (
                                <span className="relative z-10 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500/10 text-[10px] font-bold text-amber-600 dark:text-amber-400 px-1">
                                  {pendingCount}
                                </span>
                              )}
                              {item.label === "Products" && productCount > 0 && (
                                <span className="relative z-10 text-xs text-muted/75">{productCount}</span>
                              )}
                              {item.shortcut && !collapsed && (
                                <span className="relative z-10 text-[10px] text-muted/45 group-hover:text-muted/55 transition-colors">{item.shortcut}</span>
                              )}
                            </>
                          )}
                          {hoveredItem === item.label && collapsed && (
                            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 rounded-lg bg-foreground text-background px-2 py-1 text-xs font-medium whitespace-nowrap shadow-lg pointer-events-none">
                              {item.label}
                              {item.shortcut && <span className="ml-2 opacity-50">{item.shortcut}</span>}
                            </div>
                          )}
                        </Link>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {/* Recently Visited */}
        {!collapsed && recentItems.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 px-2 mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-violet-400/50 to-violet-400/10" />
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted/55">Recent</span>
              <span className="h-px flex-1 bg-gradient-to-r from-border/40 to-transparent" />
              <History className="h-2.5 w-2.5 text-violet-400/40" />
            </div>
            <div className="space-y-0.5">
              {recentItems.map((label) => {
                const allItems = navSections.flatMap((s) => s.items);
                const item = allItems.find((n) => n.label === label);
                if (!item) return null;
                const Icon = item.icon;
                return (
                  <Link
                    key={label}
                    href={item.href || "#"}
                    className="group flex items-center gap-2.5 rounded-lg px-2 py-1 text-sm text-muted/55 hover:text-foreground transition-all"
                  >
                    <Icon className="h-3 w-3 shrink-0" />
                    <span className="truncate">{item.label}</span>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); togglePinned(label); }}
                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Bookmark className="h-2.5 w-2.5 text-muted/75 hover:text-amber-400" />
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Button */}
      <div className="shrink-0 px-2 pb-1">
        {collapsed ? (
          <Link
            href="/products"
            className="flex items-center justify-center rounded-lg border border-dashed border-border/30 py-2 text-muted/75 hover:text-primary hover:border-primary/30 transition-all"
            title="Add Product"
          >
            <Plus className="h-4 w-4" />
          </Link>
        ) : (
          <Link
            href="/products"
            className="flex items-center gap-2 rounded-lg border border-dashed border-border/30 px-3 py-2 text-sm text-muted/55 hover:text-primary hover:border-primary/30 transition-all group"
          >
            <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
              <Plus className="h-3.5 w-3.5" />
            </motion.div>
            <span>Quick Add</span>
            <span className="ml-auto text-[10px] text-muted/45 group-hover:text-primary/40 transition-colors">⌘N</span>
          </Link>
        )}
      </div>

      {/* User Profile Section */}
      <div className="shrink-0 border-t border-sidebar-border">
        {collapsed ? (
          <div className="px-2 py-2">
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="relative mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/10 transition-all hover:ring-primary/30"
                title="Profile"
              >
                <span className="text-xs font-semibold text-primary">TA</span>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-sidebar" />
              </button>
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-full ml-2 bottom-0 z-50 w-48 rounded-xl bg-card border border-border/40 shadow-xl py-1"
                  >
                    <ProfileMenuContent />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="p-2" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-border/20 transition-all group"
            >
              <div className="relative shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/10">
<span className="text-xs font-semibold text-primary">TA</span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-sidebar" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Tyrone Alariao</p>
                <p className="text-xs text-muted/60 truncate">admin@merchflow.com</p>
              </div>
              <motion.div
                animate={{ rotate: showProfileMenu ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-muted/75"
              >
                <ChevronDown className="h-3 w-3" />
              </motion.div>
            </button>
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="mt-1 rounded-xl bg-card border border-border/40 shadow-xl py-1 overflow-hidden"
                >
                  <ProfileMenuContent />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.aside>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={open ? { x: 0, opacity: 1 } : { x: -300, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed left-0 top-0 z-50 h-full w-64 lg:hidden"
      >
        {sidebarContent}
      </motion.div>

      {/* Desktop */}
      <div className="hidden lg:block h-full">
        {sidebarContent}
      </div>
    </>
  );
}

function ProfileMenuContent() {
  const handleLogout = () => {
    import("next-auth/react").then(({ signOut }) => signOut());
  };

  return (
    <>
      <div className="px-3 py-2 border-b border-border/10">
        <p className="text-sm font-medium text-foreground">Tyrone Alariao</p>
        <p className="text-xs text-muted/60">Administrator</p>
      </div>
      <div className="py-1">
        {[
          { label: "Profile", icon: User, href: "/settings" },
          { label: "Settings", icon: Settings, href: "/settings" },
          { label: "Help Center", icon: HelpCircle, href: "#" },
          { label: "Keyboard Shortcuts", icon: Keyboard, href: "#" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-muted/70 hover:text-foreground hover:bg-border/20 transition-colors"
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </Link>
        ))}
      </div>
      <div className="border-t border-border/10 py-1">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 px-3 py-1.5 text-xs text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          Log out
        </button>
      </div>
    </>
  );
}
