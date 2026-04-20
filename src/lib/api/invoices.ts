/**
 * GST Invoicing API – mock-mode implementation.
 * Future endpoints:
 *   GET    /api/invoices
 *   POST   /api/invoices
 *   GET    /api/invoices/:id
 *   PATCH  /api/invoices/:id
 *   DELETE /api/invoices/:id
 *   GET    /api/invoices/tax-report?from&to
 */
import { MOCK_MODE, apiFetch, mockDelay } from "./client";

export type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue" | "Cancelled";

export interface InvoiceLine {
  id: string;
  description: string;
  hsn: string;
  qty: number;
  unitPrice: number;       // pre-tax
  gstRate: number;         // 0, 5, 12, 18, 28
}

export interface Invoice {
  id: string;              // INV-0001
  date: string;            // YYYY-MM-DD
  dueDate: string;
  customer: { name: string; gstin?: string; state: string; address: string };
  sellerState: string;     // for intra/inter state detection
  lines: InvoiceLine[];
  notes?: string;
  status: InvoiceStatus;
}

export interface InvoiceTotals {
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
  isInterState: boolean;
}

export const GST_RATES = [0, 5, 12, 18, 28] as const;

export function calcInvoiceTotals(inv: Pick<Invoice, "lines" | "customer" | "sellerState">): InvoiceTotals {
  const isInterState = inv.customer.state.trim().toLowerCase() !== inv.sellerState.trim().toLowerCase();
  let subtotal = 0, cgst = 0, sgst = 0, igst = 0;
  for (const l of inv.lines) {
    const lineSub = l.qty * l.unitPrice;
    const tax = (lineSub * l.gstRate) / 100;
    subtotal += lineSub;
    if (isInterState) igst += tax;
    else { cgst += tax / 2; sgst += tax / 2; }
  }
  const totalTax = cgst + sgst + igst;
  return {
    subtotal: round2(subtotal), cgst: round2(cgst), sgst: round2(sgst),
    igst: round2(igst), totalTax: round2(totalTax),
    grandTotal: round2(subtotal + totalTax), isInterState,
  };
}

const round2 = (n: number) => Math.round(n * 100) / 100;

let MOCK: Invoice[] = [
  {
    id: "INV-0001", date: "2025-04-02", dueDate: "2025-04-17", status: "Paid",
    sellerState: "Tamil Nadu",
    customer: { name: "GreenLeaf Distributors", gstin: "33ABCDE1234F1Z5", state: "Tamil Nadu", address: "12 Anna Salai, Chennai" },
    lines: [
      { id: "l1", description: "Cotton-stalk briquettes 25kg", hsn: "44013100", qty: 40, unitPrice: 480, gstRate: 5 },
      { id: "l2", description: "Wood-bark pellets 30kg", hsn: "44013900", qty: 25, unitPrice: 720, gstRate: 5 },
    ],
  },
  {
    id: "INV-0002", date: "2025-04-08", dueDate: "2025-04-23", status: "Sent",
    sellerState: "Tamil Nadu",
    customer: { name: "Bharat Bio Power Ltd", gstin: "27AAACB2894G1ZA", state: "Maharashtra", address: "Plot 8, MIDC Pune" },
    lines: [
      { id: "l1", description: "Nappier-grass briquettes (1 ton)", hsn: "44013100", qty: 5, unitPrice: 18500, gstRate: 12 },
    ],
  },
  {
    id: "INV-0003", date: "2025-03-22", dueDate: "2025-04-06", status: "Overdue",
    sellerState: "Tamil Nadu",
    customer: { name: "Sri Krishna Industries", gstin: "29AAQCS1234B1Z7", state: "Karnataka", address: "Industrial Area, Hubli" },
    lines: [
      { id: "l1", description: "Corn-cob pellets 40kg", hsn: "44013900", qty: 60, unitPrice: 950, gstRate: 18 },
      { id: "l2", description: "Delivery charges", hsn: "9965", qty: 1, unitPrice: 4500, gstRate: 18 },
    ],
  },
];

const nextId = () => `INV-${String(MOCK.length + 1).padStart(4, "0")}`;

export const invoicesApi = {
  async list(): Promise<Invoice[]> {
    if (MOCK_MODE) { await mockDelay(); return [...MOCK].sort((a, b) => b.date.localeCompare(a.date)); }
    return apiFetch<Invoice[]>("/invoices");
  },
  async create(data: Omit<Invoice, "id">): Promise<Invoice> {
    if (MOCK_MODE) { await mockDelay(); const n: Invoice = { ...data, id: nextId() }; MOCK.push(n); return n; }
    return apiFetch<Invoice>("/invoices", { method: "POST", body: JSON.stringify(data) });
  },
  async update(id: string, patch: Partial<Invoice>): Promise<Invoice> {
    if (MOCK_MODE) {
      await mockDelay();
      MOCK = MOCK.map((i) => (i.id === id ? { ...i, ...patch } : i));
      return MOCK.find((i) => i.id === id)!;
    }
    return apiFetch<Invoice>(`/invoices/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
  },
  async remove(id: string): Promise<void> {
    if (MOCK_MODE) { await mockDelay(); MOCK = MOCK.filter((i) => i.id !== id); return; }
    await apiFetch<void>(`/invoices/${id}`, { method: "DELETE" });
  },
};
