import { Search, AlertTriangle, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";

interface InventoryItem {
  id: number; name: string; type: string; current: number; capacity: number; unit: string; lastUpdated: string;
}

const initialInventory: InventoryItem[] = [
  { id: 1, name: "Sawdust", type: "Raw Material", current: 4500, capacity: 8000, unit: "kg", lastUpdated: "2024-03-15" },
  { id: 2, name: "Groundnut Shells", type: "Raw Material", current: 2200, capacity: 5000, unit: "kg", lastUpdated: "2024-03-14" },
  { id: 3, name: "Sugarcane Bagasse", type: "Raw Material", current: 6800, capacity: 10000, unit: "kg", lastUpdated: "2024-03-15" },
  { id: 4, name: "Biomass Briquettes", type: "Finished Product", current: 1850, capacity: 3000, unit: "kg", lastUpdated: "2024-03-15" },
  { id: 5, name: "Wood Pellets", type: "Finished Product", current: 800, capacity: 2000, unit: "kg", lastUpdated: "2024-03-13" },
  { id: 6, name: "Groundnut Shell Pellets", type: "Finished Product", current: 2000, capacity: 4000, unit: "kg", lastUpdated: "2024-03-15" },
];

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [search, setSearch] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<InventoryItem | null>(null);

  const filtered = inventory.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.type.toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = inventory.filter(i => (i.current / i.capacity) * 100 < 50);

  const openEdit = (item: InventoryItem) => { setForm({ ...item }); setEditOpen(true); };

  const handleUpdate = () => {
    if (!form) return;
    const today = new Date().toISOString().split("T")[0];
    setInventory(inventory.map(i => i.id === form.id ? { ...form, lastUpdated: today } : i));
    setEditOpen(false);
    toast.success(`"${form.name}" inventory updated`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
        <p className="text-muted-foreground">Track raw materials and finished products</p>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-status-processing shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-card-foreground">Low Stock Alert</p>
            <p className="text-xs text-muted-foreground">{lowStock.map(i => i.name).join(", ")} — below 50% capacity</p>
          </div>
        </div>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Inventory — {form?.name}</DialogTitle>
            <DialogDescription>Adjust quantity and capacity for this item.</DialogDescription>
          </DialogHeader>
          {form && (
            <div className="space-y-4 py-2">
              <div>
                <label className="text-sm font-medium text-card-foreground">Current Quantity ({form.unit})</label>
                <Input type="number" value={form.current} onChange={e => setForm({ ...form, current: Number(e.target.value) })} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground">Max Capacity ({form.unit})</label>
                <Input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: Number(e.target.value) })} className="mt-1" />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search inventory..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Material</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Type</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Quantity</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Capacity</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Last Updated</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const pct = (item.current / item.capacity) * 100;
                const status = pct < 30 ? "Critical" : pct < 50 ? "Low" : pct < 80 ? "Normal" : "Full";
                const statusClass = pct < 30 ? "bg-destructive/10 text-destructive" : pct < 50 ? "bg-yellow-50 text-status-processing" : "bg-primary/10 text-primary";
                return (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-card-foreground">{item.name}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${item.type === "Raw Material" ? "bg-secondary text-secondary-foreground" : "bg-primary/10 text-primary"}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-card-foreground font-medium">{item.current.toLocaleString()} {item.unit}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct < 50 ? "bg-status-processing" : "bg-primary"}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{item.capacity.toLocaleString()} {item.unit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusClass}`}>{status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.lastUpdated}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-muted rounded-lg"><Edit className="h-4 w-4 text-muted-foreground" /></button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">No inventory items found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
