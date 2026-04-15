import { Search, Download, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";

interface InvoiceItem {
  product: string;
  size: string;
  qty: number;
  unitPrice: string;
  lineTotal: string;
}

interface Invoice {
  id: string;
  orderId: string;
  customer: string;
  gst: string;
  items: InvoiceItem[];
  subtotal: string;
  gstAmount: string;
  deliveryFee: string;
  total: string;
  date: string;
  status: string;
  paymentMethod: string;
  trackingNumber: string;
}

const invoices: Invoice[] = [
  {
    id: "INV-2024-001", orderId: "ORD-2024-001", customer: "Green Industries Ltd", gst: "33AABCG1234F1Z5",
    items: [
      { product: "Biomass Pellets", size: "6mm", qty: 10, unitPrice: "₹750", lineTotal: "₹7,500" },
      { product: "Biomass Stove", size: "Medium", qty: 1, unitPrice: "₹5,000", lineTotal: "₹5,000" },
    ],
    subtotal: "₹12,500", gstAmount: "₹2,250", deliveryFee: "₹500", total: "₹15,250", date: "2024-03-10", status: "Paid", paymentMethod: "UPI", trackingNumber: "",
  },
  {
    id: "INV-2024-002", orderId: "ORD-2024-003", customer: "Biomass Trading Co", gst: "33AABCB7890M1Z7",
    items: [
      { product: "Biomass Burner", size: "100kW", qty: 1, unitPrice: "₹40,000", lineTotal: "₹40,000" },
    ],
    subtotal: "₹40,000", gstAmount: "₹7,200", deliveryFee: "₹2,000", total: "₹49,200", date: "2024-03-08", status: "Paid", paymentMethod: "Net Banking", trackingNumber: "TRK-9876543210",
  },
  {
    id: "INV-2024-003", orderId: "ORD-2024-002", customer: "EcoHeat Solutions", gst: "33AABCE5678H1Z3",
    items: [
      { product: "Biomass Stove", size: "Large", qty: 2, unitPrice: "₹7,500", lineTotal: "₹15,000" },
    ],
    subtotal: "₹15,000", gstAmount: "₹2,700", deliveryFee: "₹800", total: "₹18,500", date: "2024-03-05", status: "Pending", paymentMethod: "Online", trackingNumber: "",
  },
  {
    id: "INV-2024-004", orderId: "ORD-2024-004", customer: "Rural Energy Hub", gst: "33AABCR3456L1Z9",
    items: [
      { product: "Wood Pellets", size: "8mm", qty: 20, unitPrice: "₹450", lineTotal: "₹9,000" },
      { product: "Biomass Pellets", size: "10mm", qty: 5, unitPrice: "₹500", lineTotal: "₹2,500" },
    ],
    subtotal: "₹11,500", gstAmount: "₹2,070", deliveryFee: "₹600", total: "₹14,170", date: "2024-02-28", status: "Paid", paymentMethod: "COD", trackingNumber: "",
  },
];

const statusColors: Record<string, string> = {
  Paid: "bg-primary/10 text-primary",
  Pending: "bg-yellow-50 text-status-processing",
};

export default function Invoices() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = invoices.filter(inv =>
    inv.id.toLowerCase().includes(search.toLowerCase()) ||
    inv.customer.toLowerCase().includes(search.toLowerCase()) ||
    inv.orderId.toLowerCase().includes(search.toLowerCase())
  );

  const viewInvoice = (inv: Invoice) => { setSelected(inv); setOpen(true); };

  const downloadInvoice = (inv: Invoice) => {
    toast.success(`Downloading ${inv.id}...`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Invoice Management</h1>
        <p className="text-muted-foreground">Auto-generated invoices with GST calculation</p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice {selected?.id}</DialogTitle>
            <DialogDescription>Invoice details and GST breakdown.</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 py-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">Order:</span><p className="font-medium text-card-foreground">{selected.orderId}</p></div>
                <div><span className="text-muted-foreground">Date:</span><p className="font-medium text-card-foreground">{selected.date}</p></div>
                <div><span className="text-muted-foreground">Customer:</span><p className="font-medium text-card-foreground">{selected.customer}</p></div>
                <div><span className="text-muted-foreground">GSTIN:</span><p className="font-medium text-card-foreground font-mono text-xs">{selected.gst}</p></div>
                <div><span className="text-muted-foreground">Payment Method:</span><p className="font-medium text-card-foreground">{selected.paymentMethod}</p></div>
                {selected.trackingNumber && (
                  <div><span className="text-muted-foreground">Tracking Number:</span><p className="font-medium text-card-foreground font-mono text-xs">{selected.trackingNumber}</p></div>
                )}
              </div>

              {/* Line Items Table */}
              <div className="border-t pt-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Line Items</h4>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Product</th>
                        <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Size</th>
                        <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Qty</th>
                        <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Unit Price</th>
                        <th className="text-right px-3 py-2 text-xs font-semibold text-muted-foreground">Line Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.items.map((item, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="px-3 py-2 font-medium text-card-foreground">{item.product}</td>
                          <td className="px-3 py-2 text-muted-foreground">{item.size}</td>
                          <td className="px-3 py-2 text-muted-foreground">{item.qty}</td>
                          <td className="px-3 py-2 text-muted-foreground">{item.unitPrice}</td>
                          <td className="px-3 py-2 text-right font-medium text-card-foreground">{item.lineTotal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium text-card-foreground">{selected.subtotal}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span className="font-medium text-card-foreground">{selected.gstAmount}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery Fee</span><span className="font-medium text-card-foreground">{selected.deliveryFee}</span></div>
                <div className="flex justify-between border-t pt-2"><span className="font-semibold text-card-foreground">Total</span><span className="font-bold text-primary text-lg">{selected.total}</span></div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[selected.status]}`}>{selected.status}</span>
                <Button size="sm" onClick={() => downloadInvoice(selected)} className="gap-1.5">
                  <Download className="h-3.5 w-3.5" /> Download PDF
                </Button>
              </div>
            </div>
          )}
          <DialogFooter><DialogClose asChild><Button variant="outline">Close</Button></DialogClose></DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search invoices..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Invoice</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Order</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Items</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Total</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Payment</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-primary">{inv.id}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{inv.orderId}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-card-foreground">{inv.customer}</p>
                    <p className="text-xs text-muted-foreground font-mono">{inv.gst}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{inv.items.length} item(s)</td>
                  <td className="px-6 py-4 text-sm font-semibold text-card-foreground">{inv.total}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{inv.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[inv.status]}`}>{inv.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-1">
                    <button onClick={() => viewInvoice(inv)} className="p-1.5 hover:bg-muted rounded-lg"><Eye className="h-4 w-4 text-muted-foreground" /></button>
                    <button onClick={() => downloadInvoice(inv)} className="p-1.5 hover:bg-muted rounded-lg"><Download className="h-4 w-4 text-muted-foreground" /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">No invoices found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
