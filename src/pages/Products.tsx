import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: string;
  description: string;
  deliveryFee: string;
}

const initialProducts: Product[] = [
  { id: 1, name: "Biomass Briquettes", category: "Fuel", price: "₹15/kg", stock: 1200, status: "In Stock", description: "High-quality biomass briquettes", deliveryFee: "₹500" },
  { id: 2, name: "Wood Pellets", category: "Fuel", price: "₹18/kg", stock: 800, status: "In Stock", description: "Premium wood pellets", deliveryFee: "₹600" },
  { id: 3, name: "Sawdust Blocks", category: "Raw Material", price: "₹8/kg", stock: 50, status: "Low Stock", description: "Compressed sawdust blocks", deliveryFee: "₹300" },
  { id: 4, name: "Groundnut Shell Pellets", category: "Fuel", price: "₹12/kg", stock: 2000, status: "In Stock", description: "Groundnut shell fuel pellets", deliveryFee: "₹450" },
  { id: 5, name: "Bagasse Briquettes", category: "Fuel", price: "₹14/kg", stock: 0, status: "Out of Stock", description: "Sugarcane bagasse briquettes", deliveryFee: "₹500" },
];

const emptyProduct = { id: 0, name: "", category: "Fuel", price: "", stock: 0, status: "In Stock", description: "", deliveryFee: "" };

export default function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<Product>({ ...emptyProduct });

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.name || !form.price) { toast.error("Name and price are required"); return; }
    const newProduct = { ...form, id: Date.now(), status: form.stock > 100 ? "In Stock" : form.stock > 0 ? "Low Stock" : "Out of Stock" };
    setProducts([...products, newProduct]);
    setForm({ ...emptyProduct });
    setAddOpen(false);
    toast.success(`Product "${newProduct.name}" added`);
  };

  const handleEdit = () => {
    if (!form.name || !form.price) { toast.error("Name and price are required"); return; }
    const updated = { ...form, status: form.stock > 100 ? "In Stock" : form.stock > 0 ? "Low Stock" : "Out of Stock" };
    setProducts(products.map(p => p.id === form.id ? updated : p));
    setEditOpen(false);
    toast.success(`Product "${form.name}" updated`);
  };

  const handleDelete = (p: Product) => {
    setProducts(products.filter(x => x.id !== p.id));
    toast.success(`Product "${p.name}" deleted`);
  };

  const openEdit = (p: Product) => {
    setForm({ ...p });
    setEditOpen(true);
  };

  const ProductForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4 py-2">
      <div>
        <label className="text-sm font-medium text-card-foreground">Product Name *</label>
        <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Biomass Briquettes" className="mt-1" />
      </div>
      <div>
        <label className="text-sm font-medium text-card-foreground">Description</label>
        <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Product description" className="mt-1" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-card-foreground">Category</label>
          <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Fuel">Fuel</SelectItem>
              <SelectItem value="Raw Material">Raw Material</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-card-foreground">Price *</label>
          <Input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="₹15/kg" className="mt-1" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-card-foreground">Stock (kg)</label>
          <Input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-card-foreground">Delivery Fee</label>
          <Input value={form.deliveryFee} onChange={e => setForm({ ...form, deliveryFee: e.target.value })} placeholder="₹500" className="mt-1" />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
        <Button onClick={onSubmit}>{submitLabel}</Button>
      </DialogFooter>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Storefront</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Dialog open={addOpen} onOpenChange={v => { setAddOpen(v); if (v) setForm({ ...emptyProduct }); }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Fill in the product details below.</DialogDescription>
            </DialogHeader>
            <ProductForm onSubmit={handleAdd} submitLabel="Add Product" />
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the product details below.</DialogDescription>
          </DialogHeader>
          <ProductForm onSubmit={handleEdit} submitLabel="Save Changes" />
        </DialogContent>
      </Dialog>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
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
              {filtered.map((p) => (
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
                    <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-muted rounded-lg mr-1"><Edit className="h-4 w-4 text-muted-foreground" /></button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-1.5 hover:bg-destructive/10 rounded-lg"><Trash2 className="h-4 w-4 text-destructive" /></button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete "{p.name}"?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(p)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
