# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## v10 — Ask the Agent + Agent Permissions settings view + pending-tile policy buttons (this checkout)

Sibling copy of `collections-agent-prototype-august`. Three areas, all sharing one
`askAgentPermissions` list (`{sec,x,y,z}` exceptions) and one `PERMISSION_Y_HINTS` keyword
table for inferring a specific action (Y) from free text — no parallel data models:

1. **Ask the Agent** — a global NL surface on the Collections Worklist (`inboxView` toggle,
   "Worklist" / "Ask the Agent") for the Aug PRD's global-level requirements: query any
   customer/the whole book, inquire about or adjust the Agent's permissions. Deliberately does
   **not** approve/reject/modify/create individual actions — that stays exactly as-is on the
   detail page. `askAgentLog`/`askAgentDraft`/`askAgentPermissions` are the shared state;
   `handleAskAgentMessage()`/`mockPermissionDraft()`/`answerPolicyQuestion()`/
   `answerDataQuery()` are the mock-understanding router (keyword-based, not real NLU).

2. **Pending-action tile: 4 buttons, not 2.** Every still-pending card on the Agent Actions
   tab (`pendingActionButtons()`) shows **Reject / Approve once / Sometimes approve / Always
   approve** instead of a plain Reject/Approve pair — the future-policy decision happens
   up front, at the moment of deciding this instance, not as a separate follow-up prompt
   afterward. Reject and Approve once are plain one-shot verdicts, no side effects. **Always
   approve** sets the verdict and immediately pushes an unconditional AUTO exception via
   `draftFromAction()` — one click is the confirm, no extra step. **Sometimes approve** sets
   the verdict and opens an inline, agent-styled back-and-forth right under the tile
   (`renderNudge()`, `nudgeDraft[i]` cycling through `"sometimes-ask"` →
   `{mode:"sometimes-review",...}` → `{resolved:"sometimes",...}`): it asks when auto-handling
   would be OK, the user answers in one free-text line, and `draftFromSometimesText()` prefers
   a more specific Y if the user's own words name one (via `PERMISSION_Y_HINTS`) while falling
   back to the action-derived Y otherwise — a generic Y is fine when that's genuinely all there
   is, the user's words only override it when they're actually more specific. A confirm card
   (shared `draftCardHtml()`) is the last step before it lands in `askAgentPermissions`.
   **Auto-executed actions are deliberately not touched by any of this** — they still get the
   older, much quieter single "Change how the agent handles this" link (`draftFromChangeText()`,
   X inferred from keywords rather than forced to AUTO), since there's no decision being made in
   the moment to react to. Approved/rejected states reached via the 4 buttons get **no** further
   follow-up prompt — the policy question was already answered by which button was clicked.
   **There is no Cmd-K/keyboard-triggered capture anywhere in this build** — it was tried and
   explicitly removed; this inline per-tile flow plus the worklist's Ask the Agent are the only
   two ways to create an exception.

3. **Agent Permissions settings view** (`view==="settings"`) — ported from the standalone
   `collections-agent-settings-v7` prototype, matching its actual page structure, not just its
   data model: the same `.section` grid (explanatory text left, controls right, hairline divider
   between sections), the same floating "Settings" rail on the right (decorative, matching v7 —
   General/Billing/Dunning schedule links go nowhere there either), and the same section
   order — **What the Agent can do** → **Tool permissions** → **Brand tone** (`brandTone`, plain
   local state, no save bar — every other commit in this app is instant, so gating just this one
   field behind Save would be the inconsistent choice). The **Configured/New merchant** demo
   toggle is back too (`merchantState`), and matches v7 exactly: switching state re-seeds *both*
   `toolDefaults` and `askAgentPermissions` from scratch (`CONFIGURED_EXCEPTIONS`), not just the
   exceptions — "New merchant" is a fresh account with nothing learned yet. Each tool
   (`TOOL_META`) shows its blanket default (`toolDefaults`, editable, labeled Auto-execute / Ask
   for approval / Never allow — see `XLABEL`) plus its exceptions, computed live as
   `askAgentPermissions.filter(e=>e.sec===tool.sec)` rather than stored per-tool, so this view,
   the worklist chat, and the pending-tile flow above can never drift out of sync. The "Adjust
   agent permissions" button here (kept from v7's layout) now navigates to the worklist's Ask
   the Agent view rather than opening a chat drawer or Cmd-K (both gone). Below that: the "What
   the Agent can do" capability grid (`CAPS`, unchanged from v7, each with an info modal) and a
   "Request an action" tile opening its own form modal — both reuse this app's existing generic
   `#modal`/`.scrim`/`.modal` overlay pattern. The detail page's previously-dead "Agent
   permissions" link (`#permsLink`) now navigates here. **Not ported from v7**: the standalone
   chat drawer chrome (redundant with the worklist chat / pending-tile flow above).

Exceptions matching a tool's own default are allowed and NOT blocked anywhere — v7's original
redundancy guard (refusing to add a same-as-default exception) was never carried over here, by
design.

None of this touches per-action approve/reject/modify/create, which is explicitly and
permanently out of scope for all three additions — that stays exactly as documented in the
rest of this file.

# Customer Collections Agent Prototype — V7

A low-to-mid fidelity clickable prototype for the Tabs Collections Agent, covering the single-customer detail page and the customer-first worklist that leads into it. Built iteratively in vanilla HTML/CSS/JS — no build step, no framework, no dependencies. There is nothing to install, lint, or test; verification is done by eye in the browser.

This is the active working version handed off for the next round of design iteration (superseding the earlier `V7 - July 22` snapshot elsewhere in this Downloads folder).

**Branches**: `main` is the **July descope** — a reduced-FE-lift build meant to ship sooner, with the AI-refine composer, multi-event citation + hover highlighting, and the agent-identity sparkle mark (worklist banner, animated tab indicator, Agent Summary logo) all cut to bring the build down in scope. `august` is the **full-featured snapshot** taken right before the descope — everything above is intact there. If a future ask is "bring back X," check whether `august` already has it before rebuilding from scratch.

**August rebuild (this checkout)**: `august` was rebuilt from July's current tip rather than continuing to diverge from the stale pre-descope snapshot — July is now the base, plus three specific items pulled forward from the old `august` snapshot: the agent-identity sparkle mark (decisions #7, #9 — worklist banner sentence, Agent Summary logo, Actions tab badge), the AI-refine composer + formatting toolbar (decision #5), and the resizable email drawer (decision #4). Multi-event citation + hover highlighting (decision #10) was deliberately **not** pulled forward — that one's still considered wrong, not just cut for scope. Everything else — filters, columns, sorting, the Cobalt/Fairmont scenarios, the Pause-confirm modal — is July's version, unchanged. New Aug-25-PRD scope (promise-to-pay tool + entity, LLM policy block, chat interface on the detail page, follow-up email unification) is not yet built here.

## Running it

```bash
# from the Downloads folder (one level up), so any sibling vN folder is reachable the same way
python3 -m http.server 8742
```

Open **http://localhost:8742/v7/**.

## What this is

Tabs is an AR (accounts receivable) automation product. The Collections Agent is an AI that reads inbound customer emails, payment events, and billing history, then proposes actions (send a reply, update a contact, log a promise to pay, etc.) for a human to approve. This build ships **structured, click-based interaction only** — no chat surface, no natural-language plan editing. (Dunning, an LLM policy block, and NL chat/direction are Fast Follow — out of scope here by design, not by omission.)

The prototype has three views:
- **Collections Worklist** — one row per customer with open agent work; its own top-level nav item (not nested under Invoicing, since a customer-level worklist is a first-class object like Customers, not a billing sub-page). Click a row to navigate to that customer's detail page.
- **Customer detail page** — the main subject of this work, with three tabs: **Agent Actions**, **Activity**, **Scheduled**.
- **Customer page** (via "Customers" in the nav) — the standard Tabs customer profile, with a "Collections Agent" deep-link under Billing & revenue.

There's also an Invoice details page with its own "Collections Agent" deep-link (badged with the pending-action count).

### Four scenarios, real customer switching

This isn't one hardcoded customer — the worklist has four fully-built detail pages behind it, selected by which row you click:

- **Meridian Group** — the "shows everything" scenario: a narrative across **2 distinct email threads** (a billing-contact/CC/address/PO thread, resolved days before a separate later W-9 ask; a fully-historical invoice/dunning/payment thread) that between them touch every entry type in the real PRD Activity Log spec. The contact/CC/address changes are **auto-executed**, logged to the Activity tab with no card in Agent Actions; the only thing left pending review is the W-9 reply.
- **Northwind Traders** — Tom Reilly asked for a billing contact update *and* a resent invoice, both from the **same single email**. Demonstrates one event → two actions: the contact update is pre-seeded as **auto-executed** (shows "Auto-executed" verdict, no approve/reject needed), the email reply is pending review. Built specifically to stress-test the multi-action-per-event pattern and the auto-vs-review distinction — and now also logs a matching Activity-tab entry for the auto-executed change, so the two tabs agree on what happened.
- **Fairmont Logistics** — the simplest case: 2 unrelated emails, 2 proposed actions, each citing its own separate event, no shared cause and no dependency between them (contrast with Northwind/Cobalt Fitness's shared-cause grouping). A third action was tried here that depended on two different triggering events at once and was cut — see decision #1/#10.
- **Cobalt Fitness** — the "omnibus email" scenario: **one** inbound email triggers all 7 July-28-scoped agent action types at once (mark invoice pending, update PO, update customer info, send email, flag customer, apply cash app recommendation, schedule task), all sharing the same cause and nesting under one event node — decision #1's shared-cause grouping, stress-tested with the full action inventory instead of just 2. Generic (non-email, non-contact) action kinds get a human title from `ACTION_TITLES` in `renderActionCard()` rather than showing the raw `kind` string.

Architecturally: `SCENARIO_MERIDIAN`/`THREADS_MERIDIAN`, `SCENARIO_NORTHWIND`/`THREADS_NORTHWIND`, `SCENARIO_FAIRMONT`/`THREADS_FAIRMONT`, and `SCENARIO_COBALT`/`THREADS_COBALT` are the four fixed data sets; `SCENARIO`/`THREADS` are mutable `let` bindings reassigned via `SCENARIOS_BY_ID[customerId]` when a worklist row is clicked. A scenario can set `initialActionState` (e.g. `{0: "auto"}`) to pre-seed an action as already-executed on load. If you add a fifth customer, follow this pattern rather than hardcoding a new global.

## Design brief

The full functional requirements live in Notion:
**Customer Collections Agent Page Design Brief** — `37c17d4f80ce80d29a75cf2991030fbc`
**PRD 2.0: Customer Level Collections** — the current source of truth for scope, phasing, and open questions.

## Code architecture

Two files do everything: `index.html` (markup shell + the entire stylesheet in one inline `<style>` block, including the Toretto Library CSS custom properties) and `app.js` (all logic + mock data).

The app is a **single-page, string-template renderer driven by module-level mutable state** — no framework, no virtual DOM, no reactivity:

1. **Data** — `WORKLIST`, the four `SCENARIO_*` objects (+ their `THREADS_*` pairs), `SCENARIOS_BY_ID`, `INBOX_COLUMNS`, `ACT_CATS`, `AVAILABLE_ATTACHMENTS` are the fixed data/config.
2. **State** — a block of module-level `let` variables is the entire app state: `view` (`"inbox"|"detail"|"customer"|"billing"`), `SCENARIO`/`THREADS` (current customer, reassigned on navigation), `activeTab`, `activityFilter` (Activity tab's All/Email toggle), `visibleInboxCols`, `inboxSearchQuery`, `activeFilters`/`filterSubmenu` (worklist Add-filter chips), `inboxPage`, plus detail-page UI flags (`actionState`, `expandedCard`, `selectedEmailId`, `threadOpenEmails`, `agentPaused`, `drawerThreadId`, etc.).
3. **`render()`** — the top-level entry. Switches on `view`, writes `main.innerHTML` from a `renderX()` function, then attaches `.onclick`/`.onkeydown`/`.onchange` handlers to the freshly-created elements. Detail view delegates the tab body to `renderPanel()`.
4. **`renderPanel()` + `wire()`** — the detail page's inner loop. `renderPanel()` picks `renderActionsPanel`/`renderActivityPanel`/`renderScheduledPanel` by `activeTab`, sets `innerHTML`, then calls `wire()`.

**The core convention to follow when editing:** every `renderX()` function returns an HTML **string**, and interactivity is wired by tagging elements with `data-*` attributes. `wire()` (or the relevant local wiring block) then `querySelectorAll`s each `data-*` attribute and binds a handler that **mutates a state variable and re-renders** — there is no diffing, the whole panel/table re-renders every time. So adding an interaction = (a) emit the element with a new `data-foo` in a render function, (b) add a binding that reads `el.dataset.foo`, mutates state, re-renders. Always `esc()` interpolated user/data strings unless the value is trusted inline markup (see Agent Summary below), and `e.stopPropagation()` in handlers since rows nest.

Navigating into the detail view (from a worklist row, customer page, or billing page) **resets the entire detail-state block to defaults**, including reassigning `SCENARIO`/`THREADS` and seeding `actionState` from `SCENARIO.initialActionState`. If you add a new piece of detail state, reset it in those handlers too or it will leak across customers.

## Key design decisions and why

### 1. Related events → Agent proposes, grouped by shared cause (Agent Actions tab)

The Agent Actions tab shows the event that triggered a proposal before the proposal itself. Rules:
- Every proposed action cites **exactly one** triggering event via its `cause` field — never more than one, even when an action's content also draws on other account context (see decision #10 for why an earlier attempt at a second citation got cut). `causesOf(action)` is a thin wrapper (0-or-1-length array) kept only so callers have one shape to iterate. An event only ever renders here if a real proposed action is tied to it — no orphan "this also happened" entries with nothing attached.
- When two or more actions share the *exact same* cause, they're grouped under one copy of that event instead of repeating it (Northwind: one email, two action cards nested beneath it; Cobalt Fitness: one email, all 7 action cards nested beneath it). Actions with different causes each get their own event above them, unchanged from the original 1:1 pattern (Fairmont Logistics: 2 emails, 2 separate action nodes).
- `cause.type` is `"email"`, looked up by `id` in `THREADS` — the only kind currently in use; see decision #10 for a cut `"event"` variant.

**Why**: Pooling *all* events above *all* actions (tried and reverted) lost the direct cause→effect link. Strict 1:1-per-action duplicated the event when multiple actions shared it, which looked redundant. Grouping by shared cause gets both: still one event per distinct cause, but no duplication when several actions stem from the same trigger.

### 2. Activity tab: minimal All/Email filter, continuous timeline rail, actor-colored nodes

The Activity tab previously had a two-orthogonal-axis filter system (content-type × actor, with cross-filtered counts and a sliding-pill segmented control). That was killed entirely per feedback that it was more filter chrome than the tab needed, then **deliberately reintroduced in minimal form**: two pill buttons, **All** and **Email** (`.act-filter-tabs` / `.act-ftab`, state `activityFilter`, reset to `"all"` on detail-view entry). "Email" shows only the email-type items in `activityItems()`; there's no per-actor filtering and no search box anymore — if either turns out to be needed again, treat it as a fresh ask rather than restoring the old two-axis system wholesale.

**Event entries match the real PRD Activity Log spec's own vocabulary verbatim** — the actor is bolded inline as part of the entry's `text` itself (`**TABS** changed Status from SENT to PARTIALLY_PAID of Invoice`, `**Collections Agent** set PO 12345 on INV-2241`, `**Priya Sharma** flagged customer: reason`), not appended by the renderer. This replaced an earlier version where `renderActivityBody()` auto-prepended a `**Collections Agent:**` prefix on any `agent:true` row plus a colored "· Auto"/"· Approved" suffix — cut once every scenario's `text` started naming its own actor per the PRD examples, since keeping both would have doubled up ("Collections Agent: TABS changed..."). `cat`/`agent` are still on each event (harmless, may be useful for future filtering) but no longer drive any rendering. The event **timeline is one continuous rail** (`.act-list::before`, a single vertical line spanning the list) rather than per-row segments. Email cards are **full-width and sit on top of the rail** (opaque white, `z-index:1`, no node of their own — the mail icon occupies the gutter and the rail is simply occluded behind them); their body text is inset (`padding-left:6px` + icon + gap) so it lines up with the event-row text at the same x. Events sit on the visible rail as a **plain blue dot** (`.ev-node`, 10px solid circle, `--hi-200`) — a per-event-kind icon treatment (a 32px tinted circle holding a Lucide glyph chosen by `kind`, colored by actor) was tried and reverted back to this simpler uniform dot, so `EVENT_ICON` and `actorOf()` no longer exist. The dot masks the rail. This followed two earlier tries before the icon version: a per-event-row connector that left dangling stubs, and an email-cards-inset-with-hollow-marker variant that read as confusingly indented.

Email rows no longer carry an invoice tag chip — `invoiceTag()` (the `INV-####` pulled from the thread subject) and its `.inv-tag-chip` CSS were removed; the row's own subject/preview text already carries that context.

Engagement badges use one shared system across the Activity list and the drawer delivery report (`engBadge()` → `.eng-badge`): positive states (opened/clicked/delivered) green, negative (bounced/failed) red, each with its own Lucide icon.

### 3. Full thread view (Activity tab) is full-width, not a split pane

Clicking an email in the Activity list opens the thread full-width. Emails oldest-first, Gmail-style: collapsed emails are grey/muted, the most recent is open. The agent draft reply (if any) is wrapped in an email card tile with a darker connector line separating it from the thread history. Each message in a multi-email thread renders as its **own row**, in its own chronological position in the Activity list — threads are never collapsed into one row with a count; a discrete "View thread (N) →" text link sits bottom-right of each card in the thread (not a full-width block) so it doesn't add height. Clicking any message in a thread opens the drawer scrolled to that specific message.

**Drawer thread is styled Gmail-like** (redesigned away from the earlier boxy stack of bordered/grey pill cards): full-width message rows separated by hairline dividers edge-to-edge (no per-message border/radius/background). The redundant grey entity pill (`.ent-strip`) in the message head is gone — the sender name already carries it (e.g. "Dunning Reminder"). Collapsed = one line (sender · snippet · date); expanded = name/date + "to …" + body + delivery report / engagement badges. The agent draft reply is a softened light-blue card (`.td-draft`, thin `#cfe0fa` border, inset margins). **No circular sender avatars** — `.td-avatar` (initials, entity-colored) was tried on every message row and the draft head, then removed for a cleaner text-first look; `entityClass()` is still used elsewhere (the header-modal entity pill) so it wasn't deleted, just its avatar usage.

The `▾` chevron next to recipient names is the only clickable element in an email header. Clicking it opens a modal overlay with from/to/cc details and a per-recipient engagement grid (delivered/opened/clicked/bounced/failed).

**Email preview text wraps up to 3 lines** (both in the Agent Actions tab's related-event card and the Activity tab's email row) instead of hard-truncating at one line — sender/date/"Open" link moved to their own metadata row above the body so it has room.

An **expanded message shows the sender's raw email** next to their name, Gmail-style (`Dana Reed <finance@meridiangroup.com>`, muted `.td-who-email`) — from only, not to/cc (those already show truncated + the full detail is one chevron-click away via the header modal above). **Attachment chips are clickable** (`data-open-attachment`, `openMockAttachment()`) — there's no real file behind them, so clicking opens a new tab with a plain "preview unavailable in this prototype" placeholder rather than doing nothing, so the chip doesn't read as a dead decoration.

The delivery summary line reads **"Delivered to X of Y"** — tried "Sent to X of Y" briefly (`s.delivered` in `deliverySummary()` is really a not-bounced count, so "Sent" was arguably more accurate), reverted back per feedback.

### 4. Email thread drawer is a fixed width, not resizable

The right-side email drawer opens at a static `560px` (`max-width:94vw` on small viewports). It used to have a drag handle on its left edge for widening/narrowing, clamped between 420px and 94% of viewport width (`setupDrawerResize()`, `.drawer-resize-handle`) — cut for being an extra piece of interactive chrome the drawer didn't need; it's simpler as a fixed panel. Implementation note that still applies: the drawer's open/close animation uses `transform: translateX()`, not a hardcoded `right` offset — this matters because a fixed-pixel offset would leave part of a wider drawer visibly on-screen when "closed" (moot now that width never changes, but a fixed offset would be a trap for a future resize revival).

### 5. Send email card: collapsed bird's-eye + expand to edit, minimal composer

The send-email action card shows a compact bird's-eye by default (description, attachment count, Edit/Reject/Approve). Editing happens in the thread drawer via `renderDraftEditor()` — To and Cc pill rows, a plain textarea, nothing else above it. **No Subject field**: it doesn't change reviewer confidence in a reply that's already scoped to one thread — the drawer header (`.ed-subject`) still shows the thread's subject for context. A folded "To: primary + N others (To and Cc combined)" version was tried in between (no separate Cc row, just a passive count) and reverted back to the plain two-row To/Cc pill list — Cc needed to stay individually visible/editable, not folded away. **No AI-refine tools and no formatting toolbar here on `main`**: both the Gmail-style "describe your change" bar (Polish/Serious/Friendly/Shorter quick tools, undo/redo, streaming rewrite) and the decorative bold/italic/strike/link/list toolbar (`.cmp-toolbar`/`.cmp-tool`, never wired to anything) were cut — the AI tools in the July descope to reduce FE lift, the formatting toolbar as a follow-up simplification. Both are intact on the `august` branch (`AI_VARIANTS`, `mockRefine()`, `aiRefineDraft()`, `aiUndoRedo()`, `typeInto()`, `.cmp-ai*`/`.cmp-toolbar` CSS) if either needs to come back.

**"Edit in thread" deep-links straight to the draft input**: clicking it (`openDraftEditorInDrawer()`) doesn't just open the thread drawer in edit mode — it also focuses the `.cmp-body` textarea, places the cursor at the end, and scrolls it into view, so you land directly in the editable draft instead of having to find and click into it after the drawer opens.

**Em-dash convention:** agent-generated copy (draft bodies, agent-sent email bodies, agent subjects, `agentSummary`, dunning subjects) deliberately **avoids em-dashes** — they read as an AI tell — using semicolons, commas, colons, or separate sentences instead. Human-authored inbound mail (customer Dana/Tom, merchant Priya's personal note) and system activity-log event `text` intentionally keep em-dashes, so keep that split if you add data.

### 6. Scheduled tab: agent tasks + dunning as a computed line

Shows agent scheduled tasks (editable: datetime + prompt, deletable) and computes the next dunning reminder date from the customer's dunning sequence — no individual dunning tiles, since we can't reliably enumerate them from the current data model (and dunning itself is Fast Follow, out of scope for this build).

**Open design question, not yet reflected in this build:** whether `schedule_task` should exist as a generic tool at all. Every real use of it in this prototype is actually a payment-status check, which arguably belongs to a dedicated Promise-to-Pay entity (with its own logged/due/broken lifecycle emitting events) rather than a freeform natural-language scheduled prompt. If that change lands, the Scheduled tab likely narrows to "pending PTPs awaiting their due date" + the dunning line, and `schedule_task` may not survive as a distinct tool. Not built yet — call this out to Marshall if it's relevant to what you're reviewing.

### 7. Collections Worklist

Nav item under Invoicing, alongside Billing / Credit memos / Invoice Kanban. The pre-existing invoice-status Kanban board (real product name: "Collections" — Sent/Overdue/Paid columns) is relabeled **"Invoice Kanban"** here to avoid colliding with this new "Collections Agent" item, and is intentionally inert (no click behavior) — it's a placeholder for the pre-existing page, not part of this build.

No summary stat cards above the table (an earlier "Needs review" / "Last 30 days" tile strip was tried, then removed as noise the table itself already communicates). A follow-up "agent identity" status line (`.agent-voice`, four small pulsing marks + "N actions ready for your review") was also tried and then cut in the July descope along with the rest of the agent-identity sparkle treatment — it's on `august` if it comes back into scope.

**Worklist status (`planStatus`) has four values: Needs Review, Executed, Rejected, Failed.** There's no "Executing" (nothing in this prototype models an in-flight/async execution state) and no "Approved" as a worklist-level status — once a plan is approved it's executed, so the row status reflects that end state directly rather than the intermediate approval. **Failed** is distinct from **Rejected**: Rejected means a human said no, Failed means the agent tried to execute the plan and it didn't go through (e.g. a send failed) — a real, human-independent outcome the filter needed a value for. (`planStatus` is distinct from `actionState`, the per-action verdict on the detail page, which still uses "approved"/"rejected"/"auto" — that's about a human approving one action, not the worklist's summary of a customer's overall plan.)

- **No column picker** — all columns in `INBOX_COLUMNS` always show; there used to be a "Configure columns" icon button letting you hide everything but Customer/Status/Total overdue, cut for being a control nobody asked to use in a prototype with a fixed column set.
- **Columns, in display order**: Customer (pinned, carries flag icon + "Agent Paused" badge), Status (pinned), What happened, Agent actions (wider — `width:230px`, min 210px — since action descriptions run longer than most columns), Total overdue (pinned), Total outstanding, Oldest overdue (days), Open invoices (a plain right-aligned **count**, `r.invoices.length` — was per-invoice pill tags, changed since a customer's exact invoice numbers aren't useful at a glance in this column; sortable like the other numeric columns via `sortValue()`'s `"invoices"` case). A zero Total overdue renders as an em dash, not "$0.00" in red — same empty-state treatment as Oldest overdue when there's no overdue invoice to date.
- **Rows are a fixed height** (`.inbox-table tbody tr{height:72px}`) regardless of content — "What happened" clamps to 2 lines (`.event-text`, `-webkit-line-clamp`) and Agent actions caps at 2 single-line bullets (`.act-bullets li` truncates with ellipsis, cell renderer slices to `.slice(0,2)`), so no row grows taller than the fixed height even with longer text.
- **Search** sits immediately left of "Add filter" — live-filters rows by customer name as you type.
- **"Add filter" button matches the real Tabs tertiary-button pattern**: `list-filter` Lucide icon + label, tertiary-shade fill (`--tertiary`/`--tertiary-hover`), `border-radius:6px`, not a plain text-only button.
- **Filters are real**, not decorative, and match the real Add-filter interaction pattern (not a step-through-and-replace flow): clicking "Add filter" opens a **dimension list on the left** (Status, Flag, Paused, Total outstanding, Total overdue, Oldest overdue) and, once you click one, its **value panel appears to the right of it** — both visible at once. `FILTER_DEFS` entries have a `kind`: **`"categorical"`** (Status, Flag, Paused) renders a checkbox list, multi-select, so e.g. Status can filter to Needs Review *and* Failed at once; **`"numeric"`** (Total outstanding, Total overdue, Oldest overdue) renders 5 operator radios (Equal to / Greater than / Greater than or equal / Less than / Less than or equal, `NUMERIC_OPERATORS`) plus a single `$` amount input that applies live as you type. Both panel kinds end in a **Reset** button that clears just that dimension's filter without closing the dropdown. Checking a box or typing an amount applies immediately — there's no separate "Apply" step. Each dimension still becomes one removable chip (`.filter-chip`) once it has a value, and chips AND together against the row set (`activeFilters` + `filterMatches()`). Deliberately excludes What happened, Agent actions, Customer, and Open invoices as filter dimensions — those are what you're triaging, not axes you narrow by. **The worklist opens with a default "Status: Needs Review" chip already applied** (`activeFilters` initial value) rather than showing everything.
- **Status now has a 4th real value: Failed** (distinct from Rejected — see the `planStatus` note above), added directly into `FILTER_DEFS.status.options` and `DUMMY_STATUSES` so the filter is meaningful, not just decorative.
- **Pagination is numbered pages** (`‹ 1 2 3 … 13 ›`, matching the real pattern), not "Page X of Y" text — `pageNumbersToShow()` shows every page up to 7 total, or first/last/current±1 with `…` collapsing the rest for longer lists. `data-page-goto` jumps straight to a page; `data-page-nav` still drives the prev/next arrow buttons.
- **Sorting is real** on the four amount/day/count columns (Total outstanding, Total overdue, Oldest overdue, Open invoices): click a header to sort by it (toggles asc/desc on repeat clicks), via `inboxSort` + `sortRows()`/`sortByKey()`/`sortValue()`. **Defaults to Total overdue, descending**, paired with the default Needs Review filter — so the worklist opens sorted to the most-overdue customer needing a look first. **Clickable rows always sort as a block above every inert row**, regardless of the active sort key — `sortRows()` partitions by `SCENARIOS_BY_ID[r.id]` first, then applies the chosen sort within each partition — so the 4 real scenarios never get buried among the 300 filler rows.
- **Pagination**: 25 rows per page (`INBOX_PAGE_SIZE`), simple Prev/Next controls under the table, respecting the current search + filters. The table ships **300 generated filler rows** (`WORKLIST_DUMMY` / `makeDummyRow()`, deterministic index-derived data, not `Math.random()`, so it looks the same on every reload) alongside the 6 hand-built rows, to exercise real scale. **Only Meridian, Northwind, Fairmont Logistics, and Cobalt Fitness are clickable** — those are the only four with a real detail-page scenario behind them (`SCENARIOS_BY_ID`); Atlas, Riverside, and all 300 filler rows render with `.row-inert` (no pointer cursor, no click) since they have nothing to navigate to.
- The table wrapper scrolls horizontally (`overflow-x:auto`) rather than clipping when columns don't fit the viewport.
- **Why Agent actions/What happened are two columns, not one**: mixing them ("Dana asked for X so agent will do Y") in one cell loses the cause→effect distinction and makes the table hard to scan. What happened = what the customer did; Agent actions = what the agent is proposing to do about it.

### 8. Additional affordances on the customer detail page

Always visible in the title row regardless of active tab: a **Flag** toggle (outline/filled, `#flagBtn`; still backed by the `agentEscalated`/`escalated` state and field names internally — only the user-facing label and copy changed from "Escalate" to "Flag"), Pause/Resume Agent, and an "Agent permissions" text link. The Flag button's hover tooltip explains what flagging does rather than just naming the action: "Flag this customer — makes your agent aware of the flag and filterable on the Collections Agent table." The permissions link currently has nowhere real to route to, since the LLM policy block it would open is Fast Follow — left in place as a placeholder, not wired to a stub.

**Clicking Flag (in either direction) doesn't toggle it directly** — it opens a small inline popover (`.flag-popover`, state `flagPopoverOpen`) anchored right under the button asking why, with a textarea and Cancel/Confirm. Only Confirm actually flips `agentEscalated`; Cancel or a click outside just closes the popover with no change. Deliberately a small anchored popover, not a full modal overlay — matches the app's other small popovers (`.filter-dropdown` etc.) rather than introducing a new heavier pattern. The typed reason isn't persisted or shown anywhere yet (no activity-log entry, no tooltip) — that's a reasonable next step if this needs to feel more real, not built since it wasn't asked for.

**Clicking Pause is destructive, and only warns when it actually would be.** `pausePendingCounts()` checks the current customer's undone scheduled tasks and actions still awaiting review; if either is nonzero, clicking Pause opens a real modal (`openPauseWarningModal()`, reusing the app's dormant generic `.scrim`/`.modal`/`h3`/`p`/`.row` pattern — this is its first real use) naming exactly what will be lost ("Pausing will delete 2 scheduled tasks and 1 action needing review. This can't be undone."), with Cancel/"Pause & clear". Confirming both pauses *and* clears: every undeleted `agent_task` goes into `deletedTasks`, and every action with no verdict yet gets `actionState[i]="paused"` (its own verdict, `verdictHtml()`'s "Cleared — agent paused", not lumped in with "Rejected" — a human rejecting an action and a pause wiping it out are different things and shouldn't look the same in the UI). If there's nothing pending, Pause has nothing to warn about and applies immediately, same as before. Resume is unaffected — no confirmation, no restoration of what was cleared; the agent just starts fresh from here.

### 9. Agent Summary: three fixed slots, 3-4 lines (Key facts can be 1 or 2), no bullet marks, no conditional flag

Went through a Recommendation/Why/Evidence broken-out-**sections** version (each its own labeled block/card) and reverted — that read as "blue on blue" and added structure without adding clarity. Also tried a bulleted list with a small caption below/above each bullet's dot — the dot itself added nothing (there's no comparison being made between items) and fought with the caption for attention. Landed on: no bullet marks at all, just a small mono-uppercase slot label (`.as-slot`) followed directly by its plain text (`.as-line`) underneath, stacked. `SCENARIO.agentSummary` is a plain array of strings (bold via `**...**`), rendered by `renderAgentSummary()` as a single `<ul class="as-bullets">` (kept as a `<ul>`/`<li>` for structure/spacing only — `list-style:none`, no marker renders).

Each entry's label is derived from position, not a parallel array: first is always Trigger, last is always Recommendation, everything between is Key facts. When `agentSummary` has two consecutive strings for the same slot (Northwind's two Key facts), `renderAgentSummary()` groups them into one `<li>` and joins the strings with a space rather than rendering two separate lines — it's one fact continuing into a second sentence under one label, not two list entries with a gap between them. That grouping is also what lets the list flex between 3 and 4 source strings without any per-scenario bookkeeping of which slot is which.

**Why open-ended LLM generation for this was unreliable in practice**: a single unconstrained generation has to simultaneously (a) figure out what *kind* of situation it's looking at and (b) pick the right facts for that specific kind, every time, from scratch. Decoupling those into a classify-then-fill-template step is what actually fixed it. Validated by reconstructing 9 real triggers from production data (AirOps, Meter, Attentive — disputes, claimed-paid conflicts, non-response escalations, and routine closeouts) and drafting this shape of summary against the real email threads: it held up read-only, without needing to click into the thread, across all of them.

**Three fixed slots, in this order, 3-4 bullets total:**
1. **Trigger** (exactly 1 bullet) — what the customer actually said/asked, stated plainly. This one is close to deterministic: it's describing an event that already happened, not summarizing a judgment call.
2. **Key facts** (1-2 bullets) — the narrow, scoped facts a reviewer needs: the invoice's dollar/overdue state, plus any other single fact that's load-bearing enough to change the read if left out (e.g. Northwind's "the contact update already auto-executed"). **Split into two bullets rather than cramming** when there are two genuinely separate facts (Northwind: one bullet for the auto-executed contact update, a second for the invoice's overdue state) — don't force a second Key facts bullet when there's only one fact worth stating (Meridian stays at 3 total).
3. **Recommendation** (exactly 1 bullet) — why approving the proposed action(s) is safe (nothing outside what was asked, no dispute), or, for a genuine dispute/conflict, what's actually being asked for rather than an assumption either way.

The framing question when writing these for a new scenario is still *how do I convince a user to just click approve, fast?* — not "summarize everything that happened."

**No 4th "flag" bullet for escalation.** An earlier version of this framework added a conditional bullet that fired only when a customer was flagged/escalated, to call that out in the summary text. Cut it: the product already has a real, first-class control for exactly that (the Flag button + reason popover, decision #8) — a bullet that says "this is escalated" would just be restating in prose what the Flag badge on the row already shows. The only thing that varies bullet count is a second Key facts bullet, never escalation state.

Tried a real-time character-by-character typing effect on open (matching the AI-refine composer's "Polish" streaming, plus a sweep/pulse glow on the box), and a small static agent-mark next to the label — both reverted/cut in the July descope. `renderAgentSummary()` is a pure function of `SCENARIO.agentSummary`, bullets render complete the instant the page opens, no motion, no delay, no icon.

### 10. Multi-event citation stays cut on `july`: one cause per action, always

A multi-cause version was tried during the Fairmont Logistics build — an action's `cause` field becoming a plural `causes` array so one action could cite two different triggering events at once, plus a `cause.type:"event"` variant for citing a system/log trigger with no associated email — then reverted within the same session: **an action can't have two triggering events.** A proposed action fires off one real trigger, so it cites one. Fairmont's third action, which was meant to demonstrate this, didn't actually need a second citation — just access to account context (a contact address a different, earlier action had already set), which the agent already has without needing to "cite" it as a cause. Rather than keep that action around with a single (real) cause, it was dropped entirely — Fairmont is simpler for it: 2 unrelated emails, 2 actions, done. `cause.type:"email"` (looked up in `THREADS`) is the only kind in the data or the renderer now; nothing produces a plural `causes` or a `type:"event"` cause anymore.

Separately, an *earlier* (August-only) multi-cause attempt added hover-highlighting on top of plural causes — hovering an action to highlight every event it cited (blue dot/text) and darken the rail segments connecting them (`wireTimelineHover()`, `.cited-hl`/`.rail-hl`, `causeKey()`/`primaryCause()`). That's still cut from `july` and lives only on `august`. If multi-cause citation comes up again, the Fairmont experience above is a reason to first confirm the product actually allows an action to have more than one trigger before rebuilding either version.

**Rail rendering is still one continuous spine, not per-node segments stitched end to end** (this part wasn't reverted — it's a correctness fix, not part of the hover feature). The original approach drew the vertical connector as a `::before` on each `.tl-node`, relying on one node's box ending in exactly the right place for the next node's segment to pick up with no gap — it looked disjointed as soon as Meridian split into two separate `.tl-node`s (a single node with two nested actions, like Northwind, never exposed the bug). Fixed by giving `.tl` itself one continuous `::before` spine (anchored to the first dot's center, running to the container's bottom, which lines up with the last node's dot since that node has no trailing padding) that alone renders the line — no per-node segments involved anymore now that hover is gone too.

### 11. Generic action cards: editable when there's a real value, boolean when there isn't

`renderActionCard()` has three shapes now, not two: the dedicated `send_email` card, the dedicated `update_contacts` card (single editable value, used by Meridian/Northwind/Fairmont's simple contact-change actions), and a **generic editable-fields card** for everything else that has a real value the agent inferred and a reviewer might want to correct — `update_po`, `update_customer_info`, `apply_cash_app`, `schedule_task` on Cobalt Fitness. Any proposed action with a non-empty `a.editableFields` array (`[{label, value}, ...]`) gets the same collapsed/expand-to-edit pattern as the contact card, generalized to N labeled inputs instead of one (`isGenericEditable` in `renderActionCard()`, `data-savegeneric` wiring, `editValues[i]` holding an array instead of a single string for these).

**Not every action gets this.** `mark_pending` and `flag_customer` have nothing to edit — marking an invoice pending or flagging a customer is a boolean (you do it or you don't), not a value with a right answer to double-check. Those stay plain Approve/Reject, same as before. The dividing line: if the action's `desc` names a specific value (a PO number, a contact, a wire reference, a date) that came from the agent's own read of the email rather than being inherent to the action type itself, it's a candidate for `editableFields`.

### 12. Outstanding Invoices table: bordered card, sortable, status colored only when overdue

Restyled to match a real Tabs data-table component: a bordered, rounded container (`.inv-table-wrap`) around the table, header row on `--n50`, row hairlines instead of a bottom-heavy totals row, hover highlight per row. The **"OUTSTANDING INVOICES"** label is mono/uppercase in `--moss-500` (a new token; the real Tabs value wasn't at hand, so this is a reasonable moss-green approximation, not a verified brand hex). **Status** renders as small mono uppercase text (`.inv-status`) — neutral gray by default, red only when the status is literally "Overdue" (`.inv-status.overdue`) — not a colored pill/chip. **Due** and **Amount** are sortable (`invSort` state, `invSortValue()`/`sortInvoicesList()`, `data-inv-sort-key` on the `<th>`, mirroring the worklist's own `inboxSort` pattern at a smaller scale) with a Lucide arrow-up-down icon that dims when that column isn't the active sort. The **Total Outstanding** summary row was dropped entirely to match the referenced pattern, which doesn't have one — if that total needs to come back, it's gone from both the markup and `renderDetailHeader()`'s dead `totalOut` calculation (removed along with it).

## Mock data

Four scenarios, each a `SCENARIO_*` object + matching `THREADS_*` array (see "Four scenarios" above for the narratives). Each `SCENARIO_*` holds:
- `agentSummary` — a plain array of 3-4 strings across 3 fixed slots (Trigger, Key facts x1-2, Recommendation; bold via `**...**`), rendered in the blue "Agent Summary" callout via `renderAgentSummary()`. See decision #9.
- `invoices` — outstanding invoice data for that customer.
- `proposed` — the action cards, each citing its triggering event(s) via `cause` (single) or `causes` (array) — see `causesOf()` and decision #1. Kinds beyond `send_email`/`update_contacts` (`mark_pending`, `update_po`, `update_customer_info`, `flag_customer`, `apply_cash_app`, `schedule_task`) get their card title from `ACTION_TITLES` and render through the generic card, which — unlike the dedicated contact-card branch — shows the full `desc` (needed for `update_customer_info`, which can bundle a contact + CC + address change that wouldn't fit the contact card's single editable value).
- `scheduled` — agent tasks and dunning data.
- `events` — all non-email Activity-log events for this customer, written in the real PRD Activity Log spec's own vocabulary (actor bolded inline in `text` — see decision #2).
- `initialActionState` (optional) — pre-seeds `actionState` on load, e.g. `{0: "auto"}` for Northwind's auto-executed contact update.

`WORKLIST = [...WORKLIST_REAL, ...WORKLIST_DUMMY]` — `WORKLIST_REAL` is the six hand-built rows (Meridian, Northwind, Fairmont Logistics, Cobalt Fitness, Atlas Robotics, Riverside Media), `WORKLIST_DUMMY` is 300 deterministically-generated filler rows (`makeDummyRow()`) added to exercise pagination/filtering at scale. Only the four scenario customers have full detail pages (`SCENARIOS_BY_ID`) and are clickable; every other row, real or generated, is inert. See decision #7.

## Palette (Toretto Library tokens)

```
--primary / --ink:  #1c1c1a   (primary text, warm-black nav)
--n500 / --helper:  #75786f   (secondary/muted)
--border / --line:  #d3d4d0   (borders)
--n50 / --soft:     #f3f3f2   (hover / background)
--hi-200 / --blue:  #2476d8   ("jolly" blue — interactive / links / accent)
--critical / --warn:#e52834   (destructive / overdue)
--positive / --good:#15ac3f   (success / auto-executed)
--insight:          #8652ff   (purple, used sparingly)
--header:           #d3d6c2   (sage top-banner)
```
