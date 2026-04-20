import { useEffect, useMemo, useState } from "react";
import { FileDown, FileSpreadsheet, BarChart3, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/StatCard";
import { exportToPdf, exportToExcel, type ExportColumn } from "@/lib/exporters";
import { toast } from "sonner";

type ModuleKey = "sales" | "orders" | "payments" | "production" | "expenses" | "forecast";
type Preset = "today" | "week" | "month" | "year" | "custom";

interface ReportRow {
  date: string;
  reference: string;
  category: string;
  party: string;
  amount: number;
  status: string;
}

const MODULES: { key: ModuleKey; label: string; description: string }[] = [
  { key: "sales", label: "Sales", description: "Revenue from invoices & POS" },
  { key: "orders", label: "Orders", description: "Customer & dealer orders" },
  { key: "payments", label: "Payments", description: "Inflows & outflows" },
  { key: "production", label: "Production", description: "Manufacturing output" },
  { key: "expenses", label: "Expenses", description: "Operating costs" },
  { key: "forecast", label: "Forecast", description: "Projected revenue" },
];

// Mock dataset – every module returns same shape for simplicity.
const MOCK_ROWS: Record<ModuleKey, ReportRow[]> = {
  sales: [
    { date: "2025-04-02", reference: "INV-0001", category: "Briquettes", party: "GreenLeaf Distributors", amount: 39900, status: "Paid" },
    { date: "2025-04-08", reference: "INV-0002", category: "Briquettes", party: "Bharat Bio Power", amount: 103600, status: "Sent" },
    { date: "2025-03-22", reference: "INV-0003", category: "Pellets", party: "Sri Krishna Industries", amount: 67260, status: "Overdue" },
    { date: "2025-04-15", reference: "INV-0004", category: "Pellets", party: "EcoFuel Traders", amount: 89500, status: "Paid" },
  ],
  orders: [
    { date: "2025-04-12", reference: "ORD-1042", category: "Wholesale", party: "GreenLeaf", amount: 152000, status: "Shipped" },
    { date: "2025-04-14", reference: "ORD-1043", category: "Retail", party: "Walk-in", amount: 18500, status: "Delivered" },
    { date: "2025-04-16", reference: "ORD-1044", category: "Wholesale", party: "Bharat Bio", amount: 245000, status: "Pending" },
  ],
  payments: [
    { date: "2025-04-03", reference: "PAY-201", category: "Inflow", party: "GreenLeaf", amount: 39900, status: "Cleared" },
    { date: "2025-04-09", reference: "PAY-202", category: "Outflow", party: "Sri Lakshmi Traders", amount: 22500, status: "Cleared" },
    { date: "2025-04-12", reference: "PAY-203", category: "Inflow", party: "EcoFuel", amount: 89500, status: "Pending" },
  ],
  production: [
    { date: "2025-04-10", reference: "PRD-501", category: "Briquettes", party: "Line A", amount: 4200, status: "Done" },
    { date: "2025-04-11", reference: "PRD-502", category: "Pellets", party: "Line B", amount: 3800, status: "Done" },
    { date: "2025-04-12", reference: "PRD-503", category: "Briquettes", party: "Line A", amount: 4500, status: "QC" },
  ],
  expenses: [
    { date: "2025-04-04", reference: "EXP-301", category: "Raw Materials", party: "Sri Lakshmi Traders", amount: 22500, status: "Paid" },
    { date: "2025-04-06", reference: "EXP-302", category: "Salary", party: "Payroll April-W1", amount: 145000, status: "Paid" },
    { date: "2025-04-09", reference: "EXP-303", category: "Maintenance", party: "ToolPoint", amount: 8400, status: "Paid" },
  ],
  forecast: [
    { date: "2025-05-01", reference: "FC-M05", category: "Projected", party: "Sales pipeline", amount: 1280000, status: "Estimated" },
    { date: "2025-06-01", reference: "FC-M06", category: "Projected", party: "Sales pipeline", amount: 1380000, status: "Estimated" },
    { date: "2025-07-01", reference: "FC-M07", category: "Projected", party: "Sales pipeline", amount: 1520000, status: "Estimated" },
  ],
};

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const today = () => new Date().toISOString().slice(0, 10);
const minus = (days: number) => new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

export default function Reports() {
  const [module, setModule] = useState<ModuleKey>("sales");
  const [preset, setPreset] = useState<Preset>("month");
  const [from, setFrom] = useState(minus(30));
  const [to, setTo] = useState(today());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  // Reset category whenever the module changes
  useEffect(() => { setCategory("all"); }, [module]);

  const categoryOptions = useMemo(
    () => Array.from(new Set(MOCK_ROWS[module].map((r) => r.category))).sort(),
    [module],
  );

  const onPreset = (p: Preset) => {
    setPreset(p);
    if (p === "today") { setFrom(today()); setTo(today()); }
    else if (p === "week") { setFrom(minus(7)); setTo(today()); }
    else if (p === "month") { setFrom(minus(30)); setTo(today()); }
    else if (p === "year") { setFrom(minus(365)); setTo(today()); }
  };

  const rows = useMemo(() => {
    return MOCK_ROWS[module].filter((r) => {
      if (category !== "all" && r.category !== category) return false;
      if (from && r.date < from) return false;
      if (to && r.date > to) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!r.reference.toLowerCase().includes(q) &&
            !r.party.toLowerCase().includes(q) &&
            !r.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [module, from, to, search, category]);

  const stats = useMemo(() => {
    const total = rows.reduce((s, r) => s + r.amount, 0);
    return { count: rows.length, total, avg: rows.length ? total / rows.length : 0 };
  }, [rows]);

  const columns: ExportColumn<ReportRow>[] = [
    { header: "Date", key: "date" },
    { header: "Reference", key: "reference" },
    { header: "Category", key: "category" },
    { header: "Party / Source", key: "party" },
    { header: "Amount (₹)", key: (r) => r.amount.toLocaleString("en-IN") },
    { header: "Status", key: "status" },
  ];

  const baseTitle = `${MODULES.find((m) => m.key === module)?.label} Report`;
  const subtitle = `Period: ${from} → ${to} · ${rows.length} records · Total ${inr(stats.total)}`;

  const onExportPdf = () => {
    if (!rows.length) { toast.error("No rows to export"); return; }
    exportToPdf({ title: baseTitle, subtitle, columns, rows, filename: `${module}-report-${from}_to_${to}` });
    toast.success("PDF generated");
  };
  const onExportXlsx = () => {
    if (!rows.length) { toast.error("No rows to export"); return; }
    exportToExcel({ sheetName: baseTitle, columns, rows, filename: `${module}-report-${from}_to_${to}` });
    toast.success("Excel generated");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground">Generate operational reports across modules and export to PDF or Excel.</p>
      </div>

      {/* Module picker */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {MODULES.map((m) => {
          const active = module === m.key;
          return (
            <button
              key={m.key}
              onClick={() => setModule(m.key)}
              className={`text-left rounded-xl border p-4 transition-colors ${
                active ? "border-primary bg-primary/5" : "bg-card hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                  <BarChart3 className="h-4 w-4" />
                </div>
                <span className="font-medium text-card-foreground">{m.label}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{m.description}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-card-foreground">
          <Filter className="h-4 w-4" /> Filters
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <div className="md:col-span-2">
            <Label className="text-xs">Range preset</Label>
            <Select value={preset} onValueChange={(v) => onPreset(v as Preset)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="year">Last 12 months</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label className="text-xs">From</Label><Input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPreset("custom"); }} /></div>
          <div><Label className="text-xs">To</Label><Input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPreset("custom"); }} /></div>
          <div className="md:col-span-2"><Label className="text-xs">Search</Label><Input placeholder="reference, party, category..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        </div>
        <div className="flex gap-2 mt-4 justify-end">
          <Button variant="outline" onClick={onExportXlsx}><FileSpreadsheet className="h-4 w-4" /> Export Excel</Button>
          <Button onClick={onExportPdf}><FileDown className="h-4 w-4" /> Export PDF</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Records" value={String(stats.count)} subtitle="in selected range" icon={BarChart3} />
        <StatCard title="Total" value={inr(stats.total)} subtitle="aggregate value" icon={FileDown} />
        <StatCard title="Average" value={inr(Math.round(stats.avg))} subtitle="per record" icon={FileSpreadsheet} subtitleColor="muted" />
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                {columns.map((c) => <th key={c.header} className="text-left px-4 py-3 font-medium">{c.header}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={columns.length} className="text-center py-10 text-muted-foreground">No records in this range.</td></tr>}
              {rows.map((r, i) => (
                <tr key={i} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3">{r.date}</td>
                  <td className="px-4 py-3 font-medium text-card-foreground">{r.reference}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{r.category}</span></td>
                  <td className="px-4 py-3">{r.party}</td>
                  <td className="px-4 py-3 font-semibold">{inr(r.amount)}</td>
                  <td className="px-4 py-3"><span className="text-xs text-muted-foreground">{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
