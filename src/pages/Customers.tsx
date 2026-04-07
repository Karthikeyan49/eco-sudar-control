import { Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";

interface Customer {
  name: string; phone: string; email: string; orders: number; lastOrder: string;
}

const customers: Customer[] = [
  { name: "Rajesh Kumar", phone: "+91 98765 43210", email: "rajesh@greenindustries.com", orders: 12, lastOrder: "2024-03-15" },
  { name: "Priya Sharma", phone: "+91 87654 32109", email: "priya@ecoheat.in", orders: 8, lastOrder: "2024-03-14" },
  { name: "Anand Patel", phone: "+91 76543 21098", email: "anand@biomasstrading.com", orders: 15, lastOrder: "2024-03-13" },
  { name: "Meena Devi", phone: "+91 65432 10987", email: "meena@ruralenergy.in", orders: 5, lastOrder: "2024-03-12" },
  { name: "Suresh Babu", phone: "+91 54321 09876", email: "suresh@biofuelcorp.com", orders: 22, lastOrder: "2024-03-11" },
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        <p className="text-muted-foreground">Users registered via mobile app</p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>App-registered customer information.</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 py-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">Name:</span><p className="font-medium text-card-foreground">{selected.name}</p></div>
                <div><span className="text-muted-foreground">Phone:</span><p className="font-medium text-card-foreground">{selected.phone}</p></div>
                <div><span className="text-muted-foreground">Email:</span><p className="font-medium text-card-foreground">{selected.email}</p></div>
                <div><span className="text-muted-foreground">Total Orders:</span><p className="font-semibold text-primary">{selected.orders}</p></div>
                <div><span className="text-muted-foreground">Last Order:</span><p className="font-medium text-card-foreground">{selected.lastOrder}</p></div>
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
                  <td className="px-6 py-4 text-sm text-muted-foreground">{c.lastOrder}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => view(c)} className="p-1.5 hover:bg-muted rounded-lg"><Eye className="h-4 w-4 text-muted-foreground" /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No customers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}