import { useMemo, useState } from "react";
import { NuqsAdapter } from "nuqs/adapters/react";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { AlertTriangle, Download } from "lucide-react";
import { AppShell } from "@/prototype-kit/AppShell";
import { Headline, Body, Caption, Button, StatusLabel, Stack, Group } from "@tabs/toretto";
import { Table, CurrencyCell, DateTimeCell, FilterType } from "@tabs/table";
import {
  makeBillingTerms,
  makeInvoices,
  persistentStore,
  createDataFetcher,
  type MockInvoice,
  type MockCustomer,
  type BillingTerm,
} from "@/prototype-kit/mock-data";
import { CreateInvoiceDrawer } from "./components/CreateInvoiceDrawer";

// This page is scoped to a single customer record — mirrors the real
// Customers > {customer} > Billing > Invoices route.
const CUSTOMER: MockCustomer = {
  id: "00000000-0000-0000-0000-000000000601",
  name: "6K, Inc.",
  email: "ap@6kinc.example",
};

const seedBillingTerms = makeBillingTerms(CUSTOMER.name);

// Custom terms saved from the "Create invoice" drawer land here too, so they
// show up as real, reusable terms the next time someone opens the drawer.
const billingTermStore = persistentStore<BillingTerm[]>(
  "attached-invoices-page-customer:billing-terms",
  seedBillingTerms,
);

// ~20 rows so this matches the reference's "1-20 of 20 results" and fits on
// one page — createDataFetcher (the sanctioned offline-table helper) returns
// its full filtered set on every call rather than slicing by page, so keeping
// the row count at a single page's worth avoids exposing that limitation.
const seedInvoices = makeInvoices(20, {
  customers: [CUSTOMER],
  billingTerms: seedBillingTerms,
  seed: 6,
  until: "2026-08-01",
});

const invoiceStore = persistentStore<MockInvoice[]>(
  "attached-invoices-page-customer:invoices",
  seedInvoices,
);

function downloadInvoicesCsv(invoices: MockInvoice[]) {
  const header = [
    "Invoice number",
    "Customer",
    "Contract",
    "Invoice date",
    "Due date",
    "Status",
    "Amount",
    "Payment method",
  ];
  const rows = invoices.map((inv) => [
    inv.id,
    inv.customer,
    inv.contractName ?? "",
    inv.date,
    inv.dueDate ?? "",
    inv.status,
    inv.amount.toFixed(2),
    inv.paymentMethod ?? "",
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${CUSTOMER.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-invoices.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const SUBNAV: Record<string, string[]> = {
  "Billing & revenue": ["Billing terms", "Invoices", "Credit memos", "Contracts"],
  Obligations: ["Key terms", "Renewal", "Notes"],
  Profile: ["Business information", "Additional fields", "Taxes"],
};

// Static right-rail sub-nav — no route exists behind these items in this
// prototype (only "Invoices" is built), so, like AppShell's own footer nav,
// they're plain unwired buttons rather than fake links dressed up as live nav.
function BillingSubnav() {
  return (
    <Stack gap="lg" className="w-56 shrink-0 border-l border-neutral-100 px-6 py-6">
      {Object.entries(SUBNAV).map(([group, items]) => (
        <Stack gap="xs" key={group}>
          <Caption shade="muted" className="uppercase tracking-wide">
            {group}
          </Caption>
          <Stack gap="2xs">
            {items.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  item === "Invoices"
                    ? "rounded-md bg-blue-50 px-2 py-1.5 text-left text-sm font-medium text-blue-500"
                    : "rounded-md px-2 py-1.5 text-left text-sm text-neutral-600 hover:bg-neutral-50"
                }
              >
                {item}
              </button>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}

function InvoiceNumberCell({ row }: { row: MockInvoice }) {
  return (
    <Group gap="xs" ay="center">
      {row.needsAttention && (
        <span title="Needs attention before it can be sent">
          <AlertTriangle size={14} className="shrink-0 text-orange-500" />
        </span>
      )}
      <Body as="span" family="mono" weight="medium">
        {row.id}
      </Body>
    </Group>
  );
}

const STATUS_OPTIONS = ["PAID", "SENT", "OVERDUE", "DRAFT", "SCHEDULED", "DONE", "PENDING", "VOID"];

export default function Prototype() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [statuses, setStatuses] = useState<string[]>([]);

  const columns = useMemo<ColumnDef<MockInvoice>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Invoice number",
        cell: ({ row }) => <InvoiceNumberCell row={row.original} />,
      },
      {
        accessorKey: "customer",
        header: "Customer / Contract",
        cell: ({ row }) => (
          <Stack gap="2xs">
            <Body as="span" weight="medium">
              {row.original.customer}
            </Body>
            <Caption shade="muted">{row.original.contractName ?? "One-off invoice"}</Caption>
          </Stack>
        ),
      },
      {
        accessorKey: "date",
        header: "Invoice date",
        cell: ({ getValue }) => <DateTimeCell value={getValue<string>()} dateOnly />,
      },
      {
        accessorKey: "dueDate",
        header: "Due date",
        cell: ({ getValue }) => <DateTimeCell value={getValue<string | undefined>()} dateOnly />,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => (
          // StatusLabel's `status` prop is typed against InvoiceComputedState, a
          // @tabs/toretto enum not in this session's allowed import list — the
          // fixture already uses the runtime string values that enum expects.
          <StatusLabel status={getValue<string>() as any} stylized={false} />
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        meta: { style: { textAlign: "right" } },
        cell: ({ getValue }) => <CurrencyCell value={getValue<number>()} />,
      },
      {
        accessorKey: "paymentMethod",
        header: "Payment method",
        cell: ({ getValue }) => {
          const value = getValue<string | undefined>();
          return <Body as="span" shade={value ? undefined : "muted"}>{value || "—"}</Body>;
        },
      },
      {
        accessorKey: "latestActivity",
        header: "Latest activity",
        cell: ({ getValue }) => (
          <Body as="span" shade="muted">
            {getValue<string | undefined>() || "—"}
          </Body>
        ),
      },
      {
        accessorKey: "lastUpdated",
        header: "Last updated",
        cell: ({ getValue }) => <DateTimeCell value={getValue<string | undefined>()} dateOnly />,
      },
      {
        accessorKey: "usageFiles",
        header: "Usage files",
        meta: { style: { textAlign: "right" } },
        cell: ({ getValue }) => {
          const n = getValue<number | undefined>();
          return (
            <Body as="span" family="mono" shade={n ? undefined : "muted"}>
              {n ? n : "—"}
            </Body>
          );
        },
      },
    ],
    [],
  );

  const filters = useMemo(() => ({ status: statuses }), [statuses]);
  const filterConfigs = [
    {
      id: "status",
      label: "Status",
      type: FilterType.MULTI_SELECT,
      selectedValues: statuses,
      onChange: setStatuses,
      options: STATUS_OPTIONS,
    },
  ];

  const dataFetcher = useMemo(
    () =>
      createDataFetcher(() => invoiceStore.get(), {
        searchKeys: ["id", "customer", "contractName"],
        predicate: (row) => statuses.length === 0 || statuses.includes(row.status),
      }),
    [statuses, refreshKey],
  );

  const secondaryActions = useMemo(
    () => [
      {
        id: "void",
        label: "Void invoice",
        hidden: (row: Row<MockInvoice>) => row.original.status === "VOID",
        onClick: (row: Row<MockInvoice>) => {
          invoiceStore.set(
            invoiceStore
              .get()
              .map((inv) => (inv.id === row.original.id ? { ...inv, status: "VOID" as const, amount: 0 } : inv)),
          );
          setRefreshKey((k) => k + 1);
        },
      },
    ],
    [],
  );

  return (
    <AppShell breadcrumb={["Customers", CUSTOMER.name, "Billing"]} active="Customers">
      <Group className="h-full items-stretch">
        <Stack gap="lg" className="min-w-0 flex-1 p-6">
          <Group ax="between" ay="center">
            <Headline as="h1" variant="title">
              Billing
            </Headline>
            <Group gap="sm">
              <Button
                variant="fourth"
                before={<Download size={14} />}
                onClick={() => downloadInvoicesCsv(invoiceStore.get())}
              >
                Export
              </Button>
              <Button variant="primary" onClick={() => setDrawerOpen(true)}>
                Create invoice
              </Button>
            </Group>
          </Group>

          <NuqsAdapter>
            <Table
              key={refreshKey}
              dataFetcher={dataFetcher}
              columns={columns}
              filters={filters}
              filterConfigs={filterConfigs}
              onClearFilters={() => setStatuses([])}
              secondaryActions={secondaryActions}
              enableSorting
            />
          </NuqsAdapter>
        </Stack>

        <BillingSubnav />
      </Group>

      <CreateInvoiceDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        customer={CUSTOMER}
        billingTerms={billingTermStore.get()}
        existingInvoiceCount={invoiceStore.get().length}
        onCreated={(invoice, newTerm) => {
          invoiceStore.set([invoice, ...invoiceStore.get()]);
          if (newTerm) {
            billingTermStore.set([newTerm, ...billingTermStore.get()]);
          }
          setRefreshKey((k) => k + 1);
          setDrawerOpen(false);
        }}
      />
    </AppShell>
  );
}
