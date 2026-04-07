import { Search, Download, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const invoices = [
  { id: "INV-2024-001", orderId: "ORD-2024-001", customer: "Green Industries Ltd", gst: "33AABCG1234F1Z5", subtotal: "₹10,000", gstAmount: "₹1,800", total: "₹11,800", date: "2024-03-10", status: "Paid" },
  { id: "INV-2024-002", orderId: "ORD-2023-098", customer: "BioFuel Corp", gst: "33AABCB7890M1Z7", subtotal: "₹27,000", gstAmount: "₹4,860", total: "₹31,860", date: "2024-03-08", status: "Paid" },
  { id: "INV-2024-003", orderId: "ORD-2023-095", customer: "Rural Energy Hub", gst: "33AABCR3456L1Z9", subtotal: "₹9,600", gstAmount: "₹1,728", total: "₹11,328", date: "2024-03-05", status: "Pending" },
  { id: "INV-2024-004", orderId: "ORD-2023-090", customer: "EcoHeat Solutions", gst: "33AABCE5678H1Z3", subtotal: "₹28,000", gstAmount: "₹5,040", total: "₹33,040", date: "2024-02-28", status: "Paid" },
];

const statusColors: Record<string, string> = {
  Paid: "bg-primary/10 text-primary",
  Pending: "bg-yellow-50 text-status-processing",
};

export default function Invoices() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Invoice Management</h1>
        <p className="text-muted-foreground">Auto-generated invoices with GST calculation</p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search invoices..." className="pl-10" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Invoice</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Order</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Subtotal</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">GST (18%)</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Total</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-primary">{inv.id}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{inv.orderId}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-card-foreground">{inv.customer}</p>
                    <p className="text-xs text-muted-foreground font-mono">{inv.gst}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{inv.subtotal}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{inv.gstAmount}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-card-foreground">{inv.total}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[inv.status]}`}>{inv.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-1">
                    <button className="p-1.5 hover:bg-muted rounded-lg"><Eye className="h-4 w-4 text-muted-foreground" /></button>
                    <button className="p-1.5 hover:bg-muted rounded-lg"><Download className="h-4 w-4 text-muted-foreground" /></button>
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
