import { Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";

const orders = [
  { id: "ORD-2024-001", customer: "Green Industries Ltd", phone: "+91 98765 43210", products: "Biomass Briquettes", qty: "500kg", total: "₹10,000", delivery: "₹500", status: "Delivered" },
  { id: "ORD-2024-002", customer: "EcoHeat Solutions", phone: "+91 87654 32109", products: "Wood Pellets", qty: "2000kg", total: "₹36,000", delivery: "₹1,000", status: "Shipped" },
  { id: "ORD-2024-003", customer: "Biomass Trading Co", phone: "+91 76543 21098", products: "Sawdust Blocks", qty: "100kg", total: "₹2,500", delivery: "₹200", status: "Processing" },
  { id: "ORD-2024-004", customer: "Rural Energy Hub", phone: "+91 65432 10987", products: "Groundnut Shell Pellets", qty: "3500kg", total: "₹52,500", delivery: "₹2,000", status: "Pending" },
  { id: "ORD-2024-005", customer: "BioFuel Corp", phone: "+91 54321 09876", products: "Bagasse Briquettes", qty: "1000kg", total: "₹14,000", delivery: "₹800", status: "Processing" },
];

const statusColors: Record<string, string> = {
  Delivered: "bg-primary/10 text-primary",
  Shipped: "bg-blue-50 text-status-shipped",
  Processing: "bg-yellow-50 text-status-processing",
  Pending: "bg-muted text-status-pending",
};

export default function Orders() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Order Management</h1>
        <p className="text-muted-foreground">Track and manage all customer orders</p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-4 border-b flex items-center gap-4">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search orders..." className="pl-10" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Order ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Product</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Qty</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Total</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-primary">{o.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-card-foreground">{o.customer}</p>
                    <p className="text-xs text-muted-foreground">{o.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{o.products}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{o.qty}</td>
                  <td className="px-6 py-4 text-sm font-medium text-card-foreground">{o.total}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 hover:bg-muted rounded-lg"><Eye className="h-4 w-4 text-muted-foreground" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
