import { Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CancelledOrder {
  id: string;
  customer: string;
  products: string;
  date: string;
  status: "Cancelled" | "Returned";
  reason: string;
  refundStatus: "N/A" | "Initiated" | "Processed";
  grandTotal: string;
  paymentMethod: string;
}

const initialData: CancelledOrder[] = [
  { id: "ORD-2024-006", customer: "Kavitha R", products: "Biomass Stove (Small)", date: "2024-03-08", status: "Cancelled", reason: "Customer request - changed mind", refundStatus: "Initiated", grandTotal: "₹4,930", paymentMethod: "UPI" },
  { id: "ORD-2024-007", customer: "Mohan Das", products: "Biomass Burner (50kW)", date: "2024-03-03", status: "Returned", reason: "Damaged product", refundStatus: "Processed", grandTotal: "₹31,500", paymentMethod: "Online" },
  { id: "ORD-2024-010", customer: "Ravi Kumar", products: "Biomass Pellets (6mm) x5", date: "2024-02-25", status: "Cancelled", reason: "Wrong item ordered", refundStatus: "Processed", grandTotal: "₹5,200", paymentMethod: "COD" },
  { id: "ORD-2024-012", customer: "Anita Sharma", products: "Eco Plates (8 inch) x100", date: "2024-02-20", status: "Returned", reason: "Damaged product — plates cracked during transit", refundStatus: "Initiated", grandTotal: "₹520", paymentMethod: "Wallet" },
];

const statusColors: Record<string, string> = {
  Cancelled: "bg-destructive/10 text-destructive",
  Returned: "bg-purple-50 text-status-returned",
};

const refundColors: Record<string, string> = {
  "N/A": "bg-muted text-muted-foreground",
  Initiated: "bg-yellow-50 text-status-processing",
  Processed: "bg-primary/10 text-primary",
};

export default function Cancellations() {
  const [data, setData] = useState<CancelledOrder[]>(initialData);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<CancelledOrder | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [refundTarget, setRefundTarget] = useState<CancelledOrder | null>(null);
  const [newRefundStatus, setNewRefundStatus] = useState<string>("Initiated");

  const filtered = data.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || o.status === filter;
    return matchSearch && matchFilter;
  });

  const openRefundDialog = (o: CancelledOrder) => {
    setRefundTarget(o);
    setNewRefundStatus(o.refundStatus);
    setRefundOpen(true);
  };

  const saveRefund = () => {
    if (!refundTarget) return;
    setData(data.map(o => o.id === refundTarget.id ? { ...o, refundStatus: newRefundStatus as CancelledOrder["refundStatus"] } : o));
    toast.success(`Refund status updated to ${newRefundStatus} for ${refundTarget.id}`);
    setRefundOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cancellations & Returns</h1>
        <p className="text-muted-foreground">Manage cancelled and returned orders</p>
      </div>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order {selected?.id}</DialogTitle>
            <DialogDescription>Cancellation / Return details.</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 py-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">Customer:</span><p className="font-medium text-card-foreground">{selected.customer}</p></div>
                <div><span className="text-muted-foreground">Date:</span><p className="font-medium text-card-foreground">{selected.date}</p></div>
                <div><span className="text-muted-foreground">Products:</span><p className="font-medium text-card-foreground">{selected.products}</p></div>
                <div><span className="text-muted-foreground">Total:</span><p className="font-bold text-primary">{selected.grandTotal}</p></div>
                <div><span className="text-muted-foreground">Payment:</span><p className="font-medium text-card-foreground">{selected.paymentMethod}</p></div>
                <div><span className="text-muted-foreground">Status:</span><p><span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusColors[selected.status]}`}>{selected.status}</span></p></div>
              </div>
              <div className="border-t pt-3">
                <span className="text-muted-foreground">Reason:</span>
                <p className="font-medium text-destructive mt-1">{selected.reason}</p>
              </div>
              <div className="border-t pt-3 flex items-center justify-between">
                <div><span className="text-muted-foreground">Refund Status:</span><p><span className={`inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${refundColors[selected.refundStatus]}`}>{selected.refundStatus}</span></p></div>
              </div>
            </div>
          )}
          <DialogFooter><DialogClose asChild><Button variant="outline">Close</Button></DialogClose></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Update Dialog */}
      <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Refund — {refundTarget?.id}</DialogTitle>
            <DialogDescription>Change the refund status for this order.</DialogDescription>
          </DialogHeader>
          <div className="py-3">
            <Select value={newRefundStatus} onValueChange={setNewRefundStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Initiated">Initiated</SelectItem>
                <SelectItem value="Processed">Processed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={saveRefund}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {["All", "Cancelled", "Returned"].map(s => (
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
            <Input placeholder="Search by order ID or customer..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Order ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Product(s)</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Reason</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Refund</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-primary">{o.id}</td>
                  <td className="px-6 py-4 text-sm text-card-foreground">{o.customer}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground max-w-[200px] truncate">{o.products}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{o.date}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground max-w-[180px] truncate">{o.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${refundColors[o.refundStatus]}`}>{o.refundStatus}</span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-1">
                    <button onClick={() => { setSelected(o); setViewOpen(true); }} className="p-1.5 hover:bg-muted rounded-lg"><Eye className="h-4 w-4 text-muted-foreground" /></button>
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => openRefundDialog(o)}>Update Refund</Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">No records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
