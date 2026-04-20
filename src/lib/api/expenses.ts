import { MOCK_MODE, apiFetch, mockDelay } from "./client";

export const EXPENSE_CATEGORIES = [
  "Office Stationery",
  "Employee Welfare",
  "Salary",
  "Maintenance Spares",
  "Rent",
  "Raw Materials - Wood Powder",
  "Raw Materials - Nappier Grass",
  "Raw Materials - Wood Bark",
  "Raw Materials - Cotton Stalk",
  "Raw Materials - Corn Cob",
  "Other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number] | string;

export interface Expense {
  id: string;
  date: string; // ISO yyyy-mm-dd
  category: string;
  vendor: string;
  description: string;
  amount: number;
  paymentMode: "Cash" | "Bank Transfer" | "UPI" | "Cheque" | "Card";
  billUrl?: string; // uploaded receipt
  createdBy: string;
}

const MOCK: Expense[] = [
  { id: "EXP-001", date: "2025-04-02", category: "Raw Materials - Wood Powder", vendor: "Sri Lakshmi Traders", description: "Wood powder 2 tons", amount: 28500, paymentMode: "Bank Transfer", createdBy: "admin" },
  { id: "EXP-002", date: "2025-04-04", category: "Salary", vendor: "Payroll - April W1", description: "Weekly wages - production", amount: 42000, paymentMode: "Bank Transfer", createdBy: "admin" },
  { id: "EXP-003", date: "2025-04-05", category: "Office Stationery", vendor: "Krishna Stationers", description: "Printer cartridges + paper", amount: 3450, paymentMode: "UPI", createdBy: "admin" },
  { id: "EXP-004", date: "2025-04-08", category: "Maintenance Spares", vendor: "Murugan Engineering", description: "Pelletizer die replacement", amount: 18200, paymentMode: "Cheque", createdBy: "admin" },
  { id: "EXP-005", date: "2025-04-10", category: "Rent", vendor: "Factory Landlord", description: "Monthly factory rent", amount: 45000, paymentMode: "Bank Transfer", createdBy: "admin" },
  { id: "EXP-006", date: "2025-04-12", category: "Raw Materials - Nappier Grass", vendor: "Annamalai Farms", description: "Nappier grass 1.5 tons", amount: 9800, paymentMode: "Cash", createdBy: "admin" },
  { id: "EXP-007", date: "2025-04-14", category: "Employee Welfare", vendor: "Annapoorna Mess", description: "Lunch catering 2 weeks", amount: 12600, paymentMode: "UPI", createdBy: "admin" },
  { id: "EXP-008", date: "2025-04-15", category: "Raw Materials - Cotton Stalk", vendor: "Erode Agro Suppliers", description: "Cotton stalk procurement", amount: 15400, paymentMode: "Bank Transfer", createdBy: "admin" },
];

let store = [...MOCK];

export const expensesApi = {
  async list(): Promise<Expense[]> {
    if (MOCK_MODE) { await mockDelay(); return [...store].sort((a, b) => b.date.localeCompare(a.date)); }
    return apiFetch<Expense[]>("/expenses");
  },
  async create(input: Omit<Expense, "id" | "createdBy">): Promise<Expense> {
    if (MOCK_MODE) {
      await mockDelay();
      const created: Expense = { ...input, id: `EXP-${String(store.length + 1).padStart(3, "0")}`, createdBy: "admin" };
      store = [created, ...store];
      return created;
    }
    return apiFetch<Expense>("/expenses", { method: "POST", body: JSON.stringify(input) });
  },
  async update(id: string, patch: Partial<Expense>): Promise<Expense> {
    if (MOCK_MODE) {
      await mockDelay();
      store = store.map((e) => (e.id === id ? { ...e, ...patch } : e));
      return store.find((e) => e.id === id)!;
    }
    return apiFetch<Expense>(`/expenses/${id}`, { method: "PUT", body: JSON.stringify(patch) });
  },
  async remove(id: string): Promise<void> {
    if (MOCK_MODE) { await mockDelay(); store = store.filter((e) => e.id !== id); return; }
    await apiFetch<void>(`/expenses/${id}`, { method: "DELETE" });
  },
};
