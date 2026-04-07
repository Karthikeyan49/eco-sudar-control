import { Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";

interface Customer {
  name: string; phone: string; email: string; company: string; address: string; gst: string; orders: number;
}

const customers: Customer[] = [
  { name: "Green Industries Ltd", phone: "+91 98765 43210", email: "info@greenindustries.com", company: "Green Industries Ltd", address: "Chennai, Tamil Nadu", gst: "33AABCG1234F1Z5", orders: 12 },
  { name: "EcoHeat Solutions", phone: "+91 87654 32109", email: "contact@ecoheat.in", company: "EcoHeat Solutions Pvt Ltd", address: "Coimbatore, Tamil Nadu", gst: "33AABCE5678H1Z3", orders: 8 },
  { name: "Biomass Trading Co", phone: "+91 76543 21098", email: "sales@biomasstrading.com", company: "Biomass Trading Co", address: "Madurai, Tamil Nadu", gst: "33AABCB9012K1Z1", orders: 15 },
  { name: "Rural Energy Hub", phone: "+91 65432 10987", email: "admin@ruralenergy.in", company: "Rural Energy Hub LLP", address: "Salem, Tamil Nadu", gst: "33AABCR3456L1Z9", orders: 5 },
  { name: "BioFuel Corp", phone: "+91 54321 09876", email: "order@biofuelcorp.com", company: "BioFuel Corporation", address: "Trichy, Tamil Nadu", gst: "33AABCB7890M1Z7", orders: 22 },
];

export default function Customers() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase()) ||
    c.gst.toLowerCase().includes(search.toLowerCase())
  );

  const view = (c: Customer) => { setSelected(c); setOpen(true); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Customer Management</h1>
        <p className="text-muted-foreground">View and manage customer details</p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>Full customer information and order summary.</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 py-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground">Name:</span><p className="font-medium text-card-foreground">{selected.name}</p></div>
                <div><span className="text-muted-foreground">Phone:</span><p className="font-medium text-card-foreground">{selected.phone}</p></div>
                <div><span className="text-muted-foreground">Email:</span><p className="font-medium text-card-foreground">{selected.email}</p></div>
                <div><span className="text-muted-foreground">Company:</span><p className="font-medium text-card-foreground">{selected.company}</p></div>
                <div><span className="text-muted-foreground">Address:</span><p className="font-medium text-card-foreground">{selected.address}</p></div>
                <div><span className="text-muted-foreground">GSTIN:</span><p className="font-medium text-card-foreground font-mono text-xs">{selected.gst}</p></div>
              </div>
              <div className="border-t pt-3">
                <span className="text-muted-foreground">Total Orders:</span>
                <p className="font-semibold text-lg text-primary">{selected.orders}</p>
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
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Company</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Location</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">GST</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Orders</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-card-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.phone} • {c.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{c.company}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{c.address}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground font-mono text-xs">{c.gst}</td>
                  <td className="px-6 py-4 text-sm font-medium text-card-foreground">{c.orders}</td>
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
