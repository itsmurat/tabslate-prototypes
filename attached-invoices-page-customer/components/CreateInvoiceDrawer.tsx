import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  Headline,
  Body,
  Caption,
  Button,
  Card,
  Badge,
  Stack,
  Group,
  Stepper,
  RadioGroupControlled,
  InputNumber,
  InputDate,
  Dropdown,
  Input,
  Checkbox,
} from "@tabs/toretto";
import type { BillingTerm, BillingTermCategory, MockCustomer, MockInvoice } from "@/prototype-kit/mock-data";

interface CreateInvoiceDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: MockCustomer;
  billingTerms: BillingTerm[];
  /** Used to mint a next invoice number that won't collide with existing rows. */
  existingInvoiceCount: number;
  /** newTerm is set when the user chose to save the one-off as a reusable billing term. */
  onCreated: (invoice: MockInvoice, newTerm?: BillingTerm) => void;
}

type LineItemDraft = { description: string; qty: string; unitPrice: string };

type EffectiveLineItem = { description: string; qty: number; unitPrice: number };

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);

const today = () => new Date().toISOString().slice(0, 10);

const addDays = (date: string, days: number) =>
  new Date(new Date(`${date}T00:00:00Z`).getTime() + days * 86_400_000).toISOString().slice(0, 10);

const CATEGORY_ITEMS: { value: BillingTermCategory; label: string; subtext: string }[] = [
  { value: "included_in_arr", label: "Included in ARR", subtext: "Counts toward recurring revenue." },
  { value: "per_usage_arr", label: "Per usage ARR setting", subtext: "Billed based on measured usage." },
];

const FREQUENCY_ITEMS: { value: BillingTerm["frequency"]; label: string }[] = [
  { value: "/mo", label: "Monthly" },
  { value: "/3mo", label: "Every 3 months" },
  { value: "/unit/mo", label: "Per unit, monthly" },
];

const STEPS = [{ label: "Method" }, { label: "Details" }, { label: "Review" }];

function emptyLineItem(): LineItemDraft {
  return { description: "", qty: "1", unitPrice: "" };
}

export function CreateInvoiceDrawer({
  open,
  onOpenChange,
  customer,
  billingTerms,
  existingInvoiceCount,
  onCreated,
}: CreateInvoiceDrawerProps) {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<"existing" | "oneoff">("existing");
  const [selectedTermId, setSelectedTermId] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(today());
  const [netTerms, setNetTerms] = useState("30");
  const [lineItems, setLineItems] = useState<LineItemDraft[]>([emptyLineItem()]);
  const [saveAsTerm, setSaveAsTerm] = useState(false);
  const [newTermName, setNewTermName] = useState("");
  const [newTermCategory, setNewTermCategory] = useState<BillingTermCategory>("included_in_arr");
  const [newTermFrequency, setNewTermFrequency] = useState<BillingTerm["frequency"]>("/mo");

  // Sort so terms from the same source contract sit together — the closest
  // approximation of the reference's grouped-by-contract layout a single flat
  // radio group can offer without hand-rolling a new selection control.
  const sortedTerms = useMemo(
    () => [...billingTerms].sort((a, b) => a.contractName.localeCompare(b.contractName)),
    [billingTerms],
  );

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setMethod("existing");
    setSelectedTermId(sortedTerms.find((t) => t.active)?.id ?? sortedTerms[0]?.id ?? "");
    setInvoiceDate(today());
    setNetTerms("30");
    setLineItems([emptyLineItem()]);
    setSaveAsTerm(false);
    setNewTermName("");
    setNewTermCategory("included_in_arr");
    setNewTermFrequency("/mo");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const selectedTerm = sortedTerms.find((t) => t.id === selectedTermId);

  const effectiveLineItems: EffectiveLineItem[] = useMemo(() => {
    if (method === "existing") {
      return selectedTerm
        ? [{ description: selectedTerm.name, qty: 1, unitPrice: selectedTerm.amount }]
        : [];
    }
    return lineItems
      .filter((li) => li.description.trim())
      .map((li) => ({
        description: li.description,
        qty: parseFloat(li.qty) || 0,
        unitPrice: parseFloat(li.unitPrice) || 0,
      }));
  }, [method, selectedTerm, lineItems]);

  const total = effectiveLineItems.reduce((sum, li) => sum + li.qty * li.unitPrice, 0);
  const dueDate = addDays(invoiceDate, parseInt(netTerms, 10) || 0);
  const nextInvoiceId = `INV-${1001 + existingInvoiceCount}`;

  const canContinueFromDetails =
    method === "existing"
      ? Boolean(selectedTerm)
      : effectiveLineItems.length > 0 && (!saveAsTerm || newTermName.trim().length > 0);

  const handleCreate = () => {
    const invoice: MockInvoice = {
      id: nextInvoiceId,
      customer: customer.name,
      status: "DRAFT",
      amount: total,
      date: invoiceDate,
      dueDate,
      lastUpdated: invoiceDate,
      usageFiles: 0,
      needsAttention: true,
      paymentMethod: "—",
      latestActivity: "—",
    };

    let newTerm: BillingTerm | undefined;
    if (method === "existing" && selectedTerm) {
      invoice.contractName = selectedTerm.contractName;
      invoice.billingTermId = selectedTerm.id;
    } else if (saveAsTerm && newTermName.trim()) {
      newTerm = {
        id: `bt-custom-${nextInvoiceId}`,
        customer: customer.name,
        contractName: "Custom billing terms",
        name: newTermName.trim(),
        category: newTermCategory,
        serviceStart: invoiceDate,
        serviceEnd: addDays(invoiceDate, 365),
        active: true,
        invoicedCount: 1,
        totalCount: 1,
        amount: total,
        frequency: newTermFrequency,
      };
      invoice.contractName = newTerm.contractName;
      invoice.billingTermId = newTerm.id;
    } else {
      invoice.contractName = "One-off invoice";
    }
    onCreated(invoice, newTerm);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="bg-white border-b border-neutral-100">
          <Group ax="between" ay="center">
            <Stack gap="2xs">
              <Caption shade="muted">{customer.name}</Caption>
              <Headline as="h2" variant="subsection">
                Create invoice
              </Headline>
            </Stack>
            <DrawerClose asChild>
              <Button variant="stealth" size="small">
                Cancel
              </Button>
            </DrawerClose>
          </Group>
        </DrawerHeader>
        <DrawerTitle className="sr-only">Create invoice for {customer.name}</DrawerTitle>

        <Stack gap="xl" className="px-7 py-6">
          <Stepper steps={STEPS} activeStep={step} />

          {step === 1 && (
            <Stack gap="lg">
              <Stack gap="2xs">
                <Headline as="h3" variant="section">
                  How do you want to bill this?
                </Headline>
                <Body as="p" shade="muted" size="sm">
                  Creating an invoice normally requires a billing term to be defined and attached.
                  Choose a one-off invoice only for a charge that won't repeat.
                </Body>
              </Stack>

              <RadioGroupControlled
                value={method}
                onValueChange={(v) => setMethod(v as "existing" | "oneoff")}
                gap="md"
                items={[
                  {
                    value: "existing",
                    label: "Use an existing billing term",
                    subtext: `Generate this invoice from one of ${customer.name}'s billing terms.`,
                  },
                  {
                    value: "oneoff",
                    label: "Create a one-off invoice",
                    subtext: "Custom line items for a one-time charge. No recurring billing term required.",
                  },
                ]}
              />

              {method === "oneoff" && (
                <Card variant="warning">
                  <Body as="p" size="sm">
                    This invoice won't have a billing term attached unless you save it as one below, so
                    it won't repeat automatically or roll up into recurring revenue reporting.
                  </Body>
                </Card>
              )}
            </Stack>
          )}

          {step === 2 && method === "existing" && (
            <Stack gap="lg">
              <Headline as="h3" variant="section">
                Choose a billing term
              </Headline>
              <RadioGroupControlled
                value={selectedTermId}
                onValueChange={setSelectedTermId}
                gap="sm"
                items={sortedTerms.map((term) => ({
                  value: term.id,
                  label: `${term.name}: ${currency(term.amount)}${term.frequency}`,
                  subtext: `${term.contractName} · ${term.serviceStart} to ${term.serviceEnd}${
                    term.active ? "" : " · contract ended"
                  }`,
                  disabled: !term.active,
                }))}
              />

              <InvoiceScheduleFields
                invoiceDate={invoiceDate}
                setInvoiceDate={setInvoiceDate}
                netTerms={netTerms}
                setNetTerms={setNetTerms}
                dueDate={dueDate}
              />
            </Stack>
          )}

          {step === 2 && method === "oneoff" && (
            <Stack gap="lg">
              <Stack gap="sm">
                <Headline as="h3" variant="section">
                  Line items
                </Headline>
                <Stack gap="sm">
                  {lineItems.map((item, i) => (
                    <Card key={i} size="narrow" shade="gray">
                      <Group ax="between" ay="start" gap="sm">
                        <Stack gap="sm" className="min-w-0 flex-1">
                          <Input
                            label="Description"
                            placeholder="e.g. Onboarding fee"
                            value={item.description}
                            onChange={(e) =>
                              setLineItems((prev) =>
                                prev.map((li, j) => (j === i ? { ...li, description: e.target.value } : li)),
                              )
                            }
                          />
                          <Group gap="sm">
                            <InputNumber
                              label="Qty"
                              value={item.qty}
                              onChange={(e) =>
                                setLineItems((prev) =>
                                  prev.map((li, j) => (j === i ? { ...li, qty: e.target.value } : li)),
                                )
                              }
                            />
                            <InputNumber
                              label="Unit price"
                              value={item.unitPrice}
                              onChange={(e) =>
                                setLineItems((prev) =>
                                  prev.map((li, j) => (j === i ? { ...li, unitPrice: e.target.value } : li)),
                                )
                              }
                            />
                          </Group>
                        </Stack>
                        <Button
                          variant="stealth"
                          size="small"
                          disabled={lineItems.length === 1}
                          onClick={() => setLineItems((prev) => prev.filter((_, j) => j !== i))}
                          before={<Trash2 size={14} />}
                        >
                          Remove
                        </Button>
                      </Group>
                    </Card>
                  ))}
                </Stack>
                <Button
                  variant="fourth"
                  size="small"
                  before={<Plus size={14} />}
                  onClick={() => setLineItems((prev) => [...prev, emptyLineItem()])}
                >
                  Add line item
                </Button>
              </Stack>

              <InvoiceScheduleFields
                invoiceDate={invoiceDate}
                setInvoiceDate={setInvoiceDate}
                netTerms={netTerms}
                setNetTerms={setNetTerms}
                dueDate={dueDate}
              />

              <Card size="narrow">
                <Stack gap="sm">
                  <Checkbox
                    checked={saveAsTerm}
                    onChange={setSaveAsTerm}
                    label="Save this as a reusable billing term"
                    description="So future charges for this customer can reuse it instead of starting one-off again."
                  />
                  {saveAsTerm && (
                    <Stack gap="sm">
                      <Input
                        label="Billing term name"
                        placeholder="e.g. Onboarding fee"
                        value={newTermName}
                        onChange={(e) => setNewTermName(e.target.value)}
                      />
                      <Group gap="sm">
                        <Dropdown
                          label="Category"
                          value={newTermCategory}
                          onValueChange={(v) => setNewTermCategory(v as BillingTermCategory)}
                          items={CATEGORY_ITEMS}
                        />
                        <Dropdown
                          label="Frequency"
                          value={newTermFrequency}
                          onValueChange={(v) => setNewTermFrequency(v as BillingTerm["frequency"])}
                          items={FREQUENCY_ITEMS}
                        />
                      </Group>
                    </Stack>
                  )}
                </Stack>
              </Card>
            </Stack>
          )}

          {step === 3 && (
            <Stack gap="lg">
              <Headline as="h3" variant="section">
                Review
              </Headline>

              <Card>
                <Stack gap="md">
                  <Group ax="between">
                    <Stack gap="2xs">
                      <Caption shade="muted">Customer</Caption>
                      <Body as="p" weight="medium">{customer.name}</Body>
                    </Stack>
                    <Stack gap="2xs">
                      <Caption shade="muted">Invoice number</Caption>
                      <Body as="p" family="mono" weight="medium">{nextInvoiceId}</Body>
                    </Stack>
                  </Group>
                  <Group ax="between">
                    <Stack gap="2xs">
                      <Caption shade="muted">Invoice date</Caption>
                      <Body as="p">{invoiceDate}</Body>
                    </Stack>
                    <Stack gap="2xs">
                      <Caption shade="muted">Net terms</Caption>
                      <Body as="p">{netTerms} days</Body>
                    </Stack>
                    <Stack gap="2xs">
                      <Caption shade="muted">Due date</Caption>
                      <Body as="p">{dueDate}</Body>
                    </Stack>
                  </Group>
                </Stack>
              </Card>

              <Card size="noSpace">
                <Stack gap="none" className="divide-y divide-neutral-100">
                  {effectiveLineItems.map((li, i) => (
                    <Group key={i} ax="between" ay="center" p="md">
                      <Stack gap="2xs">
                        <Body as="p">{li.description}</Body>
                        <Caption shade="muted">
                          {li.qty} × {currency(li.unitPrice)}
                        </Caption>
                      </Stack>
                      <Body as="p" family="mono">{currency(li.qty * li.unitPrice)}</Body>
                    </Group>
                  ))}
                  <Group ax="between" ay="center" p="md">
                    <Body as="p" weight="semibold">Total</Body>
                    <Body as="p" family="mono" weight="semibold">{currency(total)}</Body>
                  </Group>
                </Stack>
              </Card>

              {method === "existing" && selectedTerm && (
                <Group gap="xs" ay="center">
                  <Badge shade="light" color="green">Linked to billing term</Badge>
                  <Caption shade="muted">{selectedTerm.name} · {selectedTerm.contractName}</Caption>
                </Group>
              )}
              {method === "oneoff" && !saveAsTerm && (
                <Card variant="warning">
                  <Body as="p" size="sm">
                    No billing term attached. This is created as a draft and won't repeat automatically.
                  </Body>
                </Card>
              )}
              {method === "oneoff" && saveAsTerm && (
                <Group gap="xs" ay="center">
                  <Badge shade="light" color="blue">New billing term</Badge>
                  <Caption shade="muted">
                    "{newTermName}" will be saved for {customer.name} ({FREQUENCY_ITEMS.find((f) => f.value === newTermFrequency)?.label})
                  </Caption>
                </Group>
              )}
            </Stack>
          )}
        </Stack>

        <DrawerFooter className="border-t border-neutral-100 px-7">
          <Group ax="between">
            <Button
              variant="stealth"
              disabled={step === 1}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
            >
              Back
            </Button>
            {step < 3 ? (
              <Button
                variant="primary"
                disabled={step === 2 && !canContinueFromDetails}
                onClick={() => setStep((s) => Math.min(3, s + 1))}
              >
                Continue
              </Button>
            ) : (
              <Button variant="primary" onClick={handleCreate}>
                Save as draft
              </Button>
            )}
          </Group>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function InvoiceScheduleFields({
  invoiceDate,
  setInvoiceDate,
  netTerms,
  setNetTerms,
  dueDate,
}: {
  invoiceDate: string;
  setInvoiceDate: (v: string) => void;
  netTerms: string;
  setNetTerms: (v: string) => void;
  dueDate: string;
}) {
  return (
    <Stack gap="sm">
      <Headline as="h3" variant="section">
        Schedule
      </Headline>
      <Group gap="sm">
        <InputDate label="Invoice date" value={invoiceDate} onChange={(v) => setInvoiceDate(v || invoiceDate)} />
        <InputNumber
          label="Net terms (days)"
          value={netTerms}
          onChange={(e) => setNetTerms(e.target.value)}
        />
      </Group>
      <Caption shade="muted">Due {dueDate}</Caption>
    </Stack>
  );
}
