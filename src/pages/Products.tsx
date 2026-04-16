import { Plus, Search, Edit, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Checkbox } from "@/components/ui/checkbox";

interface SizePrice {
  size: string;
  price: string;
}

interface SubPurposeMap {
  [purpose: string]: string[];
}

interface Product {
  id: number;
  product: string;
  sizes: SizePrice[];
  purposes: string[];
  subPurposes: SubPurposeMap;
  deliveryFee: string;
  description: string;
  category: string;
  stock: number;
  minOrderQty: number;
  imageUrl: string;
}

const productCategories = [
  "Pellets", "Biomass Stove", "Biomass Burner",
  "Eco-Friendly Plates", "Eco-Friendly Bowls", "Eco-Friendly Cups",
  "Cutlery", "Food Containers", "Straws & Stirrers",
];

const initialProducts: Product[] = [
  {
    id: 1, product: "Biomass Pellets",
    sizes: [{ size: "6mm", price: "₹8.50/kg" }, { size: "8mm", price: "₹9/kg" }, { size: "10mm", price: "₹10/kg" }],
    purposes: ["Commercial Kitchen", "Industrial Dryer"],
    subPurposes: {
      "Commercial Kitchen": ["Restaurant Kitchen", "Hotel Kitchen", "Catering Service", "Food Court", "Canteen", "Custom"],
      "Industrial Dryer": ["Textile Dryer", "Food Processing Dryer", "Pharmaceutical Dryer", "Chemical Dryer", "Agricultural Dryer", "Custom"],
    },
    deliveryFee: "₹150", description: "High-quality biomass pellets for industrial and commercial use",
    category: "Pellets", stock: 500, minOrderQty: 5, imageUrl: ""
  },
  {
    id: 2, product: "Biomass Stove",
    sizes: [{ size: "1kg", price: "₹3,500" }, { size: "3kg", price: "₹5,000" }, { size: "5kg", price: "₹6,500" }, { size: "10kg", price: "₹8,000" }, { size: "15kg", price: "₹10,000" }, { size: "25kg", price: "₹15,000" }],
    purposes: ["Commercial Kitchen", "Industrial Dryer"],
    subPurposes: {
      "Commercial Kitchen": ["Restaurant Kitchen", "Hotel Kitchen", "Catering Service", "Food Court", "Canteen", "Custom"],
      "Industrial Dryer": ["Textile Dryer", "Food Processing Dryer", "Pharmaceutical Dryer", "Chemical Dryer", "Agricultural Dryer", "Custom"],
    },
    deliveryFee: "₹800", description: "Efficient biomass cooking stoves for home and commercial kitchens",
    category: "Biomass Stove", stock: 45, minOrderQty: 1, imageUrl: ""
  },
  {
    id: 3, product: "Biomass Burner",
    sizes: [{ size: "50kw", price: "₹25,000" }, { size: "100kw", price: "₹40,000" }, { size: "150kw", price: "₹50,000" }, { size: "200kw", price: "₹60,000" }, { size: "250kw", price: "₹75,000" }, { size: "300kw", price: "₹90,000" }],
    purposes: ["Commercial Kitchen", "Industrial Dryer"],
    subPurposes: {
      "Commercial Kitchen": ["Restaurant Kitchen", "Hotel Kitchen", "Catering Service", "Food Court", "Canteen", "Custom"],
      "Industrial Dryer": ["Textile Dryer", "Food Processing Dryer", "Pharmaceutical Dryer", "Chemical Dryer", "Agricultural Dryer", "Custom"],
    },
    deliveryFee: "₹2,000", description: "Industrial biomass burners for heating and steam generation",
    category: "Biomass Burner", stock: 12, minOrderQty: 1, imageUrl: ""
  },
];

interface FormState {
  id: number;
  product: string;
  sizes: SizePrice[];
  purposes: string[];
  subPurposes: SubPurposeMap;
  newPurpose: string;
  newSubPurpose: string;
  activePurposeForSub: string;
  deliveryFee: string;
  description: string;
  category: string;
  stock: number;
  minOrderQty: number;
  imageUrl: string;
}

const emptyForm: FormState = {
  id: 0, product: "", sizes: [{ size: "", price: "" }], purposes: [], subPurposes: {},
  newPurpose: "", newSubPurpose: "", activePurposeForSub: "",
  deliveryFee: "", description: "", category: "Pellets", stock: 0, minOrderQty: 1, imageUrl: ""
};

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-destructive/10 text-destructive">Out of Stock</span>;
  if (stock <= 100) return <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-yellow-50 text-status-processing">{stock} units</span>;
  return <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-primary/10 text-primary">{stock} units</span>;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<FormState>({ ...emptyForm });

  const filtered = products.filter(p =>
    p.product.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    const validSizes = form.sizes.filter(s => s.size && s.price);
    if (!form.product || validSizes.length === 0) { toast.error("Product and at least one size with price required"); return; }
    const newProduct: Product = {
      id: Date.now(), product: form.product, sizes: validSizes, purposes: form.purposes,
      subPurposes: form.subPurposes, deliveryFee: form.deliveryFee, description: form.description,
      category: form.category, stock: form.stock, minOrderQty: form.minOrderQty, imageUrl: form.imageUrl
    };
    setProducts([...products, newProduct]);
    setForm({ ...emptyForm });
    setAddOpen(false);
    toast.success(`Product "${newProduct.product}" added`);
  };

  const handleEdit = () => {
    const validSizes = form.sizes.filter(s => s.size && s.price);
    if (!form.product || validSizes.length === 0) { toast.error("Product and at least one size with price required"); return; }
    const updated: Product = {
      id: form.id, product: form.product, sizes: validSizes, purposes: form.purposes,
      subPurposes: form.subPurposes, deliveryFee: form.deliveryFee, description: form.description,
      category: form.category, stock: form.stock, minOrderQty: form.minOrderQty, imageUrl: form.imageUrl
    };
    setProducts(products.map(p => p.id === form.id ? updated : p));
    setEditOpen(false);
    toast.success(`Product "${form.product}" updated`);
  };

  const handleDelete = (p: Product) => {
    setProducts(products.filter(x => x.id !== p.id));
    toast.success(`Product "${p.product}" deleted`);
  };

  const openEdit = (p: Product) => {
    setForm({
      id: p.id, product: p.product, sizes: [...p.sizes], purposes: [...p.purposes],
      subPurposes: JSON.parse(JSON.stringify(p.subPurposes)),
      newPurpose: "", newSubPurpose: "", activePurposeForSub: p.purposes[0] || "",
      deliveryFee: p.deliveryFee, description: p.description, category: p.category,
      stock: p.stock, minOrderQty: p.minOrderQty, imageUrl: p.imageUrl
    });
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
    const purpose = form.newPurpose.trim();
    setForm(f => ({
      ...f,
      purposes: [...f.purposes, purpose],
      subPurposes: { ...f.subPurposes, [purpose]: [] },
      newPurpose: "",
      activePurposeForSub: purpose,
    }));
  };
  const removePurpose = (index: number) => {
    setForm(f => {
      const removed = f.purposes[index];
      const newSubPurposes = { ...f.subPurposes };
      delete newSubPurposes[removed];
      const newPurposes = f.purposes.filter((_, i) => i !== index);
      return {
        ...f, purposes: newPurposes, subPurposes: newSubPurposes,
        activePurposeForSub: newPurposes[0] || "",
      };
    });
  };

  const addSubPurpose = () => {
    if (!form.newSubPurpose.trim() || !form.activePurposeForSub) return;
    setForm(f => ({
      ...f,
      subPurposes: {
        ...f.subPurposes,
        [f.activePurposeForSub]: [...(f.subPurposes[f.activePurposeForSub] || []), f.newSubPurpose.trim()],
      },
      newSubPurpose: "",
    }));
  };
  const removeSubPurpose = (purpose: string, index: number) => {
    setForm(f => ({
      ...f,
      subPurposes: {
        ...f.subPurposes,
        [purpose]: (f.subPurposes[purpose] || []).filter((_, i) => i !== index),
      },
    }));
  };

  const renderForm = (onSubmit: () => void, submitLabel: string) => (
    <div className="space-y-4 py-2 max-h-[65vh] overflow-y-auto pr-1">
      {form.imageUrl && (
        <div className="flex items-center gap-3">
          <img src={form.imageUrl} alt="Product" className="h-16 w-16 rounded-lg object-cover border" />
          <span className="text-sm text-muted-foreground">Product Image</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-card-foreground">Product Name *</label>
          <Input value={form.product} onChange={e => setForm(f => ({ ...f, product: e.target.value }))} placeholder="e.g. Biomass Pellets" className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-card-foreground">Category *</label>
          <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {productCategories.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-card-foreground">Description</label>
        <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Product description for app..." className="mt-1" rows={2} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-sm font-medium text-card-foreground">Stock</label>
          <Input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: parseInt(e.target.value) || 0 }))} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-card-foreground">Min Order Qty</label>
          <Input type="number" value={form.minOrderQty} onChange={e => setForm(f => ({ ...f, minOrderQty: parseInt(e.target.value) || 1 }))} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-card-foreground">Delivery Fee</label>
          <Input value={form.deliveryFee} onChange={e => setForm(f => ({ ...f, deliveryFee: e.target.value }))} placeholder="₹150" className="mt-1" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-card-foreground">Image URL</label>
        <Input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." className="mt-1" />
      </div>

      {/* Sizes & Prices */}
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

      {/* Purposes */}
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

      {/* Sub-Purposes */}
      {form.purposes.length > 0 && (
        <div>
          <label className="text-sm font-medium text-card-foreground">Sub-Purposes</label>
          <p className="text-xs text-muted-foreground mt-0.5 mb-2">Define sub-purpose options shown in the app for each purpose</p>

          {/* Purpose tabs */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {form.purposes.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setForm(f => ({ ...f, activePurposeForSub: p }))}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  form.activePurposeForSub === p
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Sub-purpose list for active purpose */}
          {form.activePurposeForSub && (
            <div className="border rounded-lg p-3 bg-muted/20">
              <p className="text-xs font-medium text-card-foreground mb-2">
                Sub-purposes for "{form.activePurposeForSub}"
              </p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {(form.subPurposes[form.activePurposeForSub] || []).map((sp, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-accent/60 text-accent-foreground text-xs px-2.5 py-1 rounded-full">
                    {sp}
                    <button type="button" onClick={() => removeSubPurpose(form.activePurposeForSub, i)}><X className="h-3 w-3" /></button>
                  </span>
                ))}
                {(form.subPurposes[form.activePurposeForSub] || []).length === 0 && (
                  <span className="text-xs text-muted-foreground italic">No sub-purposes added yet</span>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Restaurant Kitchen"
                  value={form.newSubPurpose}
                  onChange={e => setForm(f => ({ ...f, newSubPurpose: e.target.value }))}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSubPurpose(); } }}
                  className="text-sm"
                />
                <Button type="button" variant="outline" size="sm" onClick={addSubPurpose}>Add</Button>
              </div>
            </div>
          )}
        </div>
      )}

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
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>This product will be visible in the mobile app.</DialogDescription>
            </DialogHeader>
            {renderForm(handleAdd, "Add Product")}
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
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
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Category</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Sizes & Prices</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Purposes</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Stock</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Delivery Fee</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.imageUrl && <img src={p.imageUrl} alt={p.product} className="h-8 w-8 rounded object-cover" />}
                      <span className="text-sm font-medium text-card-foreground">{p.product}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{p.category}</td>
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
                    <div className="space-y-1">
                      {p.purposes.map((pur, i) => (
                        <div key={i}>
                          <span className="text-xs font-medium text-card-foreground">{pur}</span>
                          {p.subPurposes[pur] && p.subPurposes[pur].length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {p.subPurposes[pur].map((sp, j) => (
                                <span key={j} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{sp}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4"><StockBadge stock={p.stock} /></td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{p.deliveryFee}</td>
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
