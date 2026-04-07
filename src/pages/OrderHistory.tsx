import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const completedOrders = [
  { id: "ORD-2023-098", product: "Biomass Pellets", size: "50kg", quantity: "15", date: "2024-03-08", invoice: "INV-2024-001" },
  { id: "ORD-2023-095", product: "Biomass Stove", size: "Medium", quantity: "3", date: "2024-03-05", invoice: "INV-2024-002" },
  { id: "ORD-2023-090", product: "Biomass Burner", size: "200kW", quantity: "1", date: "2024-02-28", invoice: "INV-2024-003" },
  { id: "ORD-2023-085", product: "Wood Pellets", size: "25kg", quantity: "30", date: "2024-02-20", invoice: "INV-2024-004" },
  { id: "ORD-2023-080", product: "Groundnut Shell Pellets", size: "50kg", quantity: "20", date: "2024-02-15", invoice: "INV-2024-005" },
];

export default function OrderHistory() {
  const [search, setSearch] = useState("");

  const filtered = completedOrders.filter(o =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.product.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = (invoice: string) => {
    toast.success(`Downloading ${invoice}...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Order History</h1>
        <p className="text-muted-foreground">Completed & delivered orders</p>
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
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Product</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Size</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Qty</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-primary">{o.id}</td>
                  <td className="px-6 py-4 text-sm text-card-foreground">{o.product}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{o.size}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{o.quantity}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{o.date}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => handleDownload(o.invoice)}>
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