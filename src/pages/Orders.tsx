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
  id: string;
  product: string;
  size: string;
  quantity: string;
  purpose: string;
  date: string;
  price: string;
  deliveryFee: string;
  status: string;
  customer: { name: string; phone: string; email: string };
}

const statusFlow = ["Pending", "Processing", "Shipped", "Delivered"];

const initialOrders: Order[] = [
  { id: "ORD-2024-001", product: "Biomass Pellets", size: "50kg", quantity: "10", purpose: "Industrial Heating", date: "2024-03-15", price: "₹7,500", deliveryFee: "₹500", status: "Pending", customer: { name: "Rajesh Kumar", phone: "+91 98765 43210", email: "rajesh@greenindustries.com" } },
  { id: "ORD-2024-002", product: "Biomass Stove", size: "Large", quantity: "2", purpose: "Commercial Cooking", date: "2024-03-14", price: "₹7,000", deliveryFee: "₹800", status: "Processing", customer: { name: "Priya Sharma", phone: "+91 87654 32109", email: "priya@ecoheat.in" } },
  { id: "ORD-2024-003", product: "Biomass Burner", size: "100kW", quantity: "1", purpose: "Steam Generation", date: "2024-03-13", price: "₹25,000", deliveryFee: "₹2,000", status: "Shipped", customer: { name: "Anand Patel", phone: "+91 76543 21098", email: "anand@biomasstrading.com" } },
  { id: "ORD-2024-004", product: "Wood Pellets", size: "25kg", quantity: "20", purpose: "Boiler Fuel", date: "2024-03-12", price: "₹9,000", deliveryFee: "₹600", status: "Processing", customer: { name: "Meena Devi", phone: "+91 65432 10987", email: "meena@ruralenergy.in" } },
  { id: "ORD-2024-005", product: "Biomass Pellets", size: "100kg", quantity: "5", purpose: "Boiler Fuel", date: "2024-03-11", price: "₹7,500", deliveryFee: "₹500", status: "Pending", customer: { name: "Suresh Babu", phone: "+91 54321 09876", email: "suresh@biofuelcorp.com" } },
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
    o.product.toLowerCase().includes(search.toLowerCase()) ||
    o.customer.name.toLowerCase().includes(search.toLowerCase())
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
        <p className="text-muted-foreground">Current orders from mobile app</p>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Summary — {selectedOrder?.id}</DialogTitle>
            <DialogDescription>Order and customer details from app.</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-2">
              <h3 className="text-sm font-semibold text-card-foreground">Order Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Product:</span><p className="font-medium text-card-foreground">{selectedOrder.product}</p></div>
                <div><span className="text-muted-foreground">Size:</span><p className="font-medium text-card-foreground">{selectedOrder.size}</p></div>
                <div><span className="text-muted-foreground">Purpose:</span><p className="font-medium text-card-foreground">{selectedOrder.purpose}</p></div>
                <div><span className="text-muted-foreground">Quantity:</span><p className="font-medium text-card-foreground">{selectedOrder.quantity}</p></div>
                <div><span className="text-muted-foreground">Price:</span><p className="font-medium text-card-foreground">{selectedOrder.price}</p></div>
                <div><span className="text-muted-foreground">Delivery Fee:</span><p className="font-medium text-card-foreground">{selectedOrder.deliveryFee}</p></div>
                <div><span className="text-muted-foreground">Date:</span><p className="font-medium text-card-foreground">{selectedOrder.date}</p></div>
              </div>
              <div className="border-t pt-3">
                <h3 className="text-sm font-semibold text-card-foreground mb-2">Customer Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Name:</span><p className="font-medium text-card-foreground">{selectedOrder.customer.name}</p></div>
                  <div><span className="text-muted-foreground">Phone:</span><p className="font-medium text-card-foreground">{selectedOrder.customer.phone}</p></div>
                  <div className="col-span-2"><span className="text-muted-foreground">Email:</span><p className="font-medium text-card-foreground">{selectedOrder.customer.email}</p></div>
                </div>
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
        <div className="p-4 border-b">
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
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Product</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Size</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Qty</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Purpose</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-primary">{o.id}</td>
                  <td className="px-6 py-4 text-sm text-card-foreground">{o.product}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{o.size}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{o.quantity}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{o.purpose}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{o.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => viewOrder(o)} className="p-1.5 hover:bg-muted rounded-lg"><Eye className="h-4 w-4 text-muted-foreground" /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}