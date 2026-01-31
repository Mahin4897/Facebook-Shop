"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import ThemeToggle from "@/components/ui/ThemeToggle";

// Mock user


export default function DashboardPage() {


  /* Fetch stats */
const { data: stats } = useQuery({
  queryKey: ["dashboardStats"],
  queryFn: async () => {
    const res = await axios.get("/api/dashboard"); // replace with your backend
    return res.data;
  },
  initialData: {
    totalOrders: 120,
    pendingOrders: 15,
    totalRevenue: 4520,
    totalExpenses: 1200,
    ordersChart: [
      { date: "Jan 1", orders: 5 },
      { date: "Jan 2", orders: 8 },
      { date: "Jan 3", orders: 12 },
      { date: "Jan 4", orders: 6 },
      { date: "Jan 5", orders: 10 },
    ],
    recentOrders: [
      { id: 101, customer: "Alice", total: 120, status: "Pending" },
      { id: 102, customer: "Bob", total: 200, status: "Completed" },
    ],
  },
});


  return (
    <div className="flex h-screen bg-(--bg) text-(--text)">
      {/* Sidebar */}


      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <ThemeToggle />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard title="Total Orders" value={stats.totalOrders} />
          <StatCard title="Pending Orders" value={stats.pendingOrders} />
          <StatCard title="Revenue" value={`$${stats.totalRevenue}`} />
          <StatCard title="Expenses" value={`$${stats.totalExpenses}`} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <h2 className="text-lg font-semibold mb-2">Orders Over Time</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.ordersChart}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-2">Revenue vs Expenses</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { name: "Revenue", value: stats.totalRevenue },
                { name: "Expenses", value: stats.totalExpenses },
              ]}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Orders Table */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-(--border) rounded-lg">
              <thead className="bg-(--card)">
                <tr>
                  <th className="px-4 py-2 border-b border-(--border)">Order ID</th>
                  <th className="px-4 py-2 border-b border-(--border)">Customer</th>
                  <th className="px-4 py-2 border-b border-(--border)">Total</th>
                  <th className="px-4 py-2 border-b border-(--border)">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order:{id: number, customer: string, total: number, status: string}) => (
                  <tr key={order.id} className="hover:bg-gray-50 hover:text-white dark:hover:bg-gray-800 transition">
                    <td className="px-4 py-2 border-b border-(--border)">{order.id}</td>
                    <td className="px-4 py-2 border-b border-(--border)">{order.customer}</td>
                    <td className="px-4 py-2 border-b border-(--border)">${order.total}</td>
                    <td className="px-4 py-2 border-b border-(--border)">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}

/* --------------------------- */
/* Reusable Components */
/* --------------------------- */

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-(--card) border border-(--border) rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <p className="text-sm text-(--muted)">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-(--card) border border-(--border) rounded-lg p-4 shadow-sm hover:shadow-md transition">
      {children}
    </div>
  );
}
