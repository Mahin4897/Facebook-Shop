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

  // ESC close
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Swipe close
  const onTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStartX.current - e.changedTouches[0].clientX > 80) onClose();
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      <aside
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={`fixed z-50 h-screen
          flex flex-col
          transition-all duration-300
          ${collapsed ? "w-20" : "w-72"}
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0
          bg-(--card) border-r border-(--border)
        `}
      >
        {/* Brand + Collapse Button */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-(--border)">
          {!collapsed && (
            <span className="text-xl font-bold text-(--text)">
              Shop Manager
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <ChevronLeft
              className={`h-5 w-5 text-(--muted) transition-transform ${
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
            <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold text-lg shrink-0">
              {user.email[0].toUpperCase()}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate font-medium text-(--text)">
                  {user.email}
                </p>
                <p className="text-xs text-(--muted) mt-1">View profile</p>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-2 overflow-y-auto">
          {NAV_ITEMS.filter((item) => item.roles.includes(user.role)).map(
            (item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
    group relative
    flex items-center rounded-xl px-4 py-3 text-sm font-medium
    transition-all duration-200
    ${collapsed ? "justify-center" : "gap-3"}

    ${
      active
        ? `
           
            border border-blue-300
            shadow-sm
            dark:text-blue-500 dark:border-blue-800
          `
        : `
            text-(--muted)
            hover:bg-linear-to-r hover:from-blue-100 hover:to-indigo-100
            hover:text-blue-800
            hover:shadow-sm
            dark:hover:bg-white/10 dark:hover:text-black
          `
    }
  `}
                >
                  {/* Active indicator */}
                  {active && !collapsed && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-blue-600" />
                  )}

                  <Icon
                    className={`
      h-5 w-5 shrink-0 transition-all duration-200
      ${
        active
          ? "text-blue-700 dark:text-blue-500"
          : "group-hover:text-blue-700 dark:group-hover:text-blue-400"
      }
    `}
                  />

                  {!collapsed && item.label}
                </Link>
              );
            },
          )}
        </nav>

        {/* Bottom Actions */}
        <div className="px-3 py-4 border-t border-(--border) mt-auto space-y-2">
          <button
            onClick={() => mutate()}
            className="flex items-center w-full gap-2 rounded-xl px-4 py-3 text-sm text-red-600 hover:bg-red-500/10 transition"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && "Log Out"}
          </button>
        </div>
      </aside>
    </>
  );
}
