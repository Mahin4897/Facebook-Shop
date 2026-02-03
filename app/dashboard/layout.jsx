"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const user = {
    email: "shop@business.com",
    role: "owner",
  };

  return (
    <div className="flex h-screen overflow-hidden bg-(--bg)">
      <Sidebar
        user={user}
        open={sidebarOpen}
        collapsed={collapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setCollapsed((v) => !v)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex items-center justify-between border-b border-(--border) bg-(--card) px-4 py-3 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg border border-(--border) px-3 py-2"
          >
            ☰
          </button>
          <ThemeToggle />
        </header>

        {/* ONLY CONTENT SCROLLS */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
