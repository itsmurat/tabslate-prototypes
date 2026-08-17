import { AppShell } from "@/prototype-kit/AppShell";
import { Body, Button, Card, Title } from "@tabs/toretto";
import { Sparkles } from "lucide-react";

export default function Prototype() {
  return (
    <AppShell breadcrumb={["Overview", "Hello"]} active="Overview">
      <div className="flex h-full items-center justify-center p-6">
        <Card className="flex max-w-md flex-col items-center gap-4 p-8 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
            <Sparkles size={20} />
          </span>
          <div className="flex flex-col gap-1.5">
            <Title>Hello</Title>
            <Body className="text-neutral-500">
              This page is ready to build on. Tell Tabslate what to add next.
            </Body>
          </div>
          <Button variant="primary">Get started</Button>
        </Card>
      </div>
    </AppShell>
  );
}
