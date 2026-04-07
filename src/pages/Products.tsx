import { Plus, Search, Edit, Trash2, X } from "lucide-react";
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

interface SizePrice {
  size: string;
  price: string;
}

interface Product {
  id: number;
  product: string;
  sizes: SizePrice[];
  purposes: string[];
  deliveryFee: string;
  stock: number;
  status: string;
}

const productTypes = ["Pellets", "Biomass Stove", "Biomass Burner"];

const initialProducts: Product[] = [
  { id: 1, product: "Pellets", sizes: [{ size: "6mm", price: "₹8.50/kg" }, { size: "8mm", price: "₹9/kg" }, { size: "10mm", price: "₹10/kg" }], purposes: ["Commercial Kitchen", "Boiler", "Hotel", "Industrial Dryer"], deliveryFee: "₹150", stock: 1200, status: "In Stock" },
  { id: 2, product: "Biomass Stove", sizes: [{ size: "Small", price: "₹3,500" }, { size: "Medium", price: "₹5,000" }, { size: "Large", price: "₹7,500" }], purposes: ["Domestic Cooking", "Commercial Cooking"], deliveryFee: "₹800", stock: 45, status: "In Stock" },
  { id: 3, product: "Biomass Burner", sizes: [{ size: "50kW", price: "₹25,000" }, { size: "100kW", price: "₹40,000" }, { size: "200kW", price: "₹60,000" }], purposes: ["Industrial Heating", "Steam Generation", "Drying"], deliveryFee: "₹2,000", stock: 12, status: "Low Stock" },
];

interface FormState {
  id: number;
  product: string;
  sizes: SizePrice[];
  purposes: string[];
  newPurpose: string;
  deliveryFee: string;
}

const emptyForm: FormState = { id: 0, product: "Pellets", sizes: [{ size: "", price: "" }], purposes: [], newPurpose: "", deliveryFee: "", stock: 0 };

export default function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<FormState>({ ...emptyForm });

  const filtered = products.filter(p =>
    p.product.toLowerCase().includes(search.toLowerCase())
  );

  const getStatus = (stock: number) => stock > 20 ? "In Stock" : stock > 0 ? "Low Stock" : "Out of Stock";

  const handleAdd = () => {
    const validSizes = form.sizes.filter(s => s.size && s.price);
    if (!form.product || validSizes.length === 0) { toast.error("Product and at least one size with price required"); return; }
    const newProduct: Product = { id: Date.now(), product: form.product, sizes: validSizes, purposes: form.purposes, deliveryFee: form.deliveryFee, stock: form.stock, status: getStatus(form.stock) };
    setProducts([...products, newProduct]);
    setForm({ ...emptyForm });
    setAddOpen(false);
    toast.success(`Product "${newProduct.product}" added`);
  };

  const handleEdit = () => {
    const validSizes = form.sizes.filter(s => s.size && s.price);
    if (!form.product || validSizes.length === 0) { toast.error("Product and at least one size with price required"); return; }
    const updated: Product = { id: form.id, product: form.product, sizes: validSizes, purposes: form.purposes, deliveryFee: form.deliveryFee, stock: form.stock, status: getStatus(form.stock) };
    setProducts(products.map(p => p.id === form.id ? updated : p));
    setEditOpen(false);
    toast.success(`Product "${form.product}" updated`);
  };

  const handleDelete = (p: Product) => {
    setProducts(products.filter(x => x.id !== p.id));
    toast.success(`Product "${p.product}" deleted`);
  };

  const openEdit = (p: Product) => {
    setForm({ id: p.id, product: p.product, sizes: [...p.sizes], purposes: [...p.purposes], newPurpose: "", deliveryFee: p.deliveryFee, stock: p.stock });
    setEditOpen(true);
  };

  const updateSize = (index: number, field: keyof SizePrice, value: string) => {
    setForm(f => {
      const sizes = [...f.sizes];
      sizes[index] = { ...sizes[index], [field]: value };
      return { ...f, sizes };
    });
  };

  const addSizeRow = () => setForm(f => ({ ...f, sizes: [...f.sizes, { size: "", price: "" }] }));
  const removeSizeRow = (index: number) => setForm(f => ({ ...f, sizes: f.sizes.filter((_, i) => i !== index) }));

  const addPurpose = () => {
    if (!form.newPurpose.trim()) return;
    setForm(f => ({ ...f, purposes: [...f.purposes, f.newPurpose.trim()], newPurpose: "" }));
  };
  const removePurpose = (index: number) => setForm(f => ({ ...f, purposes: f.purposes.filter((_, i) => i !== index) }));

  const renderForm = (onSubmit: () => void, submitLabel: string) => (
    <div className="space-y-4 py-2">
      <div>
        <label className="text-sm font-medium text-card-foreground">Product *</label>
        <Select value={form.product} onValueChange={v => setForm(f => ({ ...f, product: v }))}>
          <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
          <SelectContent>
            {productTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-card-foreground">Sizes & Prices *</label>
        <div className="space-y-2 mt-1">
          {form.sizes.map((sp, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input placeholder="Size (e.g. 6mm)" value={sp.size} onChange={e => updateSize(i, "size", e.target.value)} className="flex-1" />
              <Input placeholder="Price (e.g. ₹8.50/kg)" value={sp.price} onChange={e => updateSize(i, "price", e.target.value)} className="flex-1" />
              {form.sizes.length > 1 && (
                <button type="button" onClick={() => removeSizeRow(i)} className="p-1.5 hover:bg-destructive/10 rounded-lg"><X className="h-4 w-4 text-destructive" /></button>
              )}
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addSizeRow}>+ Add Size</Button>
      </div>

      <div>
        <label className="text-sm font-medium text-card-foreground">Purposes</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {form.purposes.map((p, i) => (
            <span key={i} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full">
              {p}
              <button type="button" onClick={() => removePurpose(i)}><X className="h-3 w-3" /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <Input placeholder="e.g. Commercial Kitchen" value={form.newPurpose} onChange={e => setForm(f => ({ ...f, newPurpose: e.target.value }))} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addPurpose(); } }} />
          <Button type="button" variant="outline" size="sm" onClick={addPurpose}>Add</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-card-foreground">Stock</label>
          <Input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-card-foreground">Delivery Fee</label>
          <Input value={form.deliveryFee} onChange={e => setForm(f => ({ ...f, deliveryFee: e.target.value }))} placeholder="₹150" className="mt-1" />
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
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage products shown in mobile app</p>
        </div>
        <Dialog open={addOpen} onOpenChange={v => { setAddOpen(v); if (v) setForm({ ...emptyForm, sizes: [{ size: "", price: "" }] }); }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>This product will be visible in the mobile app.</DialogDescription>
            </DialogHeader>
            {renderForm(handleAdd, "Add Product")}
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the product details below.</DialogDescription>
          </DialogHeader>
          {renderForm(handleEdit, "Save Changes")}
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
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Sizes & Prices</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Purposes</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Delivery Fee</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Stock</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-card-foreground">{p.product}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {p.sizes.map((sp, i) => (
                        <div key={i} className="text-xs text-muted-foreground">
                          <span className="font-medium text-card-foreground">{sp.size}</span> — {sp.price}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {p.purposes.map((pu, i) => (
                        <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{pu}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{p.deliveryFee}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{p.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      p.status === "In Stock" ? "bg-primary/10 text-primary" :
                      p.status === "Low Stock" ? "bg-yellow-50 text-yellow-600" :
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
                          <AlertDialogTitle>Delete "{p.product}"?</AlertDialogTitle>
                          <AlertDialogDescription>This will remove the product from the mobile app.</AlertDialogDescription>
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
                <tr><td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
