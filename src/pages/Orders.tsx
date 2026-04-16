import { Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrderItem {
  product: string;
  size: string;
  quantity: string;
  unitPrice: string;
  subtotal: string;
  purpose: string;
}

interface DeliveryAddress {
  name: string;
  phone: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  addressType: "Home" | "Office" | "Other";
  preferredDate: string;
  preferredTimeSlot: string;
  deliveryInstructions: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  deliveryAddress: DeliveryAddress;
  date: string;
  status: string;
  customer: { name: string; phone: string; email: string };
  trackingNumber: string;
  paymentMethod: string;
  cancelReason: string;
  refundStatus: "N/A" | "Initiated" | "Processed";
  subtotal: string;
  gstAmount: string;
  deliveryFee: string;
  discount: string;
  grandTotal: string;
}

const statusFlow = ["Pending", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned"];

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

const paymentMethods = ["Pending", "COD", "UPI", "Online", "Net Banking", "Wallet"];

const initialOrders: Order[] = [
  {
    id: "ES202604150028",
    items: [
      { product: "Biomass Pellets", size: "6mm", quantity: "10", unitPrice: "₹8.50/kg", subtotal: "₹85", purpose: "Commercial Kitchen" },
      { product: "Biomass Pellets", size: "8mm", quantity: "5", unitPrice: "₹9/kg", subtotal: "₹45", purpose: "Industrial Dryer" },
    ],
    deliveryAddress: { name: "Rajesh Kumar", phone: "+91 98765 43210", address: "12 Industrial Estate", landmark: "Near Railway Station", city: "Chennai", state: "Tamil Nadu", pincode: "600001", addressType: "Office", preferredDate: "2024-03-18", preferredTimeSlot: "10 AM - 2 PM", deliveryInstructions: "Call before delivery" },
    date: "15/4/2026", status: "Pending",
    customer: { name: "Rajesh Kumar", phone: "+91 98765 43210", email: "rajesh@greenindustries.com" },
    trackingNumber: "", paymentMethod: "Pending", cancelReason: "", refundStatus: "N/A",
    subtotal: "₹130", gstAmount: "₹23.40", deliveryFee: "₹150", discount: "₹0", grandTotal: "₹167",
  },
  {
    id: "ES202604150021",
    items: [
      { product: "Biomass Pellets", size: "10mm", quantity: "10", unitPrice: "₹10/kg", subtotal: "₹100", purpose: "Industrial Dryer" },
    ],
    deliveryAddress: { name: "Priya Sharma", phone: "+91 87654 32109", address: "45 Green Park Colony", landmark: "Opposite Mall", city: "Bangalore", state: "Karnataka", pincode: "560001", addressType: "Home", preferredDate: "2024-03-17", preferredTimeSlot: "2 PM - 6 PM", deliveryInstructions: "" },
    date: "15/4/2026", status: "Pending",
    customer: { name: "Priya Sharma", phone: "+91 87654 32109", email: "priya@ecoheat.in" },
    trackingNumber: "", paymentMethod: "Pending", cancelReason: "", refundStatus: "N/A",
    subtotal: "₹100", gstAmount: "₹18", deliveryFee: "₹150", discount: "₹0", grandTotal: "₹167",
  },
  {
    id: "ES202604150020",
    items: [
      { product: "Biomass Pellets", size: "6mm", quantity: "8", unitPrice: "₹8.50/kg", subtotal: "₹68", purpose: "Commercial Kitchen" },
    ],
    deliveryAddress: { name: "Anand Patel", phone: "+91 76543 21098", address: "78 GIDC Industrial Area", landmark: "Near Water Tank", city: "Ahmedabad", state: "Gujarat", pincode: "380001", addressType: "Office", preferredDate: "2024-03-20", preferredTimeSlot: "10 AM - 2 PM", deliveryInstructions: "Heavy load - forklift needed" },
    date: "15/4/2026", status: "Pending",
    customer: { name: "Anand Patel", phone: "+91 76543 21098", email: "anand@biomasstrading.com" },
    trackingNumber: "", paymentMethod: "Pending", cancelReason: "", refundStatus: "N/A",
    subtotal: "₹68", gstAmount: "₹12.24", deliveryFee: "₹150", discount: "₹0", grandTotal: "₹158.50",
  },
  {
    id: "ES202604140015",
    items: [
      { product: "Biomass Stove", size: "5kg", quantity: "1", unitPrice: "₹6,500", subtotal: "₹6,500", purpose: "Commercial Kitchen" },
    ],
    deliveryAddress: { name: "Meena Devi", phone: "+91 65432 10987", address: "Village Rampur", landmark: "Near Panchayat Office", city: "Kanchipuram", state: "Tamil Nadu", pincode: "631502", addressType: "Home", preferredDate: "2024-03-19", preferredTimeSlot: "6 PM - 9 PM", deliveryInstructions: "" },
    date: "14/4/2026", status: "Confirmed",
    customer: { name: "Meena Devi", phone: "+91 65432 10987", email: "meena@ruralenergy.in" },
    trackingNumber: "", paymentMethod: "COD", cancelReason: "", refundStatus: "N/A",
    subtotal: "₹6,500", gstAmount: "₹1,170", deliveryFee: "₹800", discount: "₹200", grandTotal: "₹8,270",
  },
  {
    id: "ES202604130010",
    items: [
      { product: "Biomass Pellets", size: "6mm", quantity: "50", unitPrice: "₹8.50/kg", subtotal: "₹425", purpose: "Industrial Dryer" },
    ],
    deliveryAddress: { name: "Suresh Babu", phone: "+91 54321 09876", address: "22 Tech Park Road", landmark: "", city: "Hyderabad", state: "Telangana", pincode: "500001", addressType: "Office", preferredDate: "2024-03-22", preferredTimeSlot: "10 AM - 2 PM", deliveryInstructions: "" },
    date: "13/4/2026", status: "Shipped",
    customer: { name: "Suresh Babu", phone: "+91 54321 09876", email: "suresh@biofuelcorp.com" },
    trackingNumber: "TRK-1234567890", paymentMethod: "UPI", cancelReason: "", refundStatus: "N/A",
    subtotal: "₹425", gstAmount: "₹76.50", deliveryFee: "₹150", discount: "₹0", grandTotal: "₹651.50",
  },
  {
    id: "ES202604120008",
    items: [
      { product: "Biomass Burner", size: "100kw", quantity: "1", unitPrice: "₹40,000", subtotal: "₹40,000", purpose: "Industrial Dryer" },
    ],
    deliveryAddress: { name: "Kavitha R", phone: "+91 99887 76655", address: "10 Anna Nagar", landmark: "", city: "Madurai", state: "Tamil Nadu", pincode: "625001", addressType: "Home", preferredDate: "2024-03-10", preferredTimeSlot: "2 PM - 6 PM", deliveryInstructions: "" },
    date: "12/4/2026", status: "Cancelled",
    customer: { name: "Kavitha R", phone: "+91 99887 76655", email: "kavitha@gmail.com" },
    trackingNumber: "", paymentMethod: "Pending", cancelReason: "Customer request - changed mind", refundStatus: "Initiated",
    subtotal: "₹40,000", gstAmount: "₹7,200", deliveryFee: "₹2,000", discount: "₹0", grandTotal: "₹49,200",
  },
  {
    id: "ES202604100005",
    items: [
      { product: "Biomass Stove", size: "10kg", quantity: "2", unitPrice: "₹8,000", subtotal: "₹16,000", purpose: "Commercial Kitchen" },
    ],
    deliveryAddress: { name: "Mohan Das", phone: "+91 88776 65544", address: "56 Factory Lane", landmark: "Behind Bus Stand", city: "Coimbatore", state: "Tamil Nadu", pincode: "641001", addressType: "Office", preferredDate: "2024-03-05", preferredTimeSlot: "10 AM - 2 PM", deliveryInstructions: "" },
    date: "10/4/2026", status: "Delivered",
    customer: { name: "Mohan Das", phone: "+91 88776 65544", email: "mohan@factory.com" },
    trackingNumber: "TRK-5556667778", paymentMethod: "Net Banking", cancelReason: "", refundStatus: "N/A",
    subtotal: "₹16,000", gstAmount: "₹2,880", deliveryFee: "₹800", discount: "₹500", grandTotal: "₹19,180",
  },
];

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [trackingInput, setTrackingInput] = useState("");
  const [paymentInput, setPaymentInput] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filtered = orders.filter(o => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === "All" || o.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const viewOrder = (o: Order) => {
    setSelectedOrder({ ...o });
    setTrackingInput(o.trackingNumber);
    setPaymentInput(o.paymentMethod);
    setCancelReason("");
    setDetailOpen(true);
  };

  const updateStatus = (newStatus: string) => {
    if (!selectedOrder) return;
    if (newStatus === "Cancelled" && !cancelReason.trim()) {
      toast.error("Cancellation reason is required");
      return;
    }
    const updates: Partial<Order> = { status: newStatus };
    if (newStatus === "Shipped" || newStatus === "Out for Delivery") {
      updates.trackingNumber = trackingInput;
    }
    if (newStatus === "Cancelled") {
      updates.cancelReason = cancelReason;
      updates.refundStatus = "Initiated";
    }
    if (newStatus === "Returned") {
      updates.refundStatus = "Initiated";
    }
    const updated = { ...selectedOrder, ...updates };
    setOrders(orders.map(o => o.id === selectedOrder.id ? updated : o));
    setSelectedOrder(updated);
    toast.success(`Order ${selectedOrder.id} status updated to ${newStatus}`);
    if (newStatus === "Delivered") {
      toast.success("Invoice auto-generated for this order");
    }
  };

  const refundBadge: Record<string, string> = {
    "N/A": "bg-muted text-muted-foreground",
    Initiated: "bg-yellow-50 text-status-processing",
    Processed: "bg-primary/10 text-primary",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Order Management</h1>
        <p className="text-muted-foreground">Current orders from mobile app</p>
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Summary — {selectedOrder?.id}</DialogTitle>
            <DialogDescription>Order and customer details from app.</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-2">
              {/* Order Items Table */}
              <h3 className="text-sm font-semibold text-card-foreground">Order Items</h3>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Product</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Size</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Qty</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Unit Price</th>
                      <th className="text-right px-3 py-2 text-xs font-semibold text-muted-foreground">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="px-3 py-2 font-medium text-card-foreground">{item.product}</td>
                        <td className="px-3 py-2 text-muted-foreground">{item.size}</td>
                        <td className="px-3 py-2 text-muted-foreground">{item.quantity}</td>
                        <td className="px-3 py-2 text-muted-foreground">{item.unitPrice}</td>
                        <td className="px-3 py-2 text-right font-medium text-card-foreground">{item.subtotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Price Breakdown */}
              <div className="bg-muted/30 rounded-lg p-3 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-card-foreground">{selectedOrder.subtotal}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span className="text-card-foreground">{selectedOrder.gstAmount}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery Fee</span><span className="text-card-foreground">{selectedOrder.deliveryFee}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="text-primary">-{selectedOrder.discount}</span></div>
                <div className="flex justify-between border-t pt-1.5"><span className="font-semibold text-card-foreground">Grand Total</span><span className="font-bold text-primary text-lg">{selectedOrder.grandTotal}</span></div>
              </div>

              {/* Customer & Delivery */}
              <div className="border-t pt-3">
                <h3 className="text-sm font-semibold text-card-foreground mb-2">Customer & Delivery</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Name:</span><p className="font-medium text-card-foreground">{selectedOrder.customer.name}</p></div>
                  <div><span className="text-muted-foreground">Phone:</span><p className="font-medium text-card-foreground">{selectedOrder.customer.phone}</p></div>
                  <div className="col-span-2"><span className="text-muted-foreground">Address:</span><p className="font-medium text-card-foreground">{selectedOrder.deliveryAddress.address}, {selectedOrder.deliveryAddress.landmark && `${selectedOrder.deliveryAddress.landmark}, `}{selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} - {selectedOrder.deliveryAddress.pincode}</p></div>
                  <div><span className="text-muted-foreground">Type:</span><p className="font-medium text-card-foreground">{selectedOrder.deliveryAddress.addressType}</p></div>
                  <div><span className="text-muted-foreground">Preferred:</span><p className="font-medium text-card-foreground">{selectedOrder.deliveryAddress.preferredDate} • {selectedOrder.deliveryAddress.preferredTimeSlot}</p></div>
                  {selectedOrder.deliveryAddress.deliveryInstructions && (
                    <div className="col-span-2"><span className="text-muted-foreground">Instructions:</span><p className="font-medium text-card-foreground">{selectedOrder.deliveryAddress.deliveryInstructions}</p></div>
                  )}
                </div>
              </div>

              {/* Shipment Section */}
              <div className="border-t pt-3">
                <h3 className="text-sm font-semibold text-card-foreground mb-2">Shipment</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Payment Method:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Select value={paymentInput} onValueChange={v => setPaymentInput(v)}>
                        <SelectTrigger className="h-8 text-sm w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {paymentInput !== selectedOrder.paymentMethod && (
                        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => {
                          const updated = { ...selectedOrder, paymentMethod: paymentInput };
                          setOrders(orders.map(o => o.id === selectedOrder.id ? updated : o));
                          setSelectedOrder(updated);
                          toast.success(`Payment method set to ${paymentInput}`);
                        }}>Save</Button>
                      )}
                    </div>
                    {selectedOrder.paymentMethod === "Pending" && (
                      <p className="text-xs text-amber-400 mt-1">⚠ Contact customer to confirm payment method</p>
                    )}
                  </div>
                  {(selectedOrder.status === "Shipped" || selectedOrder.status === "Out for Delivery") && (
                    <div>
                      <span className="text-muted-foreground">Tracking Number:</span>
                      <Input
                        value={trackingInput}
                        onChange={e => setTrackingInput(e.target.value)}
                        placeholder="Enter tracking number"
                        className="mt-1 h-8 text-sm"
                      />
                    </div>
                  )}
                  {(selectedOrder.status === "Cancelled" || selectedOrder.status === "Returned") && (
                    <div>
                      <span className="text-muted-foreground">Refund Status:</span>
                      <p><span className={`inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${refundBadge[selectedOrder.refundStatus]}`}>{selectedOrder.refundStatus}</span></p>
                    </div>
                  )}
                </div>
                {selectedOrder.cancelReason && (
                  <div className="mt-2 text-sm"><span className="text-muted-foreground">Cancel Reason:</span><p className="font-medium text-destructive">{selectedOrder.cancelReason}</p></div>
                )}
              </div>

              {/* Status Update */}
              <div className="border-t pt-3 space-y-2">
                <label className="text-sm font-medium text-card-foreground">Update Status</label>
                <Select value={selectedOrder.status} onValueChange={updateStatus}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statusFlow.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
                {/* Show cancel reason field when status might be changed to Cancelled */}
                {selectedOrder.status !== "Cancelled" && (
                  <div>
                    <label className="text-xs text-muted-foreground">Cancellation Reason (required if cancelling)</label>
                    <Textarea
                      value={cancelReason}
                      onChange={e => setCancelReason(e.target.value)}
                      placeholder="Enter reason for cancellation..."
                      className="mt-1 text-sm"
                      rows={2}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {["All", ...statusFlow].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${filterStatus === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            {s}
          </button>
        ))}
      </div>

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
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Items</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Payment</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-primary">{o.id}</td>
                  <td className="px-6 py-4 text-sm text-card-foreground">{o.customer.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{o.items.length} item(s) — {o.grandTotal}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{o.date}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{o.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[o.status] || "bg-muted text-muted-foreground"}`}>{o.status}</span>
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
