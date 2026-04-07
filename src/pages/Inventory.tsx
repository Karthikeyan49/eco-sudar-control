import { Search, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";

const inventory = [
  { name: "Sawdust", type: "Raw Material", current: 4500, capacity: 8000, unit: "kg", lastUpdated: "2024-03-15" },
  { name: "Groundnut Shells", type: "Raw Material", current: 2200, capacity: 5000, unit: "kg", lastUpdated: "2024-03-14" },
  { name: "Sugarcane Bagasse", type: "Raw Material", current: 6800, capacity: 10000, unit: "kg", lastUpdated: "2024-03-15" },
  { name: "Biomass Briquettes", type: "Finished Product", current: 1850, capacity: 3000, unit: "kg", lastUpdated: "2024-03-15" },
  { name: "Wood Pellets", type: "Finished Product", current: 800, capacity: 2000, unit: "kg", lastUpdated: "2024-03-13" },
  { name: "Groundnut Shell Pellets", type: "Finished Product", current: 2000, capacity: 4000, unit: "kg", lastUpdated: "2024-03-15" },
];

export default function Inventory() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
        <p className="text-muted-foreground">Track raw materials and finished products</p>
      </div>

      {/* Low Stock Alerts */}
      {inventory.filter(i => (i.current / i.capacity) * 100 < 50).length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-status-processing shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-card-foreground">Low Stock Alert</p>
            <p className="text-xs text-muted-foreground">
              {inventory.filter(i => (i.current / i.capacity) * 100 < 50).map(i => i.name).join(", ")} — below 50% capacity
            </p>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search inventory..." className="pl-10" />
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
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, i) => {
                const pct = (item.current / item.capacity) * 100;
                const status = pct < 30 ? "Critical" : pct < 50 ? "Low" : pct < 80 ? "Normal" : "Full";
                const statusClass = pct < 30 ? "bg-destructive/10 text-destructive" : pct < 50 ? "bg-yellow-50 text-status-processing" : "bg-primary/10 text-primary";
                return (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
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
                          <div
                            className={`h-full rounded-full ${pct < 50 ? "bg-status-processing" : "bg-primary"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{item.capacity.toLocaleString()} {item.unit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusClass}`}>{status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.lastUpdated}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
