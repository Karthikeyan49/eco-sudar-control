import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const products = [
  { id: 1, name: "Biomass Briquettes", category: "Fuel", price: "₹15/kg", stock: 1200, status: "In Stock" },
  { id: 2, name: "Wood Pellets", category: "Fuel", price: "₹18/kg", stock: 800, status: "In Stock" },
  { id: 3, name: "Sawdust Blocks", category: "Raw Material", price: "₹8/kg", stock: 50, status: "Low Stock" },
  { id: 4, name: "Groundnut Shell Pellets", category: "Fuel", price: "₹12/kg", stock: 2000, status: "In Stock" },
  { id: 5, name: "Bagasse Briquettes", category: "Fuel", price: "₹14/kg", stock: 0, status: "Out of Stock" },
];

export default function Products() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Storefront</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-10" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Product</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Category</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Price</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Stock</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-sm text-card-foreground">{p.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{p.category}</td>
                  <td className="px-6 py-4 text-sm font-medium text-card-foreground">{p.price}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{p.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      p.status === "In Stock" ? "bg-primary/10 text-primary" :
                      p.status === "Low Stock" ? "bg-yellow-50 text-status-processing" :
                      "bg-destructive/10 text-destructive"
                    }`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 hover:bg-muted rounded-lg mr-1"><Edit className="h-4 w-4 text-muted-foreground" /></button>
                    <button className="p-1.5 hover:bg-destructive/10 rounded-lg"><Trash2 className="h-4 w-4 text-destructive" /></button>
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
