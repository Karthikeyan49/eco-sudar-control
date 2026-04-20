/**
 * Workflow / Traffic Management API – mock-mode.
 *
 * A workflow item moves through stages:
 *   Pending → In Progress → Approved → Completed
 * (or → Rejected at any approval gate)
 *
 * Future endpoints:
 *   GET    /api/workflows
 *   POST   /api/workflows
 *   PATCH  /api/workflows/:id
 *   POST   /api/workflows/:id/transition  { toStage, actorId, note }
 *   DELETE /api/workflows/:id
 */
import { MOCK_MODE, apiFetch, mockDelay } from "./client";

export const WORKFLOW_STAGES = ["Pending", "In Progress", "Approved", "Completed", "Rejected"] as const;
export type WorkflowStage = (typeof WORKFLOW_STAGES)[number];

export const WORKFLOW_TYPES = [
  "Purchase Request",
  "Leave Request",
  "Expense Claim",
  "Production Order",
  "Quality Hold Release",
  "Dispatch Approval",
  "Marketing Campaign",
  "Other",
] as const;
export type WorkflowType = (typeof WORKFLOW_TYPES)[number];

export type WorkflowPriority = "Low" | "Medium" | "High" | "Urgent";

export interface WorkflowEvent {
  id: string;
  at: string;            // ISO
  actorId: string;       // EMP-XXX
  fromStage: WorkflowStage | null;
  toStage: WorkflowStage;
  note?: string;
}

export interface Workflow {
  id: string;            // WF-001
  title: string;
  type: WorkflowType;
  description: string;
  requesterId: string;   // EMP-XXX
  approverId: string;    // EMP-XXX
  priority: WorkflowPriority;
  amount?: number;       // optional monetary value
  dueDate?: string;      // YYYY-MM-DD
  stage: WorkflowStage;
  history: WorkflowEvent[];
  createdAt: string;
  updatedAt: string;
}

const iso = (d = new Date()) => d.toISOString();
const minus = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const plusDays = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString().slice(0, 10);

let MOCK: Workflow[] = [
  {
    id: "WF-001",
    title: "Purchase 500kg sawdust — Vendor Anand Timbers",
    type: "Purchase Request",
    description: "Top-up raw material for next week's production batch.",
    requesterId: "EMP-001", approverId: "EMP-005",
    priority: "High", amount: 18500, dueDate: plusDays(2),
    stage: "In Progress",
    history: [
      { id: "h1", at: minus(48), actorId: "EMP-001", fromStage: null, toStage: "Pending", note: "Submitted." },
      { id: "h2", at: minus(20), actorId: "EMP-005", fromStage: "Pending", toStage: "In Progress", note: "Verifying vendor pricing." },
    ],
    createdAt: minus(48), updatedAt: minus(20),
  },
  {
    id: "WF-002",
    title: "Casual leave — 21 Apr",
    type: "Leave Request",
    description: "Family event.",
    requesterId: "EMP-002", approverId: "EMP-005",
    priority: "Low", dueDate: plusDays(1),
    stage: "Approved",
    history: [
      { id: "h1", at: minus(72), actorId: "EMP-002", fromStage: null, toStage: "Pending", note: "Submitted." },
      { id: "h2", at: minus(60), actorId: "EMP-005", fromStage: "Pending", toStage: "Approved", note: "Approved." },
    ],
    createdAt: minus(72), updatedAt: minus(60),
  },
  {
    id: "WF-003",
    title: "Reimburse fuel — site visit Coimbatore",
    type: "Expense Claim",
    description: "Vehicle log + bills attached.",
    requesterId: "EMP-004", approverId: "EMP-005",
    priority: "Medium", amount: 2400,
    stage: "Pending",
    history: [
      { id: "h1", at: minus(6), actorId: "EMP-004", fromStage: null, toStage: "Pending", note: "Submitted with bills." },
    ],
    createdAt: minus(6), updatedAt: minus(6),
  },
  {
    id: "WF-004",
    title: "Production order #PO-2042",
    type: "Production Order",
    description: "5 ton briquettes for Bharat Bio Power.",
    requesterId: "EMP-003", approverId: "EMP-001",
    priority: "Urgent", dueDate: plusDays(3),
    stage: "Completed",
    history: [
      { id: "h1", at: minus(120), actorId: "EMP-003", fromStage: null, toStage: "Pending", note: "Order placed." },
      { id: "h2", at: minus(110), actorId: "EMP-001", fromStage: "Pending", toStage: "In Progress", note: "Production started." },
      { id: "h3", at: minus(50),  actorId: "EMP-001", fromStage: "In Progress", toStage: "Approved", note: "QC cleared." },
      { id: "h4", at: minus(20),  actorId: "EMP-003", fromStage: "Approved", toStage: "Completed", note: "Dispatched." },
    ],
    createdAt: minus(120), updatedAt: minus(20),
  },
  {
    id: "WF-005",
    title: "Quality hold release — Batch B-118",
    type: "Quality Hold Release",
    description: "Moisture re-tested within spec.",
    requesterId: "EMP-002", approverId: "EMP-005",
    priority: "High",
    stage: "Rejected",
    history: [
      { id: "h1", at: minus(96), actorId: "EMP-002", fromStage: null, toStage: "Pending", note: "Requested release." },
      { id: "h2", at: minus(80), actorId: "EMP-005", fromStage: "Pending", toStage: "Rejected", note: "Density still below threshold — re-process." },
    ],
    createdAt: minus(96), updatedAt: minus(80),
  },
];

const nextId = () => `WF-${String(MOCK.length + 1).padStart(3, "0")}`;
const nextEventId = (wf: Workflow) => `h${wf.history.length + 1}`;

/** Allowed transitions from each stage */
export const ALLOWED_TRANSITIONS: Record<WorkflowStage, WorkflowStage[]> = {
  Pending: ["In Progress", "Approved", "Rejected"],
  "In Progress": ["Approved", "Rejected"],
  Approved: ["Completed", "Rejected"],
  Completed: [],
  Rejected: ["Pending"],
};

export const workflowsApi = {
  async list(): Promise<Workflow[]> {
    if (MOCK_MODE) { await mockDelay(); return [...MOCK].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)); }
    return apiFetch<Workflow[]>("/workflows");
  },
  async create(data: Omit<Workflow, "id" | "stage" | "history" | "createdAt" | "updatedAt">): Promise<Workflow> {
    if (MOCK_MODE) {
      await mockDelay();
      const wf: Workflow = {
        ...data, id: nextId(), stage: "Pending",
        history: [{ id: "h1", at: iso(), actorId: data.requesterId, fromStage: null, toStage: "Pending", note: "Submitted." }],
        createdAt: iso(), updatedAt: iso(),
      };
      MOCK.unshift(wf); return wf;
    }
    return apiFetch<Workflow>("/workflows", { method: "POST", body: JSON.stringify(data) });
  },
  async transition(id: string, toStage: WorkflowStage, actorId: string, note?: string): Promise<Workflow> {
    if (MOCK_MODE) {
      await mockDelay();
      MOCK = MOCK.map((wf) => {
        if (wf.id !== id) return wf;
        const ev: WorkflowEvent = { id: nextEventId(wf), at: iso(), actorId, fromStage: wf.stage, toStage, note };
        return { ...wf, stage: toStage, history: [...wf.history, ev], updatedAt: iso() };
      });
      return MOCK.find((wf) => wf.id === id)!;
    }
    return apiFetch<Workflow>(`/workflows/${id}/transition`, { method: "POST", body: JSON.stringify({ toStage, actorId, note }) });
  },
  async remove(id: string): Promise<void> {
    if (MOCK_MODE) { await mockDelay(); MOCK = MOCK.filter((wf) => wf.id !== id); return; }
    await apiFetch<void>(`/workflows/${id}`, { method: "DELETE" });
  },
};

export const STAGE_COLOR: Record<WorkflowStage, string> = {
  Pending: "bg-amber-500 text-white",
  "In Progress": "bg-blue-600 text-white",
  Approved: "bg-primary text-primary-foreground",
  Completed: "bg-emerald-600 text-white",
  Rejected: "bg-destructive text-destructive-foreground",
};

export const PRIORITY_COLOR: Record<WorkflowPriority, string> = {
  Low: "bg-secondary text-secondary-foreground",
  Medium: "bg-muted text-muted-foreground",
  High: "bg-amber-500 text-white",
  Urgent: "bg-destructive text-destructive-foreground",
};
