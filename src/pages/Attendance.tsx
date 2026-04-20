import { useEffect, useMemo, useState } from "react";
import { ScanLine, CheckCircle2, Clock, Calendar, Users, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StatCard } from "@/components/StatCard";
import { QrScanner } from "@/components/QrScanner";
import { toast } from "sonner";
import {
  attendanceApi, employeesApi, type AttendanceEntry, type Employee,
} from "@/lib/api/hr";
import { exportToExcel } from "@/lib/exporters";

const todayStr = () => new Date().toISOString().slice(0, 10);
const fmtTime = (iso?: string) => iso ? new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—";
const statusColor = (s: AttendanceEntry["status"]) => ({
  Present: "bg-primary/10 text-primary",
  "Half-day": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  Absent: "bg-destructive/10 text-destructive",
  Leave: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
}[s]);

export default function Attendance() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [entries, setEntries] = useState<AttendanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState(todayStr());
  const [to, setTo] = useState(todayStr());
  const [empFilter, setEmpFilter] = useState("all");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [lastScan, setLastScan] = useState<{ name: string; action: string; time: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [emps, atts] = await Promise.all([
        employeesApi.list(),
        attendanceApi.list({ from, to, employeeId: empFilter === "all" ? undefined : empFilter }),
      ]);
      setEmployees(emps); setEntries(atts);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [from, to, empFilter]);

  const empMap = useMemo(() => Object.fromEntries(employees.map((e) => [e.id, e])), [employees]);

  const today = todayStr();
  const todayEntries = useMemo(() => entries.filter((e) => e.date === today), [entries, today]);
  const stats = useMemo(() => {
    const present = todayEntries.filter((e) => e.status === "Present").length;
    const half = todayEntries.filter((e) => e.status === "Half-day").length;
    const leave = todayEntries.filter((e) => e.status === "Leave").length;
    const checkedIn = todayEntries.filter((e) => e.checkIn && !e.checkOut).length;
    return { present, half, leave, checkedIn };
  }, [todayEntries]);

  const onScan = async (token: string) => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await attendanceApi.scan(token);
      setLastScan({
        name: res.employee.name,
        action: res.action === "checked-in" ? "Checked IN" : "Checked OUT",
        time: new Date().toLocaleTimeString("en-IN"),
      });
      load();
      // Auto-dismiss success popup after 2s
      setTimeout(() => setLastScan(null), 2000);
    } catch (e: any) { toast.error(e.message); }
    finally { setTimeout(() => setBusy(false), 1500); }
  };

  const exportXlsx = () => {
    if (!entries.length) { toast.error("No data to export"); return; }
    exportToExcel({
      sheetName: "Attendance",
      filename: `attendance-${from}_to_${to}`,
      columns: [
        { header: "Date", key: "date" },
        { header: "Employee ID", key: "employeeId" },
        { header: "Name", key: (r) => empMap[r.employeeId]?.name ?? "—" },
        { header: "Department", key: (r) => empMap[r.employeeId]?.department ?? "—" },
        { header: "Check In", key: (r) => fmtTime(r.checkIn) },
        { header: "Check Out", key: (r) => fmtTime(r.checkOut) },
        { header: "Hours", key: (r) => r.hoursWorked ?? "" },
        { header: "Status", key: "status" },
      ],
      rows: entries,
    });
    toast.success("Excel exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground">Scan employee QR to mark check-in / check-out.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportXlsx}><FileDown className="h-4 w-4" /> Export</Button>
          <Button onClick={() => setScannerOpen(true)}><ScanLine className="h-4 w-4" /> Scan QR</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Present Today" value={String(stats.present)} subtitle={`of ${employees.length} staff`} icon={CheckCircle2} />
        <StatCard title="Half-day" value={String(stats.half)} subtitle="today" icon={Clock} />
        <StatCard title="On Leave" value={String(stats.leave)} subtitle="today" icon={Calendar} subtitleColor="muted" />
        <StatCard title="Checked-in" value={String(stats.checkedIn)} subtitle="awaiting check-out" icon={Users} />
      </div>

      {lastScan && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold text-foreground">{lastScan.name}</p>
              <p className="text-sm text-muted-foreground">{lastScan.action} at {lastScan.time}</p>
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setLastScan(null)}>Dismiss</Button>
        </div>
      )}

      <div className="bg-card rounded-xl border p-4 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-3">
        <div><Label className="text-xs">From</Label><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
        <div><Label className="text-xs">To</Label><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
        <div className="md:col-span-2">
          <Label className="text-xs">Employee</Label>
          <Select value={empFilter} onValueChange={setEmpFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All employees</SelectItem>
              {employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.name} ({e.id})</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Employee</th>
                <th className="text-left px-4 py-3 font-medium">Dept</th>
                <th className="text-left px-4 py-3 font-medium">Check In</th>
                <th className="text-left px-4 py-3 font-medium">Check Out</th>
                <th className="text-right px-4 py-3 font-medium">Hours</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} className="text-center py-10 text-muted-foreground">Loading…</td></tr>}
              {!loading && entries.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-muted-foreground">No attendance records in this range.</td></tr>}
              {!loading && entries.map((a) => {
                const emp = empMap[a.employeeId];
                return (
                  <tr key={a.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3">{a.date}</td>
                    <td className="px-4 py-3">{emp?.name ?? a.employeeId}<div className="text-xs text-muted-foreground">{a.employeeId}</div></td>
                    <td className="px-4 py-3 text-muted-foreground">{emp?.department ?? "—"}</td>
                    <td className="px-4 py-3">{fmtTime(a.checkIn)}</td>
                    <td className="px-4 py-3">{fmtTime(a.checkOut)}</td>
                    <td className="px-4 py-3 text-right font-medium">{a.hoursWorked ?? "—"}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${statusColor(a.status)}`}>{a.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {scannerOpen && (
        <QrScanner
          fullscreen
          onScan={onScan}
          busy={busy}
          onClose={() => setScannerOpen(false)}
        />
      )}

      {/* Success popup — auto dismisses */}
      <AlertDialog open={!!lastScan} onOpenChange={(o) => !o && setLastScan(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="h-6 w-6" /> Attendance Recorded Successfully
            </AlertDialogTitle>
            <AlertDialogDescription>
              {lastScan && (
                <span className="block space-y-1 mt-2 text-foreground">
                  <span className="block text-lg font-semibold">{lastScan.name}</span>
                  <span className="block text-sm text-muted-foreground">{lastScan.action} at {lastScan.time}</span>
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setLastScan(null)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
