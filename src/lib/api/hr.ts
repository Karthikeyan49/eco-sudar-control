/**
 * Attendance & Payroll API – mock-mode.
 *
 * Future endpoints:
 *   GET    /api/employees
 *   POST   /api/employees
 *   PATCH  /api/employees/:id
 *   DELETE /api/employees/:id
 *   GET    /api/employees/:id/qr      → returns { token, payload }
 *   GET    /api/attendance?from&to&employeeId
 *   POST   /api/attendance/scan       { token, kind: "in"|"out" }
 *   GET    /api/payroll?month=YYYY-MM
 *   POST   /api/payroll/run           { month: "YYYY-MM" }
 */
import { MOCK_MODE, apiFetch, mockDelay } from "./client";

export type Department = "Production" | "Quality" | "Sales" | "Admin" | "Dispatch" | "Maintenance";

export interface Employee {
  id: string;            // EMP-001
  name: string;
  email: string;
  phone: string;
  department: Department;
  designation: string;
  baseSalary: number;    // monthly gross
  joinedAt: string;
  qrToken: string;       // unique token embedded in QR
  active: boolean;
}

export interface AttendanceEntry {
  id: string;
  employeeId: string;
  date: string;          // YYYY-MM-DD
  checkIn?: string;      // ISO
  checkOut?: string;     // ISO
  hoursWorked?: number;
  status: "Present" | "Half-day" | "Absent" | "Leave";
}

export interface Payslip {
  employeeId: string;
  employeeName: string;
  designation: string;
  month: string;         // YYYY-MM
  workingDays: number;
  presentDays: number;
  leaves: number;
  baseSalary: number;
  earnedSalary: number;
  hra: number;
  allowances: number;
  pf: number;
  professionalTax: number;
  deductions: number;
  netPay: number;
}

const DEPARTMENTS: Department[] = ["Production", "Quality", "Sales", "Admin", "Dispatch", "Maintenance"];

let MOCK_EMPLOYEES: Employee[] = [
  { id: "EMP-001", name: "Arun Prakash", email: "arun@ecosudar.in", phone: "+91 98400 11122", department: "Production", designation: "Shift Supervisor", baseSalary: 32000, joinedAt: "2023-04-12", qrToken: "ESD-AP-001-7Q9X", active: true },
  { id: "EMP-002", name: "Divya Ramesh", email: "divya@ecosudar.in", phone: "+91 98400 22334", department: "Quality", designation: "QC Engineer", baseSalary: 38000, joinedAt: "2022-11-05", qrToken: "ESD-DR-002-K2M4", active: true },
  { id: "EMP-003", name: "Karthik S", email: "karthik@ecosudar.in", phone: "+91 99520 11445", department: "Dispatch", designation: "Logistics Lead", baseSalary: 28000, joinedAt: "2024-01-18", qrToken: "ESD-KS-003-B8N1", active: true },
  { id: "EMP-004", name: "Meena Lakshmi", email: "meena@ecosudar.in", phone: "+91 90030 55778", department: "Sales", designation: "Field Sales", baseSalary: 26000, joinedAt: "2023-09-22", qrToken: "ESD-ML-004-Z3P7", active: true },
  { id: "EMP-005", name: "Suresh Kumar", email: "suresh@ecosudar.in", phone: "+91 90420 88991", department: "Maintenance", designation: "Mechanical Tech", baseSalary: 30000, joinedAt: "2022-06-30", qrToken: "ESD-SK-005-V6T2", active: true },
];

// Build mock attendance for last 30 days
function buildMockAttendance(): AttendanceEntry[] {
  const entries: AttendanceEntry[] = [];
  const today = new Date();
  for (let d = 29; d >= 0; d--) {
    const day = new Date(today.getTime() - d * 86400000);
    const dateStr = day.toISOString().slice(0, 10);
    const isSunday = day.getDay() === 0;
    MOCK_EMPLOYEES.forEach((emp) => {
      if (isSunday) return;
      const rand = Math.random();
      let status: AttendanceEntry["status"] = "Present";
      let hours: number | undefined = 8 + Math.random() * 1.2;
      if (rand < 0.05) { status = "Absent"; hours = undefined; }
      else if (rand < 0.12) { status = "Half-day"; hours = 4 + Math.random(); }
      else if (rand < 0.16) { status = "Leave"; hours = undefined; }
      const inT = new Date(day); inT.setHours(9, Math.floor(Math.random() * 25));
      const outT = hours ? new Date(inT.getTime() + hours * 3600000) : undefined;
      entries.push({
        id: `ATT-${emp.id}-${dateStr}`,
        employeeId: emp.id,
        date: dateStr,
        checkIn: status === "Absent" || status === "Leave" ? undefined : inT.toISOString(),
        checkOut: outT?.toISOString(),
        hoursWorked: hours ? Math.round(hours * 10) / 10 : undefined,
        status,
      });
    });
  }
  return entries;
}

let MOCK_ATTENDANCE: AttendanceEntry[] = buildMockAttendance();

const todayStr = () => new Date().toISOString().slice(0, 10);
const nextEmpId = () => `EMP-${String(MOCK_EMPLOYEES.length + 1).padStart(3, "0")}`;
const genToken = (name: string) => {
  const initials = name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
  const rand = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
  return `ESD-${initials}-${String(MOCK_EMPLOYEES.length + 1).padStart(3, "0")}-${rand}`;
};

export const employeesApi = {
  async list(): Promise<Employee[]> {
    if (MOCK_MODE) { await mockDelay(); return [...MOCK_EMPLOYEES]; }
    return apiFetch<Employee[]>("/employees");
  },
  async create(data: Omit<Employee, "id" | "qrToken">): Promise<Employee> {
    if (MOCK_MODE) {
      await mockDelay();
      const e: Employee = { ...data, id: nextEmpId(), qrToken: genToken(data.name) };
      MOCK_EMPLOYEES.push(e); return e;
    }
    return apiFetch<Employee>("/employees", { method: "POST", body: JSON.stringify(data) });
  },
  async update(id: string, patch: Partial<Employee>): Promise<Employee> {
    if (MOCK_MODE) {
      await mockDelay();
      MOCK_EMPLOYEES = MOCK_EMPLOYEES.map((e) => (e.id === id ? { ...e, ...patch } : e));
      return MOCK_EMPLOYEES.find((e) => e.id === id)!;
    }
    return apiFetch<Employee>(`/employees/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
  },
  async remove(id: string): Promise<void> {
    if (MOCK_MODE) { await mockDelay(); MOCK_EMPLOYEES = MOCK_EMPLOYEES.filter((e) => e.id !== id); return; }
    await apiFetch<void>(`/employees/${id}`, { method: "DELETE" });
  },
};

export const attendanceApi = {
  async list(params?: { from?: string; to?: string; employeeId?: string }): Promise<AttendanceEntry[]> {
    if (MOCK_MODE) {
      await mockDelay();
      return MOCK_ATTENDANCE.filter((a) => {
        if (params?.employeeId && a.employeeId !== params.employeeId) return false;
        if (params?.from && a.date < params.from) return false;
        if (params?.to && a.date > params.to) return false;
        return true;
      }).sort((a, b) => b.date.localeCompare(a.date));
    }
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return apiFetch<AttendanceEntry[]>(`/attendance?${qs}`);
  },

  /** Resolve a scanned QR token into an employee, then mark in/out */
  async scan(token: string): Promise<{ employee: Employee; entry: AttendanceEntry; action: "checked-in" | "checked-out" }> {
    if (MOCK_MODE) {
      await mockDelay(150);
      const emp = MOCK_EMPLOYEES.find((e) => e.qrToken === token.trim());
      if (!emp) throw new Error("Invalid QR token");
      if (!emp.active) throw new Error("Employee is inactive");
      const date = todayStr();
      let entry = MOCK_ATTENDANCE.find((a) => a.employeeId === emp.id && a.date === date);
      const now = new Date().toISOString();
      let action: "checked-in" | "checked-out";
      if (!entry) {
        entry = { id: `ATT-${emp.id}-${date}`, employeeId: emp.id, date, checkIn: now, status: "Present" };
        MOCK_ATTENDANCE.unshift(entry);
        action = "checked-in";
      } else if (!entry.checkOut) {
        entry.checkOut = now;
        const hours = (new Date(now).getTime() - new Date(entry.checkIn!).getTime()) / 3600000;
        entry.hoursWorked = Math.round(hours * 10) / 10;
        entry.status = hours < 5 ? "Half-day" : "Present";
        action = "checked-out";
      } else {
        throw new Error("Already checked out for today");
      }
      return { employee: emp, entry, action };
    }
    return apiFetch("/attendance/scan", { method: "POST", body: JSON.stringify({ token }) });
  },
};

/** Working days in given YYYY-MM (excludes Sundays) */
export function workingDaysInMonth(month: string): number {
  const [y, m] = month.split("-").map(Number);
  const lastDay = new Date(y, m, 0).getDate();
  let count = 0;
  for (let d = 1; d <= lastDay; d++) {
    if (new Date(y, m - 1, d).getDay() !== 0) count++;
  }
  return count;
}

export const payrollApi = {
  /** Compute payroll for all employees for the given month from attendance */
  async run(month: string): Promise<Payslip[]> {
    if (MOCK_MODE) {
      await mockDelay();
      const workingDays = workingDaysInMonth(month);
      const monthEntries = MOCK_ATTENDANCE.filter((a) => a.date.startsWith(month));
      return MOCK_EMPLOYEES.map((emp) => {
        const empEntries = monthEntries.filter((a) => a.employeeId === emp.id);
        const present = empEntries.filter((a) => a.status === "Present").length
                      + empEntries.filter((a) => a.status === "Half-day").length * 0.5;
        const leaves = empEntries.filter((a) => a.status === "Leave").length;
        const earnedSalary = Math.round((emp.baseSalary / workingDays) * present);
        const hra = Math.round(emp.baseSalary * 0.10);
        const allowances = Math.round(emp.baseSalary * 0.05);
        const pf = Math.round(emp.baseSalary * 0.12);
        const professionalTax = 200;
        const deductions = pf + professionalTax;
        const netPay = earnedSalary + hra + allowances - deductions;
        return {
          employeeId: emp.id, employeeName: emp.name, designation: emp.designation, month,
          workingDays, presentDays: present, leaves,
          baseSalary: emp.baseSalary, earnedSalary, hra, allowances,
          pf, professionalTax, deductions, netPay,
        };
      });
    }
    return apiFetch<Payslip[]>("/payroll/run", { method: "POST", body: JSON.stringify({ month }) });
  },
};

export { DEPARTMENTS };
