"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const user = {
    email: "shop@business.com",
    role: "owner", // owner | staff
    avatar: "", // optional image URL
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        user={user}
        open={sidebarOpen}
        collapsed={collapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setCollapsed((v) => !v)}
      />

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col min-h-screen w-full
        ${collapsed ? "md:ml-20" : "md:ml-72"} transition-all duration-300`}
      >
        {/* Mobile header - only shown on mobile */}
        <header
          className="md:hidden sticky top-0 z-30
          flex items-center justify-between border-b
          border-(--border) bg-(--card)
          px-4 py-3"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg border border-(--border) px-3 py-2"
          >
            ☰
          </button>
          <ThemeToggle />
        </header>

        {/* Page content */}
        <main className="flex-1 bg-(--bg) p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
