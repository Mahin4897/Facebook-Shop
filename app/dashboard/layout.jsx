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
    <div className="flex">
      <Sidebar
        user={user}
        open={sidebarOpen}
        collapsed={collapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setCollapsed((v) => !v)}
      />

      <div className="flex flex-1 flex-col">
        {/* Mobile top bar */}
        <header
          className="flex items-center justify-between border-b
                           border-(--border) bg-(--card)
                           px-4 py-3 md:hidden"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg border border-(--border) px-3 py-2"
          >
            ☰
          </button>
          <ThemeToggle />
        </header>

        <main className="flex-1 bg-(--bg) p-6">{children}</main>
      </div>
    </div>
  );
}
