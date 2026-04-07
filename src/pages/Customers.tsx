import { Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";

const customers = [
  { name: "Green Industries Ltd", phone: "+91 98765 43210", email: "info@greenindustries.com", company: "Green Industries Ltd", address: "Chennai, Tamil Nadu", gst: "33AABCG1234F1Z5", orders: 12 },
  { name: "EcoHeat Solutions", phone: "+91 87654 32109", email: "contact@ecoheat.in", company: "EcoHeat Solutions Pvt Ltd", address: "Coimbatore, Tamil Nadu", gst: "33AABCE5678H1Z3", orders: 8 },
  { name: "Biomass Trading Co", phone: "+91 76543 21098", email: "sales@biomasstrading.com", company: "Biomass Trading Co", address: "Madurai, Tamil Nadu", gst: "33AABCB9012K1Z1", orders: 15 },
  { name: "Rural Energy Hub", phone: "+91 65432 10987", email: "admin@ruralenergy.in", company: "Rural Energy Hub LLP", address: "Salem, Tamil Nadu", gst: "33AABCR3456L1Z9", orders: 5 },
  { name: "BioFuel Corp", phone: "+91 54321 09876", email: "order@biofuelcorp.com", company: "BioFuel Corporation", address: "Trichy, Tamil Nadu", gst: "33AABCB7890M1Z7", orders: 22 },
];

export default function Customers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Customer Management</h1>
        <p className="text-muted-foreground">View and manage customer details</p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search customers..." className="pl-10" />
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
              {customers.map((c, i) => (
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
                    <button className="p-1.5 hover:bg-muted rounded-lg"><Eye className="h-4 w-4 text-muted-foreground" /></button>
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
