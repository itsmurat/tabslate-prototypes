import { Component, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Badge, Body, Button, Card, Headline } from "@tabs/toretto";
import { CrashRunner } from "./CrashRunner";

interface CrashBoundaryProps {
  children: ReactNode;
}

interface CrashBoundaryState {
  error: Error | null;
}

/**
 * Error-boundary fallback: when something below it throws during render,
 * instead of a blank screen it shows the dino runner mini-game so there's
 * something to do while a fix ships. Lift this (and CrashRunner) as-is if
 * the real app wants the same fallback around a route.
 */
export class CrashBoundary extends Component<CrashBoundaryProps, CrashBoundaryState> {
  state: CrashBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.error("CrashBoundary caught:", error);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex w-full items-center justify-center bg-neutral-50 p-6">
        <Card shade="default" size="slim" className="flex w-full max-w-lg flex-col items-center gap-4 text-center">
          <Badge color="red" shade="light" icon={AlertTriangle}>
            Something crashed
          </Badge>
          <Headline as="h2" variant="section">
            While we fix this, take a quick run
          </Headline>
          <Body shade="muted">
            This screen hit an unexpected error. Jump the obstacles below, or reload to try again.
          </Body>

          <CrashRunner className="w-full" />

          <Button variant="primary" before={<RotateCcw size={14} />} onClick={() => window.location.reload()}>
            Reload page
          </Button>

          <Body family="mono" size="xs" shade="muted" className="w-full break-words text-left">
            {error.message}
          </Body>
        </Card>
      </div>
    );
  }
}
