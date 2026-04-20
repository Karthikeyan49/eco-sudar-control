/**
 * SOP (Standard Operating Procedures) API – mock-mode.
 *
 * Future endpoints:
 *   GET    /api/sops
 *   POST   /api/sops
 *   PATCH  /api/sops/:id
 *   DELETE /api/sops/:id
 *   POST   /api/sops/:id/versions
 *   PATCH  /api/sops/:id/versions/:vid   (approve/reject)
 */
import { MOCK_MODE, apiFetch, mockDelay } from "./client";

export const SOP_DEPARTMENTS = [
  "Procurement",
  "Production",
  "Quality Control",
  "Packing",
  "Sales",
  "Marketing",
  "Material Management",
  "HR",
  "Dispatch",
  "Service",
  "Customer Care",
] as const;
export type SopDepartment = (typeof SOP_DEPARTMENTS)[number];

export const SOP_ROLES = ["All Staff", "Managers", "Department Only", "Admin Only"] as const;
export type SopAccessRole = (typeof SOP_ROLES)[number];

export type SopStatus = "Draft" | "Pending Approval" | "Approved" | "Archived";

export interface SopVersion {
  id: string;            // v1, v2 ...
  version: string;       // "1.0", "1.1", "2.0"
  uploadedBy: string;    // EMP-XXX
  uploadedAt: string;    // ISO
  fileName: string;
  fileSize: number;      // bytes
  changeLog: string;
  status: SopStatus;
  approvedBy?: string;   // EMP-XXX
  approvedAt?: string;
}

export interface Sop {
  id: string;            // SOP-001
  code: string;          // PROD-001
  title: string;
  department: SopDepartment;
  description: string;
  ownerId: string;       // EMP-XXX
  accessRole: SopAccessRole;
  tags: string[];
  versions: SopVersion[];
  currentVersionId: string;
  createdAt: string;
  updatedAt: string;
}

const iso = (d = new Date()) => d.toISOString();
const minus = (days: number) => new Date(Date.now() - days * 86400000).toISOString();

let MOCK: Sop[] = [
  {
    id: "SOP-001",
    code: "PROD-001",
    title: "Briquette Production Line Setup",
    department: "Production",
    description: "Step-by-step setup procedure for the hammer mill and briquetting press at shift start.",
    ownerId: "EMP-001",
    accessRole: "Department Only",
    tags: ["production", "machinery", "shift-start"],
    versions: [
      { id: "v1", version: "1.0", uploadedBy: "EMP-001", uploadedAt: minus(120), fileName: "prod-001-v1.pdf", fileSize: 245_000, changeLog: "Initial release.", status: "Approved", approvedBy: "EMP-005", approvedAt: minus(118) },
      { id: "v2", version: "1.1", uploadedBy: "EMP-001", uploadedAt: minus(30),  fileName: "prod-001-v1.1.pdf", fileSize: 268_000, changeLog: "Added pre-start safety checklist.", status: "Approved", approvedBy: "EMP-005", approvedAt: minus(28) },
    ],
    currentVersionId: "v2",
    createdAt: minus(120),
    updatedAt: minus(30),
  },
  {
    id: "SOP-002",
    code: "QC-001",
    title: "Briquette Quality Inspection Protocol",
    department: "Quality Control",
    description: "Sampling, density measurement and moisture testing procedures for finished briquettes.",
    ownerId: "EMP-002",
    accessRole: "All Staff",
    tags: ["qc", "testing", "compliance"],
    versions: [
      { id: "v1", version: "1.0", uploadedBy: "EMP-002", uploadedAt: minus(90), fileName: "qc-001-v1.pdf", fileSize: 198_000, changeLog: "Initial release.", status: "Approved", approvedBy: "EMP-005", approvedAt: minus(89) },
    ],
    currentVersionId: "v1",
    createdAt: minus(90),
    updatedAt: minus(90),
  },
  {
    id: "SOP-003",
    code: "PROC-001",
    title: "Raw Material Procurement Workflow",
    department: "Procurement",
    description: "Vendor evaluation, PO creation and goods-receipt verification for biomass raw material.",
    ownerId: "EMP-005",
    accessRole: "Managers",
    tags: ["procurement", "vendor", "po"],
    versions: [
      { id: "v1", version: "1.0", uploadedBy: "EMP-005", uploadedAt: minus(60), fileName: "proc-001-v1.pdf", fileSize: 312_000, changeLog: "Initial release.", status: "Approved", approvedBy: "EMP-005", approvedAt: minus(60) },
      { id: "v2", version: "2.0", uploadedBy: "EMP-005", uploadedAt: minus(5),  fileName: "proc-001-v2.pdf", fileSize: 340_000, changeLog: "Updated vendor scoring matrix; added GST verification step.", status: "Pending Approval" },
    ],
    currentVersionId: "v2",
    createdAt: minus(60),
    updatedAt: minus(5),
  },
  {
    id: "SOP-004",
    code: "DISP-001",
    title: "Dispatch & Loading Procedure",
    department: "Dispatch",
    description: "Truck loading sequence, weighbridge entry and delivery documentation.",
    ownerId: "EMP-003",
    accessRole: "Department Only",
    tags: ["dispatch", "logistics"],
    versions: [
      { id: "v1", version: "1.0", uploadedBy: "EMP-003", uploadedAt: minus(45), fileName: "disp-001-v1.pdf", fileSize: 220_000, changeLog: "Initial release.", status: "Approved", approvedBy: "EMP-005", approvedAt: minus(44) },
    ],
    currentVersionId: "v1",
    createdAt: minus(45),
    updatedAt: minus(45),
  },
  {
    id: "SOP-005",
    code: "HR-001",
    title: "Employee Onboarding Checklist",
    department: "HR",
    description: "Day-1 to day-30 onboarding flow including documentation, induction and training.",
    ownerId: "EMP-005",
    accessRole: "Admin Only",
    tags: ["hr", "onboarding"],
    versions: [
      { id: "v1", version: "1.0", uploadedBy: "EMP-005", uploadedAt: minus(20), fileName: "hr-001-v1.pdf", fileSize: 175_000, changeLog: "Draft for review.", status: "Draft" },
    ],
    currentVersionId: "v1",
    createdAt: minus(20),
    updatedAt: minus(20),
  },
];

const nextId = () => `SOP-${String(MOCK.length + 1).padStart(3, "0")}`;
const nextVersionId = (sop: Sop) => `v${sop.versions.length + 1}`;
const bumpVersion = (current: string, major: boolean) => {
  const [maj, min = "0"] = current.split(".");
  return major ? `${parseInt(maj) + 1}.0` : `${maj}.${parseInt(min) + 1}`;
};

export const sopsApi = {
  async list(): Promise<Sop[]> {
    if (MOCK_MODE) { await mockDelay(); return [...MOCK].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)); }
    return apiFetch<Sop[]>("/sops");
  },
  async create(data: Omit<Sop, "id" | "createdAt" | "updatedAt" | "versions" | "currentVersionId"> & { initialFileName: string; changeLog?: string }): Promise<Sop> {
    if (MOCK_MODE) {
      await mockDelay();
      const v: SopVersion = {
        id: "v1", version: "1.0", uploadedBy: data.ownerId, uploadedAt: iso(),
        fileName: data.initialFileName, fileSize: 200_000,
        changeLog: data.changeLog ?? "Initial release.", status: "Draft",
      };
      const sop: Sop = {
        id: nextId(), code: data.code, title: data.title, department: data.department,
        description: data.description, ownerId: data.ownerId, accessRole: data.accessRole,
        tags: data.tags, versions: [v], currentVersionId: v.id,
        createdAt: iso(), updatedAt: iso(),
      };
      MOCK.unshift(sop); return sop;
    }
    return apiFetch<Sop>("/sops", { method: "POST", body: JSON.stringify(data) });
  },
  async update(id: string, patch: Partial<Sop>): Promise<Sop> {
    if (MOCK_MODE) {
      await mockDelay();
      MOCK = MOCK.map((s) => (s.id === id ? { ...s, ...patch, updatedAt: iso() } : s));
      return MOCK.find((s) => s.id === id)!;
    }
    return apiFetch<Sop>(`/sops/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
  },
  async remove(id: string): Promise<void> {
    if (MOCK_MODE) { await mockDelay(); MOCK = MOCK.filter((s) => s.id !== id); return; }
    await apiFetch<void>(`/sops/${id}`, { method: "DELETE" });
  },
  async addVersion(id: string, data: { uploadedBy: string; fileName: string; changeLog: string; major: boolean }): Promise<Sop> {
    if (MOCK_MODE) {
      await mockDelay();
      MOCK = MOCK.map((s) => {
        if (s.id !== id) return s;
        const last = s.versions[s.versions.length - 1];
        const v: SopVersion = {
          id: nextVersionId(s),
          version: bumpVersion(last?.version ?? "1.0", data.major),
          uploadedBy: data.uploadedBy, uploadedAt: iso(),
          fileName: data.fileName, fileSize: 200_000 + Math.floor(Math.random() * 100_000),
          changeLog: data.changeLog, status: "Pending Approval",
        };
        return { ...s, versions: [...s.versions, v], currentVersionId: v.id, updatedAt: iso() };
      });
      return MOCK.find((s) => s.id === id)!;
    }
    return apiFetch<Sop>(`/sops/${id}/versions`, { method: "POST", body: JSON.stringify(data) });
  },
  async setVersionStatus(id: string, versionId: string, status: SopStatus, approvedBy?: string): Promise<Sop> {
    if (MOCK_MODE) {
      await mockDelay();
      MOCK = MOCK.map((s) => {
        if (s.id !== id) return s;
        return {
          ...s,
          versions: s.versions.map((v) =>
            v.id === versionId
              ? { ...v, status, approvedBy: status === "Approved" ? approvedBy : v.approvedBy, approvedAt: status === "Approved" ? iso() : v.approvedAt }
              : v
          ),
          updatedAt: iso(),
        };
      });
      return MOCK.find((s) => s.id === id)!;
    }
    return apiFetch<Sop>(`/sops/${id}/versions/${versionId}`, { method: "PATCH", body: JSON.stringify({ status, approvedBy }) });
  },
};

export const SOP_STATUS_COLOR: Record<SopStatus, string> = {
  Draft: "bg-muted text-muted-foreground",
  "Pending Approval": "bg-amber-500 text-white",
  Approved: "bg-primary text-primary-foreground",
  Archived: "bg-secondary text-secondary-foreground",
};
