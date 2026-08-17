/* ============================================================
   Collections Agent — v6
   Two views: Collections Agent worklist (customer table) + Customer detail
   ============================================================ */

// ============================================================
//  ICONS
// ============================================================
const SV = (p) => `<svg viewBox="0 0 16 16" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
// Lucide icons (https://lucide.dev) — 24px grid, 2px stroke, currentColor. Inlined so they survive the re-render loop.
const LU = (p) => `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const ICON = {
  check:    LU('<path d="M20 6 9 17l-5-5"/>'),
  x:        LU('<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>'),
  clip:     LU('<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>'),
  user:     LU('<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
  flagOut:  LU('<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>'),
  flagFill: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="var(--critical)" stroke="var(--critical)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7" fill="none"/></svg>`,
};

// Left-nav icons — Lucide (https://lucide.dev), outline, currentColor.
const NAV_ICON = {
  overview:     LU('<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>'),
  customers:    LU('<path d="M15 13a3 3 0 1 0-6 0"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><circle cx="12" cy="8" r="2"/>'),
  contracts:    LU('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>'),
  invoicing:    LU('<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>'),
  usage:        LU('<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>'),
  revenue:      LU('<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>'),
  reporting:    LU('<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>'),
  data:         LU('<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>'),
  developers:   LU('<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>'),
  integrations: LU('<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="m6.08 9.5-3.48 1.59a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.48-1.58"/><path d="m6.08 14.5-3.48 1.59a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.48-1.58"/>'),
  settings:     LU('<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>'),
  userc:        LU('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/>'),
  logout:       LU('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>'),
  agent:        LU('<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>'),
  chev:         LU('<path d="m6 9 6 6 6-6"/>'),
  collapse:     LU('<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/>'),
};

// Four copies of the same NAV_ICON.agent glyph pointing outward from a shared center —
// the "agent identity" mark for the worklist's status line (see .agent-voice below).
function agentClusterIcon(extraClass){
  const path = '<path fill="currentColor" d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/>';
  return `<span class="av-icon${extraClass?` ${extraClass}`:""}">
    <svg class="av-star av-n" viewBox="0 0 24 24">${path}</svg>
    <svg class="av-star av-e" viewBox="0 0 24 24">${path}</svg>
    <svg class="av-star av-s" viewBox="0 0 24 24">${path}</svg>
    <svg class="av-star av-w" viewBox="0 0 24 24">${path}</svg>
  </span>`;
}

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
function mdToHtml(t){ return t.trim().split(/\n\n+/).map(p=>`<p>${p.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,' ')}</p>`).join(''); }
function mdInline(t){ return t.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>'); }
// Flat bullets, not broken-out sections. Always 3 fixed slots, in order, but "Key facts" may
// be 1 or 2 bullets (so the list is 3-4 bullets total, never more, never fewer):
//   1. Trigger     - what the customer actually asked/said (deterministic; not "summarized," just stated)
//   2. Key facts (1-2) - the narrow scoped facts a reviewer needs: invoice amount/overdue state, plus
//                    any other fact load-bearing enough to change the read (e.g. an action already auto-executed).
//                    Split into two bullets rather than cramming when there are two genuinely separate facts.
//   3. Recommendation - why approving the proposed action(s) is safe, or what's actually being asked
//                    for when it isn't (a dispute) - the "click Approve" close
// No conditional 4th "flag" bullet for escalation: that already has a real control (the Flag button,
// decision #8) - a text bullet restating "this is escalated" would just duplicate a decision the UI
// already surfaces. The only reason the count varies is a second Key facts bullet.
// Slot is derived from position, not a parallel array: first = Trigger, last = Recommendation,
// everything between is Key facts - so this keeps working whether agentSummary has 3 or 4 items.
// When Key facts is 2 strings, they render as ONE block of text (joined with a space), not two
// separate lines with a gap between them - it's one fact continuing into a second sentence, not
// two distinct list entries.
function renderAgentSummary(s){
  const n = s.agentSummary.length;
  const groups = [];
  s.agentSummary.forEach((b,i)=>{
    const slot = i===0 ? "Trigger" : (i===n-1 ? "Recommendation" : "Key facts");
    const g = groups[groups.length-1];
    if(g && g.slot===slot) g.parts.push(b); else groups.push({slot, parts:[b]});
  });
  const items = groups.map(g=>`<li><span class="as-slot">${g.slot}</span><div class="as-line">${g.parts.map(mdInline).join(" ")}</div></li>`).join("");
  return `<ul class="as-bullets">${items}</ul>`;
}
function entityClass(e){ return {customer:"customer",system:"system",dunning:"system",agent:"agent",merchant:"merchant"}[e]||"system"; }
function entityLabel(ec, override){ return override || {customer:"Customer",system:"System",dunning:"Dunning",agent:"Agent",merchant:"Merchant"}[ec]||"System"; }
// Engagement badge — same visual system as the drawer delivery report: positive states
// (opened/clicked/delivered) green, negative (bounced/failed) red, each with its own icon.
function engBadge(kind){
  const I = {
    delivered: LU('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'),
    opened:    LU('<path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0z"/><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/>'),
    clicked:   LU('<path d="M14 4.1 12 6"/><path d="m5.1 8-2.9-.8"/><path d="m6 12-1.9 2"/><path d="M7.2 2.2 8 5.1"/><path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"/>'),
    bounced:   LU('<path d="m9 9 6 6"/><path d="m15 9-6 6"/><circle cx="12" cy="12" r="10"/>'),
    failed:    LU('<path d="m9 9 6 6"/><path d="m15 9-6 6"/><circle cx="12" cy="12" r="10"/>'),
  };
  const label = { delivered:"Delivered", opened:"Opened", clicked:"Clicked", bounced:"Bounced", failed:"Failed" }[kind] || kind;
  const tone = (kind==="bounced"||kind==="failed") ? "neg" : "pos";
  return `<span class="eng-badge ${tone}"><span class="eb-ic">${I[kind]||""}</span>${esc(label)}</span>`;
}

// ============================================================
//  DATA
// ============================================================
const WORKLIST_REAL = [
  {
    id: "meridian",
    customer: "Meridian Group",
    invoices: ["INV-2241","INV-2243","INV-2250","INV-2255","INV-2260"],
    outstandingAmt: 23340,
    overdueAmt: 5390,
    eventSummary: "Dana Reed still needs a signed W-9; the contact and address updates she asked for are already applied",
    proposedActions: ["Send email"],
    escalated: false,
    planStatus: "review",
    paused: false,
    mostOverdueDays: 21,
  },
  {
    id: "northwind",
    customer: "Northwind Traders",
    invoices: ["INV-3102","INV-3110","INV-3125"],
    outstandingAmt: 42300,
    overdueAmt: 28100,
    eventSummary: "Tom Reilly asked to update the billing contact and requested a resend of INV-3102",
    proposedActions: ["Update primary billing contact","Send email"],
    escalated: true,
    planStatus: "review",
    paused: false,
    mostOverdueDays: 35,
  },
  {
    id: "atlas",
    customer: "Atlas Robotics",
    invoices: ["INV-2988"],
    outstandingAmt: 7600,
    overdueAmt: 0,
    eventSummary: "Customer confirmed remittance details; agent matched $7,600 payment to INV-2988",
    proposedActions: ["Match transaction","Mark invoice paid"],
    escalated: false,
    planStatus: "executed",
    paused: false,
    mostOverdueDays: null,
  },
  {
    id: "riverside",
    customer: "Riverside Media",
    invoices: ["INV-4410"],
    outstandingAmt: 3200,
    overdueAmt: 3200,
    eventSummary: "Customer disputed the invoice; agent paused for this customer pending manual review",
    proposedActions: [],
    escalated: false,
    planStatus: "executed",
    paused: true,
    mostOverdueDays: 12,
  },
  {
    id: "fairmont",
    customer: "Fairmont Logistics",
    invoices: ["INV-7710","INV-7688"],
    outstandingAmt: 7600,
    overdueAmt: 6400,
    eventSummary: "Two unrelated asks: a contact update and a separate invoice resend",
    proposedActions: ["Update primary billing contact","Send email"],
    escalated: false,
    planStatus: "review",
    paused: false,
    mostOverdueDays: 6,
  },
  {
    id: "cobalt",
    customer: "Cobalt Fitness",
    invoices: ["INV-5520","INV-5521"],
    outstandingAmt: 13200,
    overdueAmt: 0,
    eventSummary: "One email covering seven separate asks: hold, PO, contact/address, wire match, flag, check-in, contract",
    proposedActions: ["Mark invoice pending","Update PO number","Update customer info","Apply cash app recommendation","Flag customer","Schedule task","Send email"],
    escalated: false,
    planStatus: "review",
    paused: false,
    mostOverdueDays: null,
  },
];

// Volume filler for the worklist so pagination/filtering/sorting can be exercised at realistic
// scale. None of these rows have a matching entry in SCENARIOS_BY_ID, so — like Atlas and
// Riverside above — clicking one does nothing; only Meridian and Northwind open a detail page.
// Deterministic (index-derived), not Math.random(), so the table looks the same on every reload.
const DUMMY_NAMES = ["Alderin","Brightwell","Cascade","Driftwood","Emberly","Fenwick","Granite","Hollow Creek","Ironclad","Juniper","Kestrel","Lattice","Meadowlark","Norwood","Oakmont","Pinegrove","Quarrystone","Ridgeline","Sablewood","Thistledown","Underhill","Vantage","Westmere","Yarrow","Zephyr","Amberfield","Birchgate","Copperline","Elmsworth","Foxglove"];
const DUMMY_SUFFIXES = ["Inc.","LLC","Group","Partners","Holdings","Co.","& Sons","Industries","Ventures","Supply Co."];
const DUMMY_STATUSES = ["review","executed","rejected","failed"];
const DUMMY_EVENTS = [
  "Customer requested an updated copy of their invoice",
  "Payment attempt failed due to insufficient funds",
  "Customer asked about extended payment terms",
  "Invoice marked as disputed by customer",
  "Customer confirmed payment is in process",
  "No response after third reminder email",
  "Customer requested a consolidated statement of all open invoices",
];
const DUMMY_ACTIONS = [
  ["Send email"],
  ["Send email","Update primary billing contact"],
  ["Match transaction"],
  ["Match transaction","Mark invoice paid"],
  [],
];
function makeDummyRow(i){
  const name = DUMMY_NAMES[i % DUMMY_NAMES.length];
  const suffix = DUMMY_SUFFIXES[Math.floor(i / DUMMY_NAMES.length) % DUMMY_SUFFIXES.length];
  const outstandingAmt = 1200 + (i * 137) % 48000;
  const overdueAmt = (i % 3 === 0) ? 0 : Math.round(outstandingAmt * (0.2 + (i % 5) * 0.15));
  const status = DUMMY_STATUSES[i % DUMMY_STATUSES.length];
  return {
    id: `dummy-${i}`,
    customer: `${name} ${suffix}`,
    invoices: [`INV-${5000 + i}`],
    outstandingAmt,
    overdueAmt,
    eventSummary: DUMMY_EVENTS[i % DUMMY_EVENTS.length],
    proposedActions: status === "review" ? DUMMY_ACTIONS[i % DUMMY_ACTIONS.length] : [],
    escalated: i % 11 === 0,
    planStatus: status,
    paused: i % 13 === 0,
    mostOverdueDays: overdueAmt > 0 ? 1 + (i * 7) % 90 : null,
  };
}
const WORKLIST_DUMMY = Array.from({ length: 300 }, (_, i) => makeDummyRow(i));
const WORKLIST = [...WORKLIST_REAL, ...WORKLIST_DUMMY];

// Collections Agent worklist column config. All columns always show — there's no picker to
// hide any of them. Order here is display order.
const INBOX_COLUMNS = [
  { key:"customer", label:"Customer", pinned:true },
  { key:"status", label:"Status", pinned:true },
  { key:"event", label:"What happened" },
  { key:"actions", label:"Agent actions" },
  { key:"overdue", label:"Total overdue", sortable:true, align:"r", pinned:true },
  { key:"outstanding", label:"Total outstanding", sortable:true, align:"r" },
  { key:"oldestOverdue", label:"Oldest overdue", sortable:true, align:"r" },
  { key:"invoices", label:"Open invoices", sortable:true, align:"r" },
];

// Worklist "Add filter" definitions — each maps to a predicate over a row. "Flag" (formerly
// "Escalate") reads the same `escalated` field as the detail-page flag control.
// Two filter shapes, matching the real Add-filter pattern:
// - "categorical": a checkbox list, multi-select (Status, Flag, Paused).
// - "numeric": an operator radio (Equal to / Greater than / ≥ / Less than / ≤) + a $ amount
//   field (Total outstanding, Total overdue, Oldest overdue).
const FILTER_DEFS = {
  status:        { label:"Status", kind:"categorical", options:[
                    {value:"review", display:"Needs Review"},
                    {value:"executed", display:"Executed"},
                    {value:"rejected", display:"Rejected"},
                    {value:"failed", display:"Failed"},
                  ]},
  escalated:     { label:"Flag", kind:"categorical", options:[
                    {value:"true", display:"Flagged"},
                    {value:"false", display:"Not flagged"},
                  ]},
  paused:        { label:"Paused", kind:"categorical", options:[
                    {value:"true", display:"Paused"},
                    {value:"false", display:"Not paused"},
                  ]},
  outstanding:   { label:"Total outstanding", kind:"numeric" },
  overdue:       { label:"Total overdue", kind:"numeric" },
  oldestOverdue: { label:"Oldest overdue", kind:"numeric", unit:"days" },
};
const NUMERIC_OPERATORS = [
  { value:"eq",  display:"Equal to" },
  { value:"gt",  display:"Greater than" },
  { value:"gte", display:"Greater than or equal" },
  { value:"lt",  display:"Less than" },
  { value:"lte", display:"Less than or equal" },
];
function numericFieldValue(r, type){
  if(type==="outstanding") return r.outstandingAmt||0;
  if(type==="overdue") return r.overdueAmt||0;
  if(type==="oldestOverdue") return r.mostOverdueDays==null ? 0 : r.mostOverdueDays;
  return 0;
}
function numericDisplay(def, operator, amount){
  const symbol = {eq:"=",gt:">",gte:"≥",lt:"<",lte:"≤"}[operator] || "";
  const amt = def.unit==="days" ? `${amount} days` : fmtMoney(Number(amount)||0);
  return `${symbol} ${amt}`;
}
function filterMatches(r, f){
  if(f.mode==="categorical") return f.values.includes(String(f.type==="status"?r.planStatus:f.type==="escalated"?!!r.escalated:!!r.paused));
  if(f.mode==="numeric"){
    const v = numericFieldValue(r, f.type), n = Number(f.amount);
    switch(f.operator){
      case "eq": return v===n;
      case "gt": return v>n;
      case "gte": return v>=n;
      case "lt": return v<n;
      case "lte": return v<=n;
      default: return true;
    }
  }
  return true;
}
function sortValue(r, key){
  switch(key){
    case "outstanding": return r.outstandingAmt||0;
    case "overdue": return r.overdueAmt||0;
    case "oldestOverdue": return r.mostOverdueDays==null ? -1 : r.mostOverdueDays;
    case "invoices": return r.invoices.length;
    default: return 0;
  }
}
// Rows with a real detail page behind them (SCENARIOS_BY_ID) always sort as a block above
// everything else — otherwise the 4 clickable customers get buried among 300 inert filler rows.
// The chosen sort still applies within each of the two blocks.
function sortByKey(rows){
  if(!inboxSort.key) return rows;
  const mul = inboxSort.dir==="asc" ? 1 : -1;
  return [...rows].sort((a,b)=>(sortValue(a,inboxSort.key)-sortValue(b,inboxSort.key))*mul);
}
function sortRows(rows){
  const clickable = rows.filter(r=>!!SCENARIOS_BY_ID[r.id]);
  const rest = rows.filter(r=>!SCENARIOS_BY_ID[r.id]);
  return [...sortByKey(clickable), ...sortByKey(rest)];
}
// Numbered pagination — first, last, current ±1, collapsing everything else behind "…".
function pageNumbersToShow(current, total){
  if(total<=7) return Array.from({length:total},(_,i)=>i+1);
  const set = new Set([1,2,total-1,total,current-1,current,current+1]);
  const nums = [...set].filter(n=>n>=1&&n<=total).sort((a,b)=>a-b);
  const out = [];
  for(let i=0;i<nums.length;i++){
    if(i>0 && nums[i]-nums[i-1]>1) out.push("…");
    out.push(nums[i]);
  }
  return out;
}

// Meridian is the "shows everything" scenario: a narrative across 2 distinct email threads
// that between them touch every Activity Log entry type in the real PRD spec (mark pending,
// update customer info, scheduled task fired, flag + unflag, invoice status changes both
// automatic and manual, cash application both automatic and manual, payment failure). The
// billing-contact/CC/address changes auto-execute without review (decision #9's "still has an
// auto-executed entry") — the only thing left pending is the W-9 reply.
const SCENARIO_MERIDIAN = {
  customer: "Meridian Group",
  agentSummary: [
    "Dana Reed says a signed W-9 is required before Meridian can process payment on INV-2241.",
    "The billing contact, CC, and address changes she asked for earlier are already applied; INV-2241 (**$5,390** remaining after a partial payment) is still past due.",
    "Sending the signed W-9 is a paperwork request, not a collections risk: nothing else on the account is in dispute.",
  ],
  invoices: [
    { num:"INV-2241", due:"Jun 1, 2026",  amount:10890, od:21, status:"Partially paid" },
    { num:"INV-2243", due:"Jun 15, 2026", amount:5000,  od:0,  status:"Sent" },
    { num:"INV-2250", due:"May 28, 2026", amount:1450,  od:0,  status:"Paid" },
    { num:"INV-2255", due:"Jun 20, 2026", amount:3200,  od:0,  status:"Sent" },
    { num:"INV-2260", due:"Jul 1, 2026",  amount:2800,  od:0,  status:"Pending" },
  ],
  // cat: "ai" = agent decided & executed · "user" = a human did it directly · "system" = automated, no decision.
  // text follows the real PRD Activity Log spec's own vocabulary verbatim (actor bolded inline,
  // e.g. "**TABS** changed Status from X to Y of Invoice") — see decision #2.
  events: [
    { kind:"update_po",       cat:"ai",   date:"May 5, 2026", time:"10:30 AM", text:"**Collections Agent** set PO 12345 on INV-2241", agent:true },
    { kind:"update_contacts", cat:"ai",   date:"May 5, 2026", time:"10:31 AM", text:"**Collections Agent** set primary billing contact to James Hart, ap@meridiangroup.com", agent:true },
    { kind:"update_contacts", cat:"ai",   date:"May 5, 2026", time:"10:32 AM", text:"**Collections Agent** added CC billing contact Dan Kowalski, ar@meridiangroup.com", agent:true },
    { kind:"update_contacts", cat:"ai",   date:"May 5, 2026", time:"10:33 AM", text:"**Collections Agent** updated billing address to 500 Market St, Suite 400, San Francisco, CA 94105", agent:true },
    { kind:"cash_app",        cat:"system", date:"Jun 2, 2026", time:"11:00 AM", text:"**TABS** created Payment pi_3Ok9x2KLh8", agent:false },
    { kind:"invoice_status",  cat:"system", date:"Jun 2, 2026", time:"11:05 AM", text:"**TABS** changed Status from SENT to PARTIALLY_PAID + Balance Remaining from $10,890.00 to $5,390.00 of Invoice", agent:false },
    { kind:"cash_app",        cat:"system", date:"Jun 2, 2026", time:"11:06 AM", text:"Payment completed", agent:false },
    { kind:"mark_pending",    cat:"ai",   date:"Jun 3, 2026", time:"9:15 AM",  text:"**Collections Agent** changed Status from SENT to PENDING of Invoice", agent:true },
    { kind:"payment_failed",  cat:"system", date:"Jun 6, 2026", time:"8:00 AM",  text:"**TABS** changed Status from OPEN to FAILED of Payment pi_3Ok9y7Rm2", agent:false },
    { kind:"payment_failed",  cat:"system", date:"Jun 6, 2026", time:"8:01 AM",  text:"**TABS** changed Status from PENDING to SENT of Invoice (the invoice reverts when the charge fails)", agent:false },
    { kind:"scheduled_task",  cat:"ai",   date:"Jun 6, 2026", time:"9:00 AM",  text:"**Collections Agent** ran a scheduled task: Check whether the remaining $5,390.00 balance on INV-2241 has cleared; if the autopay attempt failed, send a follow-up.", agent:true },
    { kind:"flag",            cat:"user", date:"Jun 8, 2026", time:"4:40 PM",  text:"**Priya Sharma** flagged customer: customer threatened to churn after repeated dunning on the failed autopay", agent:false },
    { kind:"flag",            cat:"user", date:"Jun 9, 2026", time:"2:15 PM",  text:"**Priya Sharma** unflagged customer: resolved by phone, remaining balance now on a manual wire", agent:false },
    { kind:"invoice_status",  cat:"user", date:"Jun 10, 2026", time:"11:20 AM", text:"**Priya Sharma** changed Status from SENT to VOID of Invoice INV-2242 (duplicate of INV-2241)", agent:false },
    { kind:"cash_app",        cat:"user", date:"Jun 11, 2026", time:"3:00 PM",  text:"**Priya Sharma** created Payment ch_1abcXY9", agent:false },
  ],
  scheduled: [
    { type:"agent_task", id:"st1", date:"Jun 13, 2026", time:"9:00 AM",
      prompt:"Check whether the signed W-9 has been received and whether INV-2241's remaining $5,390 balance has cleared via the manual wire. If the balance is still unpaid, send a follow-up." },
    { type:"dunning", id:"d1", date:"Jun 16, 2026", time:"8:00 AM",
      step:"Reminder 3 of 4", to:"finance@meridiangroup.com", subject:"INV-2241: please remit" },
    { type:"dunning", id:"d2", date:"Jun 23, 2026", time:"8:00 AM",
      step:"Final notice", to:"finance@meridiangroup.com", subject:"Final notice: INV-2241" },
  ],

  proposed: [
    { kind:"send_email", desc:"Reply to Dana Reed with signed W-9 attached", invoice:"INV-2241",
      cause:{ type:"email", id:"e2" },
      attachments:[{name:"W-9_GeneralCatalyst.pdf"}],
      draft:{ to:"finance@meridiangroup.com", cc:"ap@meridiangroup.com", subject:"Re: Billing contact, address & W-9",
        body:"Hi Dana,\n\nThanks for the note. The signed W-9 is attached.\n\nAs a reminder, the billing contact, CC, and address changes you asked for are already applied on our end.\n\nLet me know if anything else is needed.\n\nBest,\nPriya Sharma\nGeneral Catalyst",
        attachments:[{name:"W-9_GeneralCatalyst.pdf"}] },
    },
  ],
};

const THREADS_MERIDIAN = [
  // Thread 1: billing contact, CC, address, and PO reference — resolved (auto-executed) days
  // before Dana's separate, later ask for a W-9, which is what's still pending review.
  { id:"t1", subject:"Billing contact, address & W-9",
    emails:[
      { id:"e1", dir:"in", entity:"customer",
        from:{name:"Dana Reed",email:"finance@meridiangroup.com"},
        to:[{name:"Priya Sharma",email:"billing@generalcatalyst.com",badge:null}], cc:[],
        date:"May 4, 2026", time:"2:00 PM",
        body:"Hi,\n\nA few updates on our end: please set James Hart (ap@meridiangroup.com) as our primary billing contact going forward, and CC Dan Kowalski (ar@meridiangroup.com) on invoices. Please also reference PO 12345 on this and future invoices.\n\nSeparately, our office moved — could you update our billing address to 500 Market St, Suite 400, San Francisco, CA 94105?\n\nThanks,\nDana",
        attachments:[], badges:[] },
      // Agent email — confirms PO + contact + CC + address, all already applied (multi-recipient: per-recipient delivery tracking)
      { id:"e_agent", dir:"out", entity:"agent",
        from:{name:"Collections Agent",email:"billing@generalcatalyst.com"},
        to:[{name:"Dana Reed",email:"finance@meridiangroup.com",badge:"opened",
             eng:{delivered:"May 5, 2026 · 11:15 AM", opened:"May 5, 2026 · 2:11 PM", clicked:"May 5, 2026 · 2:12 PM"}}],
        cc:[
          {name:"James Hart",email:"ap@meridiangroup.com",   eng:{delivered:"May 5, 2026 · 11:15 AM", opened:"May 5, 2026 · 4:02 PM"}},
          {name:"Dan Kowalski",email:"ar@meridiangroup.com", eng:{delivered:"May 5, 2026 · 11:15 AM"}},
        ],
        date:"May 5, 2026", time:"11:15 AM",
        body:"Hi Dana,\n\nAll set: PO 12345 is now on INV-2241, James Hart is the primary billing contact, Dan Kowalski is CC'd, and the billing address is updated to 500 Market St, Suite 400, San Francisco, CA 94105.\n\nA fresh copy of INV-2241 is attached.\n\nBest,\nGeneral Catalyst Collections",
        attachments:[{name:"INV-2241.pdf",type:"PDF"}], badges:["opened","clicked"] },
      // Dana's separate, later ask — the current trigger. Still pending review.
      { id:"e2", dir:"in", entity:"customer",
        from:{name:"Dana Reed",email:"finance@meridiangroup.com"},
        to:[{name:"Priya Sharma",email:"billing@generalcatalyst.com",badge:null}], cc:[],
        date:"Jun 4, 2026", time:"2:14 PM",
        body:"Hi again,\n\nOne more thing — before we can process payment we'll need a signed W-9 from your company. Can you send that over?\n\nThanks,\nDana",
        attachments:[], badges:[] },
    ],
    agentReplyDraft:"Hi Dana,\n\nThanks for the note. The signed W-9 is attached.\n\nAs a reminder, the billing contact, CC, and address changes you asked for are already applied on our end.\n\nLet me know if anything else is needed.\n\nBest,\nPriya Sharma\nGeneral Catalyst",
  },
  // Thread 2: the INV-2241 payment/dunning saga — fully historical, nothing pending here.
  { id:"t2", subject:"INV-2241 payment status",
    emails:[
      { id:"e3", dir:"out", entity:"system", entityLabel:"Invoice Sent",
        from:{name:"Invoice Sent",email:"billing@generalcatalyst.com"},
        to:[{name:"Dana Reed",email:"finance@meridiangroup.com",badge:"opened"}], cc:[],
        date:"May 1, 2026", time:"10:31 AM",
        body:"Hi Dana,\n\nYour invoice INV-2241 for $10,890 is attached. Payment is due Jun 1, 2026. Please use the link below to pay securely online.\n\nThanks,\nGeneral Catalyst",
        attachments:[{name:"INV-2241.pdf",type:"PDF"}], badges:["opened"] },
      { id:"e4", dir:"in", entity:"customer",
        from:{name:"Dana Reed",email:"finance@meridiangroup.com"},
        to:[{name:"Priya Sharma",email:"billing@generalcatalyst.com",badge:null}], cc:[],
        date:"May 2, 2026", time:"9:05 AM",
        body:"Got it, thanks — we'll process this by the due date.",
        attachments:[], badges:[] },
      { id:"e5", dir:"out", entity:"dunning", entityLabel:"Dunning Reminder",
        from:{name:"Dunning Reminder",email:"billing@generalcatalyst.com"},
        to:[{name:"Dana Reed",email:"finance@meridiangroup.com",badge:"opened"}], cc:[],
        date:"May 25, 2026", time:"8:00 AM",
        body:"Hi Dana,\n\nJust a reminder that invoice INV-2241 for $10,890 is due in one week on Jun 1. Please let us know if you have any questions.\n\nGeneral Catalyst",
        attachments:[], badges:["opened"] },
      { id:"e6", dir:"out", entity:"merchant",
        from:{name:"Priya Sharma",email:"priya@generalcatalyst.com"},
        to:[{name:"Dana Reed",email:"finance@meridiangroup.com",badge:null}], cc:[],
        date:"May 29, 2026", time:"3:20 PM",
        body:"Hi Dana,\n\nJust wanted to follow up personally — let me know if there's anything blocking payment on INV-2241. Happy to hop on a quick call.\n\nPriya",
        attachments:[], badges:[] },
      { id:"e7", dir:"in", entity:"customer",
        from:{name:"Dana Reed",email:"finance@meridiangroup.com"},
        to:[{name:"Priya Sharma",email:"billing@generalcatalyst.com",badge:null}], cc:[],
        date:"May 30, 2026", time:"10:20 AM",
        body:"Thanks for following up, Priya — this is still with our AP team, chasing it now.",
        attachments:[], badges:[] },
      { id:"e8", dir:"out", entity:"dunning", entityLabel:"Dunning Reminder",
        from:{name:"Dunning Reminder",email:"billing@generalcatalyst.com"},
        to:[{name:"Dana Reed",email:"finance@meridiangroup.com",badge:"opened"}], cc:[],
        date:"Jun 2, 2026", time:"8:05 AM",
        body:"Hi Dana,\n\nInvoice INV-2241 for $10,890 was due yesterday and remains unpaid. Please remit at your earliest convenience or reach out if you need assistance.\n\nGeneral Catalyst",
        attachments:[], badges:["opened","clicked"] },
      { id:"e9", dir:"in", entity:"customer",
        from:{name:"Dana Reed",email:"finance@meridiangroup.com"},
        to:[{name:"Priya Sharma",email:"billing@generalcatalyst.com",badge:null}], cc:[],
        date:"Jun 2, 2026", time:"10:45 AM",
        body:"Good news — we sent $5,500 today, and the remaining $5,390 is scheduled via autopay for Jun 6.",
        attachments:[], badges:[] },
      { id:"e10", dir:"out", entity:"agent",
        from:{name:"Collections Agent",email:"billing@generalcatalyst.com"},
        to:[{name:"Dana Reed",email:"finance@meridiangroup.com",badge:"opened"}], cc:[],
        date:"Jun 6, 2026", time:"8:15 AM",
        body:"Hi Dana,\n\nJust flagging that this morning's autopay attempt for the remaining $5,390 on INV-2241 didn't go through. Could you confirm a new date, or let us know if a different payment method would be easier?\n\nBest,\nGeneral Catalyst Collections",
        attachments:[], badges:["opened"] },
    ],
  },
];

// Northwind Traders — demo scenario: ONE inbound email causes TWO proposed actions (both
// actions cite the same cause), one auto-executed (contact update), one pending review
// (send email). Meridian above is untouched; this is purely additive.
const THREADS_NORTHWIND = [
  { id:"nw_t1", subject:"INV-3102: billing contact + resend",
    emails:[
      { id:"nw_e1", dir:"out", entity:"system", entityLabel:"Invoice Sent",
        from:{name:"Invoice Sent",email:"billing@generalcatalyst.com"},
        to:[{name:"Tom Reilly",email:"finance@northwindtraders.com",badge:"opened"}], cc:[],
        date:"May 15, 2026", time:"9:00 AM",
        body:"Hi Tom,\n\nYour invoice INV-3102 for $28,100 is attached. Payment is due Jun 1, 2026. Please use the link below to pay securely online.\n\nThanks,\nGeneral Catalyst",
        attachments:[{name:"INV-3102.pdf",type:"PDF"}], badges:["opened"] },
      // The single trigger email — both proposed actions below cite this same email as cause.
      { id:"nw_e2", dir:"in", entity:"customer",
        from:{name:"Tom Reilly",email:"finance@northwindtraders.com"},
        to:[{name:"Priya Sharma",email:"billing@generalcatalyst.com",badge:null}], cc:[],
        date:"Jun 5, 2026", time:"11:20 AM",
        body:"Hi,\n\nCould you please update our billing contact to ap@northwindtraders.com going forward? Also, I can't find the original INV-3102 anywhere on our end — would you mind resending it?\n\nThanks,\nTom",
        attachments:[], badges:[] },
    ],
    agentReplyDraft:"Hi Tom,\n\nHappy to help. I've updated the billing contact to ap@northwindtraders.com, and a fresh copy of INV-3102 is attached as well.\n\nLet me know if there's anything else you need.\n\nBest,\nPriya Sharma\nGeneral Catalyst",
  },
];

const SCENARIO_NORTHWIND = {
  customer: "Northwind Traders",
  agentSummary: [
    "Tom Reilly asked to update the billing contact to **ap@northwindtraders.com** and resend INV-3102, which he can't locate; no dispute, just a routine ask.",
    "The contact update already auto-executed per policy.",
    "INV-3102 (**$28,100**), 35 days overdue, is the oldest and largest of Northwind's 3 open invoices.",
    "Only the reply with the resent invoice needs your review; approving it clears Tom's blocker without changing anything else on the account.",
  ],
  invoices: [
    { num:"INV-3102", due:"Jun 1, 2026",  amount:28100, od:35, status:"Overdue" },
    { num:"INV-3110", due:"Jun 20, 2026", amount:9200,  od:0,  status:"Sent" },
    { num:"INV-3125", due:"Jul 5, 2026",  amount:5000,  od:0,  status:"Sent" },
  ],
  // text follows the real PRD Activity Log spec's vocabulary verbatim — see decision #2 and Meridian above.
  events: [
    { kind:"payment_failed",  cat:"system", date:"May 28, 2026", time:"2:15 PM",  text:"**TABS** changed Status from OPEN to FAILED of Payment pi_8Hs2kQ1m", agent:false },
    { kind:"update_contacts", cat:"ai",     date:"Jun 5, 2026",  time:"11:25 AM", text:"**Collections Agent** set primary billing contact to ap@northwindtraders.com", agent:true },
  ],
  scheduled: [
    { type:"agent_task", id:"nw_st1", date:"Jun 12, 2026", time:"9:00 AM",
      prompt:"Check if INV-3102 has been paid following the resend. If not, send a follow-up." },
  ],
  proposed: [
    { kind:"update_contacts", desc:"Update primary billing contact → ap@northwindtraders.com", editableContact:"ap@northwindtraders.com",
      cause:{ type:"email", id:"nw_e2" } },
    { kind:"send_email", desc:"Reply to Tom Reilly with resent INV-3102, confirm billing contact update", invoice:"INV-3102",
      cause:{ type:"email", id:"nw_e2" },
      attachments:[{name:"INV-3102.pdf"}],
      draft:{ to:"finance@northwindtraders.com", cc:"ap@northwindtraders.com", subject:"Re: INV-3102: billing contact + resend",
        body:"Hi Tom,\n\nHappy to help. I've updated the billing contact to ap@northwindtraders.com, and a fresh copy of INV-3102 is attached as well.\n\nLet me know if there's anything else you need.\n\nBest,\nPriya Sharma\nGeneral Catalyst",
        attachments:[{name:"INV-3102.pdf"}] },
    },
  ],
  // Pre-seeds actionState on load: action 0 (contact update) already auto-executed;
  // action 1 (send email) starts untouched, pending review.
  initialActionState: { 0: "auto" },
};

// Fairmont Logistics — demo scenario: 2 unrelated emails, 2 proposed actions, each citing its
// own separate event (no shared cause, unlike Northwind/Cobalt Fitness — see decision #1).
const THREADS_FAIRMONT = [
  // Thread 1 (event A): a contact-change request, unrelated in topic and time to thread 2.
  { id:"fm_t1", subject:"Billing contact update",
    emails:[
      { id:"fm_a1", dir:"in", entity:"customer",
        from:{name:"Maria Lopez",email:"ap@fairmontlogistics.com"},
        to:[{name:"Priya Sharma",email:"billing@generalcatalyst.com",badge:null}], cc:[],
        date:"Jun 1, 2026", time:"9:40 AM",
        body:"Hi,\n\nQuick note — our AP lead changed. Please route billing to newap@fairmontlogistics.com going forward.\n\nThanks,\nMaria",
        attachments:[], badges:[] },
    ],
  },
  // Thread 2 (event B): a separate, self-contained resend request — different topic, different day.
  { id:"fm_t2", subject:"Resend INV-7688",
    emails:[
      { id:"fm_b1", dir:"in", entity:"customer",
        from:{name:"Maria Lopez",email:"ap@fairmontlogistics.com"},
        to:[{name:"Priya Sharma",email:"billing@generalcatalyst.com",badge:null}], cc:[],
        date:"Jun 3, 2026", time:"1:15 PM",
        body:"Hi,\n\nCould you resend a copy of INV-7688? We can't locate it on our end and need it for our records.\n\nThanks,\nMaria",
        attachments:[], badges:[] },
    ],
    agentReplyDraft:"Hi Maria,\n\nHappy to help — a fresh copy of INV-7688 is attached.\n\nLet me know if there's anything else you need.\n\nBest,\nPriya Sharma\nGeneral Catalyst",
  },
];

const SCENARIO_FAIRMONT = {
  customer: "Fairmont Logistics",
  agentSummary: [
    "Maria Lopez sent two separate, unrelated asks: update the billing contact to **newap@fairmontlogistics.com**, and resend a copy of INV-7688.",
    "Neither touches the other invoices on the account, and INV-7688 is already paid; there's nothing to reconcile.",
    "Both replies are routine: a contact change and a resend, nothing else.",
  ],
  invoices: [
    { num:"INV-7710", due:"Jun 10, 2026", amount:6400, od:6, status:"Overdue" },
    { num:"INV-7688", due:"Apr 15, 2026", amount:1200, od:0, status:"Paid" },
  ],
  events: [],
  scheduled: [
    { type:"agent_task", id:"fm_st1", date:"Jun 18, 2026", time:"9:00 AM",
      prompt:"Check whether INV-7710 has been paid. If not, send a follow-up." },
  ],
  proposed: [
    // Action 1 — cites A only.
    { kind:"update_contacts", desc:"Update primary billing contact → newap@fairmontlogistics.com", editableContact:"newap@fairmontlogistics.com",
      cause:{ type:"email", id:"fm_a1" } },
    // Action 2 — cites B only.
    { kind:"send_email", desc:"Reply to Maria Lopez with resent INV-7688", invoice:"INV-7688",
      cause:{ type:"email", id:"fm_b1" },
      attachments:[{name:"INV-7688.pdf"}],
      draft:{ to:"ap@fairmontlogistics.com", subject:"Re: Resend INV-7688",
        body:"Hi Maria,\n\nHappy to help — a fresh copy of INV-7688 is attached.\n\nLet me know if there's anything else you need.\n\nBest,\nPriya Sharma\nGeneral Catalyst",
        attachments:[{name:"INV-7688.pdf"}] },
    },
  ],
};

// Cobalt Fitness — demo scenario: ONE inbound email triggers all 7 July-28-scoped agent action
// types at once (Build plan doc: mark invoice pending, update PO, update customer info, send
// email, flag customer, apply cash app recommendation, schedule task). All 7 share the same
// cause, so they nest under a single event node — the same "shared cause" grouping Northwind
// demonstrates with 2, stress-tested here with the full inventory.
const THREADS_COBALT = [
  { id:"cf_t1", subject:"Invoice 5520 — a few things at once",
    emails:[
      { id:"cf_e1", dir:"out", entity:"system", entityLabel:"Invoice Sent",
        from:{name:"Invoice Sent",email:"billing@generalcatalyst.com"},
        to:[{name:"Renee Ibarra",email:"ap@cobaltfitness.com",badge:"opened"}], cc:[],
        date:"Jun 5, 2026", time:"9:00 AM",
        body:"Hi Cobalt Fitness,\n\nYour invoice INV-5520 for $9,000 is attached. Payment is due Jun 20, 2026.\n\nThanks,\nGeneral Catalyst",
        attachments:[{name:"INV-5520.pdf",type:"PDF"}], badges:["opened"] },
      // The one trigger email — all 7 proposed actions below cite this same email as cause.
      { id:"cf_e2", dir:"in", entity:"customer",
        from:{name:"Renee Ibarra",email:"ap@cobaltfitness.com"},
        to:[{name:"Priya Sharma",email:"billing@generalcatalyst.com",badge:null}], cc:[],
        date:"Jun 12, 2026", time:"3:40 PM",
        body:"Hi team, a few things:\n\n1) Please hold INV-5520 while we sort out a partial payment we sent last week — we'd rather not get more reminders in the meantime.\n2) It should also show PO# CF-4471 going forward.\n3) Our new AP contact is Marcus Yee (marcus.yee@cobaltfitness.com) — please make him the primary contact and keep me CC'd, and update our billing address to 900 Harbor Blvd, Suite 220, Long Beach, CA 90802.\n4) We sent $2,000 via wire on Jun 10 toward INV-5520, ref WIRE-88213 — can you confirm that's applied?\n5) Also just flagging that we've had three billing contact changes in two months and would like someone keeping an eye on this account.\n6) Could you check back with us in 3 weeks to make sure everything's settled?\n7) And could you send over a copy of our current contract for our files?\n\nThanks,\nRenee",
        attachments:[], badges:[] },
    ],
    agentReplyDraft:"Hi Renee,\n\nThanks for all of this — here's where things stand:\n\n- INV-5520 is on hold while the remaining balance is confirmed.\n- PO# CF-4471 is now on the invoice.\n- Marcus Yee is the new primary contact (you're still CC'd), and the billing address is updated to 900 Harbor Blvd, Suite 220, Long Beach, CA 90802.\n- The $2,000 wire (ref WIRE-88213) is matched and applied.\n- We'll check back in with you in 3 weeks.\n- The current contract is attached for your files.\n\nLet me know if anything looks off.\n\nBest,\nPriya Sharma\nGeneral Catalyst",
  },
];

const SCENARIO_COBALT = {
  customer: "Cobalt Fitness",
  agentSummary: [
    "Renee Ibarra sent one email covering seven separate asks: hold the invoice, add a PO, change the primary contact and address, confirm a wire payment, flag the account, schedule a check-in, and send the contract.",
    "INV-5520 (**$9,000**) has a **$2,000** wire already sent (ref WIRE-88213) against it; the account has had 3 billing-contact changes in 2 months, which is what prompted the flag request.",
    "Every action here is exactly what Renee asked for, in order: nothing is being inferred or extended beyond her list.",
  ],
  invoices: [
    { num:"INV-5520", due:"Jun 20, 2026", amount:9000, od:0, status:"Sent" },
    { num:"INV-5521", due:"Jul 5, 2026",  amount:4200, od:0, status:"Sent" },
  ],
  events: [],
  scheduled: [],
  proposed: [
    // Boolean actions (nothing to edit, just approve/reject) — mark_pending and flag_customer
    // below. Everything else here has editableFields: a real value the agent inferred that a
    // reviewer might want to correct before approving.
    { kind:"mark_pending", desc:"Mark INV-5520 as pending while the remaining balance is confirmed",
      cause:{ type:"email", id:"cf_e2" } },
    { kind:"update_po", desc:"Add PO# CF-4471 to INV-5520",
      editableFields:[{label:"PO number", value:"CF-4471"}],
      cause:{ type:"email", id:"cf_e2" } },
    // Not the dedicated update_contacts card (that branch only shows a single editable value,
    // no room for the CC + address changes too) — a distinct kind so it hits the generic card
    // and shows the full desc instead of silently dropping everything but the primary contact.
    { kind:"update_customer_info", desc:"Set primary billing contact → Marcus Yee, marcus.yee@cobaltfitness.com (keep Renee Ibarra CC'd), update billing address → 900 Harbor Blvd, Suite 220, Long Beach, CA 90802",
      editableFields:[
        {label:"Primary contact", value:"Marcus Yee, marcus.yee@cobaltfitness.com"},
        {label:"CC", value:"Renee Ibarra, ap@cobaltfitness.com"},
        {label:"Billing address", value:"900 Harbor Blvd, Suite 220, Long Beach, CA 90802"},
      ],
      cause:{ type:"email", id:"cf_e2" } },
    { kind:"apply_cash_app", desc:"Apply the $2,000 wire (ref WIRE-88213, Jun 10) to INV-5520",
      editableFields:[{label:"Reference", value:"WIRE-88213"},{label:"Amount", value:"$2,000.00"}],
      cause:{ type:"email", id:"cf_e2" } },
    { kind:"flag_customer", desc:"Flag customer: 3 billing-contact changes in 2 months, customer asked for extra attention on the account",
      cause:{ type:"email", id:"cf_e2" } },
    { kind:"schedule_task", desc:"Schedule a check-in in 3 weeks to confirm the account is settled",
      editableFields:[{label:"Date", value:"Jul 3, 2026"},{label:"Prompt", value:"Confirm the account is settled"}],
      cause:{ type:"email", id:"cf_e2" } },
    { kind:"send_email", desc:"Reply to Renee Ibarra confirming all of the above, with the current contract attached", invoice:"INV-5520",
      cause:{ type:"email", id:"cf_e2" },
      attachments:[{name:"Contract_CobaltFitness_2026.pdf"}],
      draft:{ to:"ap@cobaltfitness.com", cc:"marcus.yee@cobaltfitness.com", subject:"Re: Invoice 5520 — a few things at once",
        body:"Hi Renee,\n\nThanks for all of this — here's where things stand:\n\n- INV-5520 is on hold while the remaining balance is confirmed.\n- PO# CF-4471 is now on the invoice.\n- Marcus Yee is the new primary contact (you're still CC'd), and the billing address is updated to 900 Harbor Blvd, Suite 220, Long Beach, CA 90802.\n- The $2,000 wire (ref WIRE-88213) is matched and applied.\n- We'll check back in with you in 3 weeks.\n- The current contract is attached for your files.\n\nLet me know if anything looks off.\n\nBest,\nPriya Sharma\nGeneral Catalyst",
        attachments:[{name:"Contract_CobaltFitness_2026.pdf"}] },
    },
  ],
};

// Mutable — reassigned on navigation into a customer's detail page. Default = Meridian.
let SCENARIO = SCENARIO_MERIDIAN;
let THREADS = THREADS_MERIDIAN;
const SCENARIOS_BY_ID = {
  meridian:  { scenario: SCENARIO_MERIDIAN,  threads: THREADS_MERIDIAN },
  northwind: { scenario: SCENARIO_NORTHWIND, threads: THREADS_NORTHWIND },
  fairmont:  { scenario: SCENARIO_FAIRMONT,  threads: THREADS_FAIRMONT },
  cobalt:    { scenario: SCENARIO_COBALT,    threads: THREADS_COBALT },
};

// ============================================================
//  ROUTING STATE
// ============================================================
let view = "inbox";  // "inbox" | "detail" | "customer" | "billing"
let filterOpen = false;
let filterSubmenu = null;   // which filter type's value-panel is showing in the Add-filter dropdown, if any
let activeFilters = [{ type:"status", mode:"categorical", label:"Status", values:["review"], display:"Needs Review" }]; // default: worklist opens scoped to what needs a look
let pendingFilterOperator = {}; // per numeric filter type, the operator radio picked before/while an amount is typed
let inboxSearchQuery = "";
let inboxPage = 1;
const INBOX_PAGE_SIZE = 25;
let inboxSort = { key:"overdue", dir:"desc" }; // default: highest total overdue first, alongside the default Needs Review filter
let inboxView = "table";  // "table" | "agent" — worklist vs. the global Ask-the-Agent view
// Ask the Agent (global level, per the Aug PRD NL section): query any customer's data,
// inquire about or adjust the Agent's permissions. Deliberately does NOT approve, reject,
// modify, or create individual proposed actions — that stays on the per-customer detail page.
let askAgentLog = [
  { who:"agent", text:"I can look up anything about a customer or the whole book, explain how a tool is configured, or change that configuration. I can't approve, reject, or create individual actions here — that stays on each customer's page." },
];
// Suggested prompts shown only while the conversation is still empty — one per capability
// (data query, policy question, permission adjustment) so the copy above isn't the only
// way a user discovers what's actually askable here.
const AA_EXAMPLES = [
  "Which customers are flagged right now?",
  "What's our most overdue customer?",
  "What happens if there's a dispute?",
  "Always auto-send the W9 form",
];
let askAgentDraft = null; // {sec,x,y,z} pending permission exception awaiting your approval
const XLABEL = { AUTO:"Auto-execute", FLAG:"Ask for approval", NEVER:"Never allow" };
// Matches collections-agent-settings-v7's CONFIGURED_EXCEPTIONS verbatim — the "Configured
// merchant" demo state's seed. Only half the original rule set survives as exceptions, and two
// tools (Schedule Task, PO Number) intentionally ship with none, so the empty state is visible.
const CONFIGURED_EXCEPTIONS = [
  { sec:"Send Email", x:"AUTO", y:"Send the W9 form", z:"that's all someone's asking for" },
  { sec:"Send Email", x:"AUTO", y:"Send a payment-received confirmation", z:"the invoice is now paid in full" },
  { sec:"Send Email", x:"NEVER", y:"Send a payment confirmation email", z:"one has already gone out for this invoice" },
  { sec:"Contact & Address Updates", x:"AUTO", y:"Update the billing contact", z:"someone asks for the change, whatever their reason" },
  { sec:"Payments & Credit", x:"AUTO", y:"Approve the credit memo", z:"the amount requested is under $500" },
];
let merchantState = "configured"; // "configured" | "new" — Settings view demo toggle
let askAgentPermissions = CONFIGURED_EXCEPTIONS.map(e=>({...e}));
let brandTone = "";
// One shared keyword table for inferring {sec,y} from free text — used both by the chat's
// mockPermissionDraft() (matches typed messages) and the detail-page nudge's draftFromAction()
// (matches an action's own desc/cause text). Single source of truth so the two entry points
// never drift into different labels for the same underlying tool.
const PERMISSION_Y_HINTS = [
  [/w-?9/, "Send Email", "Send the W9 form"],
  [/(payment|invoice).*confirm|confirm.*(payment|invoice)/, "Send Email", "Send a payment confirmation email"],
  [/(copy of|resend).*invoice|invoice copy/, "Send Email", "Send a copy of the invoice"],
  [/contract/, "Send Email", "Send a copy of the contract"],
  [/dispute/, "Send Email", "Reply to the dispute"],
  [/credit memo/, "Payments & Credit", "Approve the credit memo"],
  [/payment terms|net ?30|net ?60/, "Payments & Credit", "Change the payment terms"],
  [/billing contact/, "Contact & Address Updates", "Update the billing contact"],
  [/\baddress\b/, "Contact & Address Updates", "Update the address"],
  [/po number|purchase order/, "PO Number", "Update the PO number"],
  [/schedul/, "Schedule Task", "Schedule a follow-up task"],
];

// ============================================================
//  AGENT PERMISSIONS (Settings view) — the "full combination" model from the
//  collections-agent-settings-v7 prototype: per-tool blanket Auto/Review/Never default +
//  natural-language exceptions underneath it. Ported in as its own view rather than a
//  separate standalone page, reusing the SAME askAgentPermissions/PERMISSION_Y_HINTS state
//  already shared by the worklist's Ask the Agent, the detail page's coaching nudge, and the
//  Cmd-K spotlight — one ruleset, four entry points. Exceptions are grouped by `sec` at render
//  time (askAgentPermissions.filter(e=>e.sec===tool.sec)), not stored per-tool, so every entry
//  point stays trivially in sync with no separate reconciliation step.
// ============================================================
const TOOL_META = [
  { sec:"Send Email", desc:"Compose and send email with optional attachments (invoice, W9, contract, payment link)" },
  { sec:"Schedule Task", desc:"Schedule a future re-run of the collection plan with a contextual prompt" },
  { sec:"Contact & Address Updates", desc:"Update primary/CC billing contacts, address, and other profile fields" },
  { sec:"PO Number", desc:"Update the PO number on an invoice" },
  { sec:"Payments & Credit", desc:"Issue credit memos and handle payment-terms requests" },
];
const XORDER = ["AUTO","FLAG","NEVER"];
let toolDefaults = { "Send Email":"FLAG", "Schedule Task":"FLAG", "Contact & Address Updates":"FLAG", "PO Number":"FLAG", "Payments & Credit":"FLAG" };

// "What the Agent can do" — ported from v7 unchanged.
const CAPS = [
  { name:"Send email", desc:"With an invoice, W9, contract, or payment link attached", ico:'<path d="M4 4h16v16H4z"/><path d="m4 6 8 7 8-7"/>', live:true,
    info:"The only thing you configure is which attachments go out — invoice PDF, W9, contract, or a payment link. The subject and body are drafted by the Agent each time based on the situation, not something you template in advance." },
  { name:"Schedule a follow-up task", desc:"Re-run the collection plan later with context", ico:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', live:true,
    info:"Creates a one-time future check-in on this case with a specific prompt for the Agent to act on — not a recurring cadence. The Agent decides what to actually do when it fires, based on the situation at that time." },
  { name:"Mark invoice as pending", desc:"Record a promise to pay with a date and method", ico:'<path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/>', live:true,
    info:"Pauses dunning on this invoice and logs an optional payment date, method, and notes. It records that a payment is expected — it does not apply one." },
  { name:"Update PO number", desc:"Change the PO number on an invoice", ico:'<path d="M4 4h16v16H4z"/><path d="M8 9h8M8 13h5"/>', live:true,
    info:"Replaces the PO number on the invoice. Leaving it blank clears the existing one — there is no history kept of prior values." },
  { name:"Update customer info", desc:"Contacts, addresses, and profile fields", ico:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>', live:true,
    breakdown:[
      { label:"Primary billing contact", detail:"Changes the name and email invoices are addressed to. There is only one primary contact per customer — this replaces it, it does not add to a list." },
      { label:"CC billing contacts", detail:"Adds or removes a single email from the CC list on outgoing invoices. Separate from the primary contact — changing one never touches the other." },
      { label:"Address & profile", detail:"Covers name, company name, and billing or shipping address. Does not cover tax-exempt status or custom fields — those have no trigger today." },
    ] },
  { name:"Issue a credit memo", desc:"Create a credit against an invoice", ico:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/>', live:true,
    info:"Creates a credit against a specific invoice for the amount requested. There is no threshold enforced by the tool itself — that is entirely governed by your rules below." },
  { name:"Apply a matched payment", desc:"Cash App recommendation", ico:'<path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>', live:false,
    info:"Not built yet. Today a human applies a Cash App match manually. Once live, this would let the Agent apply a bank transaction it already knows matches an invoice, without waiting on a person." },
  { name:"Flag a customer for review", desc:"Currently done by a human", ico:'<path d="M4 21V4h13l-3 5 3 5H4"/>', live:false,
    info:"Not built yet. Today a human manually flags an account, and only a human can un-flag one — there is no automated way to do either." },
];

let drawerThreadId = null;       // thread shown in the right-side drawer (null = closed)
let drawerOpenEmails = new Set(); // which emails are expanded in the drawer (Gmail-style)
let drawerEditing = false;        // is the agent draft expanded into the editable composer in the drawer?
let drawerEditActionIdx = null;   // which proposed action's draft the drawer composer edits
let drawerDeliveryOpen = new Set(); // which sent emails have their per-recipient delivery details expanded
let activeTab = "actions";
// detail state
let actionState = {};
let editingCard = null;
let editValues = {};
let expandedCard = null;
// coaching-moment nudge (Agent Actions tab) — per-card state, keyed by action index. One of:
// undefined (initial 3-button prompt), "typing" (the Sometimes free-text box is open), or
// {resolved:"once"|"always"|"sometimes", sec,x,y,z} once the user has picked one.
let nudgeDraft = {};
// AI draft refinement (Gmail-style "describe your change")
let draftHistory = {};   // actionIdx -> [previous body strings]  (undo stack)
let draftRedo = {};      // actionIdx -> [body strings]           (redo stack)
let aiGenerating = false;
let threadExpanded = false;
// activity state
let selectedEmailId = null;
let threadOpenEmails = new Set();
let expandedHeaders = new Set();
let showBcc = false;
let attachPickerOpen = false;
let agentEscalated = false;
let flagPopoverOpen = false;   // small "why are you flagging this?" popover, shown only when turning the flag ON
let agentPaused = false;
let invSort = { key:null, dir:"asc" };  // Outstanding Invoices table — sortable Due/Amount headers
let invPage = 1;  // Outstanding Invoices table — paginates once a customer has more than 3
let activityFilter = "all";     // "all" | "email" — Activity tab
// scheduled tab state
let editingTask = null;       // task id being edited
let deletedTasks = new Set(); // task ids deleted this session
let recipientPills = {}; // {actionIdx: {to:[...], cc:[...]}}
let openNewEvents = new Set(); // which new-event email IDs are expanded

const AVAILABLE_ATTACHMENTS = [
  { name:"W-9_GeneralCatalyst.pdf", type:"PDF" },
  { name:"INV-2241.pdf", type:"PDF" },
  { name:"Contract_GC_Meridian_2026.pdf", type:"PDF" },
  { name:"Statement_of_Account_Jun2026.pdf", type:"PDF" },
];
let selectedAttachments = {};

// ============================================================
//  NAV
// ============================================================
let prevView = "inbox"; // to return from detail back to correct parent
let railCollapsed = false;
let navOpen = new Set(["invoicing"]); // which expandable sections are open

// Nav structure mirrors the Tabs/Balance left nav. `act` marks items wired to a real view.
const NAV = [
  {id:"overview",   icon:"overview",   label:"Overview"},
  {id:"customers",  icon:"customers",  label:"Customers", act:"customer"},
  {id:"contracts",  icon:"contracts",  label:"Contracts", subs:[
      {label:"All contracts"},{label:"Agent calibration"},{label:"Renewals"}]},
  {id:"invoicing",  icon:"invoicing",  label:"Invoicing", subs:[
      {label:"Billing", act:"billing"},
      {label:"Collections Agent", act:"inbox", badge:true},
      {label:"Credit memos"},
      {label:"Invoice Kanban"}]},
  {id:"usage",      icon:"usage",      label:"Usage", subs:[
      {label:"Events"},{label:"Usage Files"}]},
  {id:"revenue",    icon:"revenue",    label:"Revenue", subs:[
      {label:"Overview"},{label:"ARR waterfall"},{label:"Revenue recognition"},{label:"Close management"}]},
  {id:"reporting",  icon:"reporting",  label:"Reporting", subs:[
      {label:"Aging"},{label:"Cash forecast"},{label:"Days-to-pay"}]},
  {id:"data",       icon:"data",       label:"Data", subs:[{label:"Payments"}]},
  {id:"developers", icon:"developers", label:"Developers"},
];

function viewForAct(act){ return (act==="customer"&&view==="customer")||(act==="billing"&&view==="billing")||(act==="inbox"&&(view==="inbox"||view==="detail"||view==="settings")); }

function navItemHTML(s, needsReview){
  const isParent = !!s.subs;
  const open = navOpen.has(s.id);
  const active = s.act && viewForAct(s.act) ? " active" : "";
  const chev = isParent ? `<span class="ni-chev${open?" open":""}">${NAV_ICON.chev}</span>` : "";
  const attrs = `${isParent?`data-nav-toggle="${s.id}"`:""} ${s.act?`data-nav-go="${s.act}"`:""}`;
  const badgedSub = isParent && s.subs.some(x=>x.badge);
  const dot = (needsReview>0 && (badgedSub || (!isParent && s.badge))) ? '<span class="ni-dot"></span>' : "";
  // The count only ever shows on the actual badged row (e.g. Invoicing → Collections Agent) —
  // not on the parent section too when it's collapsed. Expand the section to see it.
  const topBadge = (needsReview>0 && !isParent && s.badge) ? `<span class="nav-badge">${needsReview}</span>` : "";
  let out = `<div class="nav-item${isParent?" parent":""}${open?" open":""}${active}" ${attrs} title="${esc(s.label)}">
      <span class="ni-ic">${NAV_ICON[s.icon]}${dot}</span><span class="ni-label">${esc(s.label)}</span>${topBadge}${chev}
    </div>`;
  if(isParent && open){
    out += s.subs.map(sub=>{
      const sa = sub.act && viewForAct(sub.act) ? " active" : "";
      const b = sub.badge && needsReview>0 ? `<span class="nav-badge">${needsReview}</span>` : "";
      return `<div class="nav-sub${sa}" ${sub.act?`data-nav-go="${sub.act}"`:""}>${esc(sub.label)}${b}</div>`;
    }).join("");
  }
  // wrap an expanded section (parent + its sub-items) in a tinted band
  if(isParent) return `<div class="nav-group${open?" open":""}">${out}</div>`;
  return out;
}

function renderNav(){
  const rail = $("rail");
  if(rail) rail.classList.toggle("collapsed", railCollapsed);
  const appEl = document.querySelector(".app");
  if(appEl) appEl.classList.toggle("rail-collapsed", railCollapsed);

  const needsReview = WORKLIST.filter(r=>r.planStatus==="review").length;
  $("rail-nav").innerHTML = NAV.map(s=>navItemHTML(s, needsReview)).join("");

  // footer: integrations / settings / user / agent
  const foot = $("rail-foot");
  if(foot){
    foot.innerHTML = `
      <div class="nav-item" title="Integrations"><span class="ni-ic">${NAV_ICON.integrations}</span><span class="ni-label">Integrations</span></div>
      <div class="nav-item" title="Settings"><span class="ni-ic">${NAV_ICON.settings}</span><span class="ni-label">Settings</span></div>
      <div class="nav-item" title="Marshall Morrison"><span class="ni-ic">${NAV_ICON.userc}</span><span class="ni-label">Marshall Morrison</span><span class="ni-trail">${NAV_ICON.logout}</span></div>`;
  }

  // wiring (applies to both nav + foot)
  document.querySelectorAll("[data-nav-toggle]").forEach(el=>el.onclick=()=>{
    const id = el.dataset.navToggle;
    if(railCollapsed) railCollapsed = false;            // expand rail when opening a section from collapsed
    if(navOpen.has(id)) navOpen.delete(id); else navOpen.add(id);
    renderNav();
  });
  document.querySelectorAll("[data-nav-go]").forEach(el=>el.onclick=()=>{
    view = el.dataset.navGo; render();
  });

  const collapse = $("navCollapse");
  if(collapse){
    collapse.innerHTML = NAV_ICON.collapse;
    collapse.title = railCollapsed ? "Expand" : "Collapse";
    collapse.onclick = ()=>{ railCollapsed=!railCollapsed; renderNav(); };
  }
}

// ============================================================
//  CUSTOMER PAGE
// ============================================================
function renderCustomer(){
  const link = (title, desc, isAgent=false) =>
    `<div class="cust-link">
      <span class="${isAgent?"cl-title agent":"cl-title"}" ${isAgent?'data-nav-to-detail':""}>${title}</span>
      <p>${desc}</p>
    </div>`;
  return `
    <div class="cust-page">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px">
        <div>
          <div class="cust-title">${esc(SCENARIO.customer)}</div>
          <div class="cust-meta">CREATED JAN 1, 2026 BY QBO &nbsp;|&nbsp; <a>EXTERNAL ID: MG-4412</a> &nbsp;|&nbsp; EXISTS IN QBO</div>
        </div>
        <div style="display:flex;gap:10px">
          <button class="btn" style="padding:7px 14px">↑ Upload contract</button>
          <button class="btn" style="padding:7px 14px">Settings &amp; more</button>
        </div>
      </div>

      <div class="cust-section">
        <div class="cust-section-title">Billing &amp; revenue — adjust line items and modify schedules</div>
        <div class="cust-grid">
          ${link("Billing terms","Billable terms and revenue recognition")}
          ${link("Credit Memos (0)","View credit memos for this customer")}
          ${link("Invoices (1)","Current service period invoices, historical invoices")}
          ${link("Contracts (1)","Contracts, amendments, MSAs, renewals")}
          ${link("Collections Agent","Collections agent status, proposed actions, activity log", true)}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
        <div class="cust-section">
          <div class="cust-section-title">Obligations &amp; relationship management</div>
          <div>
            ${link("Key terms","Contract agreements that are not billed upon")}
            ${link("Renewal","AI-driven insights — Renewal types, dates, values and full audit logs")}
            ${link("Notes (0)","Store notes that help manage the relationship")}
          </div>
        </div>
        <div class="cust-section">
          <div class="cust-section-title">Profile — general invoice information</div>
          <div>
            ${link("Business information","Main contact name and email, additional contacts, billing address")}
            ${link("Additional fields","Department ID, Project name, Sales rep, etc.")}
            ${link("Taxes","Tax exemption status, VAT number, EIN")}
          </div>
        </div>
      </div>
    </div>`;
}

// ============================================================
//  BILLING / INVOICE PAGE
// ============================================================
function renderBilling(){
  const field = (label, val) =>
    `<div class="inv-field"><span class="if-label">${label}</span><span class="if-val">${val}</span></div>`;

  return `
    <div class="inv-page">
      <div class="inv-page-notice">Accounting period closed as of <strong>May 31, 2026</strong></div>

      <div style="display:flex;align-items:flex-start;margin-bottom:20px">
        <div style="flex:1">
          <div class="inv-page-title">
            <h1>Invoice #INV-2241</h1>
            <span class="inv-status-chip overdue">Overdue</span>
          </div>
          <div class="inv-page-id">⎘ INV-2241</div>
        </div>
        <div class="inv-page-actions">
          <button class="btn" id="collAgentBtn" style="padding:7px 14px;font-size:13px;display:inline-flex;align-items:center;gap:6px">Collections Agent${SCENARIO.proposed.length>0?`<span style="display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;border-radius:9px;background:#e8333a;color:#fff;font-size:11px;font-weight:700;padding:0 4px">${SCENARIO.proposed.length}</span>`:""}</button>
          <button class="btn" style="padding:7px 12px;font-size:15px">⋯</button>
          <button class="btn" style="padding:7px 14px;font-size:13px">Activity Feed</button>
          <button class="btn" style="padding:7px 14px;font-size:13px">✉ Send reminder</button>
          <button class="btn btn-primary" style="padding:7px 16px;font-size:13px">⊞ Record payment</button>
        </div>
      </div>

      <div class="inv-section">
        <h2>Summary</h2>
        <div style="display:flex;gap:0">
          <div style="flex:1">
            ${field("Customer","<a>Meridian Group</a>")}
            ${field("Invoice number","INV-2241")}
            ${field("Invoice date","May 16, 2026")}
            ${field("Net terms","Net 30")}
            ${field("Send date","May 16, 2026")}
            ${field("Due date","Jun 1, 2026")}
          </div>
          <div class="inv-divider"></div>
          <div style="flex:1">
            <div style="font-size:14px;font-weight:700;margin-bottom:10px;color:var(--ink)">Billing info</div>
            ${field("Billing email(s)","finance@meridiangroup.com")}
            ${field("Address","Meridian Group, Inc.<br>500 Howard St<br>San Francisco, CA 94105<br>US")}
            ${field("CC email(s)","ap@meridiangroup.com")}
            <div style="margin-top:16px;font-size:14px;font-weight:700;margin-bottom:10px;color:var(--ink)">Shipping info</div>
            ${field("Shipping address","—")}
          </div>
        </div>
      </div>

      <div class="inv-section">
        <h2>Invoice line items</h2>
        <table class="inv-items-table">
          <thead>
            <tr>
              <th style="width:35%">Name</th>
              <th style="width:15%">Integration item</th>
              <th>Service period</th>
              <th class="r" style="width:60px">Qty</th>
              <th class="r" style="width:100px">Unit price</th>
              <th class="r" style="width:110px">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div style="font-weight:600">Platform subscription — May 2026</div>
                <div style="font-size:12px;color:var(--helper);margin-top:2px">Recurring</div>
              </td>
              <td style="color:var(--helper)">SaaS</td>
              <td style="color:var(--helper)">May 16, 2026 – Jun 15, 2026</td>
              <td class="r">1</td>
              <td class="r">$10,890.00</td>
              <td class="r">$10,890.00</td>
            </tr>
          </tbody>
        </table>
        <div class="inv-totals">
          <span class="it-label">Subtotal:</span><span class="it-val">$10,890.00</span>
          <span class="it-label">Tax:</span><span class="it-val">$0.00</span>
          <span class="it-label it-total">Total:</span><span class="it-val it-total">$10,890.00</span>
        </div>
      </div>
    </div>`;
}

// ============================================================
//  INBOX VIEW
// ============================================================
function fmtMoney(n){ return "$"+n.toLocaleString("en-US",{minimumFractionDigits:2}); }

// Cell renderers keyed by column — used by both the header (label) and body (per-row markup).
function inboxCell(key, r){
  const statusLabel = {review:"Needs Review",executed:"Executed",rejected:"Rejected",failed:"Failed"};
  switch(key){
    case "customer": {
      const flagIcon = `<span style="display:inline-block;width:13px;height:13px;margin-right:6px;vertical-align:middle;opacity:${r.escalated?1:.2}">${r.escalated?ICON.flagFill:ICON.flagOut}</span>`;
      const pausedBadge = r.paused ? `<span class="paused-chip">Agent Paused</span>` : "";
      return `<td style="white-space:nowrap">${flagIcon}<span class="cust-name">${esc(r.customer)}</span>${pausedBadge}</td>`;
    }
    case "invoices":
      return `<td class="r"><span class="cell-amt">${r.invoices.length}</span></td>`;
    case "outstanding":
      return `<td class="r"><span class="cell-amt">${fmtMoney(r.outstandingAmt||r.overdueAmt)}</span></td>`;
    case "overdue":
      return `<td class="r">${r.overdueAmt>0 ? `<span class="overdue-amt">${fmtMoney(r.overdueAmt)}</span>` : `<span style="color:var(--helper)">—</span>`}</td>`;
    case "oldestOverdue":
      return `<td class="r">${r.mostOverdueDays!=null ? `<span class="cell-amt">${r.mostOverdueDays}d</span>` : `<span style="color:var(--helper)">—</span>`}</td>`;
    case "event":
      return `<td style="font-size:12.5px;color:var(--helper);width:240px;min-width:200px;line-height:1.45"><span class="event-text">${esc(r.eventSummary)}</span></td>`;
    case "actions": {
      const actLine = r.proposedActions.length
        ? `<ul class="act-bullets">${r.proposedActions.slice(0,2).map(a=>`<li>${esc(a)}</li>`).join("")}</ul>`
        : `<span style="color:var(--helper)">—</span>`;
      return `<td style="width:230px;min-width:210px">${actLine}</td>`;
    }
    case "status":
      return `<td><span class="plan-chip ${r.planStatus}">${statusLabel[r.planStatus]||r.planStatus}</span></td>`;
    default: return "<td></td>";
  }
}

function renderInbox(){
  const needsReviewCount = WORKLIST.filter(r=>r.planStatus==="review").length;
  const cols = INBOX_COLUMNS;
  const q = inboxSearchQuery.trim().toLowerCase();
  const searched = q ? WORKLIST.filter(r=>r.customer.toLowerCase().includes(q)) : WORKLIST;
  const filteredRows = sortRows(searched.filter(r=>activeFilters.every(f=>filterMatches(r, f))));

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / INBOX_PAGE_SIZE));
  inboxPage = Math.min(Math.max(1, inboxPage), totalPages);
  const pageStart = (inboxPage - 1) * INBOX_PAGE_SIZE;
  const pageRows = filteredRows.slice(pageStart, pageStart + INBOX_PAGE_SIZE);

  const rows = pageRows.length ? pageRows.map(r=>{
      // Only customers with a real detail-page scenario behind them are clickable.
      const clickable = !!SCENARIOS_BY_ID[r.id];
      return `<tr ${clickable?`data-customer="${r.id}" class="clickable"`:`class="row-inert"`} style="${r.escalated?"box-shadow:inset 3px 0 0 var(--warning)":""}">
      ${cols.map(c=>inboxCell(c.key, r)).join("")}
    </tr>`;
    }).join("") : `<tr><td colspan="${cols.length}" style="padding:28px;text-align:center;color:var(--helper)">No customers match ${activeFilters.length?"the current filters":`"${esc(inboxSearchQuery)}"`}</td></tr>`;

  const headerCells = cols.map(c=>{
    const active = c.sortable && inboxSort.key===c.key;
    const arrow = active ? (inboxSort.dir==="asc"?"↑":"↓") : "↕";
    return `<th class="${c.align==="r"?"r ":""}${c.sortable?"sortable":""}${active?" sorted":""}" ${c.sortable?`data-sort-key="${c.key}"`:""}>${esc(c.label)}${c.sortable?`<span class="th-sort">${arrow}</span>`:""}</th>`;
  }).join("");

  // "Add filter" — a dimension list on the left (always visible once open) and that
  // dimension's value-panel to its right (checkboxes for categorical, operator radios + a $
  // amount for numeric) — both showing at once, not a step-through-and-replace flow. Excludes
  // Event, Agent actions, Customer, and Open invoices — those aren't things you narrow the
  // worklist by, they're what you're triaging.
  const resetIcon = LU('<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>');
  const filterDimsPanel = `<div class="filter-dropdown filter-dims-panel">
    ${Object.entries(FILTER_DEFS).map(([key,def])=>`<div class="filter-option${filterSubmenu===key?" active":""}" data-filter-type="${key}"><span>${esc(def.label)}</span><span class="fo-chev">›</span></div>`).join("")}
  </div>`;
  const filterValuesPanel = filterSubmenu ? (()=>{
    const key = filterSubmenu, def = FILTER_DEFS[key];
    const existing = activeFilters.find(f=>f.type===key);
    if(def.kind==="categorical"){
      const selected = existing ? existing.values : [];
      return `<div class="filter-dropdown filter-values-panel">
        ${def.options.map(o=>`
        <label class="filter-checkbox-row">
          <input type="checkbox" data-filter-checkbox="${key}:${o.value}:${esc(o.display)}" ${selected.includes(o.value)?"checked":""}>
          <span>${esc(o.display)}</span>
        </label>`).join("")}
        <button class="filter-reset-btn" data-filter-reset="${key}">${resetIcon}Reset</button>
      </div>`;
    }
    const operator = pendingFilterOperator[key] || (existing && existing.operator) || "gte";
    const amount = existing ? existing.amount : "";
    return `<div class="filter-dropdown filter-values-panel filter-values-numeric">
      <div class="fn-row">
        <div class="fn-radios">
          ${NUMERIC_OPERATORS.map(o=>`
          <label class="filter-radio-row">
            <input type="radio" name="filter-op-${key}" data-filter-radio="${key}:${o.value}" ${operator===o.value?"checked":""}>
            <span>${esc(o.display)}</span>
          </label>`).join("")}
        </div>
        <div class="fn-amount">
          <span class="fa-prefix">$</span>
          <input type="text" inputmode="decimal" class="filter-amount-input" id="filterAmountInput" placeholder="0.00" value="${esc(amount)}" data-filter-amount="${key}">
          ${amount!==""?`<button class="fa-clear" data-filter-amount-clear="${key}">×</button>`:""}
        </div>
      </div>
      <button class="filter-reset-btn" data-filter-reset="${key}">${resetIcon}Reset</button>
    </div>`;
  })() : "";
  const filterDropdown = filterOpen ? `${filterDimsPanel}${filterValuesPanel}` : "";

  const chipsHtml = activeFilters.map((f,i)=>`<span class="filter-chip">${esc(f.label)} <b>${esc(f.display)}</b><span class="fc-x" data-remove-filter="${i}">×</span></span>`).join("");

  const rangeEnd = filteredRows.length ? Math.min(pageStart + INBOX_PAGE_SIZE, filteredRows.length) : 0;
  const pageBtns = pageNumbersToShow(inboxPage, totalPages).map(n=>
    n==="…" ? `<span class="pg-ellipsis">…</span>`
            : `<button class="pg-num${n===inboxPage?" active":""}" data-page-goto="${n}" aria-label="Go to page ${n}">${n}</button>`
  ).join("");
  const pagination = `<div class="pagination-row">
    <span class="pagination-count">${filteredRows.length ? `${pageStart+1}–${rangeEnd}` : "0"} of ${filteredRows.length}</span>
    <div class="pagination-controls">
      <button class="btn-page-arrow" data-page-nav="prev" aria-label="Go to previous page" ${inboxPage<=1?"disabled":""}>${LU('<path d="m15 18-6-6 6-6"/>')}</button>
      ${pageBtns}
      <button class="btn-page-arrow" data-page-nav="next" aria-label="Go to next page" ${inboxPage>=totalPages?"disabled":""}>${LU('<path d="m9 18 6-6-6-6"/>')}</button>
    </div>
  </div>`;

  const viewTabs = `<div class="view-tabs">
    <button class="view-tab ${inboxView==="table"?"active":""}" data-view-tab="table">Worklist</button>
    <button class="view-tab ${inboxView==="agent"?"active":""}" data-view-tab="agent">Ask the Agent</button>
  </div>`;

  if(inboxView==="agent"){
    return `
    <div class="inbox-wrap">
      <div class="inbox-head">
        <h1>Collections Agent</h1>
        <span class="sp"></span>
        ${viewTabs}
      </div>
      ${renderAskAgentBody()}
    </div>`;
  }

  return `
    <div class="inbox-wrap">
      <div class="inbox-head">
        <h1>Collections Agent</h1>
        <span class="sp"></span>
        ${viewTabs}
      </div>
      <div class="agent-voice">
        ${agentClusterIcon()}
        <span class="av-text">${needsReviewCount>0
          ? `<strong>${needsReviewCount}</strong> action${needsReviewCount===1?"":"s"} ready for your review`
          : `Nothing needs your review right now`}</span>
      </div>
      <div class="filter-row">
        <div style="position:relative;display:inline-block">
          <button class="filter-btn" id="filterBtn">${LU('<path d="M2 5h20"/><path d="M6 12h12"/><path d="M9 19h6"/>')}Add filter</button>
          ${filterDropdown}
        </div>
        ${chipsHtml ? `<div class="filter-chips">${chipsHtml}</div>` : ""}
        <span class="sp"></span>
        <div class="inbox-search${inboxSearchQuery?" has-text":""}">
          <span class="is-icon">${LU('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>')}</span>
          <input type="text" id="inboxSearchInput" placeholder="Search in results" value="${esc(inboxSearchQuery)}">
          <button class="is-clear" id="inboxSearchClear" aria-label="Clear search" tabindex="-1"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg></button>
        </div>
      </div>
      <div class="inbox-table-wrap">
      <table class="inbox-table">
        <thead><tr>${headerCells}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
      </div>
      ${pagination}
    </div>`;
}

// ============================================================
//  ASK THE AGENT — global NL interface (query any customer, ask about
//  or adjust the Agent's permissions). Deliberately does NOT approve,
//  reject, modify, or create individual actions — that stays on the
//  per-customer detail page, untouched by anything below.
// ============================================================

// Shared draft-confirm card markup — used by the worklist's Ask the Agent, the detail page's
// coaching-moment nudge, and the Cmd-K spotlight, so all three permission-drafting surfaces
// look and behave identically. confirmAttr/cancelAttr are raw data-* attribute strings so each
// caller can wire its own handler (data-aa-approve vs data-nudge-confirm, etc.).
function draftCardHtml(draft, confirmAttr, cancelAttr){
  return `
    <div class="aa-draft">
      <div class="aa-draft-row">
        <span class="aa-secpill">${esc(draft.sec)}</span>
        <span class="aa-xpill aa-x-${draft.x}">${XLABEL[draft.x]}</span>
        <span class="aa-oy">${esc(draft.y)}</span>
      </div>
      <div class="aa-draft-z"><span class="aa-ifw">if</span> ${esc(draft.z)}</div>
      <div class="aa-draft-actions">
        <button class="aa-cancel-btn" ${cancelAttr}>Not quite</button>
        <button class="aa-approve-btn" ${confirmAttr}>Approve</button>
      </div>
    </div>`;
}

function renderAskAgentBody(){
  const thread = askAgentLog.map(m=>
    m.who==="agent"
      ? `<div class="aa-msg aa-agent">${agentClusterIcon("tiny")}<div class="aa-bubble">${esc(m.text)}</div></div>`
      : `<div class="aa-msg aa-user"><div class="aa-bubble">${esc(m.text)}</div></div>`
  ).join("");

  const draftBlock = askAgentDraft ? draftCardHtml(askAgentDraft, 'data-aa-approve="1"', 'data-aa-cancel="1"') : "";

  // Only while the conversation is still just the opening greeting — once a user has
  // actually asked something, the examples would just be clutter above the real thread.
  const hints = (askAgentLog.length===1 && !askAgentDraft) ? `
    <div class="aa-hints">
      <div class="aa-hints-label">Try asking</div>
      <div class="aa-hints-row">
        ${AA_EXAMPLES.map(q=>`<button class="aa-chip" data-aa-example="${esc(q)}">${esc(q)}</button>`).join("")}
      </div>
    </div>` : "";

  return `
    <div class="aa-wrap">
      <div class="aa-thread" id="aaThread">${thread}${hints}${draftBlock}</div>
      <div class="aa-inputrow">
        <textarea id="aaInput" class="aa-input" placeholder="Ask about a customer, or tell me how to handle something..." rows="1"></textarea>
        <button class="aa-send" id="aaSend" aria-label="Send">${LU('<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>')}</button>
      </div>
    </div>`;
}

// Router: dispatches to exactly the three global-level, non-action NL requirements in scope
// (adjust permissions / inquire about permissions / query customer data). Keyword-based mock
// understanding, same style as the Settings prototypes' mockDraft — not a real NLU layer.
function handleAskAgentMessage(raw){
  const text = raw.trim();
  if(!text) return;
  askAgentLog.push({ who:"user", text });
  const t = text.toLowerCase();

  const permCue = /\b(auto[- ]?execute|auto[- ]?send|always|never|don'?t|stop|require review|need(s)? review|ask (me )?first)\b/.test(t);
  if(permCue){
    const draft = mockPermissionDraft(t, text);
    if(draft){
      askAgentDraft = draft;
      askAgentLog.push({ who:"agent", text:"Got it — want me to add this as a rule for how that tool behaves?" });
      return;
    }
  }

  if(/\bpolic(y|ies)\b|\bpermission(s)?\b|\ballowed\b|what happens if|\bcan you\b|\bwill you\b|\bdo you\b/.test(t)){
    const answer = answerPolicyQuestion(t);
    if(answer){ askAgentLog.push({ who:"agent", text:answer }); return; }
  }

  askAgentLog.push({ who:"agent", text: answerDataQuery(t) });
}

// Keyword-matched draft, mirroring the Settings v7 prototype's Y_HINTS approach: only proposes
// a specific action when one is actually inferable from the text — no generic fallback exception.
function mockPermissionDraft(t, original){
  const x = /\bnever\b|don'?t|\bstop\b/.test(t) ? "NEVER" : (/\balways\b|auto[- ]?(execute|send)/.test(t) ? "AUTO" : "FLAG");
  const hint = PERMISSION_Y_HINTS.find(([re])=>re.test(t));
  if(!hint) return null;
  const [, sec, y] = hint;
  return { sec, x, y, z: cleanZ(original) };
}
function cleanZ(original){
  const cleaned = original.replace(/^(please |can you |i want you to |i'd like you to |i want to |i'd like to )/i,"").trim();
  return cleaned.charAt(0).toUpperCase()+cleaned.slice(1);
}

// Coaching-moment nudge support: infer a {sec,y} from an action's own desc/cause text (not
// user-typed chat) via the same PERMISSION_Y_HINTS table, so both entry points agree on labels.
// Falls back to the action's own generic title/section when nothing specific matches — a
// generic Y is fine here (there may genuinely be nothing more specific), the situation (z)
// stays concrete either way since it comes straight from the action's own description.
const ACTION_SEC = {
  send_email: "Send Email",
  schedule_task: "Schedule Task",
  update_contacts: "Contact & Address Updates",
  update_customer_info: "Contact & Address Updates",
  update_po: "PO Number",
  mark_pending: "Payments & Credit",
  apply_cash_app: "Payments & Credit",
  flag_customer: "Payments & Credit",
};
function draftFromAction(a){
  const causeText = causesOf(a).filter(c=>c.type==="email").map(c=>{
    const email = THREADS.flatMap(t=>t.emails).find(e=>e.id===c.id);
    const th = THREADS.find(t=>t.emails.some(e=>e.id===c.id));
    return `${th?th.subject||"":""} ${email?email.body||"":""}`;
  }).join(" ");
  const haystack = `${a.desc||""} ${causeText}`.toLowerCase();
  const hint = PERMISSION_Y_HINTS.find(([re])=>re.test(haystack));
  const sec = hint ? hint[1] : (ACTION_SEC[a.kind] || "Send Email");
  const y = hint ? hint[2] : (ACTION_TITLES[a.kind] || "Do this");
  return { sec, x:"AUTO", y, z: a.desc || "a situation like this" };
}

function answerPolicyQuestion(t){
  if(/dispute/.test(t)) return "Disputes always go to Ask for approval — the Agent never auto-executes anything once dispute language shows up in a thread.";
  if(/w-?9/.test(t)) return "W9 requests auto-send today — that's already configured as a rule.";
  if(/credit memo/.test(t)) return "Credit memos under $500 auto-approve; anything at or above that gets flagged for you.";
  if(/(payment|invoice).*confirm|confirm.*(payment|invoice)/.test(t)) return "The Agent never sends a second payment confirmation for an invoice once one's already gone out.";
  if(/billing contact/.test(t)) return "Billing contact changes auto-execute regardless of who's asking or why.";
  return null;
}

// Real computation over the live WORKLIST array (not canned strings) — honest "full graph
// discovery" over whatever mock data is actually loaded, including the 300 filler rows.
function answerDataQuery(t){
  const money = n => `$${Number(n||0).toLocaleString()}`;
  if(/escalat|flag/.test(t)){
    const rows = WORKLIST.filter(r=>r.escalated);
    return rows.length
      ? `${rows.length} customer${rows.length===1?"":"s"} flagged: ${rows.map(r=>`${r.customer} (${money(r.overdueAmt)} overdue)`).join(", ")}.`
      : "No customers are currently flagged.";
  }
  if(/pause/.test(t)){
    const rows = WORKLIST.filter(r=>r.paused);
    return rows.length
      ? `${rows.length} customer${rows.length===1?"":"s"} paused: ${rows.map(r=>r.customer).join(", ")}.`
      : "No customers have a paused agent right now.";
  }
  if(/most overdue|biggest overdue|highest overdue|worst overdue/.test(t)){
    const sorted = [...WORKLIST].filter(r=>r.overdueAmt>0).sort((a,b)=>b.overdueAmt-a.overdueAmt).slice(0,5);
    return `Most overdue right now: ${sorted.map(r=>`${r.customer} — ${money(r.overdueAmt)}, ${r.mostOverdueDays} days`).join("; ")}.`;
  }
  if(/total (outstanding|overdue)|across (the|my|all)/.test(t)){
    const totalOut = WORKLIST.reduce((s,r)=>s+r.outstandingAmt,0);
    const totalOverdue = WORKLIST.reduce((s,r)=>s+r.overdueAmt,0);
    return `Across the full worklist: ${money(totalOut)} total outstanding, ${money(totalOverdue)} of that overdue.`;
  }
  if(/needs review|how many.*review/.test(t)){
    const rows = WORKLIST.filter(r=>r.planStatus==="review");
    return `${rows.length} customer${rows.length===1?"":"s"} currently ${rows.length===1?"has":"have"} actions needing review.`;
  }
  const named = WORKLIST.find(r=>t.includes(r.customer.toLowerCase()));
  if(named){
    return `${named.customer}: ${money(named.outstandingAmt)} outstanding, ${money(named.overdueAmt)} overdue${named.mostOverdueDays?`, oldest invoice ${named.mostOverdueDays} days overdue`:""}. ${named.eventSummary}`;
  }
  const top = [...WORKLIST].filter(r=>r.overdueAmt>0).sort((a,b)=>b.overdueAmt-a.overdueAmt).slice(0,3);
  return `I can look across any customer or the whole book. A few examples right now: ${top.map(r=>`${r.customer} (${money(r.overdueAmt)} overdue)`).join(", ")}. Try asking about a specific customer, or tell me how you want a tool to behave.`;
}

// ============================================================
//  AGENT PERMISSIONS (Settings view)
// ============================================================
function exRowHtml(e){
  const idx = askAgentPermissions.indexOf(e);
  return `<div class="set-exrow">
    <span class="aa-xpill aa-x-${e.x}">${XLABEL[e.x]}</span>
    <span class="set-oy">${esc(e.y)}</span>
    <span class="set-ifw">if</span>
    <span class="set-oz">${esc(e.z)}</span>
    <button class="set-odel" data-del-exception="${idx}" title="Remove exception">${LU('<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>')}</button>
  </div>`;
}
function toolCardHtml(m){
  const def = toolDefaults[m.sec];
  const exceptions = askAgentPermissions.filter(e=>e.sec===m.sec);
  const seg = XORDER.map(x=>`<button class="${def===x?`on ${x}`:""}" data-set-default="${esc(m.sec)}:${x}">${esc(XLABEL[x])}</button>`).join("");
  const exList = exceptions.length
    ? exceptions.map(e=>exRowHtml(e)).join("")
    : `<div class="set-ovempty">No exceptions yet — ask the Agent to add one.</div>`;
  return `<div class="set-toolcard">
    <div class="set-thead">
      <div><div class="set-tn">${esc(m.sec)}</div><div class="set-td">${esc(m.desc)}</div></div>
      <div class="set-defwrap">
        <div class="set-deflabel">Default permissions</div>
        <div class="set-seg">${seg}</div>
      </div>
    </div>
    <div class="set-ovwrap">
      <div class="set-ovhead"><span class="set-ovarrow">↳</span><span class="set-ovlabel">Exceptions</span><span class="set-ovsub">— checked first; the default above only applies when none of these match</span></div>
      <div class="set-ovlist">${exList}</div>
    </div>
  </div>`;
}
function capRowHtml(c, idx){
  return `<div class="set-caprow">
    <span class="set-ci">${LU(c.ico)}</span>
    <div><div class="set-cn">${esc(c.name)}</div><div class="set-cd">${esc(c.desc)}</div></div>
    <button class="set-infobtn" data-cap-info="${idx}" title="More detail">i</button>
  </div>`;
}
function renderSettings(){
  return `
    <div class="set-wrap">
      <div class="set-titlerow">
        <h1>Agent Permissions</h1>
        <div class="set-demoswitch">
          <span class="set-dslabel">Prototype view</span>
          <div class="set-dsseg">
            <button class="${merchantState==="configured"?"on":""}" data-merchant-state="configured">Configured merchant</button>
            <button class="${merchantState==="new"?"on":""}" data-merchant-state="new">New merchant</button>
          </div>
        </div>
      </div>
      <div class="set-divider"></div>

      <div class="set-grid">
        <div class="set-main">

          <div class="set-section">
            <div class="set-slabel">
              <div class="set-t">What the Agent can do</div>
              <div class="set-d">Every action available today.</div>
            </div>
            <div>
              <div class="set-capgrid">
                ${CAPS.map((c,idx)=>capRowHtml(c,idx)).join("")}
                <button class="set-caprow set-reqrow" data-open-request="1">
                  <span class="set-ci">${LU('<path d="M12 5v14M5 12h14"/>')}</span>
                  <div><div class="set-cn">Request an action</div><div class="set-cd">Ask for a capability that doesn't exist yet</div></div>
                </button>
              </div>
            </div>
          </div>

          <div class="set-section">
            <div class="set-slabel">
              <div class="set-t">Tool permissions</div>
              <div class="set-d">Each tool has a <b>default</b> — Auto-execute, Ask for approval, or Never allow — applied to everything unless an exception says otherwise. Exceptions are plain English, not a scenario list to search through.</div>
              <div class="set-hint">Only the Agent adds exceptions — ask it via the worklist's Ask the Agent, or Approve & add a rule on any pending action.</div>
            </div>
            <div>
              <button class="set-agentbtn" data-goto-worklist-agent="1">
                <span class="set-agentbtn-ic">${agentClusterIcon("tiny")}</span>
                <span class="set-agentbtn-tx"><span class="set-agentbtn-tt">Adjust agent permissions</span><span class="set-agentbtn-ss">Ask the Agent — it drafts the exception, you approve it</span></span>
                <span class="set-agentbtn-chev">${LU('<path d="m9 18 6-6-6-6"/>')}</span>
              </button>
              <div class="set-toolcards">${TOOL_META.map(m=>toolCardHtml(m)).join("")}</div>
            </div>
          </div>

          <div class="set-section set-section--last">
            <div class="set-slabel"><div class="set-t">Brand tone</div><div class="set-d">Manage the tone of communication.</div></div>
            <div>
              <div class="set-qlabel">What brand preferences should the Agent consider?</div>
              <div class="set-qsub">Applies to all conversations, within Agent guidelines.</div>
              <textarea id="brandToneInput" placeholder="e.g. Warm but concise. No em-dashes. Sign off as the Collections team.">${esc(brandTone)}</textarea>
            </div>
          </div>

        </div>
        <div class="set-rail"><h3 class="set-eyebrow">Settings</h3><a>General</a><a>Billing</a><a>Dunning schedule</a><a class="on">Collections Agent</a></div>
      </div>
    </div>`;
}
function openCapInfoModal(idx){
  const c = CAPS[idx];
  const body = c.breakdown
    ? c.breakdown.map(x=>`<div style="margin-bottom:12px"><div style="font-weight:600;color:var(--ink);font-size:13px;margin-bottom:3px">${esc(x.label)}</div><div style="font-size:13px;color:var(--helper);line-height:1.5">${esc(x.detail)}</div></div>`).join("")
    : `<p style="font-size:13.5px;color:#34352f;line-height:1.5;margin:0">${esc(c.info)}</p>`;
  $("modal").innerHTML = `<div class="scrim" id="capInfoBg">
    <div class="modal">
      <h3>${esc(c.name)}</h3>
      ${body}
      <div class="row"><button class="btn btn-primary" id="capInfoClose">Close</button></div>
    </div>
  </div>`;
  $("capInfoClose").onclick=()=>{ $("modal").innerHTML=""; };
  $("capInfoBg").onclick=(e)=>{ if(e.target.id==="capInfoBg") $("modal").innerHTML=""; };
}
function openRequestFormModal(){
  $("modal").innerHTML = `<div class="scrim" id="reqFormBg">
    <div class="modal">
      <h3>Request an action</h3>
      <p>Describe what you want the Agent to be able to do and why. This goes to the product team as a feature request — it won't create a working rule today.</p>
      <textarea id="reqFormText" rows="4" style="width:100%;border:1px solid var(--border);border-radius:7px;padding:10px;font-family:inherit;font-size:13.5px;resize:vertical;box-sizing:border-box" placeholder="e.g. Auto-approve credit memos under \$250 without a human review, since our support team already has that authority."></textarea>
      <div class="row">
        <button class="btn btn-tertiary" id="reqFormCancel">Cancel</button>
        <button class="btn btn-primary" id="reqFormSubmit">Submit request</button>
      </div>
    </div>
  </div>`;
  $("reqFormCancel").onclick=()=>{ $("modal").innerHTML=""; };
  $("reqFormBg").onclick=(e)=>{ if(e.target.id==="reqFormBg") $("modal").innerHTML=""; };
  $("reqFormSubmit").onclick=()=>{
    const val = $("reqFormText").value.trim();
    if(val.length<4){ $("reqFormText").focus(); return; }
    const ref = "TB-" + Math.floor(1000+Math.random()*9000);
    $("modal").innerHTML = `<div class="scrim" id="reqFormBg2">
      <div class="modal">
        <h3>Logged for the product team</h3>
        <p>Thanks — your request is logged and routed to the product team. You'll be notified when it's live.</p>
        <p style="font-family:'Geist Mono',monospace;font-size:12px">Request ${ref}</p>
        <div class="row"><button class="btn btn-primary" id="reqFormDone">Done</button></div>
      </div>
    </div>`;
    $("reqFormBg2").onclick=(e)=>{ if(e.target.id==="reqFormBg2") $("modal").innerHTML=""; };
    $("reqFormDone").onclick=()=>{ $("modal").innerHTML=""; };
  };
}
function wireSettings(){
  const main = $("main-content");
  main.querySelectorAll("[data-set-default]").forEach(el=>el.onclick=(e)=>{
    e.stopPropagation();
    const [sec,x] = el.dataset.setDefault.split(":");
    toolDefaults[sec]=x;
    render();
  });
  main.querySelectorAll("[data-del-exception]").forEach(el=>el.onclick=(e)=>{
    e.stopPropagation();
    askAgentPermissions.splice(+el.dataset.delException,1);
    render();
  });
  main.querySelectorAll("[data-cap-info]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); openCapInfoModal(+el.dataset.capInfo); });
  main.querySelectorAll("[data-open-request]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); openRequestFormModal(); });
  main.querySelectorAll("[data-goto-worklist-agent]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); view="inbox"; inboxView="agent"; render(); });
  main.querySelectorAll("[data-merchant-state]").forEach(el=>el.onclick=(e)=>{
    e.stopPropagation();
    merchantState = el.dataset.merchantState;
    // Matches v7 exactly: switching demo state re-seeds BOTH the tool defaults and the
    // exceptions from scratch, rather than only toggling exceptions — "New merchant" is a
    // fresh account with nothing learned yet, not just an empty exceptions list.
    TOOL_META.forEach(m=>toolDefaults[m.sec]="FLAG");
    askAgentPermissions.length = 0;
    if(merchantState==="configured") askAgentPermissions.push(...CONFIGURED_EXCEPTIONS.map(e=>({...e})));
    render();
  });
  const bt = $("brandToneInput"); if(bt) bt.oninput=(e)=>{ brandTone = e.target.value; };
}

// ============================================================
//  DETAIL — helpers
// ============================================================
function threadForEmailId(id){ return THREADS.find(t=>t.emails.some(e=>e.id===id))||null; }
function toMs(d,ti){ return new Date(`${d} ${ti||"12:00 AM"}`).getTime()||0; }

function activityItems(){
  const emails = THREADS.flatMap(t=>t.emails.map(e=>({type:"email",...e,threadId:t.id,threadSubject:t.subject})));
  const events = (SCENARIO.events||[]).map(e=>({type:"event",...e}));
  return [...emails,...events].sort((a,b)=>toMs(b.date,b.time)-toMs(a.date,a.time));
}

function openThread(emailId){
  selectedEmailId = emailId;
  threadOpenEmails = new Set([emailId]);
}
function deepLinkToThread(threadId){
  activeTab = "activity";
  const t = THREADS.find(t=>t.id===threadId); if(!t) return;
  const target = [...t.emails].reverse().find(e=>e.dir==="in")||t.emails[t.emails.length-1];
  openThread(target.id);
}

// ----- Thread drawer (right slide-in; Gmail-style stacked thread) -----
function openThreadDrawer(threadId, focusId, editing){
  drawerThreadId = threadId;
  drawerEditing = !!editing;
  drawerDeliveryOpen = new Set();
  const t = THREADS.find(t=>t.id===threadId);
  const latest = t ? [...t.emails].sort((a,b)=>toMs(b.date,b.time)-toMs(a.date,a.time))[0] : null;
  drawerOpenEmails = new Set([focusId || (latest && latest.id)].filter(Boolean));
  renderEmailDrawer();
}
// router used from the Actions "Open email" causes (single email id) → opens its thread, that email expanded
function openEmailDrawer(emailId){
  const t = THREADS.find(t=>t.emails.some(e=>e.id===emailId));
  if(t) openThreadDrawer(t.id, emailId);
}
// No real files behind these attachments — opens a placeholder tab so the click still reads
// as "this goes somewhere" rather than a dead decorative chip.
function openMockAttachment(name){
  const w = window.open("", "_blank");
  if(!w) return;
  w.document.title = name;
  w.document.body.style.cssText = "margin:0;height:100vh;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;font-size:15px;color:#75786f;background:#f3f3f2;";
  w.document.body.textContent = `Preview unavailable in this prototype — ${name}`;
}
// open the thread drawer straight into edit mode for a proposed email action (Edit-in-thread)
function openDraftEditorInDrawer(actionIdx){
  const a = SCENARIO.proposed[actionIdx];
  expandedCard = null;
  drawerEditActionIdx = actionIdx;
  let threadId = (THREADS[0] && THREADS[0].id) || "t1", focus = null;
  const emailCause = (a ? causesOf(a) : []).find(c=>c.type==="email");
  if(emailCause){
    const t = THREADS.find(t=>t.emails.some(e=>e.id===emailCause.id));
    if(t){ threadId = t.id; focus = emailCause.id; }
  }
  openThreadDrawer(threadId, focus, true);
  // Deep-link straight into the draft input, not just the thread — no hunting for it.
  const ta = document.querySelector("#emailDrawer .cmp-body");
  if(ta){ ta.focus(); const len = ta.value.length; ta.setSelectionRange(len, len); ta.scrollIntoView({block:"center"}); }
}
function closeEmailDrawer(){ drawerThreadId = null; drawerEditing = false; drawerEditActionIdx = null; renderEmailDrawer(); }

// ----- Per-recipient delivery & engagement (Postmark-tracked outbound only) -----
function isTracked(em){ return ["system","dunning","agent"].includes(em.entity); }
// normalize a recipient into {delivered, opened, clicked, bounced} using explicit eng or email-level badges
function recipEng(em, r){
  if(r.eng) return r.eng;
  const has = s=>(em.badges||[]).includes(s);
  if(has("bounced")) return { bounced:true };
  const stamp = `${em.date} · ${em.time||""}`;
  return { delivered: stamp, opened: has("opened")?stamp:null, clicked: has("clicked")?stamp:null };
}
function deliverySummary(em){
  const recips = [...em.to, ...(em.cc||[])];
  const bounced = recips.filter(r=>recipEng(em,r).bounced).length;
  const delivered = recips.length - bounced;
  return { total:recips.length, delivered, bounced };
}
function renderRecipientRow(em, r){
  const e = recipEng(em, r);
  const mail   = LU('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>');
  const mailOpen = LU('<path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0z"/><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/>');
  const click  = LU('<path d="M14 4.1 12 6"/><path d="m5.1 8-2.9-.8"/><path d="m6 12-1.9 2"/><path d="M7.2 2.2 8 5.1"/><path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"/>');
  if(e.bounced){
    return `<div class="dr-recip"><div class="dr-email">${esc(r.email)}</div>
      <span class="dr-bounced"><span class="ic">${ICON.x}</span>Email bounced</span></div>`;
  }
  const line = (icon,label,ts)=>`<div class="dr-line ${ts?"on":"off"}"><span class="dr-ic">${icon}</span><span class="dr-label">${label}</span><span class="dr-ts">${ts?esc(ts):"—"}</span></div>`;
  return `<div class="dr-recip">
    <div class="dr-email">${esc(r.email)}</div>
    ${line(mail,"Delivered",e.delivered)}
    ${line(mailOpen,"Opened",e.opened)}
    ${line(click,"Link clicked",e.clicked)}
  </div>`;
}
function renderDeliveryDetails(em){
  if(!isTracked(em)) return "";
  const open = drawerDeliveryOpen.has(em.id);
  const s = deliverySummary(em);
  const chev = LU('<path d="m6 9 6 6 6-6"/>');
  const summaryText = `Delivered to ${s.delivered} of ${s.total}${s.bounced?` · <span class="dr-bounce-count">${s.bounced} bounced</span>`:""}`;
  if(!open){
    return `<div class="delivery-block">
      <button class="dr-toggle" data-delivery-toggle="${em.id}">
        <span class="dr-chev">${chev}</span>
        <span class="dr-summary">${summaryText}</span>
      </button>
    </div>`;
  }
  const ccCount = (em.cc||[]).length;
  const toRows = em.to.map(r=>renderRecipientRow(em,r)).join("");
  const ccRows = (em.cc||[]).map(r=>renderRecipientRow(em,r)).join("");
  return `<div class="delivery-block open">
    <button class="dr-toggle" data-delivery-toggle="${em.id}">
      <span class="dr-chev open">${chev}</span>
      <span class="dr-summary">${summaryText}</span>
    </button>
    <div class="dr-detail">
      <div class="dr-section">${em.to.length} Recipient${em.to.length>1?"s":""}</div>
      ${toRows}
      ${ccCount?`<div class="dr-section">${ccCount} CC${ccCount>1?"s":""}</div>${ccRows}`:""}
    </div>
  </div>`;
}
// Drawer resize — set up once, via delegation, so it survives every re-render of #emailDrawer's
// innerHTML (the handle itself is re-inserted into that markup on each render).
(function setupDrawerResize(){
  let dragging = false;
  document.addEventListener("mousedown", (e)=>{
    const handle = e.target.closest && e.target.closest(".drawer-resize-handle");
    if(!handle) return;
    dragging = true;
    handle.classList.add("dragging");
    const drawer = $("emailDrawer"); if(drawer) drawer.classList.add("resizing");
    document.body.style.userSelect = "none";
    e.preventDefault();
  });
  document.addEventListener("mousemove", (e)=>{
    if(!dragging) return;
    const drawer = $("emailDrawer"); if(!drawer) return;
    const newWidth = Math.min(Math.max(window.innerWidth - e.clientX, 420), Math.round(window.innerWidth*0.94));
    drawer.style.width = newWidth + "px";
  });
  document.addEventListener("mouseup", ()=>{
    if(!dragging) return;
    dragging = false;
    document.body.style.userSelect = "";
    document.querySelectorAll(".drawer-resize-handle.dragging").forEach(h=>h.classList.remove("dragging"));
    const drawer = $("emailDrawer"); if(drawer) drawer.classList.remove("resizing");
  });
})();

function renderEmailDrawer(){
  const drawer = $("emailDrawer"), scrim = $("emailScrim");
  if(!drawer) return;
  if(!drawerThreadId){ drawer.classList.remove("open"); if(scrim) scrim.classList.remove("open"); drawer.setAttribute("aria-hidden","true"); return; }
  const thread = THREADS.find(t=>t.id===drawerThreadId);
  if(!thread){ closeEmailDrawer(); return; }
  const sorted = [...thread.emails].sort((a,b)=>toMs(a.date,a.time)-toMs(b.date,b.time));

  const msgs = sorted.map(em=>{
    const open = drawerOpenEmails.has(em.id);
    const badges = (em.badges||[]).map(b=>engBadge(b)).join("");
    if(!open){
      const preview = em.body.replace(/\s+/g," ").trim();
      return `<div class="td-msg collapsed" data-drawer-expand="${em.id}">
        <span class="td-who">${esc(em.from.name)}</span>
        <span class="td-pre">${esc(preview)}</span>
        <span class="td-date">${esc(em.date)}</span>
      </div>`;
    }
    const atts = (em.attachments||[]).map(att=>`<span class="attach-chip" data-open-attachment="${esc(att.name)}">📎 ${esc(att.name)}</span>`).join("");
    return `<div class="td-msg open">
      <div class="td-msg-head" data-drawer-expand="${em.id}">
        <div class="td-msg-meta">
          <div class="td-msg-line1"><span class="td-who">${esc(em.from.name)} <span class="td-who-email">&lt;${esc(em.from.email)}&gt;</span></span><span class="td-date">${esc(em.date)} · ${esc(em.time||"")}</span></div>
          <div class="td-msg-to">to ${em.to.map(t=>esc(t.name)).join(", ")}${(em.cc||[]).length?`, +${em.cc.length} cc`:""}</div>
        </div>
      </div>
      <div class="td-msg-body">${esc(em.body)}</div>
      ${atts?`<div class="ed-attachments">${atts}</div>`:""}
      ${isTracked(em) ? renderDeliveryDetails(em) : (badges?`<div class="td-msg-badges">${badges}</div>`:"")}
    </div>`;
  }).join("");

  // which proposed action this thread's draft belongs to
  const editIdx = drawerEditActionIdx!=null ? drawerEditActionIdx : SCENARIO.proposed.findIndex(a=>a.kind==="send_email");
  const editAction = editIdx>=0 ? SCENARIO.proposed[editIdx] : null;
  const draftDone = editAction && actionState[editIdx];

  let draft = "";
  if(thread.agentReplyDraft){
    if(drawerEditing && editAction && editAction.draft && !draftDone){
      // editable composer, inline — same component + state as the Actions-tab card
      draft = `<div class="td-connector"></div>
        <div class="td-draft editing">
          <div class="td-draft-head"><span class="td-draft-name">Collections Agent</span><span class="td-draft-tag">Editing draft reply</span></div>
          ${renderDraftEditor(editAction.draft, editIdx, {inDrawer:true})}
        </div>`;
    } else {
      const doneTag = draftDone ? verdictHtml(actionState[editIdx], editIdx, "margin-left:auto") : "";
      const foot = draftDone ? "" : `<div class="td-draft-foot"><button class="btn btn-tertiary" data-drawer-edit>Edit</button><button class="btn btn-primary" data-drawer-send><span class="ic">${ICON.check}</span>Approve &amp; send</button></div>`;
      draft = `<div class="td-connector"></div>
        <div class="td-draft">
          <div class="td-draft-head"><span class="td-draft-name">Collections Agent</span><span class="td-draft-tag">Draft reply</span>${doneTag}</div>
          <div class="td-draft-body">${esc(editAction&&editAction.draft?editAction.draft.body:thread.agentReplyDraft)}</div>
          ${foot}
        </div>`;
    }
  }

  drawer.innerHTML = `
    <div class="drawer-resize-handle" title="Drag to resize"></div>
    <div class="ed-head">
      <span class="ed-subject">${esc(thread.subject)} <span class="ed-count">${sorted.length} message${sorted.length>1?"s":""}</span></span>
      <button class="ed-close" id="emailDrawerClose" title="Close">×</button>
    </div>
    <div class="ed-body">${msgs}${draft}</div>`;
  drawer.classList.add("open"); if(scrim) scrim.classList.add("open"); drawer.setAttribute("aria-hidden","false");
  $("emailDrawerClose").onclick = ()=>closeEmailDrawer();
  drawer.querySelectorAll("[data-drawer-expand]").forEach(el=>el.onclick=()=>{ const id=el.dataset.drawerExpand; if(drawerOpenEmails.has(id)) drawerOpenEmails.delete(id); else drawerOpenEmails.add(id); renderEmailDrawer(); });
  drawer.querySelectorAll("[data-open-attachment]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); openMockAttachment(el.dataset.openAttachment); });
  drawer.querySelectorAll("[data-delivery-toggle]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const id=el.dataset.deliveryToggle; if(drawerDeliveryOpen.has(id)) drawerDeliveryOpen.delete(id); else drawerDeliveryOpen.add(id); renderEmailDrawer(); });
  const sendBtn = drawer.querySelector("[data-drawer-send]");
  if(sendBtn) sendBtn.onclick = ()=>{
    const idx = editIdx;
    if(idx>=0){ actionState[idx]="approved"; expandedCard=null; }
    closeEmailDrawer(); activeTab="actions";
    if(idx>=0) mockExecute(idx, render); else render();
  };
  const editBtn = drawer.querySelector("[data-drawer-edit]");
  if(editBtn) editBtn.onclick = ()=>{ drawerEditActionIdx=editIdx; drawerEditing=true; renderEmailDrawer(); };
  if(drawerEditing && editAction) wireDrawerComposer(drawer, editIdx);
}

// Bind the shared composer's controls when it lives inside the drawer (re-renders the drawer, not #panel).
function wireDrawerComposer(drawer, idx){
  const rr = ()=>renderEmailDrawer();
  drawer.querySelectorAll("[data-cancel-draft]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); drawerEditing=false; rr(); });
  drawer.querySelectorAll("[data-save-draft]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); drawerEditing=false; rr(); });
  drawer.querySelectorAll("[data-ai-refine]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const [i,type]=el.dataset.aiRefine.split(":"); const inp=drawer.querySelector(`[data-ai-input="${i}"]`); if(inp) inp.value=""; aiRefineDraft(i, type); });
  drawer.querySelectorAll("[data-ai-input]").forEach(el=>el.onkeydown=(e)=>{ if(e.key==="Enter"){ e.preventDefault(); e.stopPropagation(); if(!el.value.trim()) return; const i=el.dataset.aiInput; el.value=""; aiRefineDraft(i, null); } });
  drawer.querySelectorAll("[data-ai-submit]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const i=el.dataset.aiSubmit; const inp=drawer.querySelector(`[data-ai-input="${i}"]`); if(!inp||!inp.value.trim()) return; inp.value=""; aiRefineDraft(i, null); });
  drawer.querySelectorAll("[data-ai-focus]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); drawer.querySelector(`[data-ai-input="${el.dataset.aiFocus}"]`)?.focus(); });
  drawer.querySelectorAll("[data-ai-undo]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); aiUndoRedo(el.dataset.aiUndo, false); });
  drawer.querySelectorAll("[data-ai-redo]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); aiUndoRedo(el.dataset.aiRedo, true); });
  drawer.querySelectorAll("[data-app]").forEach(el=>el.onclick=(e)=>{
    e.stopPropagation();
    const i=+el.dataset.app;
    actionState[i]="approved"; expandedCard=null;
    closeEmailDrawer(); activeTab="actions";
    mockExecute(i, render);
  });
  drawer.querySelectorAll("[data-rej]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); actionState[+el.dataset.rej]="rejected"; expandedCard=null; closeEmailDrawer(); activeTab="actions"; render(); });
  drawer.querySelectorAll("[data-pill-input]").forEach(el=>el.onkeydown=(e)=>{
    if(e.key===" "||e.key===","||e.key==="Enter"){ e.preventDefault();
      const val=el.value.trim().replace(/,$/,""); if(!val) return;
      const [i,field]=el.dataset.pillInput.split(":");
      if(!recipientPills[i]) recipientPills[i]={to:[],cc:[]};
      recipientPills[i][field].push(val); el.value=""; rr();
    }
  });
  drawer.querySelectorAll("[data-rm-pill]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation();
    const [i,field,email]=el.dataset.rmPill.split(":");
    if(recipientPills[i]) recipientPills[i][field]=recipientPills[i][field].filter(x=>x!==email); rr();
  });
  drawer.querySelectorAll("[data-open-picker]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); attachPickerOpen=attachPickerOpen===el.dataset.openPicker?false:el.dataset.openPicker; rr(); });
  drawer.querySelectorAll("[data-pick-attach]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const [i,name]=el.dataset.pickAttach.split(":"); if(!selectedAttachments[i]) selectedAttachments[i]=new Set(); selectedAttachments[i].add(name); attachPickerOpen=false; rr(); });
  drawer.querySelectorAll("[data-rm-attach]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const [i,name]=el.dataset.rmAttach.split(":"); if(selectedAttachments[i]) selectedAttachments[i].delete(name); rr(); });
}

// ============================================================
//  SHARED EMAIL CARD
// ============================================================
function renderEmailCard(em, opts={}){
  const ec = entityClass(em.entity);
  const label = entityLabel(ec, em.entityLabel);
  const isHeaderOpen = expandedHeaders.has(em.id);
  const toNames = em.to.map(r=>r.name||r.email).join(", ");
  const ccNames = (em.cc||[]).map(r=>r.name||r.email).join(", ");

  const headerSummary = `<span class="em-to-summary">
    to <span class="to-names">${esc(toNames)}</span>
    ${ccNames?` cc <span class="to-names">${esc(ccNames)}</span>`:""}
    <span class="em-chevron" data-toggle-header="${em.id}">▾</span>
  </span>`;

  const engGrid = isHeaderOpen ? `<div class="eng-grid">
    <table>
      <thead><tr><th class="left">Recipient</th><th>Delivered</th><th>Opened</th><th>Clicked</th><th>Bounced</th><th>Failed</th></tr></thead>
      <tbody>${em.to.map(r=>{
        const o = !!(r.badge==="opened"||em.badges?.includes("opened"));
        const c = !!em.badges?.includes("clicked");
        const b = !!em.badges?.includes("bounced");
        const f = !!em.badges?.includes("failed");
        const chk = v=>v?`<span class="eng-yes">✓</span>`:`<span class="eng-no">—</span>`;
        return `<tr><td class="left">${esc(r.name||r.email)}</td><td>${chk(true)}</td><td>${chk(o)}</td><td>${chk(c)}</td><td>${chk(b)}</td><td>${chk(f)}</td></tr>`;
      }).join("")}</tbody>
    </table>
  </div>` : "";

  const headerDetail = isHeaderOpen ? `<div class="em-header-detail">
    <div class="em-header-grid">
      <span class="hg-label">from</span><span class="hg-val"><strong>${esc(em.from.name)}</strong> &lt;${esc(em.from.email)}&gt;</span>
      <span class="hg-label">to</span><span class="hg-val">${em.to.map(r=>`${esc(r.name)} &lt;${esc(r.email)}&gt;`).join("<br>")}</span>
      ${(em.cc||[]).length?`<span class="hg-label">cc</span><span class="hg-val">${em.cc.map(r=>`${esc(r.name||"")} &lt;${esc(r.email)}&gt;`).join("<br>")}</span>`:""}
      <span class="hg-label">date</span><span class="hg-val">${esc(em.date)} · ${esc(em.time)}</span>
    </div>${engGrid}
  </div>` : "";

  const attach = (em.attachments||[]).length
    ? `<div class="em-card-attach">${em.attachments.map(a=>`<span class="attach-pill">📎 ${esc(a.name)} · ${esc(a.type)}</span>`).join("")}</div>` : "";

  const footer = opts.showThreadLink
    ? `<div class="em-card-footer"><span class="thread-link" data-thread="${opts.threadId}" style="font-size:12.5px;color:var(--helper);cursor:pointer;text-decoration:underline">See entire thread →</span></div>` : "";

  return `<div class="em-card">
    <div class="em-card-head" style="cursor:default">
      <div class="em-head-left">
        <div class="em-name-row">
          <span class="ent-strip ${ec}" style="margin:0">${label}</span>
          <span class="em-name">${esc(em.from.name)}</span>
        </div>
        <span class="em-to-summary">
          to <span class="to-names">${esc(toNames)}</span>
          ${ccNames?` cc <span class="to-names">${esc(ccNames)}</span>`:""}
          <span class="em-chevron" data-header-modal="${em.id}">▾</span>
        </span>
      </div>
      <span class="em-date">${esc(em.date)} · ${esc(em.time)}</span>
    </div>
    <div class="em-card-body">${esc(em.body)}</div>
    ${attach}${footer}
  </div>`;
}

// ============================================================
//  PAUSE AGENT — confirm modal (only shown when there's something to lose)
// ============================================================
// Scheduled tasks and pending actions don't survive a pause — this counts what's
// currently at stake for the active customer so the confirm copy is accurate.
function pausePendingCounts(){
  const tasks = (SCENARIO.scheduled||[]).filter(s=>s.type==="agent_task" && !deletedTasks.has(s.id)).length;
  const actions = SCENARIO.proposed.filter((_,i)=>!actionState[i]).length;
  return { tasks, actions };
}
function pauseWarningText(tasks, actions){
  const parts = [];
  if(tasks>0) parts.push(`${tasks} scheduled task${tasks>1?"s":""}`);
  if(actions>0) parts.push(`${actions} action${actions>1?"s":""} needing review`);
  return `Pausing will delete ${parts.join(" and ")}. This can't be undone.`;
}
function openPauseWarningModal(){
  const { tasks, actions } = pausePendingCounts();
  $("modal").innerHTML = `<div class="scrim" id="pauseWarnBg">
    <div class="modal">
      <h3>Pause agent for this customer?</h3>
      <p>${esc(pauseWarningText(tasks, actions))}</p>
      <div class="row">
        <button class="btn btn-tertiary" id="pauseWarnCancel">Cancel</button>
        <button class="btn btn-danger" id="pauseWarnConfirm">Pause &amp; clear</button>
      </div>
    </div>
  </div>`;
  $("pauseWarnCancel").onclick=()=>{ $("modal").innerHTML=""; };
  $("pauseWarnBg").onclick=(e)=>{ if(e.target.id==="pauseWarnBg") $("modal").innerHTML=""; };
  $("pauseWarnConfirm").onclick=()=>{
    (SCENARIO.scheduled||[]).forEach(s=>{ if(s.type==="agent_task") deletedTasks.add(s.id); });
    SCENARIO.proposed.forEach((_,i)=>{ if(!actionState[i]) actionState[i]="paused"; });
    agentPaused = true;
    $("modal").innerHTML = "";
    render();
  };
}

// ============================================================
//  DRAFT EDITOR
// ============================================================
function openComposeModal(){
  if(!recipientPills["compose"]) recipientPills["compose"]={to:[],cc:[]};
  const draft={to:"",cc:"",subject:"",body:"",attachments:[]};
  $("modal").innerHTML=`<div class="scrim" id="composeBg">
    <div class="modal" style="max-width:600px;padding:0;overflow:hidden;border-radius:12px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--line)">
        <span style="font-size:15px;font-weight:700">Send reminder</span>
        <button class="btn" id="composeClose" style="padding:4px 10px;font-size:13px">×</button>
      </div>
      <div style="padding:16px 18px">${renderDraftEditor(draft,"compose")}</div>
    </div>
  </div>`;
  $("composeClose").onclick=()=>{ $("modal").innerHTML=""; recipientPills["compose"]={to:[],cc:[]}; };
  $("composeBg").onclick=(e)=>{ if(e.target.id==="composeBg"){ $("modal").innerHTML=""; recipientPills["compose"]={to:[],cc:[]}; } };
  // re-wire draft interactions inside modal
  const m=$("modal");
  m.querySelectorAll("[data-pill-input]").forEach(el=>el.onkeydown=(e)=>{
    if(e.key===" "||e.key===","||e.key==="Enter"){ e.preventDefault();
      const val=el.value.trim().replace(/,$/,""); if(!val) return;
      const [idx,field]=el.dataset.pillInput.split(":");
      if(!recipientPills[idx]) recipientPills[idx]={to:[],cc:[]};
      recipientPills[idx][field].push(val); el.value=""; const p=$("panel"); renderPanel(); openComposeModal(); }
  });
  m.querySelectorAll("[data-open-picker]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); attachPickerOpen=attachPickerOpen===el.dataset.openPicker?false:el.dataset.openPicker; $("modal").innerHTML=""; openComposeModal(); });
  m.querySelectorAll("[data-pick-attach]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const [idx,name]=el.dataset.pickAttach.split(":"); if(!selectedAttachments[idx]) selectedAttachments[idx]=new Set(); selectedAttachments[idx].add(name); attachPickerOpen=false; $("modal").innerHTML=""; openComposeModal(); });
  m.querySelectorAll("[data-rm-attach]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const [idx,name]=el.dataset.rmAttach.split(":"); if(selectedAttachments[idx]) selectedAttachments[idx].delete(name); $("modal").innerHTML=""; openComposeModal(); });
}

function openEmailHeaderModal(emailId, triggerEl){
  // toggle: close if already open
  const existing = document.getElementById("hdrDropdown");
  if(existing){ existing.remove(); document.removeEventListener("click", window._hdrClose); return; }

  const allEmails = THREADS.flatMap(t=>t.emails);
  const em = allEmails.find(e=>e.id===emailId); if(!em) return;

  // engagement only for outbound system/dunning/agent emails
  const hasEngagement = ["system","dunning","agent"].includes(em.entity);
  const chk = v=>`<span style="color:${v?"var(--ink)":"#ccc"};font-size:14px;font-weight:${v?"600":"400"}">${v?"✓":"—"}</span>`;

  let engSection = "";
  if(hasEngagement){
    const o = (em.badges||[]).includes("opened");
    const c = (em.badges||[]).includes("clicked");
    const b = (em.badges||[]).includes("bounced");
    const f = (em.badges||[]).includes("failed");

    const recipRows = [...em.to,...(em.cc||[])].map(r=>{
      const pf = em.to.includes(r)?"To":"CC";
      return `<tr>
        <td style="padding:6px 12px 6px 0;color:var(--helper);font-size:12px;white-space:nowrap;vertical-align:middle">${pf}</td>
        <td style="padding:6px 16px 6px 0;font-size:13px;vertical-align:middle;white-space:nowrap">${esc(r.name||"")} <span style="color:var(--helper)">&lt;${esc(r.email)}&gt;</span></td>
        <td style="text-align:center;padding:6px 12px;vertical-align:middle">${chk(true)}</td>
        <td style="text-align:center;padding:6px 12px;vertical-align:middle">${chk(o)}</td>
        <td style="text-align:center;padding:6px 12px;vertical-align:middle">${chk(c)}</td>
        <td style="text-align:center;padding:6px 12px;vertical-align:middle">${chk(b)}</td>
        <td style="text-align:center;padding:6px 12px;vertical-align:middle">${chk(f)}</td>
      </tr>`;
    }).join("");

    engSection = `
      <div style="border-top:1px solid var(--line);margin-top:12px;padding-top:12px">
        <table style="border-collapse:collapse;font-size:12px;width:100%">
          <thead><tr>
            <th style="text-align:left;padding:0 12px 8px 0;color:var(--helper);font-weight:500;font-size:11px;white-space:nowrap"></th>
            <th style="text-align:left;padding:0 16px 8px 0;color:var(--helper);font-weight:500;font-size:11px"></th>
            <th style="text-align:center;padding:0 12px 8px;color:var(--helper);font-weight:500;font-size:11px">Delivered</th>
            <th style="text-align:center;padding:0 12px 8px;color:var(--helper);font-weight:500;font-size:11px">Opened</th>
            <th style="text-align:center;padding:0 12px 8px;color:var(--helper);font-weight:500;font-size:11px">Clicked</th>
            <th style="text-align:center;padding:0 12px 8px;color:var(--helper);font-weight:500;font-size:11px">Bounced</th>
            <th style="text-align:center;padding:0 12px 8px;color:var(--helper);font-weight:500;font-size:11px">Failed</th>
          </tr></thead>
          <tbody>${recipRows}</tbody>
        </table>
      </div>`;
  }

  const drop = document.createElement("div");
  drop.id = "hdrDropdown";
  drop.innerHTML = `
    <div style="display:grid;grid-template-columns:max-content 1fr;gap:5px 14px;font-size:13px">
      <span style="color:var(--helper);text-align:right">from:</span>
      <span><strong>${esc(em.from.name)}</strong> <span style="color:var(--helper)">&lt;${esc(em.from.email)}&gt;</span></span>
      <span style="color:var(--helper);text-align:right">date:</span>
      <span style="color:var(--ink)">${esc(em.date)} · ${esc(em.time)}</span>
    </div>
    ${engSection}
  `;
  Object.assign(drop.style, {
    position:"fixed", zIndex:"200",
    background:"#fff", borderRadius:"8px",
    boxShadow:"0 4px 24px rgba(0,0,0,.18), 0 1px 4px rgba(0,0,0,.08)",
    padding:"16px 18px",
    fontSize:"13px", whiteSpace:"nowrap"
  });

  document.body.appendChild(drop);

  // position below the chevron, clamp to viewport
  const rect = triggerEl.getBoundingClientRect();
  let left = rect.left;
  let top = rect.bottom + 6;
  drop.style.left = "0px"; drop.style.top = "-9999px"; // measure off-screen first
  const dropW = drop.offsetWidth || 420;
  if(left + dropW > window.innerWidth - 12) left = window.innerWidth - dropW - 12;
  if(left < 8) left = 8;
  drop.style.left = left + "px";
  drop.style.top = top + "px";

  window._hdrClose = (e)=>{
    if(!drop.contains(e.target) && e.target!==triggerEl){
      drop.remove();
      document.removeEventListener("click", window._hdrClose);
    }
  };
  setTimeout(()=>document.addEventListener("click", window._hdrClose), 0);
}

// ----- AI draft refinement (mock) -----
// Canned rewrites for the Meridian W-9 reply; a custom instruction falls back to "polish".
const AI_VARIANTS = {
  polish:    "Hi Dana,\n\nThanks for flagging both. The signed W-9 is attached, and I've updated the primary billing contact to ap@meridiangroup.com as requested.\n\nPlease let me know if anything else is needed.\n\nBest,\nPriya Sharma\nGeneral Catalyst",
  serious:   "Dana,\n\nBefore we can move forward, we need the signed W-9 and confirmation of the billing contact. This has already delayed payment, so please send both today.\n\nThank you,\nPriya Sharma\nGeneral Catalyst",
  friendly:  "Hi Dana,\n\nThanks so much for flagging these! I've attached the signed W-9 for you, and I've gone ahead and updated your billing contact to ap@meridiangroup.com.\n\nJust give me a shout if there's anything else at all I can help with; I'm happy to sort it out.\n\nWarmly,\nPriya",
  shorter:   "Hi Dana,\n\nSigned W-9 attached, and I've updated the billing contact to ap@meridiangroup.com.\n\nBest,\nPriya",
};
function mockRefine(current, type){
  return (type && AI_VARIANTS[type]) ? AI_VARIANTS[type] : AI_VARIANTS.polish;
}
function setDraftBody(actionIdx, body){
  const a = SCENARIO.proposed[actionIdx];
  if(a && a.draft) a.draft.body = body;
}
function updateAiHistoryButtons(actionIdx){
  const u = document.querySelector(`[data-ai-undo="${actionIdx}"]`);
  const r = document.querySelector(`[data-ai-redo="${actionIdx}"]`);
  if(u) u.disabled = !((draftHistory[actionIdx]||[]).length);
  if(r) r.disabled = !((draftRedo[actionIdx]||[]).length);
}
function typeInto(ta, text, done){
  ta.value = "";
  let i = 0;
  const step = ()=>{
    if(i >= text.length){ done && done(); return; }
    i += 2 + Math.floor(Math.random()*3);    // 2–4 chars per tick
    ta.value = text.slice(0, i);
    ta.scrollTop = ta.scrollHeight;
    setTimeout(step, 13);
  };
  step();
}
function aiRefineDraft(actionIdx, type){
  if(aiGenerating) return;
  const ta = document.querySelector(".cmp-body"); if(!ta) return;
  const editor = document.querySelector(".cmp-editor");
  const bar = document.querySelector(".cmp-ai");
  const current = ta.value;
  const next = mockRefine(current, type);
  (draftHistory[actionIdx] = draftHistory[actionIdx]||[]).push(current);
  draftRedo[actionIdx] = [];
  aiGenerating = true;
  ta.readOnly = true;
  editor && editor.classList.add("generating");
  bar && bar.classList.add("busy");
  typeInto(ta, next, ()=>{
    aiGenerating = false;
    ta.readOnly = false;
    editor && editor.classList.remove("generating");
    bar && bar.classList.remove("busy");
    setDraftBody(actionIdx, next);
    updateAiHistoryButtons(actionIdx);
  });
}
function aiUndoRedo(actionIdx, isRedo){
  if(aiGenerating) return;
  const from = isRedo ? draftRedo[actionIdx] : draftHistory[actionIdx];
  if(!from || !from.length) return;
  const ta = document.querySelector(".cmp-body"); if(!ta) return;
  const to = isRedo ? (draftHistory[actionIdx]=draftHistory[actionIdx]||[]) : (draftRedo[actionIdx]=draftRedo[actionIdx]||[]);
  to.push(ta.value);
  const val = from.pop();
  ta.value = val;
  setDraftBody(actionIdx, val);
  updateAiHistoryButtons(actionIdx);
}

function renderDraftEditor(draft, actionIdx, opts){
  opts = opts || {};
  // init recipient pills from draft
  if(!recipientPills[actionIdx]){
    const toList = (draft.to||"").split(",").map(s=>s.trim()).filter(Boolean);
    const ccList = (draft.cc||"").split(",").map(s=>s.trim()).filter(Boolean);
    recipientPills[actionIdx] = {to: toList, cc: ccList};
  }
  const pills = recipientPills[actionIdx];

  // init attachments
  const selAttach = selectedAttachments[actionIdx] || new Set((draft.attachments||[]).map(a=>a.name));
  if(!selectedAttachments[actionIdx]) selectedAttachments[actionIdx] = selAttach;

  const isThread = draft.subject && draft.subject.startsWith("Re:");
  const isReply = actionIdx === "reply";

  // don't show "View thread" when already inside the thread (activity log / drawer)
  const threadLink = isThread && actionIdx !== "reply" && !opts.inDrawer
    ? `<span class="cmp-threadlink" data-open-thread="t1">View thread →</span>` : "";

  // recipient pill rows — To and Cc each show their own full pill list.
  const pillsHtml = (list, field) => list.map(e=>
    `<span class="email-pill">${esc(e)}<span class="ep-rm" data-rm-pill="${actionIdx}:${field}:${esc(e)}">×</span></span>`
  ).join("") + `<input class="recip-input" placeholder="" data-pill-input="${actionIdx}:${field}">`;

  const attachPillsHtml = [...selAttach].map(name=>
    `<span class="attach-pill-tag" onclick="window.open('#','_blank')">📎 ${esc(name.split('/').pop())} <span class="ap-rm" data-rm-attach="${actionIdx}:${esc(name)}">×</span></span>`
  ).join("");

  const pickerItems = AVAILABLE_ATTACHMENTS.filter(a=>!selAttach.has(a.name));
  const pickerHtml = String(attachPickerOpen)===String(actionIdx) && pickerItems.length
    ? `<div class="attach-picker">${pickerItems.map(a=>
        `<div class="attach-picker-item" data-pick-attach="${actionIdx}:${esc(a.name)}">${esc(a.name)}</div>`
      ).join("")}</div>` : "";

  const footer = isReply
    ? `<button class="btn btn-primary">${LU('<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>')}Send</button>`
    : `<button class="btn btn-danger" data-rej="${actionIdx}"><span class="ic">${ICON.x}</span>Reject</button>
       <button class="btn btn-primary" data-app="${actionIdx}"><span class="ic">${ICON.check}</span>Approve &amp; send</button>`;

  const tool = (p)=>`<button class="cmp-tool" tabindex="-1">${LU(p)}</button>`;
  const toolbar = [
    '<path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/>',
    '<line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/>',
    '<path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" x2="20" y1="12" y2="12"/>',
    '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    '<line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>',
  ].map(tool).join("");

  // Gmail-style AI refinement bar: describe-a-change input + quick refine tools + undo/redo
  const aiTool = (action,tip,paths)=>`<button class="cmp-ai-tool" data-ai-refine="${actionIdx}:${action}" data-tip="${tip}">${LU(paths)}</button>`;
  const histLen = (draftHistory[actionIdx]||[]).length;
  const redoLen = (draftRedo[actionIdx]||[]).length;
  const aiBar = `<div class="cmp-ai" data-ai-bar="${actionIdx}">
    <span class="cmp-ai-pencil" data-ai-focus="${actionIdx}">${LU('<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>')}</span>
    <input class="cmp-ai-input" placeholder="Describe your change" data-ai-input="${actionIdx}">
    <button class="cmp-ai-submit" data-ai-submit="${actionIdx}" data-tip="Submit" aria-label="Submit change">${LU('<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>')}</button>
    <div class="cmp-ai-actions">
      ${aiTool("polish","Polish",'<path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/>')}
      ${aiTool("serious","Serious",'<circle cx="12" cy="12" r="10"/><line x1="8" x2="16" y1="15" y2="15"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>')}
      ${aiTool("friendly","Friendly",'<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>')}
      ${aiTool("shorter","Shorter",'<path d="m7 20 5-5 5 5"/><path d="m7 4 5 5 5-5"/>')}
      <span class="cmp-ai-div"></span>
      <button class="cmp-ai-tool" data-ai-undo="${actionIdx}" data-tip="Undo" ${histLen?"":"disabled"}>${LU('<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>')}</button>
      <button class="cmp-ai-tool" data-ai-redo="${actionIdx}" data-tip="Redo" ${redoLen?"":"disabled"}>${LU('<path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/>')}</button>
    </div>
  </div>`;

  return `<div class="composer">
    ${threadLink}
    <div class="cmp-field"><span class="cmp-label">To</span><div class="cmp-control">${pillsHtml(pills.to,"to")}</div></div>
    <div class="cmp-field"><span class="cmp-label">Cc</span><div class="cmp-control">${pillsHtml(pills.cc,"cc")}</div></div>
    <div class="cmp-editor">
      <div class="cmp-toolbar">${toolbar}</div>
      <textarea class="cmp-body">${esc(draft.body||"")}</textarea>
      ${aiBar}
    </div>
    <div class="cmp-tiny">
      <button class="btn btn-tertiary" data-cancel-draft="${actionIdx}">Cancel</button>
      <button class="btn" data-save-draft="${actionIdx}">Save draft</button>
    </div>
    <div class="attach-row" style="position:relative">
      ${attachPillsHtml}
      <span class="attach-add-btn" data-open-picker="${actionIdx}">+ Attachments</span>
      ${pickerHtml}
    </div>
    <div class="draft-footer">${footer}</div>
  </div>`;
}

// ============================================================
//  DETAIL — header
// ============================================================
function invSortValue(inv, key){
  if(key==="due") return new Date(inv.due).getTime()||0;
  if(key==="amount") return inv.amount||0;
  return 0;
}
function sortInvoicesList(list){
  if(!invSort.key) return list;
  const mul = invSort.dir==="asc" ? 1 : -1;
  return [...list].sort((a,b)=>(invSortValue(a,invSort.key)-invSortValue(b,invSort.key))*mul);
}
const INV_PAGE_SIZE = 3;
function renderDetailHeader(){
  const pendingCount = SCENARIO.proposed.filter((_,i)=>!actionState[i]).length;
  const sortedInvs = sortInvoicesList(SCENARIO.invoices);
  const invTotalPages = Math.max(1, Math.ceil(sortedInvs.length / INV_PAGE_SIZE));
  invPage = Math.min(Math.max(1, invPage), invTotalPages);
  const invPageStart = (invPage - 1) * INV_PAGE_SIZE;
  const invs = sortedInvs.slice(invPageStart, invPageStart + INV_PAGE_SIZE);
  const invRangeEnd = sortedInvs.length ? Math.min(invPageStart + INV_PAGE_SIZE, sortedInvs.length) : 0;
  const invRows = invs.map(inv=>{
    const isOverdue = (inv.status||"").toLowerCase()==="overdue";
    const od = inv.od>0 ? ` <span class="inv-od">(${inv.od} days overdue)</span>` : "";
    return `<tr>
      <td><span>${esc(inv.num)}</span></td>
      <td>${esc(inv.due)}${od}</td>
      <td><p class="inv-status${isOverdue?" overdue":""}">${esc((inv.status||"").toUpperCase())}</p></td>
      <td class="r">${fmtMoney(inv.amount)}</td>
    </tr>`;
  }).join("");
  const sortArrow = LU('<path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/>');
  const invSortTh = (key,label,align)=>{
    const active = invSort.key===key;
    return `<th class="${align==="r"?"r ":""}inv-sortable${active?" sorted":""}" data-inv-sort-key="${key}">${esc(label)}<span class="inv-sort-ic">${sortArrow}</span></th>`;
  };
  return `
    <div style="padding:14px 22px 6px;display:flex;align-items:center;gap:12px">
      <span class="page-title">${esc(SCENARIO.customer)}</span>
      <div class="top-actions">
        <div style="position:relative;display:inline-block">
          <button class="btn-icon ${agentEscalated?"flagged":""}" id="flagBtn">
            ${agentEscalated?ICON.flagFill:ICON.flagOut}
            <span class="icon-tip">${agentEscalated?"Remove flag":"Flag this customer — makes your agent aware of the flag and filterable on the Collections Agent table"}</span>
          </button>
          ${flagPopoverOpen ? `
          <div class="flag-popover" id="flagPopover">
            <div class="flag-popover-label">${agentEscalated?"Why remove this flag?":"Why are you flagging this customer?"}</div>
            <textarea class="flag-popover-input" id="flagReasonInput" rows="2" placeholder="${agentEscalated?"e.g. issue resolved":"e.g. customer threatened to churn"}"></textarea>
            <div class="flag-popover-actions">
              <button class="btn btn-tertiary" id="flagCancelBtn">Cancel</button>
              <button class="btn btn-primary" id="flagConfirmBtn">Confirm</button>
            </div>
          </div>` : ""}
        </div>
        <button class="btn-topbar ${agentPaused?"paused":""}" id="pauseBtn">
          ${agentPaused
            ? LU('<polygon points="6 3 20 12 6 21 6 3"/>')+"Resume Agent"
            : LU('<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>')+"Pause Agent"}
          <span class="icon-tip" style="right:0;left:auto">${agentPaused?"Resume: agent will start proposing actions":"Agent won't propose or take any actions on this customer"}</span>
        </button>
        <span class="perms-link" id="permsLink" style="margin-left:4px">Agent permissions</span>
      </div>
    </div>
    <section class="finger">
      <div class="left">
        <div class="agent-summary">
          <div class="as-label">${agentClusterIcon("static")}Agent Summary</div>
          <div class="as-body">${renderAgentSummary(SCENARIO)}</div>
        </div>
      </div>
      <div class="right">
        <div class="inv-h">Outstanding Invoices</div>
        <div class="inv-table-wrap">
          <table class="inv">
            <thead><tr><th>Invoice #</th>${invSortTh("due","Due")}<th>Status</th>${invSortTh("amount","Amount","r")}</tr></thead>
            <tbody>
              ${invRows}
            </tbody>
          </table>
        </div>
        ${sortedInvs.length > INV_PAGE_SIZE ? `<div class="pagination-row">
          <div class="pagination-controls">
            <button class="btn-page-arrow" data-inv-page-nav="prev" aria-label="Go to previous page" ${invPage<=1?"disabled":""}>${LU('<path d="m15 18-6-6 6-6"/>')}</button>
            ${pageNumbersToShow(invPage, invTotalPages).map(n=>
              n==="…" ? `<span class="pg-ellipsis">…</span>`
                      : `<button class="pg-num${n===invPage?" active":""}" data-inv-page-goto="${n}" aria-label="Go to page ${n}">${n}</button>`
            ).join("")}
            <button class="btn-page-arrow" data-inv-page-nav="next" aria-label="Go to next page" ${invPage>=invTotalPages?"disabled":""}>${LU('<path d="m9 18 6-6-6-6"/>')}</button>
          </div>
          <span class="pagination-count">${invPageStart+1}–${invRangeEnd} of ${sortedInvs.length} results</span>
        </div>` : ""}
      </div>
    </section>
    <nav class="tabs">
      <button class="tab ${activeTab==="actions"?"active":""}" data-tab="actions">Actions${pendingCount>0?agentClusterIcon("tiny"):""}</button>
      <button class="tab ${activeTab==="activity"?"active":""}" data-tab="activity">Activity</button>
      <button class="tab ${activeTab==="scheduled"?"active":""}" data-tab="scheduled">Scheduled</button>
      <span class="tab-underline" aria-hidden="true"></span>
    </nav>`;
}

// ============================================================
//  DETAIL — actions panel
// ============================================================
// "auto" (pre-seeded via a scenario's initialActionState, never set by a click) means the
// agent already executed this with no human touch — distinct from a human clicking Approve.
// A brief mocked "Executing…" state (executingActions) shows between a human approving and
// the verdict actually reading Executed — purely visual, the underlying actionState/
// askAgentPermissions writes have already happened by the time this fires (see mockExecute()).
function verdictHtml(st, i, extraStyle){
  if(!st) return "";
  if(st==="approved" && executingActions.has(i)){
    return `<span class="verdict executing"${extraStyle?` style="${extraStyle}"`:""}><span class="verdict-spinner"></span>Executing…</span>`;
  }
  const cls = st==="auto" ? "ok" : st==="approved" ? "approved" : "no";
  const label = st==="auto" ? "Auto-executed" : st==="approved" ? "✓ Executed" : st==="paused" ? "Cleared — agent paused" : "Rejected";
  return `<span class="verdict ${cls}"${extraStyle?` style="${extraStyle}"`:""}>${label}</span>`;
}
// Mock execution delay: shows "Executing…" for a beat, then flips to the real verdict. The
// actual state write (actionState/askAgentPermissions) already happened before this is called —
// this only controls what the badge displays in the meantime.
let executingActions = new Set();
function mockExecute(i, renderFn, after){
  executingActions.add(i);
  renderFn();
  setTimeout(()=>{
    executingActions.delete(i);
    if(after) after();
    renderFn();
  }, 900);
}

// Human-readable titles for generic (non-email, non-contact) proposed-action kinds — the July
// 28 action inventory (Build plan doc): mark pending, update PO, flag customer, apply cash app,
// schedule task. send_email/update_contacts have their own dedicated card branches below.
const ACTION_TITLES = {
  mark_pending:        "Mark invoice pending",
  update_po:           "Update PO number",
  update_customer_info:"Update customer info",
  flag_customer:       "Flag customer",
  apply_cash_app:      "Apply cash app recommendation",
  schedule_task:       "Schedule task",
};

// Coaching-moment nudge (per the Aug PRD's "How do we get users to give our agent more
// freedom to auto execute?" doc). The 4-button row on a still-PENDING action tile
// (pendingActionButtons()) is where the future-policy decision actually gets made now — Reject
// / Approve once / Sometimes approve / Always approve. This function renders whatever happens
// AFTER one of those is clicked:
//   - Always approve: resolves instantly, no confirm needed (the click IS the confirm).
//   - Sometimes approve: opens an inline, agent-style back-and-forth — asks when it'd be OK to
//     auto-handle this, lets the user also name a more specific action than the generic one if
//     that's what they actually mean, then shows a confirm card before committing.
//   - Auto-executed actions (a state this function intentionally doesn't touch the button-row
//     for) still get a quiet, no-question "change how the agent handles this" link.
// Everything here writes into the same shared askAgentPermissions list the worklist's Ask the
// Agent also reads/writes — one ruleset, no reconciliation needed.
function renderNudge(i, verdict){
  const draft = nudgeDraft[i];

  if(draft && (draft.resolved==="always" || draft.resolved==="sometimes" || draft.resolved==="changed")){
    const note = draft.resolved==="always" ? `Always auto-execute <strong>${esc(draft.y)}</strong> going forward.`
      : draft.resolved==="sometimes" ? `Auto-execute <strong>${esc(draft.y)}</strong> when: ${esc(draft.z)}`
      : `${XLABEL[draft.x]} <strong>${esc(draft.y)}</strong> when: ${esc(draft.z)}`;
    return `<div class="nudge-strip nudge-resolved">${agentClusterIcon("tiny")}<div class="nudge-body"><div class="nudge-text">✓ ${note}</div></div></div>`;
  }

  if(verdict==="auto"){
    if(draft==="typing-change"){
      return `<div class="nudge-strip nudge-auto">
        ${agentClusterIcon("tiny")}
        ${nudgeInputRow(i, "e.g. flag this instead if the amount is over $500", "data-nudge-change-submit")}
      </div>`;
    }
    return `<div class="nudge-strip nudge-auto"><button class="nudge-link" data-nudge-change="${i}">Change how the agent handles this →</button></div>`;
  }

  if(verdict!=="approved" || !draft || draft.mode!=="chat") return "";

  // A real back-and-forth: the agent can ask clarifying questions (and explain what a rule
  // needs) across as many turns as it takes, shows a thinking beat between turns, and only
  // surfaces the approval tile once the situation/action are specific enough — see
  // sometimesReady(). The user can still reject that tile and keep correcting the agent
  // (data-nudge-sometimes-cancel loops back into the same conversation, not a fresh reset).
  const thread = draft.log.map(m=>
    m.who==="agent"
      ? `<div class="aa-msg aa-agent">${agentClusterIcon("tiny")}<div class="aa-bubble">${esc(m.text)}</div></div>`
      : `<div class="aa-msg aa-user"><div class="aa-bubble">${esc(m.text)}</div></div>`
  ).join("");
  const thinking = draft.thinking
    ? `<div class="aa-msg aa-agent">${agentClusterIcon("tiny")}<div class="aa-bubble think-bubble"><span class="think-dots"><i></i><i></i><i></i></span></div></div>`
    : "";
  const inputRow = (!draft.ready && !draft.thinking)
    ? nudgeInputRow(i, "e.g. only for W9 requests, if that's all someone's asking for", "data-nudge-sometimes-submit")
    : "";
  const confirmCard = draft.ready ? draftCardHtml(draft.draft, `data-nudge-sometimes-confirm="${i}"`, `data-nudge-sometimes-cancel="${i}"`) : "";
  return `<div class="nudge-strip nudge-chat">${thread}${thinking}${inputRow}${confirmCard}</div>`;
}
// Auto-resizing textarea (grows with line breaks, doesn't shift the row's position) + a
// circular "press enter" send button, shared by the auto-executed change link and the
// sometimes-approve chat below.
function nudgeInputRow(i, placeholder, submitAttr){
  return `<div class="nudge-tell-row">
    <textarea class="nudge-tell-input" id="nudgeTell${i}" rows="1" placeholder="${esc(placeholder)}"></textarea>
    <button class="nudge-send" ${submitAttr}="${i}" aria-label="Send">${LU('<polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/>')}</button>
  </div>`;
}
// Decides whether the conversation has enough to draft a rule yet, or needs another turn.
// Ready immediately if a recognizable action/situation is named (PERMISSION_Y_HINTS) or the
// reply is reasonably descriptive; otherwise asks once for more detail, then proceeds
// regardless on the next attempt (a mock shouldn't loop forever).
function sometimesReady(text, attempts){
  const t = text.toLowerCase();
  const hasHint = PERMISSION_Y_HINTS.some(([re])=>re.test(t));
  const wordCount = t.split(/\s+/).filter(Boolean).length;
  return hasHint || wordCount>=5 || attempts>=1;
}
// Auto-executed change path: unlike Sometimes approve (fixed X=AUTO, since that flow exists to
// add nuance to an action the user is actively approving), here the user is likely walking AUTO
// back on something that already ran — so X is inferred from keywords and defaults to
// "Ask for approval" when ambiguous, not forced to AUTO.
function draftFromChangeText(i, text){
  const t = text.toLowerCase();
  const viaText = mockPermissionDraft(t, text);
  if(viaText) return viaText;
  const base = draftFromAction(SCENARIO.proposed[i]);
  const x = /\balways\b|auto[- ]?(execute|send)/.test(t) ? "AUTO" : (/\bnever\b|don'?t|\bstop\b/.test(t) ? "NEVER" : "FLAG");
  return { sec: base.sec, x, y: base.y, z: cleanZ(text) };
}
// Sometimes-approve path: prefer a more specific Y if the user's own words name one (via the
// same PERMISSION_Y_HINTS table everything else uses), otherwise keep the action-derived Y —
// a generic Y is fine when that's genuinely all there is, but the user's own words win when
// they're more specific than the tile itself.
function draftFromSometimesText(i, text){
  const base = draftFromAction(SCENARIO.proposed[i]);
  const t = text.toLowerCase();
  const hint = PERMISSION_Y_HINTS.find(([re])=>re.test(t));
  return {
    sec: hint ? hint[1] : base.sec,
    x: "AUTO",
    y: hint ? hint[2] : base.y,
    z: cleanZ(text),
  };
}
// The 4-button row shown on a still-pending action tile. Reject / Approve once are plain,
// one-shot decisions about THIS action only. Always approve / Sometimes approve both also
// approve this instance, but additionally shape future policy — Always approve commits an
// unconditional exception immediately (the click is the confirm); Sometimes approve opens the
// inline agent back-and-forth above.
function pendingActionButtons(i){
  return `<button class="btn" data-rej="${i}">Reject</button>
    <button class="btn" data-app-once="${i}">Approve once</button>
    <button class="btn" data-app-always="${i}">Always approve</button>
    <button class="btn btn-rule" data-app-sometimes="${i}">${agentClusterIcon("tiny")}Approve & add a rule</button>`;
}

// One proposed action card (right/effect side). Reused for email / contact / generic.
function renderActionCard(a, i){
  const st = actionState[i];
  const isEmail = a.kind==="send_email";
  const isContact = a.kind==="update_contacts" && a.editableContact!=null;
  const isExpContact = expandedCard===i && isContact && !st;
  const isExpanded = expandedCard===i && isEmail && !st;
  const attachCount = (a.attachments||[]).length;

  if(isEmail){
    // Editing the email draft now happens in the thread drawer (with conversation context), not inline.
    return `<div class="card ${st?"done":""}" style="flex-direction:column;align-items:stretch">
      <div class="se-collapsed">
        <div class="body" style="flex:1;min-width:0">
          <span class="title">Send email</span>
          <span class="desc">${esc(a.desc)}</span>
          ${attachCount?`<span class="se-meta">${attachCount} attachment${attachCount>1?"s":""}</span>`:""}
        </div>
        ${st
          ? verdictHtml(st, i)
          : `<button class="btn btn-tertiary" data-edit-email="${i}">Edit in thread</button>
             ${pendingActionButtons(i)}`}
      </div>
      ${renderNudge(i, st)}
    </div>`;
  }
  if(isContact){
    const curVal = editValues[i]!==undefined ? editValues[i] : a.editableContact;
    const contactExpanded = isExpContact ? `
      <div class="contact-edit" style="margin-top:12px">
        <div class="field">
          <label class="field-label">Primary contact</label>
          <input class="field-input" id="ci${i}" value="${esc(curVal)}">
        </div>
        <div class="cmp-tiny">
          <button class="btn btn-tertiary" data-canceledit="${i}">Cancel</button>
          <button class="btn" data-save="${i}">Save</button>
        </div>
        <div class="draft-footer">
          <button class="btn btn-danger" data-rej="${i}"><span class="ic">${ICON.x}</span>Reject</button>
          <button class="btn btn-primary" data-app="${i}"><span class="ic">${ICON.check}</span>Approve</button>
        </div>
      </div>` : "";
    return `<div class="card ${st?"done":""}" style="flex-direction:column;align-items:stretch">
      <div class="se-collapsed">
        <div class="body" style="flex:1;min-width:0">
          <span class="title">Update billing contact</span>
          <span class="se-meta">→ ${esc(curVal)}</span>
        </div>
        ${st
          ? verdictHtml(st, i)
          : `<button class="btn btn-tertiary" data-expand="${i}">${isExpContact?"Close":"Edit"}</button>
             ${pendingActionButtons(i)}`}
      </div>
      ${contactExpanded}
      ${renderNudge(i, st)}
    </div>`;
  }
  // Anything with real field(s) the agent inferred (a PO number, a contact, a wire reference, a
  // scheduled date/prompt...) gets an Edit toggle, same collapsed/expanded pattern as the contact
  // card above, generalized to N fields. Actions with nothing to edit (mark_pending,
  // flag_customer — a boolean, not a value) skip straight to the plain Approve/Reject fallback.
  const isGenericEditable = Array.isArray(a.editableFields) && a.editableFields.length>0;
  if(isGenericEditable){
    const isExp = expandedCard===i && !st;
    const curVals = editValues[i] || a.editableFields.map(f=>f.value);
    const fieldsExpanded = isExp ? `
      <div class="contact-edit" style="margin-top:12px">
        ${a.editableFields.map((f,fi)=>`
        <div class="field">
          <label class="field-label">${esc(f.label)}</label>
          <input class="field-input" id="gi${i}_${fi}" value="${esc(curVals[fi])}">
        </div>`).join("")}
        <div class="cmp-tiny">
          <button class="btn btn-tertiary" data-canceledit="${i}">Cancel</button>
          <button class="btn" data-savegeneric="${i}">Save</button>
        </div>
        <div class="draft-footer">
          <button class="btn btn-danger" data-rej="${i}"><span class="ic">${ICON.x}</span>Reject</button>
          <button class="btn btn-primary" data-app="${i}"><span class="ic">${ICON.check}</span>Approve</button>
        </div>
      </div>` : "";
    return `<div class="card ${st?"done":""}" style="flex-direction:column;align-items:stretch">
      <div class="se-collapsed">
        <div class="body" style="flex:1;min-width:0"><span class="title">${esc(ACTION_TITLES[a.kind]||a.kind)}</span><span class="desc">${esc(a.desc)}</span></div>
        ${st
          ? verdictHtml(st, i)
          : `<button class="btn btn-tertiary" data-expand="${i}">${isExp?"Close":"Edit"}</button>
             ${pendingActionButtons(i)}`}
      </div>
      ${fieldsExpanded}
      ${renderNudge(i, st)}
    </div>`;
  }
  const acts = st ? verdictHtml(st, i) : pendingActionButtons(i);
  return `<div class="card ${st?"done":""}" style="flex-direction:column;align-items:stretch">
    <div style="display:flex;align-items:center;gap:16px">
      <div class="body" style="flex:1"><span class="title">${esc(ACTION_TITLES[a.kind]||a.kind)}</span><span class="desc">${esc(a.desc)}</span></div>
      <div class="acts">${acts}</div>
    </div>
    ${renderNudge(i, st)}
  </div>`;
}

// An action cites exactly one triggering event — never more than one (a real proposed action
// only ever fires off a single trigger; see CLAUDE.md decision #1). Wrapped in an array purely
// so callers have one shape to iterate, not because more than one is ever valid.
function causesOf(a){ return a && a.cause ? [a.cause] : []; }

// The one triggering email, as cited by a proposed action's `cause` (looked up in THREADS).
function renderCauseBlock(cause){
  const mail = LU('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>');
  if(cause && cause.type==="email"){
    const em = THREADS.flatMap(t=>t.emails).find(e=>e.id===cause.id);
    const preview = em ? em.body.replace(/\s+/g," ").trim() : "";
    const time = em ? (em.time||"") : "";
    return `<div class="tl-event email" data-open-email-drawer="${em?em.id:""}">
      <span class="tl-ev-icon">${mail}</span>
      <div class="tl-ev-main">
        <div class="tl-ev-top">
          <span class="tl-ev-who">${esc(em?em.from.name:"")}</span>
          <span class="tl-time">${esc(em?em.date:"")} · ${esc(time)}</span>
          <span class="tl-open">Open ›</span>
        </div>
        <div class="tl-ev-text">${esc(preview)}</div>
      </div>
    </div>`;
  }
  return `<div class="tl-event"><span class="tl-ev-text">Agent-initiated</span></div>`;
}

// One timeline node: the event that triggered it, with the suggested action(s) nested beneath.
function renderTimelineNode(o){
  const eventHtml = renderCauseBlock(o.cause||null);
  // o.actions is a list of {action, idx} sharing this exact cause — stacked together under
  // the one event instead of repeating it once per action.
  const actionHtml = (o.actions||[]).map(({action,idx})=>`<div class="tl-action">${renderActionCard(action,idx)}</div>`).join("");
  return `<div class="tl-node">
    <span class="tl-dot"></span>
    <div class="tl-node-main">${eventHtml}${actionHtml}</div>
  </div>`;
}

function renderActionsPanel(){
  const p = SCENARIO.proposed;
  const pending = p.filter((_,i)=>!actionState[i]).length;
  const head = pending>0
    ? `<span class="as-count"><span>${pending}</span> action${pending>1?"s":""} awaiting review</span>`
    : `<span class="as-count" style="color:var(--good)">✓ All actions resolved</span>`;

  let content;
  if(!p.length){
    content = `<div class="empty">No actions pending.</div>`;
  } else {
    // Decision: the agent cites a single event per action it proposes — no orphan events, and
    // no action ever cites more than one. An event only ever shows here if a proposed action is
    // actually tied to it (via cause). When two or more actions share the *exact same* cause,
    // they're grouped under one copy of that event instead of repeating it (Northwind/Meridian/
    // Cobalt Fitness — several actions, one shared email).
    const groups = [];
    const groupByKey = new Map();
    p.forEach((a,i)=>{
      const key = a.cause ? `${a.cause.type}:${a.cause.id}` : `none:${i}`;
      if(!groupByKey.has(key)){
        const g = { cause: a.cause, actions: [] };
        groupByKey.set(key, g);
        groups.push(g);
      }
      groupByKey.get(key).actions.push({ action:a, idx:i });
    });
    const nodes = groups.map(g=>renderTimelineNode({cause:g.cause, actions:g.actions}));
    content = `<div class="action-strip">${head}</div>
      <div class="tl">${nodes.join("")}</div>`;
  }

  // Paused agent → cover the Actions tab with a blurred overlay + Resume button, no copy.
  const overlay = agentPaused ? `
    <div class="agent-overlay">
      <div class="agent-overlay-inner">
        <button class="btn btn-primary agent-overlay-btn" data-resume-agent>${LU('<polygon points="6 3 20 12 6 21 6 3"/>')}Resume Agent</button>
      </div>
    </div>` : "";

  return `<div class="actions-wrap${agentPaused?" is-paused":""}">${content}${overlay}</div>`;
}

// ============================================================
//  DETAIL — activity panel
// ============================================================

// Filter buckets. "agent" cuts across both emails and events — anything Collections Agent
// touched, auto-executed or human-approved. Rejected proposals never appear here at all.
function renderActivityBody(){
  const mail = LU('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>');
  const items = activityItems().filter(item => activityFilter==="email" ? item.type==="email" : true);
  if(!items.length) return `<div class="act-list"><div class="empty">${activityFilter==="email"?"No emails yet.":"No activity yet."}</div></div>`;
  const rows = items.map(item=>{
    if(item.type==="email"){
      // Each message in a thread gets its own chronological row (no collapsing to the
      // latest message) — clicking any of them opens the same shared thread, scrolled/
      // expanded to that specific message. See PRD 2.0 open questions.
      const thread = threadForEmailId(item.id);
      const tid = thread ? thread.id : item.id;
      const count = thread ? thread.emails.length : 1;
      const preview = item.body.replace(/\s+/g," ").trim();
      const badges = (item.badges||[]).map(b=>engBadge(b)).join("");
      const draftBadge = (thread&&thread.agentReplyDraft&&item.id===thread.emails[thread.emails.length-1].id) ? `<span class="draft-badge">✎ Agent draft</span>` : "";
      const stacked = (count>1) ? `<div class="email-stack" data-open-thread="${tid}" data-focus-email="${item.id}">View thread (${count}) →</div>` : "";
      return `<div class="act-row email-row${count>1?" has-thread-link":""}" data-open-thread="${tid}" data-focus-email="${item.id}">
        <span class="er-icon">${mail}</span>
        <div class="er-main">
          <div class="email-row-top">
            <span class="email-row-who">${esc(item.from.name)}</span>
            <span class="email-row-subject">${esc(thread?thread.subject:"")}</span>${draftBadge}
            <span class="email-row-date">${esc(item.date)} · ${esc(item.time||"")}</span>
          </div>
          <div class="email-row-body">${esc(preview)}</div>
          ${badges?`<div class="email-row-foot">${badges}</div>`:""}
          ${stacked}
        </div>
      </div>`;
    }
    // Actor attribution matches the real PRD Activity Log spec's own examples verbatim:
    // the actor (TABS / Priya Sharma / Collections Agent) is bolded inline as part of the
    // entry text itself ("**Collections Agent** set PO 12345 on INV-2241"), not appended by
    // this renderer — every event's `text` already names who did it. No separate prefix or
    // "· Auto"/"· Approved" suffix on top of that (see decision #2).
    return `<div class="act-row event-row">
      <span class="ev-node"></span>
      <span class="ar-body">${item.html||mdInline(esc(item.text||""))}</span>
      <span class="ar-datestamp">${esc(item.date)} · ${esc(item.time||"")}</span>
    </div>`;
  }).join("");
  return `<div class="act-list">${rows}</div>`;
}

function renderActivityPanel(){
  const filterTabs = `<div class="act-filter-tabs">
    <button class="act-ftab ${activityFilter==="all"?"active":""}" data-activity-filter="all">All</button>
    <button class="act-ftab ${activityFilter==="email"?"active":""}" data-activity-filter="email">Email</button>
  </div>`;
  return `${filterTabs}<div class="act-body" id="actBody">${renderActivityBody()}</div>`;
}

function wireActivityBody(){
  const body = $("actBody"); if(!body) return;
  body.querySelectorAll("[data-open-thread]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); openThreadDrawer(el.dataset.openThread, el.dataset.focusEmail); });
  body.querySelectorAll("[data-open-email-drawer]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); openEmailDrawer(el.dataset.openEmailDrawer); });
}

// ============================================================
//  SCHEDULED PANEL
// ============================================================
function renderScheduledPanel(){
  const all = (SCENARIO.scheduled||[]).sort((a,b)=>toMs(a.date,a.time)-toMs(b.date,b.time));
  const tasks = all.filter(s=>s.type==="agent_task" && !deletedTasks.has(s.id));
  const nextDunning = all.find(s=>s.type==="dunning");

  const dunningNote = nextDunning
    ? `<span style="font-size:12px;color:var(--helper)">Next dunning reminder: <strong style="color:var(--ink)">${esc(nextDunning.date)}</strong> &nbsp;·&nbsp; <span class="sched-settings-link">Global dunning settings →</span></span>`
    : `<span class="sched-settings-link" style="font-size:12px">Global dunning settings →</span>`;

  let html = `<div class="sched-header">
    <h3>Scheduled</h3>
    <div>${dunningNote}</div>
  </div>`;

  if(!tasks.length){
    return `<div class="sched-body">${html}<div class="empty">No agent scheduled tasks.</div></div>`;
  }

  tasks.forEach(s=>{
    const isEditing = editingTask===s.id;
    const preview = s.prompt.replace(/\s+/g," ").trim();
    const editForm = isEditing ? `
      <div class="sched-task-form">
        <div class="field">
          <label class="field-label">Date / time</label>
          <input class="field-input" id="stf-date-${s.id}" value="${esc(s.date)} · ${esc(s.time)}">
        </div>
        <div class="field">
          <label class="field-label">Prompt</label>
          <textarea class="field-input" style="min-height:80px;resize:vertical;line-height:1.5" id="stf-prompt-${s.id}">${esc(s.prompt)}</textarea>
        </div>
        <div class="stf-actions">
          <span class="stf-delete" data-delete-task="${s.id}">Delete task</span>
          <div class="cmp-tiny">
            <button class="btn btn-tertiary" data-cancel-task="${s.id}">Cancel</button>
            <button class="btn" data-save-task="${s.id}">Save</button>
          </div>
        </div>
      </div>` : "";
    html+=`<div class="sched-tile">
      <div class="sched-tile-head">
        <div class="sched-tile-left">
          <div class="sched-tile-when">${esc(s.date)} · ${esc(s.time)}</div>
          <div class="sched-tile-title">Agent scheduled task</div>
          <div class="sched-tile-body" style="padding:4px 0 0;font-size:13px;color:var(--ink)">${esc(preview)}</div>
        </div>
        <span class="ent-strip agent" style="flex:0 0 auto;margin-top:2px">Agent</span>
      </div>
      <div class="sched-tile-foot">
        <span class="sf-note"></span>
        ${isEditing?"":
          `<button class="btn" data-edit-task="${s.id}" style="padding:5px 12px;font-size:12.5px">Edit</button>
           <button class="btn" data-delete-task="${s.id}" style="padding:5px 12px;font-size:12.5px;color:var(--warn)">Delete</button>`}
      </div>
      ${editForm}
    </div>`;
  });

  return `<div class="sched-body">${html}</div>`;
}

// ============================================================
//  PANEL + WIRING
// ============================================================
function renderPanel(){
  const p = $("panel"); if(!p) return;
  p.innerHTML = activeTab==="actions" ? renderActionsPanel()
    : activeTab==="activity" ? renderActivityPanel()
    : renderScheduledPanel();
  wire();
}

function wire(){
  const p = $("panel"); if(!p) return;
  p.querySelectorAll("[data-toggle-ne]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const id=el.dataset.toggleNe; if(openNewEvents.has(id)) openNewEvents.delete(id); else openNewEvents.add(id); renderPanel(); });
  p.querySelectorAll("[data-open-email-drawer]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); openEmailDrawer(el.dataset.openEmailDrawer); });
  p.querySelectorAll("[data-app]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const i=+el.dataset.app; actionState[i]="approved"; expandedCard=null; mockExecute(i, renderPanel); });
  p.querySelectorAll("[data-rej]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); actionState[+el.dataset.rej]="rejected"; expandedCard=null; renderPanel(); });
  // Pending-tile 4-button row: Reject/Approve once are plain one-shot verdicts (handled by the
  // generic data-app/data-rej handlers above). Always/Sometimes approve also set the verdict
  // AND shape future policy — that part of the outcome (the exception, the follow-up chat)
  // is deferred until the mock "Executing…" beat finishes, so it lands right as the badge
  // flips to Executed rather than appearing before the action has "run."
  p.querySelectorAll("[data-app-once]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const i=+el.dataset.appOnce; actionState[i]="approved"; expandedCard=null; mockExecute(i, renderPanel); });
  p.querySelectorAll("[data-app-always]").forEach(el=>el.onclick=(e)=>{
    e.stopPropagation();
    const i=+el.dataset.appAlways;
    actionState[i]="approved"; expandedCard=null;
    const d=draftFromAction(SCENARIO.proposed[i]);
    mockExecute(i, renderPanel, ()=>{ askAgentPermissions.push(d); nudgeDraft[i]={resolved:"always", ...d}; });
  });
  p.querySelectorAll("[data-app-sometimes]").forEach(el=>el.onclick=(e)=>{
    e.stopPropagation();
    const i=+el.dataset.appSometimes;
    actionState[i]="approved"; expandedCard=null;
    mockExecute(i, renderPanel, ()=>{
      nudgeDraft[i] = { mode:"chat", attempts:0, thinking:false, ready:false, draft:null, log:[
        { who:"agent", text:"I can automate more of this going forward — just tell me the situation, and what I can do automatically in it." },
      ] };
    });
  });
  p.querySelectorAll("[data-nudge-sometimes-submit]").forEach(el=>el.onclick=(e)=>{
    e.stopPropagation();
    const i=+el.dataset.nudgeSometimesSubmit;
    const inp=$(`nudgeTell${i}`); if(!inp||!inp.value.trim()) return;
    const d=nudgeDraft[i]; if(!d||d.mode!=="chat") return;
    d.log.push({ who:"user", text:inp.value });
    d.thinking = true;
    renderPanel();
    setTimeout(()=>{
      d.thinking = false;
      const allUserText = d.log.filter(m=>m.who==="user").map(m=>m.text).join(". ");
      if(sometimesReady(allUserText, d.attempts)){
        d.draft = draftFromSometimesText(i, allUserText);
        d.ready = true;
        d.log.push({ who:"agent", text:"Here's what I'll set up — take a look." });
      } else {
        d.attempts++;
        d.log.push({ who:"agent", text:"Can you say a bit more? A rule needs two things: the specific type of request (if this one isn't already specific enough) and the situation that makes it okay to handle automatically." });
      }
      renderPanel();
    }, 800);
  });
  p.querySelectorAll("[data-nudge-sometimes-confirm]").forEach(el=>el.onclick=(e)=>{
    e.stopPropagation();
    const i=+el.dataset.nudgeSometimesConfirm;
    const d=nudgeDraft[i] && nudgeDraft[i].draft;
    if(d){ askAgentPermissions.push(d); nudgeDraft[i]={resolved:"sometimes", ...d}; }
    renderPanel();
  });
  p.querySelectorAll("[data-nudge-sometimes-cancel]").forEach(el=>el.onclick=(e)=>{
    e.stopPropagation();
    const i=+el.dataset.nudgeSometimesCancel;
    const d=nudgeDraft[i]; if(!d||d.mode!=="chat") return;
    // "Not quite" keeps the thread going — the user can still correct the agent — rather
    // than resetting the whole conversation.
    d.ready = false; d.draft = null;
    d.log.push({ who:"agent", text:"No problem — what should I change?" });
    renderPanel();
  });
  // auto-executed's lightweight "change permission" link — untouched by the above
  p.querySelectorAll("[data-nudge-change]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); nudgeDraft[+el.dataset.nudgeChange]="typing-change"; renderPanel(); });
  p.querySelectorAll("[data-nudge-change-submit]").forEach(el=>el.onclick=(e)=>{
    e.stopPropagation();
    const i=+el.dataset.nudgeChangeSubmit;
    const inp=$(`nudgeTell${i}`); if(!inp||!inp.value.trim()) return;
    const d=draftFromChangeText(i, inp.value);
    askAgentPermissions.push(d);
    nudgeDraft[i]={resolved:"changed", ...d};
    renderPanel();
  });
  p.querySelectorAll(".nudge-tell-input").forEach(el=>{
    const i = el.id.replace("nudgeTell","");
    const resize=()=>{ el.style.height="auto"; el.style.height=Math.min(el.scrollHeight,110)+"px"; };
    el.oninput = resize;
    el.onkeydown=(e)=>{ if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); e.stopPropagation(); p.querySelector(`[data-nudge-sometimes-submit="${i}"], [data-nudge-change-submit="${i}"]`)?.click(); } };
    resize();
    el.focus();
  });
  p.querySelectorAll("[data-expand]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const i=+el.dataset.expand; expandedCard=(expandedCard===i)?null:i; renderPanel(); });
  p.querySelectorAll("[data-edit-email]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); openDraftEditorInDrawer(+el.dataset.editEmail); });
  p.querySelectorAll("[data-edit]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); editingCard=+el.dataset.edit; renderPanel(); });
  p.querySelectorAll("[data-save]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const i=+el.dataset.save; const inp=document.getElementById("ci"+i); if(inp) editValues[i]=inp.value; editingCard=null; renderPanel(); });
  p.querySelectorAll("[data-savegeneric]").forEach(el=>el.onclick=(e)=>{
    e.stopPropagation();
    const i=+el.dataset.savegeneric;
    const a=SCENARIO.proposed[i];
    editValues[i]=(a.editableFields||[]).map((f,fi)=>{ const inp=document.getElementById(`gi${i}_${fi}`); return inp?inp.value:f.value; });
    renderPanel();
  });
  p.querySelectorAll("[data-canceledit]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); editingCard=null; renderPanel(); });
  p.querySelectorAll("[data-resume-agent]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); agentPaused=false; render(); });
  p.querySelectorAll("[data-open-thread]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); openThreadDrawer(el.dataset.openThread); });
  p.querySelectorAll("[data-back-activity]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); selectedEmailId=null; threadOpenEmails=new Set(); renderPanel(); });
  p.querySelectorAll("[data-expand-email]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const id=el.dataset.expandEmail; if(threadOpenEmails.has(id)) threadOpenEmails.delete(id); else threadOpenEmails.add(id); renderPanel(); });
  p.querySelectorAll("[data-header-modal]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); openEmailHeaderModal(el.dataset.headerModal, el); });
  p.querySelectorAll("[data-activity-filter]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); activityFilter=el.dataset.activityFilter; renderPanel(); });
  // pill add on space/comma
  p.querySelectorAll("[data-pill-input]").forEach(el=>el.onkeydown=(e)=>{
    if(e.key===" "||e.key===","||e.key==="Enter"){ e.preventDefault();
      const val=el.value.trim().replace(/,$/,"");
      if(!val) return;
      const [idx,field]=el.dataset.pillInput.split(":");
      if(!recipientPills[idx]) recipientPills[idx]={to:[],cc:[]};
      recipientPills[idx][field].push(val); el.value=""; renderPanel();
    }
  });
  // pill remove
  p.querySelectorAll("[data-rm-pill]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation();
    const [idx,field,email]=el.dataset.rmPill.split(":");
    if(recipientPills[idx]) recipientPills[idx][field]=recipientPills[idx][field].filter(x=>x!==email);
    renderPanel();
  });
  p.querySelectorAll("[data-edit-task]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); editingTask=el.dataset.editTask; renderPanel(); });
  p.querySelectorAll("[data-cancel-task]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); editingTask=null; renderPanel(); });
  p.querySelectorAll("[data-save-task]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); editingTask=null; renderPanel(); });
  p.querySelectorAll("[data-delete-task]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); deletedTasks.add(el.dataset.deleteTask); editingTask=null; renderPanel(); });
  p.querySelectorAll("[data-cancel-draft]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); expandedCard=null; renderPanel(); });
  p.querySelectorAll("[data-save-draft]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); expandedCard=null; renderPanel(); });
  p.querySelectorAll("[data-ai-refine]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const [idx,type]=el.dataset.aiRefine.split(":"); const inp=p.querySelector(`[data-ai-input="${idx}"]`); if(inp) inp.value=""; aiRefineDraft(idx, type); });
  p.querySelectorAll("[data-ai-input]").forEach(el=>el.onkeydown=(e)=>{ if(e.key==="Enter"){ e.preventDefault(); e.stopPropagation(); if(!el.value.trim()) return; const idx=el.dataset.aiInput; el.value=""; aiRefineDraft(idx, null); } });
  p.querySelectorAll("[data-ai-submit]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const idx=el.dataset.aiSubmit; const inp=p.querySelector(`[data-ai-input="${idx}"]`); if(!inp||!inp.value.trim()) return; inp.value=""; aiRefineDraft(idx, null); });
  p.querySelectorAll("[data-ai-focus]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); p.querySelector(`[data-ai-input="${el.dataset.aiFocus}"]`)?.focus(); });
  p.querySelectorAll("[data-ai-undo]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); aiUndoRedo(el.dataset.aiUndo, false); });
  p.querySelectorAll("[data-ai-redo]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); aiUndoRedo(el.dataset.aiRedo, true); });
  p.querySelectorAll("[data-open-picker]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); attachPickerOpen=attachPickerOpen===el.dataset.openPicker?false:el.dataset.openPicker; renderPanel(); });
  p.querySelectorAll("[data-pick-attach]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const [idx,name]=el.dataset.pickAttach.split(":"); if(!selectedAttachments[idx]) selectedAttachments[idx]=new Set(); selectedAttachments[idx].add(name); attachPickerOpen=false; renderPanel(); });
  p.querySelectorAll("[data-rm-attach]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); const [idx,name]=el.dataset.rmAttach.split(":"); if(selectedAttachments[idx]) selectedAttachments[idx].delete(name); renderPanel(); });
  p.querySelectorAll(".thread-link[data-thread]").forEach(el=>el.onclick=(e)=>{
    e.stopPropagation();
    deepLinkToThread(el.dataset.thread);
    activeTab="activity";
    document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t.dataset.tab==="activity"));
    positionTabIndicator(true);
    renderPanel();
  });

}

// ============================================================
//  RENDER + INIT
// ============================================================
// Toretto top banner: sage header with breadcrumb (left) + global search (right)
function renderTopbar(crumbHtml){
  const search = LU('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>');
  return `<div class="topbar">
    <div class="tb-crumb">${crumbHtml}</div>
    <div class="tb-spacer"></div>
    <div class="tb-search">${search}<span class="tb-ph">Search customers, invoices, contracts</span><span class="tb-kbd">⌘K</span></div>
    <div class="tb-help">?</div>
  </div>`;
}
const TB = {
  inbox: `<b>Collections Agent</b>`,
  customer: ()=>`Customers <span class="tb-sep">›</span> <b>${esc(SCENARIO.customer)}</b>`,
  billing: `Invoicing <span class="tb-sep">›</span> Billing <span class="tb-sep">›</span> <b>Invoice</b>`,
  detail: ()=>`<span class="tb-link" data-crumb="inbox">Collections Agent</span> <span class="tb-sep">›</span> <b>${esc(SCENARIO.customer)}</b>`,
  settings: `<span class="tb-link" data-crumb="inbox">Collections Agent</span> <span class="tb-sep">›</span> <b>Agent Permissions</b>`,
};

function render(){
  renderNav();
  const escrim = $("emailScrim"); if(escrim) escrim.onclick = ()=>closeEmailDrawer();
  const main = $("main-content");
  if(view==="billing"){
    main.innerHTML = renderTopbar(TB.billing) + renderBilling();
    const cab = $("collAgentBtn");
    if(cab) cab.onclick=()=>{ view="detail"; actionState={}; editingCard=null; editValues={}; expandedCard=null; threadExpanded=false; selectedEmailId=null; threadOpenEmails=new Set(); expandedHeaders=new Set(); selectedAttachments={}; showBcc=false; attachPickerOpen=false; openNewEvents=new Set(); recipientPills={}; draftHistory={}; draftRedo={}; aiGenerating=false; drawerThreadId=null; drawerEditing=false; drawerEditActionIdx=null; agentEscalated=false; flagPopoverOpen=false; agentPaused=false; invSort={key:null,dir:"asc"}; invPage=1; nudgeDraft={}; executingActions=new Set(); activeTab="actions"; activityFilter="all"; render(); };
  } else if(view==="customer"){
    main.innerHTML = renderTopbar(TB.customer()) + renderCustomer();
    main.querySelectorAll("[data-nav-to-detail]").forEach(el=>el.onclick=()=>{
      view="detail"; actionState={}; editingCard=null; editValues={}; expandedCard=null;
      threadExpanded=false; selectedEmailId=null; threadOpenEmails=new Set();
      expandedHeaders=new Set(); selectedAttachments={}; showBcc=false; attachPickerOpen=false;
      openNewEvents=new Set(); recipientPills={}; draftHistory={}; draftRedo={}; aiGenerating=false; drawerThreadId=null; drawerEditing=false; drawerEditActionIdx=null; agentEscalated=false; flagPopoverOpen=false; agentPaused=false; invSort={key:null,dir:"asc"}; invPage=1; nudgeDraft={}; executingActions=new Set();
      activeTab="actions"; activityFilter="all"; render();
    });
    $("backBtn") && ($("backBtn").onclick=()=>{ view="inbox"; render(); });
  } else if(view==="inbox"){
    main.innerHTML = renderTopbar(TB.inbox) + renderInbox();
    const si=$("inboxSearchInput"); if(si) si.oninput=(e)=>{
      inboxSearchQuery = e.target.value;
      inboxPage = 1;
      const pos = e.target.selectionStart;
      render();
      const ni=$("inboxSearchInput"); if(ni){ ni.focus(); ni.setSelectionRange(pos, pos); }
    };
    const sc=$("inboxSearchClear"); if(sc) sc.onclick=(e)=>{ e.stopPropagation(); inboxSearchQuery=""; inboxPage=1; render(); const ni=$("inboxSearchInput"); if(ni) ni.focus(); };
    const fb=$("filterBtn"); if(fb) fb.onclick=(e)=>{ e.stopPropagation(); filterOpen=!filterOpen; filterSubmenu=null; render(); };
    main.querySelectorAll(".filter-dropdown").forEach(el=>el.onclick=(e)=>e.stopPropagation());
    main.querySelectorAll("[data-filter-type]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); filterSubmenu=el.dataset.filterType; render(); });
    main.querySelectorAll("[data-filter-checkbox]").forEach(el=>el.onchange=(e)=>{
      e.stopPropagation();
      const [type,value,display] = el.dataset.filterCheckbox.split(":");
      let f = activeFilters.find(x=>x.type===type);
      if(!f){ f = { type, mode:"categorical", label:FILTER_DEFS[type].label, values:[], displays:{} }; activeFilters.push(f); }
      f.displays = f.displays || {};
      if(el.checked){ if(!f.values.includes(value)) f.values.push(value); f.displays[value]=display; }
      else { f.values = f.values.filter(v=>v!==value); delete f.displays[value]; }
      f.display = f.values.map(v=>f.displays[v]).join(", ");
      if(!f.values.length) activeFilters = activeFilters.filter(x=>x.type!==type);
      inboxPage=1; render();
    });
    main.querySelectorAll("[data-filter-radio]").forEach(el=>el.onchange=(e)=>{
      e.stopPropagation();
      const [type,op] = el.dataset.filterRadio.split(":");
      pendingFilterOperator[type] = op;
      const f = activeFilters.find(x=>x.type===type);
      if(f){ f.operator=op; f.display = numericDisplay(FILTER_DEFS[type], op, f.amount); }
      render();
    });
    const fai = $("filterAmountInput");
    if(fai) fai.oninput = (e)=>{
      e.stopPropagation();
      const type = fai.dataset.filterAmount;
      const raw = fai.value.trim();
      const pos = fai.selectionStart;
      const op = pendingFilterOperator[type] || "gte";
      if(raw===""){ activeFilters = activeFilters.filter(x=>x.type!==type); }
      else {
        let f = activeFilters.find(x=>x.type===type);
        if(!f){ f = { type, mode:"numeric", label:FILTER_DEFS[type].label, operator:op, amount:0 }; activeFilters.push(f); }
        f.operator = op;
        f.amount = Number(raw)||0;
        f.display = numericDisplay(FILTER_DEFS[type], f.operator, f.amount);
      }
      inboxPage=1; render();
      const ni=$("filterAmountInput"); if(ni){ ni.focus(); ni.setSelectionRange(pos,pos); }
    };
    main.querySelectorAll("[data-filter-amount-clear]").forEach(el=>el.onclick=(e)=>{
      e.stopPropagation();
      activeFilters = activeFilters.filter(x=>x.type!==el.dataset.filterAmountClear);
      inboxPage=1; render();
    });
    main.querySelectorAll("[data-filter-reset]").forEach(el=>el.onclick=(e)=>{
      e.stopPropagation();
      const type = el.dataset.filterReset;
      activeFilters = activeFilters.filter(x=>x.type!==type);
      delete pendingFilterOperator[type];
      inboxPage=1; render();
    });
    main.querySelectorAll("[data-remove-filter]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); activeFilters.splice(+el.dataset.removeFilter,1); inboxPage=1; render(); });
    main.querySelectorAll("[data-page-nav]").forEach(el=>el.onclick=(e)=>{
      e.stopPropagation();
      inboxPage += el.dataset.pageNav==="next" ? 1 : -1;
      render();
    });
    main.querySelectorAll("[data-page-goto]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); inboxPage=+el.dataset.pageGoto; render(); });
    main.querySelectorAll("th[data-sort-key]").forEach(el=>el.onclick=()=>{
      const k = el.dataset.sortKey;
      inboxSort = inboxSort.key===k ? { key:k, dir: inboxSort.dir==="asc"?"desc":"asc" } : { key:k, dir:"desc" };
      inboxPage = 1;
      render();
    });
    document.onclick=()=>{ if(filterOpen){filterOpen=false;filterSubmenu=null;render();} };
    main.querySelectorAll("[data-customer]").forEach(row=>row.onclick=()=>{
      const sc = SCENARIOS_BY_ID[row.dataset.customer];
      if(sc){ SCENARIO = sc.scenario; THREADS = sc.threads; }
      view="detail"; actionState = (SCENARIO.initialActionState ? {...SCENARIO.initialActionState} : {}); editingCard=null; editValues={}; expandedCard=null;
      threadExpanded=false; selectedEmailId=null; threadOpenEmails=new Set();
      expandedHeaders=new Set(); selectedAttachments={}; showBcc=false; attachPickerOpen=false;
      openNewEvents=new Set(); recipientPills={}; draftHistory={}; draftRedo={}; aiGenerating=false; drawerThreadId=null; drawerEditing=false; drawerEditActionIdx=null; agentEscalated=false; flagPopoverOpen=false; agentPaused=false; invSort={key:null,dir:"asc"}; invPage=1; nudgeDraft={}; executingActions=new Set();
      activeTab="actions"; activityFilter="all"; render();
    });
    main.querySelectorAll("[data-view-tab]").forEach(el=>el.onclick=(e)=>{ e.stopPropagation(); inboxView=el.dataset.viewTab; render(); });
    if(inboxView==="agent"){
      const sendAskAgent = ()=>{
        const ai=$("aaInput"); if(!ai || !ai.value.trim()) return;
        handleAskAgentMessage(ai.value);
        render();
      };
      const as=$("aaSend"); if(as) as.onclick=(e)=>{ e.stopPropagation(); sendAskAgent(); };
      const ai=$("aaInput");
      if(ai){
        ai.focus();
        ai.onkeydown=(e)=>{ if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); sendAskAgent(); } };
      }
      main.querySelectorAll("[data-aa-approve]").forEach(el=>el.onclick=(e)=>{
        e.stopPropagation();
        if(askAgentDraft){
          askAgentPermissions.push(askAgentDraft);
          askAgentLog.push({ who:"agent", text:"Done — added." });
          askAgentDraft = null;
        }
        render();
      });
      main.querySelectorAll("[data-aa-cancel]").forEach(el=>el.onclick=(e)=>{
        e.stopPropagation();
        askAgentDraft = null;
        askAgentLog.push({ who:"agent", text:"No problem — tell me what you'd change and I'll redraft it." });
        render();
      });
      main.querySelectorAll("[data-aa-example]").forEach(el=>el.onclick=(e)=>{
        e.stopPropagation();
        handleAskAgentMessage(el.dataset.aaExample);
        render();
      });
      const th=$("aaThread"); if(th) th.scrollTop = th.scrollHeight;
    }
  } else if(view==="settings"){
    main.innerHTML = renderTopbar(TB.settings) + renderSettings();
    main.querySelectorAll("[data-crumb]").forEach(el=>el.onclick=()=>{ view=el.dataset.crumb; render(); });
    wireSettings();
  } else {
    main.innerHTML = renderTopbar(TB.detail())+renderDetailHeader()+`<div class="panel" id="panel"></div>`;
    renderPanel();
    main.querySelectorAll("[data-crumb]").forEach(el=>el.onclick=()=>{ view=el.dataset.crumb; render(); });
    $("flagBtn").onclick=(e)=>{ e.stopPropagation(); flagPopoverOpen=!flagPopoverOpen; render(); };
    const flagPopover = $("flagPopover");
    if(flagPopover){
      flagPopover.onclick=(e)=>e.stopPropagation();
      $("flagCancelBtn").onclick=()=>{ flagPopoverOpen=false; render(); };
      $("flagConfirmBtn").onclick=()=>{ agentEscalated=!agentEscalated; flagPopoverOpen=false; render(); };
      $("flagReasonInput").focus();
    }
    document.onclick=()=>{ if(flagPopoverOpen){ flagPopoverOpen=false; render(); } };
    $("pauseBtn").onclick=()=>{
      if(agentPaused){ agentPaused=false; render(); return; }
      const { tasks, actions } = pausePendingCounts();
      if(tasks>0 || actions>0) openPauseWarningModal();
      else { agentPaused=true; render(); }
    };
    $("permsLink").onclick=()=>{ view="settings"; render(); };
    main.querySelectorAll("th[data-inv-sort-key]").forEach(el=>el.onclick=()=>{
      const k = el.dataset.invSortKey;
      invSort = invSort.key===k ? { key:k, dir: invSort.dir==="asc"?"desc":"asc" } : { key:k, dir:"asc" };
      render();
    });
    main.querySelectorAll("[data-inv-page-goto]").forEach(el=>el.onclick=()=>{ invPage=+el.dataset.invPageGoto; render(); });
    main.querySelectorAll("[data-inv-page-nav]").forEach(el=>el.onclick=()=>{ invPage += el.dataset.invPageNav==="next"?1:-1; render(); });
    main.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{
      if(b.dataset.tab==="settings") return;
      activeTab=b.dataset.tab;
      main.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));
      positionTabIndicator(true);   // slide the underline to the clicked tab
      renderPanel();
    });
    positionTabIndicator(false);    // place underline on initial detail render
  }
}

// Slide the main tab underline to the active tab (instant when animate=false).
function positionTabIndicator(animate){
  const tabs = document.querySelector(".tabs"); if(!tabs) return;
  const u = tabs.querySelector(".tab-underline");
  const a = tabs.querySelector(".tab.active");
  if(!u || !a) return;
  if(!animate) u.style.transition = "none";
  u.style.transform = `translateX(${a.offsetLeft}px)`;
  u.style.width = a.offsetWidth + "px";
  if(!animate){ void u.offsetWidth; u.style.transition = ""; }
}

// Cursor-tracked button glow: point each hovered .btn's gradient (--gx/--gy) at the cursor.
document.addEventListener("pointermove", (e)=>{
  const btn = e.target.closest && e.target.closest(".btn");
  if(!btn) return;
  const r = btn.getBoundingClientRect();
  btn.style.setProperty("--gx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
  btn.style.setProperty("--gy", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
}, {passive:true});

render();
