import { Package, IndianRupee, ShoppingCart, Users, TrendingDown, RefreshCcw } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const salesData = [
  { month: "Jan", sales: 120000 },
  { month: "Feb", sales: 180000 },
  { month: "Mar", sales: 220000 },
  { month: "Apr", sales: 280000 },
  { month: "May", sales: 320000 },
  { month: "Jun", sales: 380000 },
];

const revenueData = [
  { month: "Jan", revenue: 320000 },
  { month: "Feb", revenue: 400000 },
  { month: "Mar", revenue: 450000 },
  { month: "Apr", revenue: 480000 },
  { month: "May", revenue: 520000 },
  { month: "Jun", revenue: 550000 },
];

const topProductsData = [
  { name: "Pellets 6mm", orders: 42 },
  { name: "Pellets 8mm", orders: 31 },
  { name: "Biomass Stove Medium", orders: 18 },
  { name: "Biomass Burner 100kW", orders: 12 },
  { name: "Pellets 10mm", orders: 9 },
];

const recentOrders = [
  { id: "ORD-2024-001", customer: "Green Industries Ltd", weight: "2 items", amount: "₹15,250", status: "Confirmed" },
  { id: "ORD-2024-002", customer: "EcoHeat Solutions", weight: "1 item", amount: "₹18,000", status: "Out for Delivery" },
  { id: "ORD-2024-003", customer: "Biomass Trading Co", weight: "1 item", amount: "₹49,200", status: "Shipped" },
  { id: "ORD-2024-004", customer: "Rural Energy Hub", weight: "2 items", amount: "₹13,970", status: "Pending" },
  { id: "ORD-2024-006", customer: "Kavitha R", weight: "1 item", amount: "₹4,930", status: "Cancelled" },
  { id: "ORD-2024-007", customer: "Mohan Das", weight: "1 item", amount: "₹31,500", status: "Returned" },
];

const statusColors: Record<string, string> = {
  Delivered: "bg-primary/10 text-primary",
  Shipped: "bg-blue-50 text-status-shipped",
  Processing: "bg-yellow-50 text-status-processing",
  Pending: "bg-muted text-status-pending",
  Confirmed: "bg-indigo-50 text-status-confirmed",
  "Out for Delivery": "bg-orange-50 text-status-out-for-delivery",
  Cancelled: "bg-destructive/10 text-destructive",
  Returned: "bg-purple-50 text-status-returned",
};

export default function Dashboard() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Executive Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
        </div>
        <div className="text-sm text-muted-foreground border rounded-lg px-4 py-2 bg-card">
          Last updated: <span className="font-semibold text-foreground">Today, {timeStr}</span>
        </div>
      </div>

      {/* Stat Cards — 6-card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Products" value="48" subtitle="6 categories" icon={Package} />
        <StatCard title="Total Orders" value="156" subtitle="+12 this week" icon={ShoppingCart} />
        <StatCard title="Revenue" value="₹6.2L" subtitle="+8.5% from last month" icon={IndianRupee} />
        <StatCard title="Active Users" value="234" subtitle="+18 new this month" icon={Users} />
        <StatCard title="Cancelled Orders" value="12" subtitle="↑3 this week" icon={TrendingDown} subtitleColor="muted" />
        <StatCard title="Pending Refunds" value="5" subtitle="₹24,500 value" icon={RefreshCcw} subtitleColor="muted" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <h3 className="font-semibold text-card-foreground mb-1">Sales Analytics</h3>
          <p className="text-xs text-muted-foreground mb-4">Monthly sales trend in ₹</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Area type="monotone" dataKey="sales" stroke="hsl(152,60%,36%)" fill="hsl(152,60%,36%,0.15)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <h3 className="font-semibold text-card-foreground mb-1">Revenue Overview</h3>
          <p className="text-xs text-muted-foreground mb-4">Monthly revenue in ₹</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="hsl(152,60%,36%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products Chart — full width */}
      <div className="bg-card rounded-xl border p-6 shadow-sm">
        <h3 className="font-semibold text-card-foreground mb-1">Top Products by Orders</h3>
        <p className="text-xs text-muted-foreground mb-4">Top 5 products by order count</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topProductsData} layout="vertical" margin={{ left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} width={100} />
            <Tooltip />
            <Bar dataKey="orders" fill="hsl(152,60%,36%)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-xl border shadow-sm">
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <h3 className="font-semibold text-card-foreground">Recent Orders</h3>
            <p className="text-xs text-muted-foreground">Latest customer orders</p>
          </div>
          <button className="text-sm text-primary font-medium hover:underline">View All →</button>
        </div>
        <div className="px-6 pb-6 space-y-3">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-lg">
                  <ShoppingCart className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm text-card-foreground">{order.customer}</p>
                  <p className="text-xs text-muted-foreground">{order.id} • {order.weight}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-sm text-card-foreground">{order.amount}</span>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[order.status] || "bg-muted text-muted-foreground"}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
