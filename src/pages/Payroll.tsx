import { useEffect, useMemo, useState } from "react";
import { Calculator, FileDown, Receipt, Wallet, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { StatCard } from "@/components/StatCard";
import { toast } from "sonner";
import { payrollApi, workingDaysInMonth, type Payslip } from "@/lib/api/hr";
import { exportToPdf, exportToExcel, type ExportColumn } from "@/lib/exporters";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const currentMonth = () => new Date().toISOString().slice(0, 7);

export default function Payroll() {
  const [month, setMonth] = useState(currentMonth());
  const [slips, setSlips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<Payslip | null>(null);

  const load = async (m = month) => {
    setLoading(true);
    try { setSlips(await payrollApi.run(m)); }
    catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(month); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [month]);

  const stats = useMemo(() => {
    const total = slips.reduce((s, p) => s + p.netPay, 0);
    const gross = slips.reduce((s, p) => s + p.earnedSalary + p.hra + p.allowances, 0);
    const ded = slips.reduce((s, p) => s + p.deductions, 0);
    return { total, gross, ded, count: slips.length, workingDays: workingDaysInMonth(month) };
  }, [slips, month]);

  const columns: ExportColumn<Payslip>[] = [
    { header: "Emp ID", key: "employeeId" },
    { header: "Name", key: "employeeName" },
    { header: "Designation", key: "designation" },
    { header: "Working Days", key: "workingDays" },
    { header: "Present", key: "presentDays" },
    { header: "Base", key: (r) => r.baseSalary.toLocaleString("en-IN") },
    { header: "Earned", key: (r) => r.earnedSalary.toLocaleString("en-IN") },
    { header: "HRA", key: (r) => r.hra.toLocaleString("en-IN") },
    { header: "Allow", key: (r) => r.allowances.toLocaleString("en-IN") },
    { header: "PF", key: (r) => r.pf.toLocaleString("en-IN") },
    { header: "PT", key: "professionalTax" },
    { header: "Net Pay", key: (r) => r.netPay.toLocaleString("en-IN") },
  ];

  const exportPdf = () => {
    if (!slips.length) return;
    exportToPdf({
      title: `Payroll Register — ${month}`,
      subtitle: `${slips.length} employees · Working days: ${stats.workingDays} · Total net payout: ${inr(stats.total)}`,
      columns, rows: slips, filename: `payroll-${month}`,
    });
  };
  const exportXlsx = () => {
    if (!slips.length) return;
    exportToExcel({ sheetName: `Payroll ${month}`, columns, rows: slips, filename: `payroll-${month}` });
  };

  const downloadPayslip = (p: Payslip) => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFontSize(18);
    doc.text("ECO SUDAR Bio Energy LLP", 40, 50);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Payslip for ${p.month}`, 40, 70);
    doc.setTextColor(20);

    autoTable(doc, {
      startY: 95,
      theme: "plain",
      body: [
        ["Employee", `${p.employeeName} (${p.employeeId})`],
        ["Designation", p.designation],
        ["Working Days", String(p.workingDays)],
        ["Present Days", String(p.presentDays)],
        ["Leaves", String(p.leaves)],
      ],
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 130 } },
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 14,
      head: [["Earnings", "Amount (₹)"]],
      body: [
        ["Earned Basic", p.earnedSalary.toLocaleString("en-IN")],
        ["HRA", p.hra.toLocaleString("en-IN")],
        ["Allowances", p.allowances.toLocaleString("en-IN")],
        ["Gross", (p.earnedSalary + p.hra + p.allowances).toLocaleString("en-IN")],
      ],
      headStyles: { fillColor: [38, 132, 89] },
      styles: { fontSize: 10 },
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [["Deductions", "Amount (₹)"]],
      body: [
        ["Provident Fund (12%)", p.pf.toLocaleString("en-IN")],
        ["Professional Tax", String(p.professionalTax)],
        ["Total Deductions", p.deductions.toLocaleString("en-IN")],
      ],
      headStyles: { fillColor: [180, 70, 70] },
      styles: { fontSize: 10 },
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 14,
      theme: "grid",
      body: [["NET PAY", `₹ ${p.netPay.toLocaleString("en-IN")}`]],
      styles: { fontSize: 13, fontStyle: "bold", halign: "right" },
      columnStyles: { 0: { halign: "left", fillColor: [240, 245, 240] } },
    });

    doc.setFontSize(8);
    doc.setTextColor(140);
    doc.text("This is a system-generated payslip and does not require a signature.", 40, doc.internal.pageSize.height - 30);
    doc.save(`payslip-${p.employeeId}-${p.month}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payroll</h1>
          <p className="text-muted-foreground">Auto-computed from attendance. Generate payslips and registers.</p>
        </div>
        <div className="flex gap-2 items-end">
          <div>
            <Label className="text-xs">Month</Label>
            <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
          </div>
          <Button variant="outline" onClick={() => load()}><Calculator className="h-4 w-4" /> Re-run</Button>
          <Button variant="outline" onClick={exportXlsx}><FileDown className="h-4 w-4" /> Excel</Button>
          <Button onClick={exportPdf}><FileDown className="h-4 w-4" /> Register PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Employees" value={String(stats.count)} subtitle="processed" icon={Users} />
        <StatCard title="Working Days" value={String(stats.workingDays)} subtitle={month} icon={Calculator} />
        <StatCard title="Gross Payable" value={inr(stats.gross)} subtitle="basic + HRA + allow." icon={Wallet} />
        <StatCard title="Net Payout" value={inr(stats.total)} subtitle={`Deductions ${inr(stats.ded)}`} icon={TrendingUp} />
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Employee</th>
                <th className="text-left px-4 py-3 font-medium">Designation</th>
                <th className="text-right px-4 py-3 font-medium">Days</th>
                <th className="text-right px-4 py-3 font-medium">Earned</th>
                <th className="text-right px-4 py-3 font-medium">HRA + Allow.</th>
                <th className="text-right px-4 py-3 font-medium">Deductions</th>
                <th className="text-right px-4 py-3 font-medium">Net Pay</th>
                <th className="text-right px-4 py-3 font-medium">Payslip</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={8} className="text-center py-10 text-muted-foreground">Computing…</td></tr>}
              {!loading && slips.length === 0 && <tr><td colSpan={8} className="text-center py-10 text-muted-foreground">No payroll data.</td></tr>}
              {!loading && slips.map((p) => (
                <tr key={p.employeeId} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3">{p.employeeName}<div className="text-xs text-muted-foreground">{p.employeeId}</div></td>
                  <td className="px-4 py-3 text-muted-foreground">{p.designation}</td>
                  <td className="px-4 py-3 text-right">{p.presentDays} / {p.workingDays}</td>
                  <td className="px-4 py-3 text-right">{inr(p.earnedSalary)}</td>
                  <td className="px-4 py-3 text-right">{inr(p.hra + p.allowances)}</td>
                  <td className="px-4 py-3 text-right text-destructive">−{inr(p.deductions)}</td>
                  <td className="px-4 py-3 text-right font-bold text-primary">{inr(p.netPay)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setView(p)}><Receipt className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => downloadPayslip(p)}><FileDown className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="max-w-md">
          {view && (
            <>
              <DialogHeader>
                <DialogTitle>Payslip — {view.month}</DialogTitle>
                <DialogDescription>{view.employeeName} ({view.employeeId})</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Designation</div><div>{view.designation}</div>
                  <div className="text-muted-foreground">Working Days</div><div>{view.workingDays}</div>
                  <div className="text-muted-foreground">Present</div><div>{view.presentDays}</div>
                  <div className="text-muted-foreground">Leaves</div><div>{view.leaves}</div>
                </div>
                <div className="border-t pt-3 space-y-1">
                  <div className="flex justify-between"><span>Earned Basic</span><span>{inr(view.earnedSalary)}</span></div>
                  <div className="flex justify-between"><span>HRA</span><span>{inr(view.hra)}</span></div>
                  <div className="flex justify-between"><span>Allowances</span><span>{inr(view.allowances)}</span></div>
                </div>
                <div className="border-t pt-3 space-y-1 text-destructive">
                  <div className="flex justify-between"><span>PF</span><span>−{inr(view.pf)}</span></div>
                  <div className="flex justify-between"><span>Prof. Tax</span><span>−{inr(view.professionalTax)}</span></div>
                </div>
                <div className="flex justify-between font-bold border-t pt-3 text-base">
                  <span>Net Pay</span><span className="text-primary">{inr(view.netPay)}</span>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setView(null)}>Close</Button>
                <Button onClick={() => downloadPayslip(view)}><FileDown className="h-4 w-4" /> Download PDF</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
