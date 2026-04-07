import { Search, Plus, Edit, Trash2, Key } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const initialDealers = [
  { name: "Ravi Kumar", company: "Green Energy Traders", phone: "+91 98765 43210", location: "Chennai", orders: 24, commission: "₹45,000", status: "Active" },
  { name: "Priya Sharma", company: "EcoFuel Distributors", phone: "+91 87654 32109", location: "Coimbatore", orders: 18, commission: "₹32,000", status: "Active" },
  { name: "Arun Patel", company: "BioPower Solutions", phone: "+91 76543 21098", location: "Madurai", orders: 31, commission: "₹58,000", status: "Active" },
  { name: "Meena Devi", company: "Rural Biomass Co", phone: "+91 65432 10987", location: "Salem", orders: 12, commission: "₹21,000", status: "Inactive" },
];

export default function Dealers() {
  const [dealers] = useState(initialDealers);
  const [newDealer, setNewDealer] = useState({ name: "", company: "", phone: "", location: "", password: "" });

  const handleCreate = () => {
    // In production: POST to /api/dealers/create with phone + password
    console.log("Create dealer credentials:", { phone: newDealer.phone, password: newDealer.password });
    setNewDealer({ name: "", company: "", phone: "", location: "", password: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dealer Network</h1>
          <p className="text-muted-foreground">Manage dealer partners — admin creates login credentials</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Dealer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Dealer Credentials</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <p className="text-xs text-muted-foreground">Dealer will login with their phone number and the password you set below.</p>
              <div>
                <label className="text-sm font-medium text-card-foreground">Dealer Name</label>
                <Input
                  value={newDealer.name}
                  onChange={(e) => setNewDealer({ ...newDealer, name: e.target.value })}
                  placeholder="Full name"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground">Company</label>
                <Input
                  value={newDealer.company}
                  onChange={(e) => setNewDealer({ ...newDealer, company: e.target.value })}
                  placeholder="Company name"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground">Phone Number (Login ID)</label>
                <Input
                  value={newDealer.phone}
                  onChange={(e) => setNewDealer({ ...newDealer, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground">Location</label>
                <Input
                  value={newDealer.location}
                  onChange={(e) => setNewDealer({ ...newDealer, location: e.target.value })}
                  placeholder="City, State"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground">Password</label>
                <Input
                  type="password"
                  value={newDealer.password}
                  onChange={(e) => setNewDealer({ ...newDealer, password: e.target.value })}
                  placeholder="Set login password for dealer"
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={handleCreate} className="gap-2">
                  <Key className="h-4 w-4" /> Create Credentials
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Phone (Login)</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Location</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Orders</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Commission</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dealers.map((d, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-card-foreground">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.company}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{d.phone}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{d.location}</td>
                  <td className="px-6 py-4 text-sm text-card-foreground font-medium">{d.orders}</td>
                  <td className="px-6 py-4 text-sm text-primary font-semibold">{d.commission}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${d.status === "Active" ? "bg-primary/10 text-primary" : "bg-muted text-status-pending"}`}>
                      {d.status}
                    </span>
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
