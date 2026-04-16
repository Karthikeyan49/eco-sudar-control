import { Plus, Edit, Trash2, X, GripVertical, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  active: boolean;
}

const initialFaqs: FAQ[] = [
  { id: 1, question: "What is the minimum order quantity?", answer: "The minimum order quantity varies by product. For pellets, it is 5kg. For stoves and burners, you can order a single unit.", active: true },
  { id: 2, question: "How long does delivery take?", answer: "Delivery typically takes 3-5 business days within Tamil Nadu and 5-7 business days for other states. Express delivery is available for select locations.", active: true },
  { id: 3, question: "What is the GCV of your pellets?", answer: "Our biomass pellets have a Gross Calorific Value (GCV) of 4000-4200 kcal/kg, making them highly efficient for industrial and commercial use.", active: true },
  { id: 4, question: "Do you offer bulk discounts?", answer: "Yes, we offer tiered discounts for bulk orders. Orders above 500kg get 10% off, and orders above 1000kg get 15% off. Contact our sales team for custom pricing.", active: true },
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editFaq, setEditFaq] = useState<FAQ | null>(null);
  const [form, setForm] = useState({ question: "", answer: "" });

  const openAdd = () => {
    setEditFaq(null);
    setForm({ question: "", answer: "" });
    setDialogOpen(true);
  };

  const openEdit = (faq: FAQ) => {
    setEditFaq(faq);
    setForm({ question: faq.question, answer: faq.answer });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Both question and answer are required");
      return;
    }
    if (editFaq) {
      setFaqs(prev => prev.map(f => f.id === editFaq.id ? { ...f, ...form } : f));
      toast.success("FAQ updated successfully");
    } else {
      setFaqs(prev => [...prev, { id: Date.now(), question: form.question, answer: form.answer, active: true }]);
      toast.success("FAQ added successfully");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
    toast.success("FAQ deleted");
  };

  const toggleActive = (id: number) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, active: !f.active } : f));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFaqs(prev => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
  };

  const moveDown = (index: number) => {
    if (index === faqs.length - 1) return;
    setFaqs(prev => {
      const arr = [...prev];
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      return arr;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">FAQ Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage frequently asked questions shown in the mobile app</p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus className="h-4 w-4" /> Add FAQ
        </Button>
      </div>

      {/* FAQ list */}
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={faq.id} className={`bg-card rounded-xl border border-border p-4 transition-opacity ${!faq.active ? "opacity-50" : ""}`}>
            <div className="flex items-start gap-3">
              <div className="flex flex-col gap-1 mt-1">
                <button onClick={() => moveUp(index)} className="text-muted-foreground hover:text-card-foreground p-0.5" disabled={index === 0}>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                </button>
                <button onClick={() => moveDown(index)} className="text-muted-foreground hover:text-card-foreground p-0.5" disabled={index === faqs.length - 1}>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                  <h3 className="font-medium text-card-foreground">{faq.question}</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-6">{faq.answer}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Switch checked={faq.active} onCheckedChange={() => toggleActive(faq.id)} />
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(faq)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete FAQ?</AlertDialogTitle>
                      <AlertDialogDescription>This will remove the FAQ from the mobile app.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(faq.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
        {faqs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
            No FAQs added yet. Click "Add FAQ" to create one.
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editFaq ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
            <DialogDescription>{editFaq ? "Update the question and answer" : "Add a new FAQ for the mobile app"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-card-foreground">Question *</label>
              <Input value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} placeholder="e.g. What is the minimum order quantity?" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground">Answer *</label>
              <Textarea value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} placeholder="Type the answer..." className="mt-1" rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editFaq ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
