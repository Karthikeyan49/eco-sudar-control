import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const dealers = [
  { name: "Ravi Kumar", company: "Green Energy Traders", phone: "+91 98765 43210", location: "Chennai", orders: 24, commission: "₹45,000" },
  { name: "Priya Sharma", company: "EcoFuel Distributors", phone: "+91 87654 32109", location: "Coimbatore", orders: 18, commission: "₹32,000" },
  { name: "Arun Patel", company: "BioPower Solutions", phone: "+91 76543 21098", location: "Madurai", orders: 31, commission: "₹58,000" },
  { name: "Meena Devi", company: "Rural Biomass Co", phone: "+91 65432 10987", location: "Salem", orders: 12, commission: "₹21,000" },
];

export default function Dealers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dealer Network</h1>
        <p className="text-muted-foreground">Manage your dealer partners</p>
      </div>
      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search dealers..." className="pl-10" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Dealer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Location</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Total Orders</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Commission</th>
              </tr>
            </thead>
            <tbody>
              {dealers.map((d, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-card-foreground">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.company} • {d.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{d.location}</td>
                  <td className="px-6 py-4 text-sm text-card-foreground font-medium">{d.orders}</td>
                  <td className="px-6 py-4 text-sm text-primary font-semibold">{d.commission}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
