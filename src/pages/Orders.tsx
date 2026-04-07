import { Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Order {
  id: string; customer: string; phone: string; email: string; company: string; address: string; gst: string;
  products: string; qty: string; total: string; delivery: string; status: string;
}

const statusFlow = ["Pending", "Processing", "Shipped", "Delivered"];

const initialOrders: Order[] = [
  { id: "ORD-2024-001", customer: "Green Industries Ltd", phone: "+91 98765 43210", email: "info@greenindustries.com", company: "Green Industries Ltd", address: "Chennai, Tamil Nadu", gst: "33AABCG1234F1Z5", products: "Biomass Briquettes", qty: "500kg", total: "₹10,000", delivery: "₹500", status: "Delivered" },
  { id: "ORD-2024-002", customer: "EcoHeat Solutions", phone: "+91 87654 32109", email: "contact@ecoheat.in", company: "EcoHeat Solutions Pvt Ltd", address: "Coimbatore, Tamil Nadu", gst: "33AABCE5678H1Z3", products: "Wood Pellets", qty: "2000kg", total: "₹36,000", delivery: "₹1,000", status: "Shipped" },
  { id: "ORD-2024-003", customer: "Biomass Trading Co", phone: "+91 76543 21098", email: "sales@biomasstrading.com", company: "Biomass Trading Co", address: "Madurai, Tamil Nadu", gst: "33AABCB9012K1Z1", products: "Sawdust Blocks", qty: "100kg", total: "₹2,500", delivery: "₹200", status: "Processing" },
  { id: "ORD-2024-004", customer: "Rural Energy Hub", phone: "+91 65432 10987", email: "admin@ruralenergy.in", company: "Rural Energy Hub LLP", address: "Salem, Tamil Nadu", gst: "33AABCR3456L1Z9", products: "Groundnut Shell Pellets", qty: "3500kg", total: "₹52,500", delivery: "₹2,000", status: "Pending" },
  { id: "ORD-2024-005", customer: "BioFuel Corp", phone: "+91 54321 09876", email: "order@biofuelcorp.com", company: "BioFuel Corporation", address: "Trichy, Tamil Nadu", gst: "33AABCB7890M1Z7", products: "Bagasse Briquettes", qty: "1000kg", total: "₹14,000", delivery: "₹800", status: "Processing" },
];

const statusColors: Record<string, string> = {
  Delivered: "bg-primary/10 text-primary",
  Shipped: "bg-blue-50 text-status-shipped",
  Processing: "bg-yellow-50 text-status-processing",
  Pending: "bg-muted text-status-pending",
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filtered = orders.filter(o =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.customer.toLowerCase().includes(search.toLowerCase()) ||
    o.products.toLowerCase().includes(search.toLowerCase())
  );

  const viewOrder = (o: Order) => { setSelectedOrder({ ...o }); setDetailOpen(true); };

  const updateStatus = (newStatus: string) => {
    if (!selectedOrder) return;
    setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
    setSelectedOrder({ ...selectedOrder, status: newStatus });
    toast.success(`Order ${selectedOrder.id} status updated to ${newStatus}`);
    if (newStatus === "Delivered") {
      toast.success("Invoice auto-generated for this order");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Order Management</h1>
        <p className="text-muted-foreground">Track and manage all customer orders</p>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details — {selectedOrder?.id}</DialogTitle>
            <DialogDescription>View full order information and update status.</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Customer:</span><p className="font-medium text-card-foreground">{selectedOrder.customer}</p></div>
                <div><span className="text-muted-foreground">Phone:</span><p className="font-medium text-card-foreground">{selectedOrder.phone}</p></div>
                <div><span className="text-muted-foreground">Email:</span><p className="font-medium text-card-foreground">{selectedOrder.email}</p></div>
                <div><span className="text-muted-foreground">Company:</span><p className="font-medium text-card-foreground">{selectedOrder.company}</p></div>
                <div><span className="text-muted-foreground">Address:</span><p className="font-medium text-card-foreground">{selectedOrder.address}</p></div>
                <div><span className="text-muted-foreground">GST:</span><p className="font-medium text-card-foreground font-mono text-xs">{selectedOrder.gst}</p></div>
              </div>
              <div className="border-t pt-3 grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Product:</span><p className="font-medium text-card-foreground">{selectedOrder.products}</p></div>
                <div><span className="text-muted-foreground">Quantity:</span><p className="font-medium text-card-foreground">{selectedOrder.qty}</p></div>
                <div><span className="text-muted-foreground">Total:</span><p className="font-medium text-card-foreground">{selectedOrder.total}</p></div>
                <div><span className="text-muted-foreground">Delivery:</span><p className="font-medium text-card-foreground">{selectedOrder.delivery}</p></div>
              </div>
              <div className="border-t pt-3">
                <label className="text-sm font-medium text-card-foreground">Update Status</label>
                <Select value={selectedOrder.status} onValueChange={updateStatus}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statusFlow.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-4 border-b flex items-center gap-4">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search orders..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
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
              {filtered.map((o) => (
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
                    <button onClick={() => viewOrder(o)} className="p-1.5 hover:bg-muted rounded-lg"><Eye className="h-4 w-4 text-muted-foreground" /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
