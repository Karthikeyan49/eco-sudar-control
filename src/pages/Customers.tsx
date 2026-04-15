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

interface SavedAddress {
  type: "Home" | "Office" | "Other";
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface Customer {
  name: string;
  phone: string;
  email: string;
  orders: number;
  lastOrder: string;
  savedAddresses: SavedAddress[];
  totalSpent: string;
  cancelledOrders: number;
  accountCreatedDate: string;
  activeOrders: number;
  deliveredOrders: number;
}

const customers: Customer[] = [
  {
    name: "Rajesh Kumar", phone: "+91 98765 43210", email: "rajesh@greenindustries.com", orders: 12, lastOrder: "2024-03-15",
    savedAddresses: [
      { type: "Office", address: "12 Industrial Estate, Anna Salai", city: "Chennai", state: "Tamil Nadu", pincode: "600001", isDefault: true },
      { type: "Home", address: "45 2nd Cross Street, Adyar", city: "Chennai", state: "Tamil Nadu", pincode: "600020", isDefault: false },
    ],
    totalSpent: "₹1,85,000", cancelledOrders: 1, accountCreatedDate: "2023-06-15", activeOrders: 2, deliveredOrders: 9,
  },
  {
    name: "Priya Sharma", phone: "+91 87654 32109", email: "priya@ecoheat.in", orders: 8, lastOrder: "2024-03-14",
    savedAddresses: [
      { type: "Office", address: "45 Green Park Colony", city: "Bangalore", state: "Karnataka", pincode: "560001", isDefault: true },
    ],
    totalSpent: "₹92,000", cancelledOrders: 0, accountCreatedDate: "2023-09-20", activeOrders: 1, deliveredOrders: 7,
  },
  {
    name: "Anand Patel", phone: "+91 76543 21098", email: "anand@biomasstrading.com", orders: 15, lastOrder: "2024-03-13",
    savedAddresses: [
      { type: "Office", address: "78 GIDC Industrial Area", city: "Ahmedabad", state: "Gujarat", pincode: "380001", isDefault: true },
      { type: "Home", address: "12 Satellite Road", city: "Ahmedabad", state: "Gujarat", pincode: "380015", isDefault: false },
    ],
    totalSpent: "₹3,20,000", cancelledOrders: 2, accountCreatedDate: "2023-04-10", activeOrders: 3, deliveredOrders: 10,
  },
  {
    name: "Meena Devi", phone: "+91 65432 10987", email: "meena@ruralenergy.in", orders: 5, lastOrder: "2024-03-12",
    savedAddresses: [
      { type: "Home", address: "Village Rampur", city: "Jaipur", state: "Rajasthan", pincode: "302001", isDefault: true },
    ],
    totalSpent: "₹45,000", cancelledOrders: 0, accountCreatedDate: "2024-01-05", activeOrders: 1, deliveredOrders: 4,
  },
  {
    name: "Suresh Babu", phone: "+91 54321 09876", email: "suresh@biofuelcorp.com", orders: 22, lastOrder: "2024-03-11",
    savedAddresses: [
      { type: "Office", address: "22 Tech Park Road", city: "Hyderabad", state: "Telangana", pincode: "500001", isDefault: true },
      { type: "Home", address: "5 Jubilee Hills", city: "Hyderabad", state: "Telangana", pincode: "500033", isDefault: false },
      { type: "Other", address: "Warehouse 8, Outer Ring Road", city: "Hyderabad", state: "Telangana", pincode: "500082", isDefault: false },
    ],
    totalSpent: "₹5,50,000", cancelledOrders: 3, accountCreatedDate: "2023-02-28", activeOrders: 2, deliveredOrders: 17,
  },
];

const addressTypeIcon = { Home: Home, Office: Briefcase, Other: MapPin };

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
        <p className="text-muted-foreground">Users registered via mobile app</p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>App-registered customer information.</DialogDescription>
          </DialogHeader>
          {selected && (
            <Tabs defaultValue="profile" className="mt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="stats">Order Stats</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-3 py-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Name:</span><p className="font-medium text-card-foreground">{selected.name}</p></div>
                  <div><span className="text-muted-foreground">Phone:</span><p className="font-medium text-card-foreground">{selected.phone}</p></div>
                  <div><span className="text-muted-foreground">Email:</span><p className="font-medium text-card-foreground">{selected.email}</p></div>
                  <div><span className="text-muted-foreground">Account Created:</span><p className="font-medium text-card-foreground">{selected.accountCreatedDate}</p></div>
                  <div><span className="text-muted-foreground">User Type:</span><p className="font-medium text-card-foreground">Customer</p></div>
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

              <TabsContent value="addresses" className="space-y-3 py-2">
                {selected.savedAddresses.map((addr, i) => {
                  const Icon = addressTypeIcon[addr.type];
                  return (
                    <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="p-2 bg-secondary rounded-lg"><Icon className="h-4 w-4 text-primary" /></div>
                      <div className="flex-1 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-card-foreground">{addr.type}</span>
                          {addr.isDefault && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Default</span>}
                        </div>
                        <p className="text-muted-foreground mt-0.5">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                      </div>
                    </div>
                  );
                })}
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
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Phone</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Email</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Orders</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Total Spent</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Last Order</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-card-foreground">{c.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{c.phone}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{c.email}</td>
                  <td className="px-6 py-4 text-sm font-medium text-card-foreground">{c.orders}</td>
                  <td className="px-6 py-4 text-sm font-medium text-primary">{c.totalSpent}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{c.lastOrder}</td>
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
