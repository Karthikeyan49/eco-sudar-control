import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, QrCode, Download, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StatCard } from "@/components/StatCard";
import { QrImage } from "@/components/QrImage";
import { toast } from "sonner";
import QRCode from "qrcode";
import {
  employeesApi, DEPARTMENTS, type Employee, type Department,
} from "@/lib/api/hr";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const emptyForm = (): Omit<Employee, "id" | "qrToken"> => ({
  name: "", email: "", phone: "", department: "Production",
  designation: "", baseSalary: 25000, joinedAt: new Date().toISOString().slice(0, 10), active: true,
});

export default function Employees() {
  const [items, setItems] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<string>("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [confirmDelete, setConfirmDelete] = useState<Employee | null>(null);
  const [qrFor, setQrFor] = useState<Employee | null>(null);

  const load = async () => {
    setLoading(true);
    try { setItems(await employeesApi.list()); }
    catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => items.filter((e) => {
    if (deptFilter !== "all" && e.department !== deptFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!e.name.toLowerCase().includes(q) &&
          !e.id.toLowerCase().includes(q) &&
          !e.designation.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [items, deptFilter, search]);

  const stats = useMemo(() => {
    const active = items.filter((e) => e.active).length;
    const payroll = items.reduce((s, e) => s + (e.active ? e.baseSalary : 0), 0);
    return { total: items.length, active, payroll, depts: new Set(items.map((e) => e.department)).size };
  }, [items]);

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setDialogOpen(true); };
  const openEdit = (e: Employee) => {
    setEditing(e);
    const { id, qrToken, ...rest } = e;
    setForm(rest);
    setDialogOpen(true);
  };

  const onSubmit = async () => {
    if (!form.name.trim()) { toast.error("Name required"); return; }
    if (form.baseSalary <= 0) { toast.error("Base salary must be > 0"); return; }
    try {
      if (editing) await employeesApi.update(editing.id, form);
      else await employeesApi.create(form);
      toast.success(editing ? "Employee updated" : "Employee added");
      setDialogOpen(false); load();
    } catch (e: any) { toast.error(e.message); }
  };

  const onDelete = async () => {
    if (!confirmDelete) return;
    try {
      await employeesApi.remove(confirmDelete.id);
      toast.success("Removed"); setConfirmDelete(null); load();
    } catch (e: any) { toast.error(e.message); }
  };

  const downloadQr = async (e: Employee) => {
    try {
      // Render an Identity-Card style PNG (600 x 900)
      const W = 600, H = 900;
      const canvas = document.createElement("canvas");
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      // White background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);

      // Green header bar
      ctx.fillStyle = "hsl(152, 60%, 36%)";
      ctx.fillRect(0, 0, W, 110);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 30px system-ui, -apple-system, Segoe UI, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("ECO SUDAR", W / 2, 50);
      ctx.font = "16px system-ui, -apple-system, Segoe UI, sans-serif";
      ctx.fillText("Bio Energy LLP — Employee ID", W / 2, 80);

      // Employee details
      ctx.fillStyle = "#0f172a";
      ctx.textAlign = "center";
      ctx.font = "bold 32px system-ui, -apple-system, Segoe UI, sans-serif";
      ctx.fillText(e.name, W / 2, 170);

      ctx.fillStyle = "#475569";
      ctx.font = "18px system-ui, -apple-system, Segoe UI, sans-serif";
      ctx.fillText(`${e.designation} · ${e.department}`, W / 2, 200);

      ctx.fillStyle = "hsl(152, 60%, 36%)";
      ctx.font = "bold 22px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillText(e.id, W / 2, 240);

      // QR code (420x420 centred)
      const qrDataUrl = await QRCode.toDataURL(e.qrToken, { width: 420, margin: 1, errorCorrectionLevel: "M" });
      const img = new Image();
      img.src = qrDataUrl;
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
      const QR = 420;
      ctx.drawImage(img, (W - QR) / 2, 280, QR, QR);

      // Footer
      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 16px system-ui, -apple-system, Segoe UI, sans-serif";
      ctx.fillText("Scan at attendance kiosk for check-in / check-out", W / 2, 760);
      ctx.fillStyle = "#64748b";
      ctx.font = "13px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillText(e.qrToken, W / 2, 790);
      ctx.font = "12px system-ui, -apple-system, Segoe UI, sans-serif";
      ctx.fillText(e.email || "", W / 2, 815);
      ctx.fillText(e.phone || "", W / 2, 835);

      // Bottom border accent
      ctx.fillStyle = "hsl(152, 60%, 36%)";
      ctx.fillRect(0, H - 12, W, 12);

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${e.id}-${e.name.replace(/\s+/g, "_")}-IDCard.png`;
      a.click();
    } catch { toast.error("Could not generate ID card"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employees</h1>
          <p className="text-muted-foreground">Manage staff and generate QR codes for attendance.</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" />Add Employee</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Staff" value={String(stats.total)} subtitle={`${stats.active} active`} icon={Users} />
        <StatCard title="Departments" value={String(stats.depts)} subtitle="active" icon={QrCode} />
        <StatCard title="Monthly Payroll" value={inr(stats.payroll)} subtitle="gross base" icon={Download} />
        <StatCard title="Avg. Salary" value={stats.active ? inr(Math.round(stats.payroll / stats.active)) : "₹0"} subtitle="per active" icon={Pencil} subtitleColor="muted" />
      </div>

      <div className="bg-card rounded-xl border p-4 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search name, ID or designation..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Department" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>
            {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">ID</th>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Department</th>
                <th className="text-left px-4 py-3 font-medium">Designation</th>
                <th className="text-left px-4 py-3 font-medium">Contact</th>
                <th className="text-right px-4 py-3 font-medium">Salary</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={8} className="text-center py-10 text-muted-foreground">Loading…</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan={8} className="text-center py-10 text-muted-foreground">No employees.</td></tr>}
              {!loading && filtered.map((e) => (
                <tr key={e.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-card-foreground">{e.id}</td>
                  <td className="px-4 py-3">{e.name}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{e.department}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{e.designation}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{e.email}<br/>{e.phone}</td>
                  <td className="px-4 py-3 text-right font-semibold">{inr(e.baseSalary)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${e.active ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                      {e.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setQrFor(e)}><QrCode className="h-4 w-4" /></Button>
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
            <DialogTitle>{editing ? "Edit Employee" : "Add Employee"}</DialogTitle>
            <DialogDescription>{editing ? `Editing ${editing.id}` : "A unique QR token is generated automatically."}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><Label>Full Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div>
              <Label>Department</Label>
              <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v as Department })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Designation</Label><Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} /></div>
            <div><Label>Base Salary (₹/mo)</Label><Input type="number" min="0" value={form.baseSalary} onChange={(e) => setForm({ ...form, baseSalary: Number(e.target.value) })} /></div>
            <div><Label>Joined</Label><Input type="date" value={form.joinedAt} onChange={(e) => setForm({ ...form, joinedAt: e.target.value })} /></div>
            <div className="col-span-2 flex items-center gap-2 pt-1">
              <input id="active" type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              <Label htmlFor="active" className="cursor-pointer">Active employee</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={onSubmit}>{editing ? "Save changes" : "Add employee"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR dialog */}
      <Dialog open={!!qrFor} onOpenChange={(o) => !o && setQrFor(null)}>
        <DialogContent className="max-w-sm">
          {qrFor && (
            <>
              <DialogHeader>
                <DialogTitle>{qrFor.name}</DialogTitle>
                <DialogDescription>{qrFor.id} · {qrFor.designation}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-3 py-2">
                <div className="bg-white p-3 rounded-lg border">
                  <QrImage value={qrFor.qrToken} size={220} />
                </div>
                <code className="text-xs bg-muted px-2 py-1 rounded">{qrFor.qrToken}</code>
                <p className="text-xs text-muted-foreground text-center">Print and give to the employee. They scan it at the QR kiosk for check-in/out.</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setQrFor(null)}>Close</Button>
                <Button onClick={() => downloadQr(qrFor)}><Download className="h-4 w-4" /> Download PNG</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove employee?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDelete && <>This permanently deletes <strong>{confirmDelete.name}</strong> ({confirmDelete.id}) and invalidates their QR token.</>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
