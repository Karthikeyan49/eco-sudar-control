import { Factory, IndianRupee, ShoppingCart, Users } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const productionData = [
  { day: "Mon", actual: 2400, target: 2700 },
  { day: "Tue", actual: 2600, target: 2700 },
  { day: "Wed", actual: 2900, target: 2700 },
  { day: "Thu", actual: 3100, target: 2700 },
  { day: "Fri", actual: 2800, target: 2700 },
  { day: "Sat", actual: 2750, target: 2700 },
  { day: "Sun", actual: 2500, target: 2700 },
];

const revenueData = [
  { month: "Jan", revenue: 320000, cogs: 180000 },
  { month: "Feb", revenue: 400000, cogs: 220000 },
  { month: "Mar", revenue: 450000, cogs: 240000 },
  { month: "Apr", revenue: 480000, cogs: 250000 },
  { month: "May", revenue: 520000, cogs: 260000 },
  { month: "Jun", revenue: 550000, cogs: 280000 },
];

const recentOrders = [
  { id: "ORD-2024-001", customer: "Green Industries Ltd", weight: "500kg", amount: "₹10,000", status: "Delivered" },
  { id: "ORD-2024-002", customer: "EcoHeat Solutions", weight: "2000kg", amount: "₹36,000", status: "Shipped" },
  { id: "ORD-2024-003", customer: "Biomass Trading Co", weight: "100kg", amount: "₹2,500", status: "Processing" },
  { id: "ORD-2024-004", customer: "Rural Energy Hub", weight: "3500kg", amount: "₹52,500", status: "Pending" },
];

const inventory = [
  { name: "Sawdust", current: 4500, capacity: 8000 },
  { name: "Groundnut Shells", current: 2200, capacity: 5000, warning: true },
  { name: "Sugarcane Bagasse", current: 6800, capacity: 10000 },
  { name: "Finished Pellets", current: 1850, capacity: 3000 },
];

const statusColors: Record<string, string> = {
  Delivered: "bg-primary/10 text-primary",
  Shipped: "bg-blue-50 text-status-shipped",
  Processing: "bg-yellow-50 text-status-processing",
  Pending: "bg-muted text-status-pending",
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

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Production" value="3,240 kg" subtitle="+12% from yesterday" icon={Factory} />
        <StatCard title="Monthly Revenue" value="₹6.2L" subtitle="+8.5% from last month" icon={IndianRupee} />
        <StatCard title="Active Orders" value="28" subtitle="5 pending dispatch" icon={ShoppingCart} subtitleColor="muted" />
        <StatCard title="Active Dealers" value="45" subtitle="+3 this week" icon={Users} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-card-foreground">Daily Production</h3>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary inline-block" /> Actual</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-muted-foreground/30 inline-block" /> Target</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Weekly yield in kg</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip />
              <Area type="monotone" dataKey="actual" stroke="hsl(152,60%,36%)" fill="hsl(152,60%,36%,0.15)" strokeWidth={2} />
              <Area type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground)/0.3)" fill="transparent" strokeWidth={2} strokeDasharray="6 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-card-foreground">Revenue vs COGS</h3>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary inline-block" /> Revenue</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-status-processing inline-block" /> COGS</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Monthly comparison in ₹</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="hsl(152,60%,36%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cogs" fill="hsl(45,90%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders + Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border shadow-sm">
          <div className="flex items-center justify-between p-6 pb-4">
            <div>
              <h3 className="font-semibold text-card-foreground">Recent Orders</h3>
              <p className="text-xs text-muted-foreground">Latest customer orders</p>
            </div>
            <button className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
              View All →
            </button>
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
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-card-foreground">Inventory Status</h3>
              <p className="text-xs text-muted-foreground">Raw materials & finished goods</p>
            </div>
          </div>
          <div className="space-y-5">
            {inventory.map((item) => {
              const pct = (item.current / item.capacity) * 100;
              const low = pct < 50;
              return (
                <div key={item.name}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-card-foreground flex items-center gap-1">
                      {item.name}
                      {item.warning && <span className="text-status-processing">⚠</span>}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {item.current.toLocaleString()} / {item.capacity.toLocaleString()} kg
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${low ? "bg-status-processing" : "bg-primary"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
