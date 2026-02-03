"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "@/lib/authApi";
import { NAV_ITEMS } from "@/config/navigation";
import { ChevronLeft, LogOut } from "lucide-react";

export default function Sidebar({
  user,
  open,
  collapsed,
  onClose,
  onToggleCollapse,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const touchStartX = useRef(0);

  const { mutate } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => router.push("/login"),
  });

  /* Lock background scroll on mobile only */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current - e.changedTouches[0].clientX > 80) onClose();
  };

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={`
          fixed md:sticky
          top-0 left-0 z-50
          h-screen
          flex flex-col overflow-hidden
          transition-transform duration-300
          ${collapsed ? "w-20" : "w-72"}
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          bg-(--card) border-r border-(--border)
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-(--border)">
          {!collapsed && (
            <span className="text-xl font-bold text-(--text)">
              Shop Manager
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
          >
            <ChevronLeft
              className={`h-5 w-5 transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Profile */}
        <div className="px-3 py-4">
          <Link
            href="/profile"
            onClick={onClose}
            className={`flex items-center rounded-xl p-3 transition
              hover:bg-black/5 dark:hover:bg-white/10
              ${collapsed ? "justify-center" : "gap-3"}
            `}
          >
            <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold">
              {user.email[0].toUpperCase()}
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate font-medium">{user.email}</p>
                <p className="text-xs text-(--muted)">View profile</p>
              </div>
            )}
          </Link>
        </div>

        {/* NAV — this scrolls */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
          {NAV_ITEMS.filter((i) => i.roles.includes(user.role)).map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                    group relative flex items-center rounded-xl px-4 py-3 text-sm font-medium
                    transition-all
                    ${collapsed ? "justify-center" : "gap-3"}
                    ${
                      active
                        ? "border border-blue-300 shadow-sm dark:border-blue-800"
                        : "text-(--muted) hover:bg-black/5 dark:hover:bg-white/10"
                    }
                  `}
              >
                {active && !collapsed && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-blue-600" />
                )}
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-(--border)">
          <button
            onClick={() => mutate()}
            className="flex items-center w-full gap-2 rounded-xl px-4 py-3 text-sm text-red-600 hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && "Log Out"}
          </button>
        </div>
      </aside>
    </>
  );
}
