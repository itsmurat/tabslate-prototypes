import type { ColumnDef } from "@tanstack/react-table";
import { NuqsAdapter } from "nuqs/adapters/react";
import { CircleDollarSign, Clock } from "lucide-react";

import { AppShell } from "@/prototype-kit/AppShell";
import { Body, Card, Eyebrow, Headline, InvoiceComputedState, StatusLabel } from "@tabs/toretto";
import { CurrencyCell, DateTimeCell, Table } from "@tabs/table";
import { SCENARIOS, createDataFetcher, persistentStore, type MockInvoice } from "@/prototype-kit/mock-data";

const invoices = persistentStore("invoices", SCENARIOS.typical.invoices);

const OUTSTANDING_STATUSES: MockInvoice["status"][] = ["SENT", "OVERDUE", "SCHEDULED", "PENDING"];
const PAID_STATUSES: MockInvoice["status"][] = ["PAID", "DONE"];

const sumBy = (rows: MockInvoice[], statuses: MockInvoice["status"][]) =>
  rows.filter((row) => statuses.includes(row.status)).reduce((total, row) => total + row.amount, 0);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

const columns: ColumnDef<MockInvoice>[] = [
  { accessorKey: "id", header: "Invoice" },
  { accessorKey: "customer", header: "Customer" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => <StatusLabel status={getValue<string>() as InvoiceComputedState} stylized={false} />,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    meta: { style: { textAlign: "right" } },
    cell: ({ getValue }) => <CurrencyCell value={getValue<number>()} />,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ getValue }) => (
      <Body as="span" family="mono">
        <DateTimeCell value={getValue<string>()} dateOnly />
      </Body>
    ),
  },
];

export default function Prototype() {
  const rows = invoices.get();
  const fetcher = createDataFetcher(() => invoices.get(), { searchKeys: ["id", "customer"] });

  return (
    <AppShell breadcrumb={["Invoices"]}>
      <div className="flex flex-col gap-6 p-6">
        <div className="grid grid-cols-2 gap-4">
          <Card shade="blue" className="flex items-start gap-4">
            <div className="rounded-md bg-blue-100 p-2">
              <Clock className="h-5 w-5 text-blue-700" />
            </div>
            <div className="flex flex-col gap-1">
              <Eyebrow>Outstanding</Eyebrow>
              <Headline as="h2" variant="title" family="mono">
                {formatCurrency(sumBy(rows, OUTSTANDING_STATUSES))}
              </Headline>
              <Body shade="muted">Sent, overdue, scheduled, and pending invoices</Body>
            </div>
          </Card>

          <Card shade="gray" className="flex items-start gap-4">
            <div className="rounded-md bg-moss-100 p-2">
              <CircleDollarSign className="h-5 w-5 text-moss-700" />
            </div>
            <div className="flex flex-col gap-1">
              <Eyebrow>Paid</Eyebrow>
              <Headline as="h2" variant="title" family="mono">
                {formatCurrency(sumBy(rows, PAID_STATUSES))}
              </Headline>
              <Body shade="muted">Paid and completed invoices</Body>
            </div>
          </Card>
        </div>

        <NuqsAdapter>
          <Table dataFetcher={fetcher} columns={columns} enableSorting />
        </NuqsAdapter>
      </div>
    </AppShell>
  );
}
