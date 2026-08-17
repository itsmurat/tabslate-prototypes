import { useState } from "react";
import { AppShell } from "@/prototype-kit/AppShell";
import { Badge, Body, Button, Card, Group, Headline, Stack } from "@tabs/toretto";
import { CrashBoundary } from "./CrashBoundary";
import { CrashRunner } from "./CrashRunner";

// Throws during render (not in an event handler) so CrashBoundary can catch it —
// error boundaries only catch render-phase errors, never ones thrown from onClick.
function Boom({ armed }: { armed: boolean }) {
  if (armed) {
    throw new Error("Simulated crash: the invoice sync worker threw an unhandled error.");
  }
  return null;
}

function CrashDemoSection() {
  const [armed, setArmed] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  return (
    <Stack gap="sm">
      <CrashBoundary key={resetKey}>
        <Boom armed={armed} />
        <Card shade="default" size="slim" className="flex flex-col gap-3">
          <Badge color="green" shade="light">
            Working normally
          </Badge>
          <Body shade="muted">
            This card stands in for a real screen. Simulate an unhandled error in it and the crash
            fallback takes its place, in AppShell, exactly like a real crash would.
          </Body>
          <Button variant="primary" onClick={() => setArmed(true)} className="self-start">
            Simulate a crash
          </Button>
        </Card>
      </CrashBoundary>

      {armed && (
        <Button
          variant="stealth"
          size="small"
          className="self-start"
          onClick={() => {
            setArmed(false);
            setResetKey((k) => k + 1);
          }}
        >
          Reset demo
        </Button>
      )}
    </Stack>
  );
}

export default function Prototype() {
  return (
    <AppShell breadcrumb={["Prototype", "Crash fallback"]}>
      <Stack gap="xl" className="mx-auto max-w-3xl p-8">
        <Stack gap="sm">
          <Headline as="h1" variant="title">
            Dino runner: crash fallback
          </Headline>
          <Body shade="muted">
            When a screen throws, show this instead of a blank page. It gives someone a reason to
            stay while a fix ships. Press space, arrow up, or tap the track to jump.
          </Body>
        </Stack>

        <Stack gap="sm">
          <Body weight="medium">Play it directly</Body>
          <CrashRunner />
        </Stack>

        <Stack gap="sm">
          <Body weight="medium">See it wired as a real crash fallback</Body>
          <CrashDemoSection />
        </Stack>

        <Group gap="sm" ay="center" className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
          <Body shade="muted" size="xs">
            <Body as="span" weight="medium" size="xs">
              CrashBoundary
            </Body>{" "}
            and{" "}
            <Body as="span" weight="medium" size="xs">
              CrashRunner
            </Body>{" "}
            are self-contained — wrap any screen or route in CrashBoundary to reuse this fallback
            elsewhere.
          </Body>
        </Group>
      </Stack>
    </AppShell>
  );
}
