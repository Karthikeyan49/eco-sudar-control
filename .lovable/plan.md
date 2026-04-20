

# 7-Part Enhancement Plan

A focused upgrade across **Expenses, Reports, Employees, Attendance**, plus two new modules: **AI Insights** and a **floating Chatbot**. Lovable Cloud (Supabase + Lovable AI Gateway) will be enabled to power AI features and bill upload OCR.

---

## 1. Expenses — Photo-first form with auto-fill

**Changes to `src/pages/Expenses.tsx`:**
- Move the **Bill / Receipt** field to the **top** of the dialog as a prominent drop-zone card.
- Replace the single file input with **two buttons + one drag area**:
  - **Take Photo** → `<input type="file" accept="image/*" capture="environment">` (opens rear camera on mobile)
  - **Upload from Gallery** → `<input type="file" accept="image/*,application/pdf">` (no `capture` attribute)
- After upload, show a thumbnail preview + an **"Auto-fill from photo"** button.
- Auto-fill calls a new edge function `extract-expense` (Lovable AI Gateway, `google/gemini-3-flash-preview` with vision) → returns `{date, vendor, amount, category, description}`. Form fields populate, user reviews, then Save.

**Category dropdown enhancement:**
- Add `"Other"` option (already exists as "Other").
- When user selects `"Other"`, render a text `<Input placeholder="Custom category name">` directly below the dropdown.
- On save, the typed value is stored as the actual category string (replaces "Other"). The `EXPENSE_CATEGORIES` enum schema is loosened to accept arbitrary strings.

---

## 2. Reports — Category filter that drives exports

**Changes to `src/pages/Reports.tsx`:**
- Each module's mock dataset already has a `category` field. Add a **Category dropdown** above the existing Filters block.
- Options are computed dynamically from the active module's distinct categories: e.g. Sales → `Briquettes, Pellets`; Expenses → `Raw Materials, Salary, Maintenance`; Production → `Briquettes, Pellets`; etc.
- The selected category is included in the `rows` filter `useMemo` and flows automatically into PDF + Excel exports (no change to exporter logic).
- Reset to "All categories" whenever the module changes.

---

## 3. Employees — Identity-card style QR download

**Changes to `src/pages/Employees.tsx`:**
- Rewrite `downloadQr(e)` to render onto a **600×900 px Canvas** instead of just `QRCode.toDataURL`:
  - White background with green Eco Sudar header bar (logo + "ECO SUDAR Bio Energy LLP")
  - Employee Name (bold, large)
  - Employee Number / ID
  - Designation + Department
  - QR code (~400×400) centered
  - Footer: "Scan at attendance kiosk" + token text
- Export the canvas via `canvas.toDataURL("image/png")` as `<EmpID>-<Name>-IDCard.png`.

---

## 4. Attendance — Full-screen scanner + reliable scanning + popup

**Changes to `src/components/QrScanner.tsx`:**
- Switch from a fixed-size square box inside a dialog to a **full-viewport overlay** when active (fixed positioning, `inset-0`, dark backdrop).
- Increase scan box `qrbox` to ~80% of the smaller viewport dimension and bump `fps` to 15 for better detection.
- Add `formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]` and `disableFlip: false` for orientation tolerance.
- Larger close (X) button at top-right of the overlay.

**Changes to `src/pages/Attendance.tsx`:**
- Open scanner as a **full-screen Sheet** (or full-viewport div) instead of a constrained Dialog so 100% of the camera feed is visible.
- After successful scan: show a **success popup AlertDialog** with `"Attendance Recorded Successfully"`, employee name, action (IN/OUT), and time. Auto-dismiss after 2 seconds.
- Already calls `load()` after each scan — verify the entries table updates immediately (it does via state refresh).

**Why scanning fails today:** the 220×220 qrbox is too small relative to the camera frame. Bumping `qrbox` and `fps`, plus making the overlay full-screen, fixes detection.

---

## 5. AI Insights — New module powered by Lovable AI

**New menu entry** under a new "Intelligence" section in `src/components/AppSidebar.tsx`: **"AI Insights"** (icon: `Sparkles`).

**New page `src/pages/Insights.tsx`:**
- 4 category tabs: **Sales · Expenses · Employees · Production**
- Each tab has a **"Generate Insights"** button + a **"Generate All"** button at the top.
- Calls a new edge function `generate-insights` that:
  1. Aggregates data from `expensesApi`, `employeesApi`, `attendanceApi`, `invoicesApi`, etc.
  2. Sends summary JSON to Lovable AI Gateway with structured-output tool-calling.
  3. Returns `{recommendations[], improvements[], criticalIssues[], performanceMetrics[]}`.
- UI renders results as 4 stacked card sections with colored badges (green = recommendation, amber = improvement, red = critical, blue = metric). Each item has a title + 1-2 sentence detail.
- Cache last result in `localStorage` so users don't re-spend AI credits on every visit.

---

## 6. Chatbot — Floating "Ask Eco Sudar" widget on every page

**New components:**
- `src/components/ChatWidget.tsx` — fixed bottom-right floating button (icon: `MessageCircle`). Click → opens a 400×600 chat panel.
- Renders messages with `react-markdown`. Streams responses via SSE.

**New edge function `chat-assistant`:**
- System prompt: *"You are the Eco Sudar Bio Energy assistant. Answer using the provided application context. Be concise."*
- Frontend sends `{messages, context}` where `context` is a snapshot of current-page data (e.g. on `/expenses`, sends list of recent expenses; on `/employees`, sends staff list). Page contributes context via a `useChatContext()` hook stored in a React context provider.
- Streams via Lovable AI Gateway (`google/gemini-3-flash-preview`, with reasoning="low").

**Mounting:** add `<ChatWidget />` once inside `DashboardLayout.tsx` so it appears on every authenticated page. Hidden on `/login`.

---

## Backend / Infrastructure

**Enable Lovable Cloud** (one-time, on user approval) to get:
- Edge functions runtime
- Auto-provisioned `LOVABLE_API_KEY` for the AI Gateway
- Storage bucket `expense-bills` (public read, authenticated write) for the photo upload step (also persists image so OCR can re-run if needed)

**3 new edge functions:**
| Function | Purpose | Model |
|---|---|---|
| `extract-expense` | Vision OCR → structured expense JSON | `google/gemini-3-flash-preview` |
| `generate-insights` | Aggregate analytics → categorized insights | `google/gemini-3-flash-preview` (reasoning: medium) |
| `chat-assistant` | Streaming Q&A grounded in page context | `google/gemini-3-flash-preview` |

All functions read `LOVABLE_API_KEY` from env. Errors 429/402 are caught and surfaced to the user via `toast`.

---

## File-by-file summary

| File | Action |
|---|---|
| `src/pages/Expenses.tsx` | Reorder dialog, dual upload buttons, "Other" custom field, auto-fill button |
| `src/lib/api/expenses.ts` | Loosen `category` type to `string` |
| `src/pages/Reports.tsx` | Add category dropdown, include in filter + export |
| `src/pages/Employees.tsx` | Rewrite `downloadQr` to render an ID card onto canvas |
| `src/components/QrScanner.tsx` | Full-screen overlay, larger qrbox, higher fps |
| `src/pages/Attendance.tsx` | Full-screen scanner, success popup AlertDialog |
| `src/pages/Insights.tsx` | NEW — AI insights tabs + cards |
| `src/components/ChatWidget.tsx` | NEW — floating chat panel with streaming |
| `src/contexts/ChatContext.tsx` | NEW — per-page context provider |
| `src/components/DashboardLayout.tsx` | Mount `<ChatWidget />` |
| `src/components/AppSidebar.tsx` | Add "Intelligence" section with "AI Insights" link |
| `src/App.tsx` | Register `/insights` route |
| `supabase/functions/extract-expense/index.ts` | NEW |
| `supabase/functions/generate-insights/index.ts` | NEW |
| `supabase/functions/chat-assistant/index.ts` | NEW |
| `supabase/config.toml` | Register the 3 functions, `verify_jwt = false` for chat |

---

## Notes for the user (non-technical)

- Enabling Lovable Cloud is required because the AI features (photo→form, insights, chatbot) need a secure backend. It's free to enable; usage above the free tier is billed per request.
- The chatbot only sees data already visible on the current page — it cannot leak data the user can't see themselves.
- Bill photo OCR works best for clear, well-lit Indian GST invoices/receipts. The form is always editable after auto-fill.

