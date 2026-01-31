import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Wallet,
  BarChart3,
  Settings,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard/home",
    icon: LayoutDashboard,
    roles: ["owner", "staff"],
  },
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    roles: ["owner", "staff"],
  },
  {
    label: "Products",
    href: "/dashboard/products",
    icon: Package,
    roles: ["owner"],
  },
  {
    label: "Customers",
    href: "/dashboard/customers",
    icon: Users,
    roles: ["owner", "staff"],
  },
  {
    label: "Invoices",
    href: "/dashboard/invoices",
    icon: FileText,
    roles: ["owner"],
  },
  {
    label: "Expenses",
    href: "/dashboard/expenses",
    icon: Wallet,
    roles: ["owner"],
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
    roles: ["owner"],
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["owner"],
  },
];
