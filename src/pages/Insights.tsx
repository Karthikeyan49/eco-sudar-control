import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Activity, Loader2, RefreshCw, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useRegisterChatContext } from "@/contexts/ChatContext";

type Tab = "sales" | "expenses" | "employees" | "production";

interface InsightItem { title: string; detail: string; }
interface InsightsResult {
  recommendations: InsightItem[];
  improvements: InsightItem[];
  criticalIssues: InsightItem[];
  performanceMetrics: InsightItem[];
  generatedAt: string;
}

const TABS: { key: Tab; label: string; description: string }[] = [
  { key: "sales", label: "Sales", description: "Revenue trends, top SKUs, churn risk" },
  { key: "expenses", label: "Expenses", description: "Spend leaks, vendor concentration, anomalies" },
  { key: "employees", label: "Employees", description: "Attendance, productivity, payroll efficiency" },
  { key: "production", label: "Production", description: "Throughput, downtime, raw-material yield" },
];

const STORAGE_KEY = "eco_insights_cache_v1";

// Demo placeholder content shown until the `generate-insights` edge function is wired up.
const DEMO: Record<Tab, InsightsResult> = {
  sales: {
    recommendations: [
      { title: "Push Briquettes to GreenLeaf", detail: "GreenLeaf's order velocity has increased 32% MoM — propose a 6-month volume contract." },
    ],
    improvements: [
      { title: "Shorten payment cycles", detail: "Average collection is 47 days. Offer a 1.5% early-payment discount to bring it under 30." },
    ],
    criticalIssues: [
      { title: "Overdue: Sri Krishna Industries", detail: "₹67,260 invoice INV-0003 is 18 days overdue. Escalate this week." },
    ],
    performanceMetrics: [
      { title: "Conversion rate", detail: "Quote→Invoice conversion stands at 64%, up from 58% last quarter." },
    ],
    generatedAt: "Demo data — connect Lovable Cloud for live AI-generated insights.",
  },
  expenses: {
    recommendations: [{ title: "Switch wood-powder vendor", detail: "Sri Lakshmi Traders is 12% above market. Solicit 2 alternate quotes." }],
    improvements: [{ title: "Consolidate small UPI payments", detail: "23 sub-₹500 expenses last month. Pre-fund a petty-cash float instead." }],
    criticalIssues: [{ title: "Maintenance spike", detail: "Pelletizer die replacements 3× more frequent than design spec — investigate root cause." }],
    performanceMetrics: [{ title: "Raw material share", detail: "Raw materials are 41% of total spend, healthy for current output." }],
    generatedAt: "Demo data — connect Lovable Cloud for live AI-generated insights.",
  },
  employees: {
    recommendations: [{ title: "Cross-train Line A", detail: "2 operators carry 68% of Line A shifts — single-point failure risk." }],
    improvements: [{ title: "Reduce half-days", detail: "Half-day rate is 11% on Mondays. Adjust shift start to 9:30." }],
    criticalIssues: [{ title: "Overtime breach", detail: "3 employees exceeded 60h/week last cycle — labour-law exposure." }],
    performanceMetrics: [{ title: "Attendance", detail: "Average attendance 92% across the last 30 days." }],
    generatedAt: "Demo data — connect Lovable Cloud for live AI-generated insights.",
  },
  production: {
    recommendations: [{ title: "Run Line B at night", detail: "Line B utilisation is only 54%. Add a night shift to absorb pellet backlog." }],
    improvements: [{ title: "Tighten moisture spec", detail: "Briquette rejects spike when wood-powder moisture > 14%." }],
    criticalIssues: [{ title: "QC hold: PRD-503", detail: "4,500 kg batch in QC for 2 days — blocks dispatch to Bharat Bio." }],
    performanceMetrics: [{ title: "Yield", detail: "Overall yield 87.4%, on target for the quarter." }],
    generatedAt: "Demo data — connect Lovable Cloud for live AI-generated insights.",
  },
};

export default function Insights() {
  const [tab, setTab] = useState<Tab>("sales");
  const [busy, setBusy] = useState<Tab | "all" | null>(null);
  const [results, setResults] = useState<Partial<Record<Tab, InsightsResult>>>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"); } catch { return {}; }
  });

  const register = useRegisterChatContext();
  useEffect(() => register({
    page: "AI Insights",
    summary: `Tab: ${tab}`,
    data: results[tab],
  }), [register, tab, results]);

  const persist = (next: Partial<Record<Tab, InsightsResult>>) => {
    setResults(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore quota */ }
  };

  const generate = async (which: Tab | "all") => {
    setBusy(which);
    try {
      // TODO: Once Lovable Cloud is enabled, call the `generate-insights`
      // edge function which aggregates expensesApi/employeesApi/etc., sends
      // a structured-output tool call to the Lovable AI Gateway and returns
      // a real InsightsResult per category.
      await new Promise((r) => setTimeout(r, 700));
      const targets: Tab[] = which === "all" ? TABS.map((t) => t.key) : [which];
      const next = { ...results };
      for (const t of targets) next[t] = DEMO[t];
      persist(next);
      toast.success(which === "all" ? "All insights generated (demo)" : `${which} insights ready (demo)`);
    } catch (e: any) {
      toast.error(e?.message ?? "Could not generate insights");
    } finally {
      setBusy(null);
    }
  };

  const result = results[tab];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" /> AI Insights
          </h1>
          <p className="text-muted-foreground">
            Cross-module recommendations, risks and metrics — powered by Lovable AI.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => generate("all")} disabled={!!busy}>
            {busy === "all" ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
            Generate All
          </Button>
        </div>
      </div>

      <div className="rounded-xl border-l-4 border-l-primary bg-primary/5 p-4 text-sm">
        <p className="font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> Backend not connected
        </p>
        <p className="text-muted-foreground mt-1">
          Showing demo insights. Enable <strong>Lovable Cloud</strong> to deploy the
          <code className="mx-1 px-1.5 py-0.5 rounded bg-background border text-xs">generate-insights</code>
          edge function and get live AI analysis of your real data.
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          {TABS.map((t) => (
            <TabsTrigger key={t.key} value={t.key}>{t.label}</TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((t) => (
          <TabsContent key={t.key} value={t.key} className="space-y-4 mt-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{t.label}</h2>
                <p className="text-sm text-muted-foreground">{t.description}</p>
              </div>
              <Button onClick={() => generate(t.key)} disabled={!!busy}>
                {busy === t.key ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                {results[t.key] ? "Regenerate" : "Generate Insights"}
              </Button>
            </div>

            {!result && t.key === tab && (
              <div className="rounded-xl border border-dashed bg-card p-10 text-center text-muted-foreground">
                Click <strong>Generate Insights</strong> to analyse your {t.label.toLowerCase()} data.
              </div>
            )}

            {result && t.key === tab && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <InsightSection
                  title="Recommendations"
                  icon={<Lightbulb className="h-4 w-4" />}
                  tone="recommendation"
                  items={result.recommendations}
                />
                <InsightSection
                  title="Areas of Improvement"
                  icon={<TrendingUp className="h-4 w-4" />}
                  tone="improvement"
                  items={result.improvements}
                />
                <InsightSection
                  title="Critical Issues"
                  icon={<AlertTriangle className="h-4 w-4" />}
                  tone="critical"
                  items={result.criticalIssues}
                />
                <InsightSection
                  title="Performance Metrics"
                  icon={<Activity className="h-4 w-4" />}
                  tone="metric"
                  items={result.performanceMetrics}
                />
              </div>
            )}

            {result && t.key === tab && (
              <p className="text-xs text-muted-foreground italic">{result.generatedAt}</p>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function InsightSection({
  title, icon, tone, items,
}: {
  title: string;
  icon: React.ReactNode;
  tone: "recommendation" | "improvement" | "critical" | "metric";
  items: InsightItem[];
}) {
  const toneClasses: Record<typeof tone, string> = {
    recommendation: "border-l-primary bg-primary/5",
    improvement: "border-l-amber-500 bg-amber-500/5",
    critical: "border-l-destructive bg-destructive/5",
    metric: "border-l-blue-500 bg-blue-500/5",
  } as const;
  const badgeClasses: Record<typeof tone, string> = {
    recommendation: "bg-primary/15 text-primary",
    improvement: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    critical: "bg-destructive/15 text-destructive",
    metric: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  } as const;

  return (
    <div className={`rounded-xl border border-l-4 ${toneClasses[tone]} p-5 space-y-3`}>
      <div className="flex items-center gap-2 font-semibold text-foreground">
        <span className={`p-1.5 rounded-md ${badgeClasses[tone]}`}>{icon}</span>
        {title}
        <span className="text-xs text-muted-foreground font-normal">({items.length})</span>
      </div>
      <ul className="space-y-2.5">
        {items.length === 0 && <li className="text-sm text-muted-foreground italic">Nothing to flag.</li>}
        {items.map((it, i) => (
          <li key={i} className="text-sm">
            <p className="font-medium text-foreground">{it.title}</p>
            <p className="text-muted-foreground">{it.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
