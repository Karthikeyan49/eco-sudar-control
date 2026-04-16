import { Search, Eye, Home, Briefcase, MapPin, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Customer {
  name: string;
  phone: string;
  email: string;
  userType: "Customer" | "Dealer";
  deliveryAddress: string;
  city: string;
  pincode: string;
  orders: number;
  lastOrder: string;
  totalSpent: string;
  cancelledOrders: number;
  accountCreatedDate: string;
  activeOrders: number;
  deliveredOrders: number;
}

const customers: Customer[] = [
  {
    name: "Rajesh Kumar", phone: "9876543210", email: "rajesh@greenindustries.com",
    userType: "Customer", deliveryAddress: "12 Industrial Estate, Anna Salai", city: "Chennai", pincode: "600001",
    orders: 12, lastOrder: "15/4/2026", totalSpent: "₹1,85,000", cancelledOrders: 1,
    accountCreatedDate: "15/6/2023", activeOrders: 2, deliveredOrders: 9,
  },
  {
    name: "Priya Sharma", phone: "8765432109", email: "priya@ecoheat.in",
    userType: "Customer", deliveryAddress: "45 Green Park Colony", city: "Bangalore", pincode: "560001",
    orders: 8, lastOrder: "14/4/2026", totalSpent: "₹92,000", cancelledOrders: 0,
    accountCreatedDate: "20/9/2023", activeOrders: 1, deliveredOrders: 7,
  },
  {
    name: "Anand Patel", phone: "7654321098", email: "anand@biomasstrading.com",
    userType: "Customer", deliveryAddress: "78 GIDC Industrial Area", city: "Ahmedabad", pincode: "380001",
    orders: 15, lastOrder: "13/4/2026", totalSpent: "₹3,20,000", cancelledOrders: 2,
    accountCreatedDate: "10/4/2023", activeOrders: 3, deliveredOrders: 10,
  },
  {
    name: "naresh", phone: "8610623077", email: "rnaresh31122002@gmail.com",
    userType: "Customer", deliveryAddress: "—", city: "—", pincode: "—",
    orders: 3, lastOrder: "15/4/2026", totalSpent: "₹492.50", cancelledOrders: 0,
    accountCreatedDate: "15/4/2026", activeOrders: 3, deliveredOrders: 0,
  },
  {
    name: "Meena Devi", phone: "6543210987", email: "meena@ruralenergy.in",
    userType: "Customer", deliveryAddress: "Village Rampur", city: "Jaipur", pincode: "302001",
    orders: 5, lastOrder: "12/4/2026", totalSpent: "₹45,000", cancelledOrders: 0,
    accountCreatedDate: "5/1/2024", activeOrders: 1, deliveredOrders: 4,
  },
];

export default function Customers() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const view = (c: Customer) => { setSelected(c); setOpen(true); };

  const handleResetPassword = () => {
    if (selected) {
      toast.success(`Password reset email sent to ${selected.email}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        <p className="text-muted-foreground">Users registered as "Customer" in the mobile app</p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>Profile filled by user in the mobile app</DialogDescription>
          </DialogHeader>
          {selected && (
            <Tabs defaultValue="profile" className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="stats">Order Stats</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-3 py-2">
                <div className="bg-muted/30 rounded-lg p-4 space-y-2.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">User Type</span>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">Customer</Badge>
                  </div>
                  <div className="border-t border-border" />
                  <div className="flex justify-between"><span className="text-muted-foreground">Full Name</span><span className="text-card-foreground font-medium">{selected.name}</span></div>
                  <div className="border-t border-border" />
                  <div className="flex justify-between"><span className="text-muted-foreground">Email Address</span><span className="text-card-foreground">{selected.email}</span></div>
                  <div className="border-t border-border" />
                  <div className="flex justify-between"><span className="text-muted-foreground">Phone Number</span><span className="text-card-foreground">{selected.phone}</span></div>
                  <div className="border-t border-border" />
                  <div className="flex justify-between"><span className="text-muted-foreground">Delivery Address</span><span className="text-card-foreground text-right max-w-[200px]">{selected.deliveryAddress}</span></div>
                  <div className="border-t border-border" />
                  <div className="flex justify-between"><span className="text-muted-foreground">City</span><span className="text-card-foreground">{selected.city}</span></div>
                  <div className="border-t border-border" />
                  <div className="flex justify-between"><span className="text-muted-foreground">Pincode</span><span className="text-card-foreground">{selected.pincode}</span></div>
                  <div className="border-t border-border" />
                  <div className="flex justify-between"><span className="text-muted-foreground">Account Created</span><span className="text-card-foreground">{selected.accountCreatedDate}</span></div>
                </div>
                <div className="pt-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2"><KeyRound className="h-4 w-4" /> Reset Password</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset Password?</AlertDialogTitle>
                        <AlertDialogDescription>A password reset email will be sent to {selected.email}.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetPassword}>Send Reset Email</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TabsContent>

              <TabsContent value="stats" className="py-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-2xl font-bold text-card-foreground">{selected.orders}</p>
                    <p className="text-xs text-muted-foreground">Total Orders</p>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">{selected.totalSpent}</p>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-2xl font-bold text-status-shipped">{selected.activeOrders}</p>
                    <p className="text-xs text-muted-foreground">Active Orders</p>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">{selected.deliveredOrders}</p>
                    <p className="text-xs text-muted-foreground">Delivered</p>
                  </div>
                  <div className="col-span-2 p-3 border rounded-lg text-center">
                    <p className="text-2xl font-bold text-destructive">{selected.cancelledOrders}</p>
                    <p className="text-xs text-muted-foreground">Cancelled Orders</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter><DialogClose asChild><Button variant="outline">Close</Button></DialogClose></DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search customers..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Full Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Phone</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Email</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">City</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Orders</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Total Spent</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-card-foreground">{c.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{c.phone}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{c.email}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{c.city}</td>
                  <td className="px-6 py-4 text-sm font-medium text-card-foreground">{c.orders}</td>
                  <td className="px-6 py-4 text-sm font-medium text-primary">{c.totalSpent}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => view(c)} className="p-1.5 hover:bg-muted rounded-lg"><Eye className="h-4 w-4 text-muted-foreground" /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">No customers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
