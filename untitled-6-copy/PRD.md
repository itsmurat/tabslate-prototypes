# Daily Overview Dashboard — PRD

## Summary
A landing dashboard for returning users: a quick daily read on accounts
receivable health, what needs action today, and a look at recent invoice
activity. This is not an onboarding or setup flow; it assumes the account is
already active and has invoice history.

## Problem
Users currently have no single place to land that answers "how are we doing
today, and what do I need to do." This dashboard is that landing page.

## Goals
- Show AR health at a glance: outstanding, overdue, and collected totals.
- Surface what needs attention today as a short, prioritized to-do list.
- Show recent invoice activity without requiring a trip to the full
  Invoices page.
- Work as a true "every day" screen: data-driven, not a one-time checklist.

## Non-goals
- Onboarding, setup, or first-run checklists (explicitly out of scope; the
  user asked for the returning-user daily view, not a getting-started flow).
- Editing or creating invoices. The "New invoice" button and invoice-row
  interactions are placeholders (see Open questions).
- Date-range filtering, comparisons to prior periods, or exportable reports.

## Users
Finance/AR team members who check this dashboard as a daily routine, most
often the first screen they see after logging in.

## Experience

### Header
Greeting ("Good morning, Murat") plus one line of framing copy, and a single
primary action, "New invoice." One primary action per view, per the design
system's UX guidance.

### KPI row
Four cards, each a total plus a supporting count:
- **Outstanding** — sum of invoices in `SENT`, `SCHEDULED`, `PENDING`, or
  `OVERDUE` status; "N invoices awaiting payment."
- **Overdue** — sum of `OVERDUE` invoices; "N invoices past due."
- **Collected** — sum of `PAID` and `DONE` invoices; "N invoices paid."
- **Drafts** — sum of `DRAFT` invoices; "N invoices not sent."

Overdue is styled as an alert, Collected as success, Outstanding as
informational, Drafts as neutral/muted — color communicates urgency, not
just labeling.

### Things to do
A data-driven task list, not a fixed checklist:
- "Collect N overdue invoices" — shown only if overdue invoices exist.
- "Send N draft invoices" — shown only if drafts exist.
- "Review N scheduled invoices" — shown only if scheduled invoices exist.

If none apply, the section shows an explicit done state ("You are all caught
up") rather than an empty gap. Clicking a task is a placeholder today (see
Open questions).

### Invoice status
A donut chart of all invoices broken down by status, with a legend showing
each status name and count. Lets a user see the shape of their whole
portfolio, not just the four KPI buckets above.

### Collected by month
A bar chart of paid/done invoice totals for the most recent six months with
data, so a user can see whether collections are trending up or down.

### Recent invoices
A table of the six most recent invoices (by date), with invoice ID,
customer, status, amount, and date — the same status and currency
formatting used elsewhere in the product. A "View all" link is a placeholder
for linking to the full Invoices page (see Open questions).

## Data
All data is generated from `SCENARIOS.typical` in the shared mock-data kit
(18 customers, 120 invoices, seeded, deterministic). No live data source;
this is a prototype.

## Open questions
- **"New invoice" button** — currently shows a placeholder toast. Should it
  open a real invoice-creation flow (drawer, modal, or dedicated page)?
- **Task-card clicks** — currently show a placeholder toast per task.
  Clicking "Collect 4 overdue invoices" should probably jump to a filtered
  Invoices view. What should each task type navigate to?
- **"View all" (Recent invoices)** — placeholder toast today. Assumed to
  link to the full Invoices page; needs a real destination once that page
  exists in this prototype.
- **Greeting time-of-day logic** — copy is currently a static "Good
  morning." Should it vary by time of day, or is a fixed greeting
  acceptable for a prototype?
- **Empty/first-invoice state** — this PRD assumes an account with invoice
  history (per the "returning user" framing). A brand-new account with zero
  invoices would need its own empty state across every section; not
  designed here since it was called out as out of scope.
