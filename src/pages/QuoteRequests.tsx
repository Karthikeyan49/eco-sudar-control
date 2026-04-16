import { Search, Eye, CheckCircle, Clock, IndianRupee, Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface QuoteRequest {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  date: string;
  product: string;
  quantityPerMonth: string;
  currentFuel: string;
  currentCost: string;
  biomassCost: string;
  monthlySavings: string;
  annualSavings: string;
  status: "New" | "Contacted" | "Quoted" | "Closed";
  adminNotes: string;
  quotedPrice: string;
}

const initialQuotes: QuoteRequest[] = [
  {
    id: "QTE-001", customerName: "Ravi Kumar", phone: "+91 98765 43210", email: "ravi@example.com",
    date: "2024-12-15", product: "Biomass Pellets", quantityPerMonth: "283 kg/month",
    currentFuel: "LPG", currentCost: "₹8,500/month", biomassCost: "₹3,967/month",
    monthlySavings: "₹4,533/month", annualSavings: "₹54,400/year",
    status: "New", adminNotes: "", quotedPrice: "",
  },
  {
    id: "QTE-002", customerName: "Priya Sharma", phone: "+91 87654 32100", email: "priya@example.com",
    date: "2024-12-14", product: "Biomass Pellets", quantityPerMonth: "500 kg/month",
    currentFuel: "LPG", currentCost: "₹15,000/month", biomassCost: "₹7,000/month",
    monthlySavings: "₹8,000/month", annualSavings: "₹96,000/year",
    status: "Contacted", adminNotes: "Called customer, interested in bulk pricing", quotedPrice: "",
  },
  {
    id: "QTE-003", customerName: "Suresh Babu", phone: "+91 76543 21000", email: "suresh@example.com",
    date: "2024-12-12", product: "Biomass Pellets", quantityPerMonth: "150 kg/month",
    currentFuel: "LPG", currentCost: "₹4,500/month", biomassCost: "₹2,100/month",
    monthlySavings: "₹2,400/month", annualSavings: "₹28,800/year",
    status: "Quoted", adminNotes: "Sent quote at ₹13.50/kg with free delivery", quotedPrice: "₹13.50/kg",
  },
  {
    id: "QTE-004", customerName: "Meena Devi", phone: "+91 65432 10000", email: "meena@example.com",
    date: "2024-12-10", product: "Biomass Pellets", quantityPerMonth: "1000 kg/month",
    currentFuel: "LPG", currentCost: "₹30,000/month", biomassCost: "₹14,000/month",
    monthlySavings: "₹16,000/month", annualSavings: "₹1,92,000/year",
    status: "Closed", adminNotes: "Order placed — ORD-2024-160", quotedPrice: "₹12/kg",
  },
];

const statusColors: Record<string, string> = {
  "New": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Contacted": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "Quoted": "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
  "Closed": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

export default function QuoteRequests() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>(initialQuotes);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewQuote, setViewQuote] = useState<QuoteRequest | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState<QuoteRequest["status"]>("New");
  const [editQuotedPrice, setEditQuotedPrice] = useState("");

  const filtered = quotes.filter(q => {
    const matchSearch = q.customerName.toLowerCase().includes(search.toLowerCase()) ||
      q.id.toLowerCase().includes(search.toLowerCase()) ||
      q.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || q.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openView = (q: QuoteRequest) => {
    setViewQuote(q);
    setEditNotes(q.adminNotes);
    setEditStatus(q.status);
    setEditQuotedPrice(q.quotedPrice);
  };

  const handleUpdate = () => {
    if (!viewQuote) return;
    setQuotes(prev => prev.map(q =>
      q.id === viewQuote.id ? { ...q, adminNotes: editNotes, status: editStatus, quotedPrice: editQuotedPrice } : q
    ));
    toast.success(`Quote ${viewQuote.id} updated`);
    setViewQuote(null);
  };

  const counts = {
    All: quotes.length,
    New: quotes.filter(q => q.status === "New").length,
    Contacted: quotes.filter(q => q.status === "Contacted").length,
    Quoted: quotes.filter(q => q.status === "Quoted").length,
    Closed: quotes.filter(q => q.status === "Closed").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-card-foreground">Quote Requests</h1>
        <p className="text-muted-foreground text-sm mt-1">Custom quotes requested from the Savings Calculator in the mobile app</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["All", "New", "Contacted", "Quoted", "Closed"] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
              filterStatus === s
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:bg-muted"
            }`}
          >
            {s} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by name, ID, or email..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-3 font-medium text-muted-foreground">Quote ID</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Customer</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Product</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Qty/Month</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Monthly Savings</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(q => (
                <tr key={q.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-mono text-xs text-primary">{q.id}</td>
                  <td className="p-3">
                    <div className="font-medium text-card-foreground">{q.customerName}</div>
                    <div className="text-xs text-muted-foreground">{q.phone}</div>
                  </td>
                  <td className="p-3 text-card-foreground">{q.product}</td>
                  <td className="p-3 text-card-foreground">{q.quantityPerMonth}</td>
                  <td className="p-3 font-medium text-emerald-400">{q.monthlySavings}</td>
                  <td className="p-3 text-muted-foreground">{q.date}</td>
                  <td className="p-3">
                    <Badge variant="outline" className={statusColors[q.status]}>{q.status}</Badge>
                  </td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm" onClick={() => openView(q)}>
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No quote requests found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Dialog */}
      <Dialog open={!!viewQuote} onOpenChange={open => !open && setViewQuote(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" /> {viewQuote?.id}
            </DialogTitle>
            <DialogDescription>Quote request from Savings Calculator</DialogDescription>
          </DialogHeader>
          {viewQuote && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {/* Customer info */}
              <div className="bg-muted/30 rounded-lg p-4 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span className="text-card-foreground font-medium">{viewQuote.customerName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="text-card-foreground">{viewQuote.phone}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-card-foreground">{viewQuote.email}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="text-card-foreground">{viewQuote.date}</span></div>
              </div>

              {/* Savings breakdown */}
              <div className="border border-border rounded-lg p-4 space-y-2 text-sm">
                <h4 className="font-semibold text-card-foreground mb-2">Savings Calculator Results</h4>
                <div className="flex justify-between"><span className="text-muted-foreground">Product</span><span className="text-card-foreground">{viewQuote.product}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Quantity</span><span className="text-card-foreground">{viewQuote.quantityPerMonth}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Current Fuel</span><span className="text-card-foreground">{viewQuote.currentFuel}</span></div>
                <div className="border-t border-border my-2" />
                <div className="flex justify-between"><span className="text-muted-foreground">Current ({viewQuote.currentFuel}) Cost</span><span className="text-card-foreground">{viewQuote.currentCost}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">With Biomass Pellets</span><span className="text-card-foreground">{viewQuote.biomassCost}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Monthly Savings</span><span className="text-emerald-400 font-semibold">{viewQuote.monthlySavings}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Annual Savings</span><span className="text-emerald-400 font-semibold">{viewQuote.annualSavings}</span></div>
              </div>

              {/* Admin actions */}
              <div>
                <label className="text-sm font-medium text-card-foreground">Quoted Price</label>
                <Input value={editQuotedPrice} onChange={e => setEditQuotedPrice(e.target.value)} placeholder="e.g. ₹13.50/kg" className="mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground">Admin Notes</label>
                <Textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} placeholder="Add notes about this quote..." className="mt-1" rows={3} />
              </div>

              <div>
                <label className="text-sm font-medium text-card-foreground">Update Status</label>
                <Select value={editStatus} onValueChange={v => setEditStatus(v as QuoteRequest["status"])}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="Quoted">Quoted</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewQuote(null)}>Cancel</Button>
            <Button onClick={handleUpdate}>Save & Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
