import { AppShell } from "@/prototype-kit/AppShell";
import { Body, Stack, Title, StatusLabel } from "@tabs/toretto";
import { Table } from "@tabs/table";
import { NuqsAdapter } from "nuqs/adapters/react";
import { SCENARIOS, createDataFetcher, persistentStore } from "@/prototype-kit/mock-data";

// Seeded fixtures — 120 invoices, so pagination and density are real from the start.
const invoices = persistentStore("tpl-invoices", SCENARIOS.typical.invoices);

const COLUMNS = [
  { accessorKey: "id", header: "Invoice" },
  { accessorKey: "customer", header: "Customer" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => <StatusLabel status={getValue()} />,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => (
      <Body as="span" family="mono">
        {getValue().toLocaleString("en-US", { style: "currency", currency: "USD" })}
      </Body>
    ),
  },
  { accessorKey: "date", header: "Date" },
];

export default function Prototype() {
  const fetcher = createDataFetcher(() => invoices.get(), {
    searchKeys: ["id", "customer"],
  });

  return (
    <AppShell breadcrumb={["Invoicing", "Invoices"]}>
      <Stack gap="lg" className="p-8">
        <Stack gap="sm">
          <Title>Invoices</Title>
          <Body shade="muted">Search, sort, and page through the invoice list.</Body>
        </Stack>
        <NuqsAdapter>
          <Table dataFetcher={fetcher} columns={COLUMNS} getRowId={(r) => r.id} search enableSorting />
        </NuqsAdapter>
      </Stack>
    </AppShell>
  );
}
