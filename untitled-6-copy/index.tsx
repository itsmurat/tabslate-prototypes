import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { CurrencyCell, DateTimeCell, SimpleTable } from "@tabs/table";
import {
  Body,
  Button,
  Card,
  Data,
  Eyebrow,
  Group,
  InvoiceComputedState,
  StatusLabel,
  Stack,
  Subtitle,
  Title,
  VerticalBarChart,
  blue,
  brown,
  green,
  neutral,
  red,
  toast,
  Tray,
} from "@tabs/toretto";
import { OverviewPieChart, OverviewTaskCard } from "@/vendor/dashboard";
import { Plus } from "lucide-react";
import { AppShell } from "@/prototype-kit/AppShell";
import { SCENARIOS, type InvoiceStatus, type MockInvoice } from "@/prototype-kit/mock-data";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  PAID: "Paid",
  SENT: "Sent",
  OVERDUE: "Overdue",
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  DONE: "Done",
  PENDING: "Pending",
  VOID: "Void",
};

const STATUS_COLORS: Record<InvoiceStatus, string> = {
  PAID: green[500],
  DONE: green[300],
  SENT: blue[500],
  SCHEDULED: blue[300],
  OVERDUE: red[500],
  PENDING: neutral[400],
  DRAFT: neutral[200],
  VOID: brown[400],
};

const isOutstanding = (status: InvoiceStatus) =>
  status === "SENT" || status === "SCHEDULED" || status === "PENDING" || status === "OVERDUE";

const sum = (invoices: MockInvoice[]) => invoices.reduce((total, invoice) => total + invoice.amount, 0);

const invoiceCountLabel = (count: number, noun: string) => `${count} ${noun}${count === 1 ? "" : "s"}`;

const recentColumns: ColumnDef<MockInvoice>[] = [
  { accessorKey: "id", header: "Invoice" },
  { accessorKey: "customer", header: "Customer" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => (
      <StatusLabel status={getValue<string>() as InvoiceComputedState} stylized={false} />
    ),
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
  const { invoices } = SCENARIOS.typical;

  const outstanding = useMemo(() => invoices.filter((i) => isOutstanding(i.status)), [invoices]);
  const overdue = useMemo(() => invoices.filter((i) => i.status === "OVERDUE"), [invoices]);
  const collected = useMemo(
    () => invoices.filter((i) => i.status === "PAID" || i.status === "DONE"),
    [invoices],
  );
  const drafts = useMemo(() => invoices.filter((i) => i.status === "DRAFT"), [invoices]);
  const scheduled = useMemo(() => invoices.filter((i) => i.status === "SCHEDULED"), [invoices]);
  const recent = useMemo(() => invoices.slice(0, 6), [invoices]);

  const statusBreakdown = useMemo(() => {
    const counts = new Map<InvoiceStatus, number>();
    for (const invoice of invoices) counts.set(invoice.status, (counts.get(invoice.status) ?? 0) + 1);
    return [...counts.entries()].map(([status, value]) => ({
      name: STATUS_LABELS[status],
      value,
      fill: STATUS_COLORS[status],
    }));
  }, [invoices]);

  const monthlyCollected = useMemo(() => {
    const totals = new Map<string, number>();
    for (const invoice of collected) {
      const key = invoice.date.slice(0, 7);
      totals.set(key, (totals.get(key) ?? 0) + invoice.amount);
    }
    return [...totals.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, total]) => {
        const [year, month] = key.split("-").map(Number);
        const label = new Date(year, month - 1, 1).toLocaleString("en-US", { month: "short" });
        return { name: label, items: { Collected: total } };
      });
  }, [collected]);

  const tasks = useMemo(() => {
    const items: { title: string; count: number }[] = [];
    if (overdue.length > 0) {
      items.push({ title: `Collect ${invoiceCountLabel(overdue.length, "overdue invoice")}`, count: overdue.length });
    }
    if (drafts.length > 0) {
      items.push({ title: `Send ${invoiceCountLabel(drafts.length, "draft invoice")}`, count: drafts.length });
    }
    if (scheduled.length > 0) {
      items.push({ title: `Review ${invoiceCountLabel(scheduled.length, "scheduled invoice")}`, count: scheduled.length });
    }
    return items;
  }, [overdue, drafts, scheduled]);

  return (
    <AppShell breadcrumb={["Overview"]} active="Overview">
      <Stack gap="2xl" p="2xl">
        <Group ay="center" className="justify-between">
          <Stack gap="xs">
            <Title>Good morning, Murat</Title>
            <Body shade="muted">Here is how your receivables look today.</Body>
          </Stack>
          <Button
            variant="primary"
            before={<Plus size={16} />}
            onClick={() => toast.info("New invoice is not wired up in this prototype.")}
          >
            New invoice
          </Button>
        </Group>

        <Group gap="lg" wrap>
          <Card fullwidth className="min-w-[220px] flex-1">
            <Stack gap="xs">
              <Eyebrow>Outstanding</Eyebrow>
              <Data size="lg" shade="info">{formatCurrency(sum(outstanding))}</Data>
              <Body size="sm" shade="muted">{invoiceCountLabel(outstanding.length, "invoice")} awaiting payment</Body>
            </Stack>
          </Card>
          <Card fullwidth className="min-w-[220px] flex-1">
            <Stack gap="xs">
              <Eyebrow>Overdue</Eyebrow>
              <Data size="lg" shade="alert">{formatCurrency(sum(overdue))}</Data>
              <Body size="sm" shade="muted">{invoiceCountLabel(overdue.length, "invoice")} past due</Body>
            </Stack>
          </Card>
          <Card fullwidth className="min-w-[220px] flex-1">
            <Stack gap="xs">
              <Eyebrow>Collected</Eyebrow>
              <Data size="lg" shade="success">{formatCurrency(sum(collected))}</Data>
              <Body size="sm" shade="muted">{invoiceCountLabel(collected.length, "invoice")} paid</Body>
            </Stack>
          </Card>
          <Card fullwidth className="min-w-[220px] flex-1">
            <Stack gap="xs">
              <Eyebrow>Drafts</Eyebrow>
              <Data size="lg" shade="muted">{formatCurrency(sum(drafts))}</Data>
              <Body size="sm" shade="muted">{invoiceCountLabel(drafts.length, "invoice")} not sent</Body>
            </Stack>
          </Card>
        </Group>

        <Card fullwidth>
          <Stack gap="md">
            <Subtitle>Things to do</Subtitle>
            {tasks.length > 0 ? (
              <Stack gap="sm">
                {tasks.map((task) => (
                  <OverviewTaskCard
                    key={task.title}
                    title={task.title}
                    status="open"
                    count={task.count}
                    onClick={() => toast.info(task.title)}
                  />
                ))}
              </Stack>
            ) : (
              <OverviewTaskCard title="You are all caught up" status="done" onClick={() => {}} />
            )}
          </Stack>
        </Card>

        <Group gap="lg" wrap>
          <Card fullwidth className="min-w-[280px] flex-1">
            <Stack gap="md">
              <Subtitle>Invoice status</Subtitle>
              <Group gap="lg" ay="center">
                <OverviewPieChart data={statusBreakdown} />
                <Stack gap="xs">
                  {statusBreakdown.map((entry) => (
                    <Group key={entry.name} gap="sm" ay="center">
                      <span
                        className="inline-block size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: entry.fill }}
                      />
                      <Body size="sm">{entry.name}</Body>
                      <Body size="sm" shade="muted" className="ml-auto">{entry.value}</Body>
                    </Group>
                  ))}
                </Stack>
              </Group>
            </Stack>
          </Card>
          <Card fullwidth className="min-w-[320px] flex-[2]">
            <Stack gap="md">
              <Subtitle>Collected by month</Subtitle>
              <VerticalBarChart data={monthlyCollected} legend={false} />
            </Stack>
          </Card>
        </Group>

        <Card fullwidth>
          <Stack gap="md">
            <Group ay="center" className="justify-between">
              <Subtitle>Recent invoices</Subtitle>
              <Button
                variant="tertiary"
                onClick={() => toast.info("Opens the Invoices page in the full app.")}
              >
                View all
              </Button>
            </Group>
            <SimpleTable data={recent} columns={recentColumns} zebraStripes />
          </Stack>
        </Card>
      </Stack>
      <Tray />
    </AppShell>
  );
}
