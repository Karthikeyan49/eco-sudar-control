import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search, Pencil, Trash2, Upload, Wallet, Receipt, TrendingUp, Layers, Camera, ImageIcon, Sparkles, Loader2, X } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/StatCard";
import { toast } from "sonner";
import {
  EXPENSE_CATEGORIES, expensesApi, type Expense,
} from "@/lib/api/expenses";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const PAYMENT_MODES: Expense["paymentMode"][] = ["Cash", "Bank Transfer", "UPI", "Cheque", "Card"];
const OTHER = "Other" as const;

const expenseSchema = z.object({
  date: z.string().min(1, "Date is required"),
  category: z.string().trim().min(2, "Category required").max(60),
  vendor: z.string().trim().min(2, "Vendor required").max(120),
  description: z.string().trim().max(300).optional().default(""),
  amount: z.number().positive("Amount must be > 0").max(10_000_000),
  paymentMode: z.enum(["Cash", "Bank Transfer", "UPI", "Cheque", "Card"]),
  billUrl: z.string().optional(),
});

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const CHART_COLORS = [
  "hsl(152,60%,36%)", "hsl(210,70%,55%)", "hsl(30,90%,52%)", "hsl(280,55%,52%)",
  "hsl(45,90%,50%)", "hsl(0,72%,51%)", "hsl(240,60%,55%)", "hsl(170,55%,42%)",
  "hsl(330,60%,55%)", "hsl(190,65%,45%)", "hsl(120,40%,45%)",
];

interface FormState {
  date: string;
  category: string;          // any string (preset OR custom from "Other")
  categoryChoice: string;    // dropdown value: a preset OR "Other"
  vendor: string;
  description: string;
  amount: string;
  paymentMode: Expense["paymentMode"];
  billUrl?: string;
}

const emptyForm = (): FormState => ({
  date: new Date().toISOString().slice(0, 10),
  category: "Office Stationery",
  categoryChoice: "Office Stationery",
  vendor: "",
  description: "",
  amount: "",
  paymentMode: "Bank Transfer",
  billUrl: undefined,
});

export default function Expenses() {
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minAmt, setMinAmt] = useState("");
  const [maxAmt, setMaxAmt] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [confirmDelete, setConfirmDelete] = useState<Expense | null>(null);

  const load = async () => {
    setLoading(true);
    try { setItems(await expensesApi.list()); } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return items.filter((e) => {
      if (filterCategory !== "all" && e.category !== filterCategory) return false;
      if (fromDate && e.date < fromDate) return false;
      if (toDate && e.date > toDate) return false;
      if (minAmt && e.amount < Number(minAmt)) return false;
      if (maxAmt && e.amount > Number(maxAmt)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!e.vendor.toLowerCase().includes(q) &&
            !e.description.toLowerCase().includes(q) &&
            !e.id.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [items, filterCategory, fromDate, toDate, minAmt, maxAmt, search]);

  const summary = useMemo(() => {
    const total = filtered.reduce((s, e) => s + e.amount, 0);
    const byCat = new Map<string, number>();
    filtered.forEach((e) => byCat.set(e.category, (byCat.get(e.category) ?? 0) + e.amount));
    const pieData = Array.from(byCat, ([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    const byMonth = new Map<string, number>();
    filtered.forEach((e) => {
      const m = e.date.slice(0, 7);
      byMonth.set(m, (byMonth.get(m) ?? 0) + e.amount);
    });
    const barData = Array.from(byMonth, ([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));
    const top = pieData[0];
    return { total, count: filtered.length, pieData, barData, topCategory: top };
  }, [filtered]);

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setDialogOpen(true); };
  const openEdit = (e: Expense) => {
    setEditing(e);
    setForm({
      date: e.date, category: e.category, vendor: e.vendor, description: e.description,
      amount: String(e.amount), paymentMode: e.paymentMode, billUrl: e.billUrl,
    });
    setDialogOpen(true);
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { toast.error("File must be under 5MB"); return; }
    if (!/^(image\/|application\/pdf)/.test(f.type)) { toast.error("Only images or PDF allowed"); return; }
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, billUrl: reader.result as string }));
    reader.readAsDataURL(f);
  };

  const onSubmit = async () => {
    const parsed = expenseSchema.safeParse({ ...form, amount: Number(form.amount) });
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Invalid input"); return; }
    try {
      if (editing) {
        await expensesApi.update(editing.id, parsed.data as Partial<Expense>);
        toast.success("Expense updated");
      } else {
        await expensesApi.create(parsed.data as Omit<Expense, "id" | "createdBy">);
        toast.success("Expense added");
      }
      setDialogOpen(false);
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  const onDelete = async () => {
    if (!confirmDelete) return;
    try {
      await expensesApi.remove(confirmDelete.id);
      toast.success("Expense deleted");
      setConfirmDelete(null);
      load();
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Expense Management</h1>
          <p className="text-muted-foreground">Track, categorize and analyse business expenses.</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" />Add Expense</Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Expenses" value={inr(summary.total)} subtitle={`${summary.count} entries`} icon={Wallet} />
        <StatCard title="Categories" value={String(new Set(filtered.map((e) => e.category)).size)} subtitle="active" icon={Layers} />
        <StatCard title="Top Category" value={summary.topCategory ? summary.topCategory.name.split(" - ")[0] : "—"} subtitle={summary.topCategory ? inr(summary.topCategory.value) : ""} icon={TrendingUp} />
        <StatCard title="Avg / Entry" value={summary.count ? inr(Math.round(summary.total / summary.count)) : "₹0"} subtitle="filtered set" icon={Receipt} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <h3 className="font-semibold text-card-foreground mb-1">Expense Breakdown</h3>
          <p className="text-xs text-muted-foreground mb-4">Share by category</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={summary.pieData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50}>
                {summary.pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => inr(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <h3 className="font-semibold text-card-foreground mb-1">Monthly Spend</h3>
          <p className="text-xs text-muted-foreground mb-4">Aggregated by month (filtered)</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={summary.barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip formatter={(v: number) => inr(v)} />
              <Bar dataKey="amount" fill="hsl(152,60%,36%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border p-4 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search vendor, description, ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {EXPENSE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} placeholder="From" />
        <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} placeholder="To" />
        <div className="flex gap-2">
          <Input type="number" placeholder="Min ₹" value={minAmt} onChange={(e) => setMinAmt(e.target.value)} />
          <Input type="number" placeholder="Max ₹" value={maxAmt} onChange={(e) => setMaxAmt(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">ID</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Category</th>
                <th className="text-left px-4 py-3 font-medium">Vendor</th>
                <th className="text-left px-4 py-3 font-medium">Description</th>
                <th className="text-left px-4 py-3 font-medium">Mode</th>
                <th className="text-right px-4 py-3 font-medium">Amount</th>
                <th className="text-right px-4 py-3 font-medium">Bill</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={9} className="text-center py-10 text-muted-foreground">Loading…</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-10 text-muted-foreground">No expenses match the filters.</td></tr>
              )}
              {!loading && filtered.map((e) => (
                <tr key={e.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-card-foreground">{e.id}</td>
                  <td className="px-4 py-3">{e.date}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{e.category}</span></td>
                  <td className="px-4 py-3">{e.vendor}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{e.description}</td>
                  <td className="px-4 py-3">{e.paymentMode}</td>
                  <td className="px-4 py-3 text-right font-semibold">{inr(e.amount)}</td>
                  <td className="px-4 py-3 text-right">
                    {e.billUrl
                      ? <a href={e.billUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">View</a>
                      : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(e)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => setConfirmDelete(e)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Expense" : "Add Expense"}</DialogTitle>
            <DialogDescription>Record a business expense entry. Attach a bill if available.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-1">
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="col-span-1">
              <Label>Amount (₹)</Label>
              <Input type="number" min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div className="col-span-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as ExpenseCategory })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Vendor / Payee</Label>
              <Input value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} placeholder="e.g. Sri Lakshmi Traders" />
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Notes / reference" />
            </div>
            <div className="col-span-2">
              <Label>Payment Mode</Label>
              <Select value={form.paymentMode} onValueChange={(v) => setForm({ ...form, paymentMode: v as Expense["paymentMode"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_MODES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Bill / Receipt (image or PDF, max 5MB)</Label>
              <div className="flex items-center gap-2">
                <Input type="file" accept="image/*,application/pdf" capture="environment" onChange={(e) => onFile(e.target.files?.[0])} />
                {form.billUrl && <a href={form.billUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline whitespace-nowrap"><Upload className="h-3 w-3 inline" /> Preview</a>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={onSubmit}>{editing ? "Save changes" : "Add expense"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete expense?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDelete && <>This will permanently remove <strong>{confirmDelete.id}</strong> ({inr(confirmDelete.amount)}). This cannot be undone.</>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
