import { useState } from "react";
import { AppShell } from "@/prototype-kit/AppShell";
import { Badge, Body, Card, Group, Headline, Input, Stack } from "@tabs/toretto";
import { EmailSenderSection } from "./EmailSenderSection";

// Billing settings page. The email sender feature below defaults to the
// "legacy" read-only view: most existing customers already have a
// Tabs-managed sender configured from before self-serve setup existed.
export default function Prototype() {
  const [prefix, setPrefix] = useState("INV-");
  const [nextNumber, setNextNumber] = useState("1042");

  return (
    <AppShell breadcrumb={["Settings", "Billing"]}>
      <div className="mx-auto max-w-3xl px-6 py-8">
        <Stack gap="xl">
          <Headline as="h1" variant="title">
            Billing
          </Headline>

          <section>
            <Stack gap="xs" className="mb-4">
              <Headline as="h2" variant="section">
                Payment methods
              </Headline>
              <Body size="sm" shade="muted">
                Choose the payment methods available to your customers.
              </Body>
            </Stack>
            <Card>
              <Stack gap="md">
                <Group ax="between" ay="center">
                  <Stack gap="2xs">
                    <Body weight="medium">ACH transfer</Body>
                    <Body size="sm" shade="muted">
                      Accept bank payments on invoices.
                    </Body>
                  </Stack>
                  <Badge color="green" shade="light">
                    Enabled
                  </Badge>
                </Group>
                <div className="h-px bg-neutral-100" />
                <Group ax="between" ay="center">
                  <Stack gap="2xs">
                    <Body weight="medium">Credit card</Body>
                    <Body size="sm" shade="muted">
                      Accept card payments on invoices.
                    </Body>
                  </Stack>
                  <Badge color="neutral" shade="light">
                    Disabled
                  </Badge>
                </Group>
              </Stack>
            </Card>
          </section>

          <EmailSenderSection />

          <section>
            <Stack gap="xs" className="mb-4">
              <Headline as="h2" variant="section">
                Invoice settings
              </Headline>
              <Body size="sm" shade="muted">
                Configure invoice numbering and customer-facing details.
              </Body>
            </Stack>
            <Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Invoice number prefix"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  fullwidth
                />
                <Input
                  label="Next invoice number"
                  value={nextNumber}
                  onChange={(e) => setNextNumber(e.target.value)}
                  fullwidth
                />
              </div>
            </Card>
          </section>
        </Stack>
      </div>
    </AppShell>
  );
}
