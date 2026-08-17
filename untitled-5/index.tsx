import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { CurrencyCell, DateTimeCell, Table } from "@tabs/table";
import { NuqsAdapter } from "nuqs/adapters/react";
import {
  Body,
  Button,
  Card,
  Data,
  DistributionBar,
  DropdownMonthRange,
  Eyebrow,
  Group,
  InvoiceComputedState,
  StatusLabel,
  Stack,
  Subtitle,
  Title,
  VerticalBarChart,
  WaterfallBarChart,
  green,
  neutral,
  orange,
  red,
  sunshine,
  toast,
  Tray,
  type WaterfallBarChartDataItem,
} from "@tabs/toretto";
import { Download, TriangleAlert } from "lucide-react";
import { AppShell } from "@/prototype-kit/AppShell";
import { createDataFetcher, makeCustomers, makeInvoices, type InvoiceStatus, type MockInvoice } from "@/prototype-kit/mock-data";

/**
 * "Today" is fixed so the forecast is deterministic across reloads — a real
 * clock would make the aging buckets (and the seeded data's relationship to
 * them) drift every day the prototype is opened.
 */
const TODAY_ISO = "2026-08-06";
const DAY_MS = 86_400_000;

const TODAY_MONTH = TODAY_ISO.slice(0, 7);

const daysUntil = (dateIso: string) => Math.round((Date.parse(dateIso) - Date.parse(TODAY_ISO)) / DAY_MS);

const isCollected = (status: InvoiceStatus) => status === "PAID" || status === "DONE";
const isOutstanding = (status: InvoiceStatus) => !isCollected(status) && status !== "VOID";

const sum = (invoices: MockInvoice[]) => invoices.reduce((total, invoice) => total + invoice.amount, 0);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const invoiceCountLabel = (count: number, noun: string) => `${count} ${noun}${count === 1 ? "" : "s"}`;

const monthRangeKeys = (start: string, end: string): string[] => {
  const [startYear, startMonth] = start.split("-").map(Number);
  const [endYear, endMonth] = end.split("-").map(Number);
  const keys: string[] = [];
  let year = startYear;
  let month = startMonth;
  while (year < endYear || (year === endYear && month <= endMonth)) {
    keys.push(`${year}-${String(month).padStart(2, "0")}`);
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return keys;
};

const monthLabel = (key: string) => {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleString("en-US", { month: "short" });
};

// Deterministic, seeded fixture with a spread from ~May through mid-November
// 2026 — straddling "today" so the report has both historical actuals to
// collect against and future-dated invoices to forecast.
const CUSTOMERS = makeCustomers(20, 42);
const INVOICES = makeInvoices(160, { customers: CUSTOMERS, mix: "typical", until: "2026-11-15", seed: 42 });

const DEFAULT_RANGE = { start: "2026-05", end: "2026-11" };

function DueLabel({ date }: { date: string }) {
  const days = daysUntil(date);
  if (days < 0) {
    const n = Math.abs(days);
    return (
      <Body size="sm" shade="alert">
        {n} day{n === 1 ? "" : "s"} overdue
      </Body>
    );
  }
  if (days === 0) return <Body size="sm" shade="warning">Due today</Body>;
  return (
    <Body size="sm" shade="muted">
      Due in {days} day{days === 1 ? "" : "s"}
    </Body>
  );
}

const outstandingColumns: ColumnDef<MockInvoice>[] = [
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "id", header: "Invoice" },
  {
    accessorKey: "date",
    header: "Due date",
    cell: ({ getValue }) => (
      <Body as="span" family="mono">
        <DateTimeCell value={getValue<string>()} dateOnly />
      </Body>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => <StatusLabel status={getValue<string>() as InvoiceComputedState} stylized={false} />,
  },
  {
    id: "days",
    header: "Days",
    cell: ({ row }) => <DueLabel date={row.original.date} />,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    meta: { style: { textAlign: "right" } },
    cell: ({ getValue }) => <CurrencyCell value={getValue<number>()} />,
  },
];

export default function Prototype() {
  const [range, setRange] = useState(DEFAULT_RANGE);
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  const outstanding = useMemo(() => INVOICES.filter((i) => isOutstanding(i.status)), []);
  const overdue = useMemo(() => outstanding.filter((i) => daysUntil(i.date) < 0), [outstanding]);
  const next30 = useMemo(() => outstanding.filter((i) => { const d = daysUntil(i.date); return d >= 0 && d <= 30; }), [outstanding]);
  const next90 = useMemo(() => outstanding.filter((i) => { const d = daysUntil(i.date); return d >= 0 && d <= 90; }), [outstanding]);

  const chartData = useMemo(() => {
    const keys = monthRangeKeys(range.start, range.end);
    return keys.map((key) => {
      const collected = sum(INVOICES.filter((i) => isCollected(i.status) && i.date.slice(0, 7) === key));
      const forecasted = sum(INVOICES.filter((i) => isOutstanding(i.status) && i.date.slice(0, 7) === key));
      return { name: monthLabel(key), items: { Collected: collected, Forecasted: forecasted } };
    });
  }, [range]);

  const agingBuckets = useMemo(() => {
    const buckets = [
      { label: "Not yet due", color: green[400], test: (d: number) => d >= 0 },
      { label: "1–30 days late", color: sunshine[300], test: (d: number) => d < 0 && d >= -30 },
      { label: "31–60 days late", color: orange[400], test: (d: number) => d < -30 && d >= -60 },
      { label: "61–90 days late", color: orange[600], test: (d: number) => d < -60 && d >= -90 },
      { label: "90+ days late", color: red[500], test: (d: number) => d < -90 },
    ];
    return buckets.map((bucket) => {
      const matches = outstanding.filter((i) => bucket.test(daysUntil(i.date)));
      return { value: matches.length, label: `${bucket.label} · ${formatCurrency(sum(matches))}`, color: bucket.color };
    });
  }, [outstanding]);

  const outstandingFetcher = useMemo(
    () =>
      createDataFetcher(() => INVOICES, {
        searchKeys: ["id", "customer"],
        predicate: (invoice) =>
          isOutstanding(invoice.status) &&
          invoice.date.slice(0, 7) >= range.start &&
          invoice.date.slice(0, 7) <= range.end &&
          (!showOverdueOnly || daysUntil(invoice.date) < 0),
      }),
    [range, showOverdueOnly],
  );

  // Running AR balance: starts at everything outstanding today, then steps
  // down by whatever is due each month — on the one assumption this whole
  // page already makes elsewhere (DueLabel, the KPI cards): an outstanding
  // invoice is expected to collect on its due date. Overdue invoices, and
  // anything due after the selected range, have no future due date to step
  // against, so they stay parked in the ending balance instead of vanishing.
  // Always walks forward from today, regardless of the selected range's
  // start — the balance itself is a today snapshot, not a range-scoped one.
  const runoff = useMemo(() => {
    const totalOutstanding = sum(outstanding);
    const months = TODAY_MONTH <= range.end ? monthRangeKeys(TODAY_MONTH, range.end) : [];

    const items: WaterfallBarChartDataItem[] = [
      { name: "Outstanding today", value: totalOutstanding, fill: neutral[300] },
    ];
    let level = totalOutstanding;
    for (const key of months) {
      const dueThisMonth = sum(outstanding.filter((i) => i.date.slice(0, 7) === key && daysUntil(i.date) >= 0));
      if (dueThisMonth > 0) {
        const next = level - dueThisMonth;
        items.push({ name: `Collected in ${monthLabel(key)}`, value: [level, next], fill: green[400] });
        level = next;
      }
      items.push({ name: monthLabel(key), value: level, fill: neutral[300], xAxisLabel: key });
    }
    return { items, months, endingBalance: level };
  }, [outstanding, range]);

  return (
    <AppShell breadcrumb={["Reporting", "Cash forecast"]} active="Cash forecast">
      <Stack gap="2xl" p="2xl">
        <Group ay="center" className="justify-between" wrap>
          <Stack gap="xs">
            <Title>Cash forecast</Title>
            <Body shade="muted">Expected cash inflows and overdue receivables, based on outstanding invoices.</Body>
          </Stack>
          <Group gap="md" ay="center">
            <DropdownMonthRange
              defaultValue={DEFAULT_RANGE}
              onValueChange={(value) => setRange({ start: value.start, end: value.end })}
            />
            <Button
              variant="secondary"
              before={<Download size={16} />}
              onClick={() => toast.info("Export is not wired up in this prototype.")}
            >
              Export
            </Button>
          </Group>
        </Group>

        {overdue.length > 0 && (
          <Card variant="warning" fullwidth>
            <Group ay="center" gap="md" className="w-full justify-between" wrap>
              <Group ay="center" gap="sm">
                <TriangleAlert size={18} />
                <Body size="sm">
                  {invoiceCountLabel(overdue.length, "invoice")} overdue, totaling {formatCurrency(sum(overdue))}.
                </Body>
              </Group>
              <Button variant="secondary" onClick={() => setShowOverdueOnly((value) => !value)}>
                {showOverdueOnly ? "Show all outstanding" : "View overdue invoices"}
              </Button>
            </Group>
          </Card>
        )}

        <Group gap="lg" wrap>
          <Card fullwidth className="min-w-[220px] flex-1">
            <Stack gap="xs">
              <Eyebrow>Cash in next 30 days</Eyebrow>
              <Data size="lg" shade="info">{formatCurrency(sum(next30))}</Data>
              <Body size="sm" shade="muted">{invoiceCountLabel(next30.length, "invoice")} due</Body>
            </Stack>
          </Card>
          <Card fullwidth className="min-w-[220px] flex-1">
            <Stack gap="xs">
              <Eyebrow>Cash in next 90 days</Eyebrow>
              <Data size="lg">{formatCurrency(sum(next90))}</Data>
              <Body size="sm" shade="muted">{invoiceCountLabel(next90.length, "invoice")} due</Body>
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
              <Eyebrow>Total outstanding AR</Eyebrow>
              <Data size="lg" shade="muted">{formatCurrency(sum(outstanding))}</Data>
              <Body size="sm" shade="muted">{invoiceCountLabel(outstanding.length, "invoice")} unpaid</Body>
            </Stack>
          </Card>
        </Group>

        <Card fullwidth>
          <Stack gap="md">
            <Subtitle>Projected AR runoff</Subtitle>
            <Body size="sm" shade="muted">
              Outstanding balance today, stepping down as invoices come due through {monthLabel(range.end)}.
            </Body>
            {runoff.months.length === 0 && (
              <Body size="sm" shade="warning">
                Select a range that includes today or later to see the runoff.
              </Body>
            )}
            <WaterfallBarChart
              data={runoff.items}
              legendLabels={[
                { label: "Outstanding", color: "bg-neutral-300" },
                { label: "Collected", color: "bg-green-400" },
              ]}
            />
            <Body size="sm" shade="muted">
              Assumes every outstanding invoice collects on its due date. Overdue invoices, and any due after{" "}
              {monthLabel(range.end)}, have no future due date to step against, so{" "}
              <Body as="span" size="sm" family="mono" weight="medium">
                {formatCurrency(runoff.endingBalance)}
              </Body>{" "}
              stays in the ending balance.
            </Body>
          </Stack>
        </Card>

        <Card fullwidth>
          <Stack gap="md">
            <Subtitle>Cash flow forecast</Subtitle>
            <Body size="sm" shade="muted">Collected actuals vs. forecasted collections, by month.</Body>
            <VerticalBarChart data={chartData} />
          </Stack>
        </Card>

        <Card fullwidth>
          <Stack gap="md">
            <Subtitle>Aging of outstanding receivables</Subtitle>
            <DistributionBar items={agingBuckets} />
          </Stack>
        </Card>

        <Card fullwidth>
          <Stack gap="md">
            <Subtitle>Outstanding invoices</Subtitle>
            <NuqsAdapter>
              <Table dataFetcher={outstandingFetcher} columns={outstandingColumns} enableSorting />
            </NuqsAdapter>
          </Stack>
        </Card>
      </Stack>
      <Tray />
    </AppShell>
  );
}
