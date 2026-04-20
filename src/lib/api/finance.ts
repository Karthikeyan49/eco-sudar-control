/**
 * Finance API – P&L summary, monthly performance and financial ratios.
 * Mock-mode data for now; backend endpoints described in API spec.
 *
 * Future endpoints:
 *   GET /api/finance/pnl?from=YYYY-MM-DD&to=YYYY-MM-DD
 *   GET /api/finance/ratios?period=YYYY-MM
 *   GET /api/finance/monthly?year=YYYY
 */
import { MOCK_MODE, apiFetch, mockDelay } from "./client";

export interface MonthlyPoint {
  month: string; // YYYY-MM
  revenue: number;
  expenses: number;
  profit: number;
}

export interface ExpenseSlice {
  category: string;
  amount: number;
}

export interface PnLSummary {
  periodFrom: string;
  periodTo: string;
  revenue: number;
  expenses: number;
  grossProfit: number;
  netProfit: number;
  taxes: number;
  monthly: MonthlyPoint[];
  expenseBreakdown: ExpenseSlice[];
  revenueBreakdown: { source: string; amount: number }[];
}

export interface FinancialRatios {
  profitMargin: number;        // Net Profit / Revenue
  expenseRatio: number;        // Expenses / Revenue
  roi: number;                 // Net Profit / Investment
  currentRatio: number;        // Current Assets / Current Liabilities
  grossMargin: number;
  operatingMargin: number;
  currentAssets: number;
  currentLiabilities: number;
  investment: number;
}

const MOCK_MONTHLY: MonthlyPoint[] = [
  { month: "2024-11", revenue: 845000, expenses: 612000, profit: 233000 },
  { month: "2024-12", revenue: 920000, expenses: 690000, profit: 230000 },
  { month: "2025-01", revenue: 760000, expenses: 580000, profit: 180000 },
  { month: "2025-02", revenue: 880000, expenses: 645000, profit: 235000 },
  { month: "2025-03", revenue: 1020000, expenses: 720000, profit: 300000 },
  { month: "2025-04", revenue: 1150000, expenses: 810000, profit: 340000 },
];

const MOCK_EXPENSES: ExpenseSlice[] = [
  { category: "Raw Materials", amount: 1850000 },
  { category: "Salary", amount: 980000 },
  { category: "Maintenance Spares", amount: 320000 },
  { category: "Rent", amount: 240000 },
  { category: "Office Stationery", amount: 78000 },
  { category: "Employee Welfare", amount: 142000 },
];

const MOCK_REVENUE: { source: string; amount: number }[] = [
  { source: "Direct Sales", amount: 3120000 },
  { source: "Dealer Network", amount: 1840000 },
  { source: "B2B Orders", amount: 1295000 },
  { source: "Online Store", amount: 320000 },
];

function buildSummary(): PnLSummary {
  const revenue = MOCK_MONTHLY.reduce((s, m) => s + m.revenue, 0);
  const expenses = MOCK_MONTHLY.reduce((s, m) => s + m.expenses, 0);
  const grossProfit = revenue - expenses;
  const taxes = Math.round(grossProfit * 0.18);
  const netProfit = grossProfit - taxes;
  return {
    periodFrom: MOCK_MONTHLY[0].month + "-01",
    periodTo: MOCK_MONTHLY[MOCK_MONTHLY.length - 1].month + "-30",
    revenue, expenses, grossProfit, netProfit, taxes,
    monthly: MOCK_MONTHLY,
    expenseBreakdown: MOCK_EXPENSES,
    revenueBreakdown: MOCK_REVENUE,
  };
}

function buildRatios(s: PnLSummary): FinancialRatios {
  const investment = 4500000;
  const currentAssets = 2850000;
  const currentLiabilities = 1320000;
  return {
    profitMargin: s.netProfit / s.revenue,
    expenseRatio: s.expenses / s.revenue,
    roi: s.netProfit / investment,
    currentRatio: currentAssets / currentLiabilities,
    grossMargin: s.grossProfit / s.revenue,
    operatingMargin: (s.grossProfit - s.taxes * 0.4) / s.revenue,
    currentAssets, currentLiabilities, investment,
  };
}

export const financeApi = {
  async pnl(): Promise<PnLSummary> {
    if (MOCK_MODE) { await mockDelay(); return buildSummary(); }
    return apiFetch<PnLSummary>("/finance/pnl");
  },
  async ratios(): Promise<FinancialRatios> {
    if (MOCK_MODE) { await mockDelay(); return buildRatios(buildSummary()); }
    return apiFetch<FinancialRatios>("/finance/ratios");
  },
};
