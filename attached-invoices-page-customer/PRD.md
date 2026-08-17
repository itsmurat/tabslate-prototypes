# Billing / Invoices — Create invoice (customer-scoped)

## Problem

On a customer's Billing page, there was no way to create an invoice. Creating an
invoice normally requires a billing term to be defined and attached to the customer,
so the page needs a path for the common case (bill against an existing term) and a
path for the occasional exception (a one-time charge that has no term yet).

## What's built

**Billing page** (`index.tsx`): customer-scoped invoices table for 6K, Inc., matching
the reference layout — breadcrumb, title, Export (CSV download), status filter,
search, a 10-column invoices table (invoice number with a needs-attention flag,
customer/contract, invoice date, due date, status, amount, payment method, latest
activity, last updated, usage files), a "Void invoice" row action, and a static
right-rail sub-nav mirroring Billing & revenue / Obligations / Profile.

**Create invoice** button opens a drawer (`components/CreateInvoiceDrawer.tsx`) with
three steps:

1. **Method** — choose "Use an existing billing term" or "Create a one-off invoice."
   The one-off path calls out, up front, that it won't have a term attached unless
   the user saves one.
2. **Details** —
   - *Existing term*: pick from the customer's billing terms (grouped visually by
     contract, inactive/ended terms shown disabled), then set invoice date and net
     terms.
   - *One-off*: build custom line items (description, qty, unit price), set invoice
     date and net terms, and optionally check "Save this as a reusable billing term"
     to name it and set its category (Included in ARR / Per usage ARR) and frequency.
3. **Review** — summary of customer, invoice number, dates, line items, and total,
   plus a status chip showing whether the invoice is linked to an existing term, a
   new term, or genuinely term-less.

Submitting creates a `DRAFT` invoice flagged `needsAttention` and prepends it to the
table. If the user saved a new billing term, that term is persisted too (a separate
`localStorage`-backed store) and appears as a real, selectable option the next time
the drawer opens — so "handle creating custom billing term" is a real save, not just
label text on the invoice.

## Key decisions

- **Draft, not sent.** Every invoice this flow creates lands as `DRAFT` with
  `needsAttention: true`. This prototype doesn't model a review/approval or
  send-to-customer step, so drafting is the honest state to land in rather than
  implying it was billed.
- **One flat radio list for terms, not the reference's grouped cards.** The design
  system has no ready-made "grouped selectable list" component; building a bespoke
  one would drift from the reused-components rule. The list is sorted so terms from
  the same contract sit together and each item's subtext names its contract, which
  gets most of the way there without a new component.
- **A new custom term gets a placeholder 1-year service window** (`serviceStart` =
  invoice date, `serviceEnd` = +365 days) since the drawer doesn't collect an explicit
  term duration. See open questions below.

## Open questions

- **Term duration for custom terms.** Should saving a new billing term ask for its
  own service period (like the existing terms have), rather than defaulting to one
  year from the invoice date?
- **Editing/removing a saved custom term.** There's no billing-terms management view
  in this prototype (the sub-nav's "Billing terms" item is unwired), so a term saved
  from this drawer can only be seen again inside the drawer's own picker, not edited
  or removed.
- **Approval before sending.** Should a term-less one-off invoice require a review
  or approval step before it can move out of `DRAFT`, given it bypasses the normal
  "term required" rule?
- **Multi-currency / tax.** Line items are unit price × qty only — no tax line or
  currency selection, since the customer fixture doesn't carry either today.
