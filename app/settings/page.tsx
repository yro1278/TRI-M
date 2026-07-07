"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, User, Bell, Palette, Shield, Save, Eye, EyeOff, Settings } from "lucide-react";

type Tab = "company" | "users" | "notifications" | "appearance" | "security";

const tabs: { key: Tab; label: string; icon: typeof Building2 }[] = [
  { key: "company", label: "Company", icon: Building2 },
  { key: "users", label: "Users", icon: User },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("company");
  const [saved, setSaved] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } } };
  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted/60 mt-1">Manage your workspace and preferences</p>
        </div>
        <button onClick={handleSave} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark transition-all">
          <Save className="h-3.5 w-3.5" />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </motion.div>

      <motion.div variants={fadeUp} className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                isActive ? "bg-primary text-white shadow-sm" : "text-muted/70 hover:text-foreground hover:bg-border/30"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </motion.button>
          );
        })}
      </motion.div>

      <motion.div variants={fadeUp} className="bg-surface rounded-xl border border-border/50 p-6 overflow-hidden">
        {activeTab === "company" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Company Profile</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs text-muted/70 font-medium">Company Name</label>
                <input defaultValue="TRI-M inc" className="mt-1 w-full rounded-lg border border-border/30 bg-surface/50 px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary/30 focus:bg-surface" />
              </div>
              <div>
                <label className="text-xs text-muted/70 font-medium">Tax ID</label>
                <input defaultValue="MF-2024-001" className="mt-1 w-full rounded-lg border border-border/30 bg-surface/50 px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary/30 focus:bg-surface" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-muted/70 font-medium">Address</label>
                <input defaultValue="123 Commerce St, Business District" className="mt-1 w-full rounded-lg border border-border/30 bg-surface/50 px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary/30 focus:bg-surface" />
              </div>
              <div>
                <label className="text-xs text-muted/70 font-medium">Email</label>
                <input defaultValue="hello@merchflow.com" className="mt-1 w-full rounded-lg border border-border/30 bg-surface/50 px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary/30 focus:bg-surface" />
              </div>
              <div>
                <label className="text-xs text-muted/70 font-medium">Phone</label>
                <input defaultValue="+1 (555) 123-4567" className="mt-1 w-full rounded-lg border border-border/30 bg-surface/50 px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-primary/30 focus:bg-surface" />
              </div>
            </div>
            <div className="pt-4 border-t border-border/20">
              <h4 className="text-xs font-medium text-foreground mb-3">Business Hours</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {["Mon-Fri", "Saturday", "Sunday"].map((day) => (
                  <div key={day} className="flex items-center gap-3">
                    <span className="text-sm text-muted/60 w-20">{day}</span>
                    <input defaultValue={day === "Sunday" ? "Closed" : "9:00 AM - 6:00 PM"} className="flex-1 rounded-lg border border-border/30 bg-surface/50 px-3 py-1.5 text-sm text-foreground outline-none transition-all focus:border-primary/30 focus:bg-surface" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">User Management</h3>
            <div className="space-y-2">
              {[
                { name: "Tyrone Alariao", email: "admin@merchflow.com", role: "Admin", status: "Active" },
                { name: "John Smith", email: "staff@merchflow.com", role: "Staff", status: "Active" },
              ].map((user) => (
                <div key={user.email} className="flex items-center justify-between rounded-lg border border-border/20 px-4 py-3 hover:bg-border/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary ring-1 ring-primary/20">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted/60">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${user.role === "Admin" ? "badge-blue" : "badge-gray"}`}>{user.role}</span>
                    <span className="badge badge-green">{user.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Notification Preferences</h3>
            <div className="space-y-2">
              {[
                { label: "Low Stock Alerts", desc: "Notify when products fall below 20 units", on: true },
                { label: "New Orders", desc: "Get notified when new orders are placed", on: true },
                { label: "Supplier Updates", desc: "Changes in supplier evaluation scores", on: false },
                { label: "Weekly Reports", desc: "Receive weekly sales summary", on: true },
                { label: "Monthly Analytics", desc: "Monthly KPI and performance digest", on: true },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between rounded-lg border border-border/20 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{n.label}</p>
                    <p className="text-xs text-muted/60 mt-0.5">{n.desc}</p>
                  </div>
                  <div className={`h-5 w-9 rounded-full transition-colors cursor-pointer ${n.on ? "bg-primary" : "bg-border/40"}`}>
                    <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${n.on ? "translate-x-4.5 ml-0.5" : "ml-0.5"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "appearance" && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Appearance</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted/70 font-medium">Theme</label>
                <div className="flex gap-2 mt-1.5">
                  {["Light", "Dark", "System"].map((t) => (
                    <button key={t} className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-all ${
                      t === "Light" ? "border-primary/40 bg-primary/5 text-primary" : "border-border/30 text-muted/70 hover:border-primary/30 hover:text-foreground"
                    }`}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted/70 font-medium">Color Scheme</label>
                <div className="flex gap-2 mt-1.5">
                  {["#4f46e5", "#059669", "#dc2626", "#0891b2", "#8b5cf6"].map((color) => (
                    <button key={color} className="h-8 w-8 rounded-full ring-1 ring-border/30 hover:ring-2 hover:ring-primary/50 transition-all" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted/70 font-medium">Layout Density</label>
                <div className="flex gap-2 mt-1.5">
                  {["Compact", "Comfortable", "Spacious"].map((d) => (
                    <button key={d} className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-all ${
                      d === "Comfortable" ? "border-primary/40 bg-primary/5 text-primary" : "border-border/30 text-muted/70 hover:border-primary/30 hover:text-foreground"
                    }`}>{d}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted/70 font-medium">Current Password</label>
                <div className="relative mt-1">
                  <input type={showPasswords ? "text" : "password"} placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" className="w-full rounded-lg border border-border/30 bg-surface/50 px-3 py-2 pr-9 text-sm text-foreground outline-none transition-all focus:border-primary/30 focus:bg-surface" />
                  <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted/60 hover:text-foreground transition-colors">
                    {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-muted/70 font-medium">New Password</label>
                  <div className="relative mt-1">
                    <input type={showPasswords ? "text" : "password"} placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" className="w-full rounded-lg border border-border/30 bg-surface/50 px-3 py-2 pr-9 text-sm text-foreground outline-none transition-all focus:border-primary/30 focus:bg-surface" />
                    <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted/60 hover:text-foreground transition-colors">
                      {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted/70 font-medium">Confirm Password</label>
                  <div className="relative mt-1">
                    <input type={showPasswords ? "text" : "password"} placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" className="w-full rounded-lg border border-border/30 bg-surface/50 px-3 py-2 pr-9 text-sm text-foreground outline-none transition-all focus:border-primary/30 focus:bg-surface" />
                    <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted/60 hover:text-foreground transition-colors">
                      {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/20 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-xs text-muted/60 mt-0.5">Add an extra layer of security</p>
                </div>
                <div className="h-5 w-9 rounded-full bg-border/40">
                  <div className="h-4 w-4 rounded-full bg-white shadow-sm ml-0.5 mt-0.5" />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/20 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Session Timeout</p>
                  <p className="text-xs text-muted/60 mt-0.5">Auto-logout after inactivity</p>
                </div>
                <select className="rounded-lg border border-border/30 bg-surface/50 px-2 py-1 text-sm text-foreground outline-none focus:border-primary/30 transition-colors">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                  <option>Never</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
