import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  Delivered: "bg-primary/10 text-primary",
  Cancelled: "bg-destructive/10 text-destructive",
  Returned: "bg-purple-50 text-status-returned",
};

const completedOrders = [
  { id: "ORD-2023-098", items: "Biomass Pellets (50kg) x15", date: "2024-03-08", status: "Delivered", grandTotal: "₹12,800", invoice: "INV-2024-001" },
  { id: "ORD-2023-095", items: "Biomass Stove (Medium) x3", date: "2024-03-05", status: "Delivered", grandTotal: "₹18,540", invoice: "INV-2024-002" },
  { id: "ORD-2023-090", items: "Biomass Burner (200kW) x1", date: "2024-02-28", status: "Delivered", grandTotal: "₹73,160", invoice: "INV-2024-003" },
  { id: "ORD-2023-085", items: "Wood Pellets (25kg) x30", date: "2024-02-20", status: "Delivered", grandTotal: "₹16,520", invoice: "INV-2024-004" },
  { id: "ORD-2024-006", items: "Biomass Stove (Small) x1", date: "2024-03-08", status: "Cancelled", grandTotal: "₹4,930", invoice: "—" },
  { id: "ORD-2024-007", items: "Biomass Burner (50kW) x1", date: "2024-03-03", status: "Returned", grandTotal: "₹31,500", invoice: "—" },
];

export default function OrderHistory() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = completedOrders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.items.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || o.status === filter;
    return matchSearch && matchFilter;
  });

  const handleDownload = (invoice: string) => {
    if (invoice === "—") { toast.error("No invoice for this order"); return; }
    toast.success(`Downloading ${invoice}...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Order History</h1>
        <p className="text-muted-foreground">Completed, cancelled & returned orders</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {["All", "Delivered", "Cancelled", "Returned"].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search order history..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Order ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Items</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Total</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-primary">{o.id}</td>
                  <td className="px-6 py-4 text-sm text-card-foreground">{o.items}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{o.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[o.status] || "bg-muted text-muted-foreground"}`}>{o.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-card-foreground">{o.grandTotal}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => handleDownload(o.invoice)} disabled={o.invoice === "—"}>
                      <Download className="h-3.5 w-3.5" /> {o.invoice}
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No completed orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
