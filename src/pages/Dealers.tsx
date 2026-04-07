import { Search, Plus, Edit, Trash2, Key } from "lucide-react";
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

interface Dealer {
  id: number; name: string; company: string; phone: string; location: string; orders: number; commission: string; status: string;
}

const initialDealers: Dealer[] = [
  { id: 1, name: "Ravi Kumar", company: "Green Energy Traders", phone: "+91 98765 43210", location: "Chennai", orders: 24, commission: "₹45,000", status: "Active" },
  { id: 2, name: "Priya Sharma", company: "EcoFuel Distributors", phone: "+91 87654 32109", location: "Coimbatore", orders: 18, commission: "₹32,000", status: "Active" },
  { id: 3, name: "Arun Patel", company: "BioPower Solutions", phone: "+91 76543 21098", location: "Madurai", orders: 31, commission: "₹58,000", status: "Active" },
  { id: 4, name: "Meena Devi", company: "Rural Biomass Co", phone: "+91 65432 10987", location: "Salem", orders: 12, commission: "₹21,000", status: "Inactive" },
];

const emptyDealer = { id: 0, name: "", company: "", phone: "", location: "", orders: 0, commission: "₹0", status: "Active" };

export default function Dealers() {
  const [dealers, setDealers] = useState<Dealer[]>(initialDealers);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyDealer, password: "" });

  const filtered = dealers.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.company.toLowerCase().includes(search.toLowerCase()) ||
    d.phone.includes(search)
  );

  const handleAdd = () => {
    if (!form.name || !form.phone || !form.password) { toast.error("Name, phone & password are required"); return; }
    const newDealer: Dealer = { ...form, id: Date.now() };
    setDealers([...dealers, newDealer]);
    setForm({ ...emptyDealer, password: "" });
    setAddOpen(false);
    toast.success(`Dealer "${form.name}" created with phone login`);
  };

  const handleEdit = () => {
    if (!form.name || !form.phone) { toast.error("Name and phone are required"); return; }
    setDealers(dealers.map(d => d.id === form.id ? { ...d, name: form.name, company: form.company, phone: form.phone, location: form.location } : d));
    setEditOpen(false);
    toast.success(`Dealer "${form.name}" updated`);
  };

  const handleDelete = (d: Dealer) => {
    setDealers(dealers.filter(x => x.id !== d.id));
    toast.success(`Dealer "${d.name}" deleted`);
  };

  const openEdit = (d: Dealer) => { setForm({ ...d, password: "" }); setEditOpen(true); };

  const renderForm = (onSubmit: () => void, submitLabel: string, showPassword: boolean) => (
    <div className="space-y-4 py-2">
      {showPassword && <p className="text-xs text-muted-foreground">Dealer will login with their phone number and the password you set below.</p>}
      <div>
        <label className="text-sm font-medium text-card-foreground">Dealer Name *</label>
        <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Full name" className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium text-card-foreground">Company</label>
        <Input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Company name" className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium text-card-foreground">Phone Number (Login ID) *</label>
        <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium text-card-foreground">Location</label>
        <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="City, State" className="mt-1" />
      </div>
      {showPassword && (
        <div>
          <label className="text-sm font-medium text-card-foreground">Password *</label>
          <Input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Set login password" className="mt-1" />
        </div>
      )}
      <DialogFooter>
        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
        <Button onClick={onSubmit} className="gap-2">
          {showPassword && <Key className="h-4 w-4" />} {submitLabel}
        </Button>
      </DialogFooter>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dealer Network</h1>
          <p className="text-muted-foreground">Manage dealer partners — admin creates login credentials</p>
        </div>
        <Dialog open={addOpen} onOpenChange={v => { setAddOpen(v); if (v) setForm({ ...emptyDealer, password: "" }); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Dealer Credentials</DialogTitle>
              <DialogDescription>Set up a new dealer with phone number login.</DialogDescription>
            </DialogHeader>
            {renderForm(handleAdd, "Create Credentials", true)}
          </DialogContent>
        </Dialog>
        <Button onClick={() => setAddOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Add Dealer</Button>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Dealer</DialogTitle>
            <DialogDescription>Update dealer information.</DialogDescription>
          </DialogHeader>
          {renderForm(handleEdit, "Save Changes", false)}
        </DialogContent>
      </Dialog>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search dealers..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
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
              {filtered.map((d) => (
                <tr key={d.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
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
                    <button onClick={() => openEdit(d)} className="p-1.5 hover:bg-muted rounded-lg mr-1"><Edit className="h-4 w-4 text-muted-foreground" /></button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-1.5 hover:bg-destructive/10 rounded-lg"><Trash2 className="h-4 w-4 text-destructive" /></button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete dealer "{d.name}"?</AlertDialogTitle>
                          <AlertDialogDescription>This will remove their login credentials and all data.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(d)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">No dealers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
