/**
 * Meetings + RACI API – mock-mode.
 *
 * Future endpoints:
 *   GET    /api/meetings
 *   POST   /api/meetings
 *   PATCH  /api/meetings/:id
 *   DELETE /api/meetings/:id
 *   POST   /api/meetings/:id/action-items
 *   PATCH  /api/meetings/:id/action-items/:aiId
 */
import { MOCK_MODE, apiFetch, mockDelay } from "./client";

export type RaciRole = "R" | "A" | "C" | "I" | "-";
export const RACI_ROLES: RaciRole[] = ["R", "A", "C", "I", "-"];

export interface RaciAssignment {
  /** employeeId -> role */
  [employeeId: string]: RaciRole;
}

export type ActionStatus = "Open" | "In Progress" | "Done";

export interface ActionItem {
  id: string;
  description: string;
  ownerId: string;       // EMP-XXX
  dueDate: string;       // YYYY-MM-DD
  status: ActionStatus;
}

export interface Meeting {
  id: string;            // MTG-001
  title: string;
  date: string;          // YYYY-MM-DD
  time: string;          // HH:mm
  location: string;
  agenda: string;
  notes: string;
  attendees: string[];   // employeeIds
  /** RACI: outcome/deliverable label -> assignments */
  raci: { id: string; deliverable: string; assignments: RaciAssignment }[];
  actionItems: ActionItem[];
  createdAt: string;
}

const today = () => new Date().toISOString().slice(0, 10);
const minus = (d: number) => new Date(Date.now() - d * 86400000).toISOString().slice(0, 10);
const plus = (d: number) => new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);

let MOCK: Meeting[] = [
  {
    id: "MTG-001",
    title: "Weekly Production Review",
    date: minus(2), time: "10:00", location: "Plant Floor — Office",
    agenda: "Review last week's output, defect rate and downtime.",
    notes: "Output up 8%. Hammer mill bearing replaced. Defect rate at 1.2%.",
    attendees: ["EMP-001", "EMP-002", "EMP-005"],
    raci: [
      { id: "r1", deliverable: "Daily output report", assignments: { "EMP-001": "R", "EMP-002": "C", "EMP-005": "I" } },
      { id: "r2", deliverable: "QC defect log", assignments: { "EMP-001": "I", "EMP-002": "R", "EMP-005": "-" } },
    ],
    actionItems: [
      { id: "a1", description: "Order 6 spare bearings", ownerId: "EMP-005", dueDate: plus(3), status: "In Progress" },
      { id: "a2", description: "Publish weekly QC summary", ownerId: "EMP-002", dueDate: plus(1), status: "Open" },
    ],
    createdAt: minus(2),
  },
  {
    id: "MTG-002",
    title: "Sales Pipeline Sync",
    date: today(), time: "15:00", location: "Conference Room",
    agenda: "Review hot leads, dealer onboarding and Q2 forecast.",
    notes: "",
    attendees: ["EMP-004", "EMP-003"],
    raci: [
      { id: "r1", deliverable: "Q2 revenue forecast", assignments: { "EMP-004": "R", "EMP-003": "C" } },
      { id: "r2", deliverable: "Dealer onboarding pack", assignments: { "EMP-004": "A", "EMP-003": "R" } },
    ],
    actionItems: [
      { id: "a1", description: "Follow-up with Bharat Bio Power", ownerId: "EMP-004", dueDate: plus(2), status: "Open" },
    ],
    createdAt: minus(1),
  },
];

const nextId = () => `MTG-${String(MOCK.length + 1).padStart(3, "0")}`;

export const meetingsApi = {
  async list(): Promise<Meeting[]> {
    if (MOCK_MODE) { await mockDelay(); return [...MOCK].sort((a, b) => b.date.localeCompare(a.date)); }
    return apiFetch<Meeting[]>("/meetings");
  },
  async create(data: Omit<Meeting, "id" | "createdAt">): Promise<Meeting> {
    if (MOCK_MODE) {
      await mockDelay();
      const m: Meeting = { ...data, id: nextId(), createdAt: new Date().toISOString() };
      MOCK.unshift(m); return m;
    }
    return apiFetch<Meeting>("/meetings", { method: "POST", body: JSON.stringify(data) });
  },
  async update(id: string, patch: Partial<Meeting>): Promise<Meeting> {
    if (MOCK_MODE) {
      await mockDelay();
      MOCK = MOCK.map((m) => (m.id === id ? { ...m, ...patch } : m));
      return MOCK.find((m) => m.id === id)!;
    }
    return apiFetch<Meeting>(`/meetings/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
  },
  async remove(id: string): Promise<void> {
    if (MOCK_MODE) { await mockDelay(); MOCK = MOCK.filter((m) => m.id !== id); return; }
    await apiFetch<void>(`/meetings/${id}`, { method: "DELETE" });
  },
};

export const RACI_LABELS: Record<RaciRole, { label: string; color: string }> = {
  R: { label: "Responsible", color: "bg-primary text-primary-foreground" },
  A: { label: "Accountable", color: "bg-blue-600 text-white" },
  C: { label: "Consulted",  color: "bg-amber-500 text-white" },
  I: { label: "Informed",   color: "bg-secondary text-secondary-foreground" },
  "-": { label: "—",        color: "bg-muted text-muted-foreground" },
};
