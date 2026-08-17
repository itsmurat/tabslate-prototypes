/**
 * Email sender + DNS domain settings: the CTO's self-serve sending feature.
 *
 * State machine (mirrors what a real self-serve setup would support):
 *   legacy  -> tabs      "Switch to self-serve setup"
 *   tabs    -> mailbox   choosing "Send from this address" and saving
 *   mailbox -> dns       verifying the six-digit mailbox code
 *   dns     -> active    all DNS records verified
 *   active  -> mailbox   "Change address" (a new address needs re-verifying)
 *   active  -> tabs      "Remove custom sender"
 *
 * Most existing customers already have a Tabs-managed sender configured from
 * before self-serve setup existed, so the section defaults to "legacy": a
 * read-only summary, rather than the setup flow.
 */
import { useEffect, useRef, useState } from "react";
import {
  Badge,
  Body,
  Button,
  Card,
  Caption,
  Group,
  Headline,
  Input,
  RadioGroupControlled,
  Stack,
} from "@tabs/toretto";
import { IconButton } from "@tabs/table";
import { Check, Copy, Info, Mail, TriangleAlert } from "lucide-react";

type SenderState = "legacy" | "tabs" | "mailbox" | "dns" | "active";
type DnsStatus = "pending" | "verified";
type DnsRecord = { key: string; type: "TXT" | "CNAME"; name: string; value: string; status: DnsStatus };

const DOMAIN = "acme.com";
const CODE_LENGTH = 6;
const RESEND_SECONDS = 42;

const STATUS_META: Record<SenderState, { label: string; description: string; color: "green" | "orange" }> = {
  legacy: {
    label: "Active · Legacy",
    description: "This sender remains active and is managed by Tabs.",
    color: "green",
  },
  tabs: {
    label: "Through Tabs",
    description: "Tabs-owned sending is the default. There is nothing to set up.",
    color: "green",
  },
  mailbox: {
    label: "Mailbox verification",
    description: "Your contact details stay available while we verify mailbox access.",
    color: "orange",
  },
  dns: {
    label: "DNS setup",
    description: "The mailbox is verified. Finish DNS setup to use your own address.",
    color: "orange",
  },
  active: {
    label: "Active",
    description: "Your own address is used for customer-facing billing emails.",
    color: "green",
  },
};

const INITIAL_DNS_RECORDS: DnsRecord[] = [
  {
    key: "dkim",
    type: "TXT",
    name: "DKIM",
    value: "202608._domainkey → k=rsa; p=MIGfMA0GCSqGSIb3…",
    status: "pending",
  },
  {
    key: "return-path",
    type: "CNAME",
    name: "Return-Path",
    value: "pm-bounces → pm.mtasv.net",
    status: "pending",
  },
];

function LegacyItem({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "success";
}) {
  return (
    <Stack gap="2xs">
      <Caption shade="muted">{label}</Caption>
      <Body size="sm" weight="medium" shade={tone}>
        {value}
      </Body>
    </Stack>
  );
}

function Notice({
  tone,
  icon: Icon,
  children,
}: {
  tone: "neutral" | "warning";
  icon: typeof Info;
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "warning"
      ? "border-sunshine-200 bg-sunshine-50"
      : "border-blue-100 bg-blue-50";
  const iconClass = tone === "warning" ? "text-sunshine-600" : "text-blue-500";
  return (
    <Group gap="sm" ay="start" className={`rounded-lg border p-3 ${toneClass}`}>
      <Icon size={16} className={`mt-0.5 shrink-0 ${iconClass}`} />
      <Body size="sm" className="min-w-0">
        {children}
      </Body>
    </Group>
  );
}

function DnsRecordRow({
  record,
  copied,
  onCopy,
}: {
  record: DnsRecord;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <Card size="narrow">
      <Group ax="between" ay="start" gap="md">
        <Group gap="md" ay="start" className="min-w-0">
          <Badge color="neutral" shade="light">
            {record.type}
          </Badge>
          <Stack gap="2xs" className="min-w-0">
            <Body size="sm" weight="medium">
              {record.name}
            </Body>
            <Group gap="xs" ay="center" className="min-w-0">
              <Body size="sm" family="mono" shade="muted" className="truncate">
                {record.value}
              </Body>
              <IconButton
                icon={copied ? Check : Copy}
                tooltip={copied ? "Copied" : "Copy"}
                onClick={onCopy}
              />
            </Group>
          </Stack>
        </Group>
        <Badge color={record.status === "verified" ? "green" : "orange"} shade="light">
          {record.status === "verified" ? "Verified" : "Not verified"}
        </Badge>
      </Group>
    </Card>
  );
}

export function EmailSenderSection() {
  const [state, setState] = useState<SenderState>("legacy");
  const [contactEmail, setContactEmail] = useState("billing@acme.com");
  const [displayName, setDisplayName] = useState("Acme Billing");
  const [senderChoice, setSenderChoice] = useState<"tabs" | "custom">("tabs");
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [resendSeconds, setResendSeconds] = useState(RESEND_SECONDS);
  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>(INITIAL_DNS_RECORDS);
  const [checkingDns, setCheckingDns] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [replyTested, setReplyTested] = useState(false);
  const codeRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Reset the mailbox code + resend timer whenever the mailbox screen is entered.
  useEffect(() => {
    if (state !== "mailbox") return;
    setCode(Array(CODE_LENGTH).fill(""));
    setResendSeconds(RESEND_SECONDS);
  }, [state]);

  useEffect(() => {
    if (state !== "mailbox" || resendSeconds <= 0) return;
    const id = setTimeout(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [state, resendSeconds]);

  const meta = STATUS_META[state];
  const isCodeComplete = code.every((digit) => digit !== "");

  function handleDigitChange(index: number, raw: string) {
    const value = raw.replace(/\D/g, "").slice(-1);
    setCode((prev) => prev.map((d, i) => (i === index ? value : d)));
    if (value && codeRefs.current[index + 1]) {
      codeRefs.current[index + 1]?.focus();
    }
  }

  function handleDigitKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !code[index] && codeRefs.current[index - 1]) {
      codeRefs.current[index - 1]?.focus();
    }
  }

  function handleCopy(record: DnsRecord) {
    navigator.clipboard?.writeText(record.value).catch(() => {});
    setCopiedKey(record.key);
    setTimeout(() => setCopiedKey((k) => (k === record.key ? null : k)), 1200);
  }

  function handleCheckDns() {
    setCheckingDns(true);
    setTimeout(() => {
      setDnsRecords((prev) => prev.map((r) => ({ ...r, status: "verified" as const })));
      setCheckingDns(false);
      setReplyTested(false);
      setState("active");
    }, 700);
  }

  function goToMailbox() {
    setState("mailbox");
  }

  return (
    <section>
      <Stack gap="xs" className="mb-4">
        <Headline as="h2" variant="section">
          Email sender
        </Headline>
        <Body size="sm" shade="muted">
          Choose the address customers see on invoices, dunning, and agent emails.
        </Body>
      </Stack>

      <Card>
        <Stack gap="lg">
          <Group ax="between" ay="start" gap="md">
            <Stack gap="2xs">
              <Body weight="medium">Contact and sending</Body>
              <Body size="sm" shade="muted">
                {meta.description}
              </Body>
            </Stack>
            <Badge color={meta.color} shade="light">
              {meta.label}
            </Badge>
          </Group>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Contact email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              disabled={state === "legacy"}
              description="Appears on invoices, credit memos, and checks."
              fullwidth
            />
            <Input
              label="Display name"
              type="text"
              maxLength={60}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={state === "legacy"}
              description="Used only when your own sender address is active."
              fullwidth
            />
          </div>

          <div className="h-px bg-neutral-100" />

          {state === "legacy" && (
            <Stack gap="md">
              <Notice tone="neutral" icon={Info}>
                <b>This configuration is read-only.</b> It will keep sending unchanged. Contact
                Tabs support to make a change.
              </Notice>
              <div className="grid grid-cols-2 gap-4">
                <LegacyItem label="Sender" value={`${displayName} <${contactEmail}>`} />
                <LegacyItem label="Domain" value={DOMAIN} />
                <LegacyItem label="DKIM" value="Verified" tone="success" />
                <LegacyItem label="Return-Path" value="Verified" tone="success" />
              </div>
              <Group gap="sm">
                <Button variant="secondary">Contact support</Button>
                <Button variant="stealth" onClick={() => setState("tabs")}>
                  Switch to self-serve setup
                </Button>
              </Group>
            </Stack>
          )}

          {state === "tabs" && (
            <Stack gap="md">
              <Body weight="medium">How should billing emails be sent?</Body>
              <RadioGroupControlled
                value={senderChoice}
                onValueChange={(value) => setSenderChoice(value as "tabs" | "custom")}
                items={[
                  {
                    value: "tabs",
                    label: "Send through Tabs",
                    subtext: `Customers see ${displayName} and a secure Tabs-owned address. Nothing to set up.`,
                  },
                  {
                    value: "custom",
                    label: "Send from this address",
                    subtext: `Customers see ${displayName} <${contactEmail}>. Requires mailbox and DNS verification.`,
                  },
                ]}
              />
              <Group gap="sm" ax="end">
                <Button
                  variant="primary"
                  disabled={senderChoice === "tabs"}
                  onClick={goToMailbox}
                >
                  Save changes
                </Button>
              </Group>
            </Stack>
          )}

          {state === "mailbox" && (
            <Stack gap="lg">
              <Stack gap="sm" ax="center" className="text-center">
                <Mail size={28} className="text-neutral-300" />
                <Body weight="medium">Check {contactEmail}</Body>
                <Body size="sm" shade="muted">
                  Enter the six-digit code we sent. It expires in 10 minutes and allows five
                  attempts.
                </Body>
              </Stack>
              <Group gap="sm" ax="center">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      codeRefs.current[index] = el;
                    }}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleDigitKeyDown(index, e)}
                    inputMode="numeric"
                    maxLength={1}
                    className="w-10 text-center"
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </Group>
              <Group gap="xs" ax="center">
                <Caption shade="muted">Didn&apos;t get it?</Caption>
                {resendSeconds > 0 ? (
                  <Caption shade="muted">Resend in {resendSeconds}s</Caption>
                ) : (
                  <Button
                    variant="stealth"
                    onClick={() => {
                      setCode(Array(CODE_LENGTH).fill(""));
                      setResendSeconds(RESEND_SECONDS);
                    }}
                  >
                    Resend code
                  </Button>
                )}
              </Group>
              <Caption shade="muted" className="text-center">
                You can leave this page and come back later. The code stays valid until it
                expires or you resend it.
              </Caption>
              <Group gap="sm" ax="end">
                <Button variant="stealth" onClick={() => setState("tabs")}>
                  Cancel setup
                </Button>
                <Button variant="primary" disabled={!isCodeComplete} onClick={() => setState("dns")}>
                  Verify mailbox
                </Button>
              </Group>
            </Stack>
          )}

          {state === "dns" && (
            <Stack gap="lg">
              <Stack gap="2xs">
                <Body weight="medium">Verify {DOMAIN}</Body>
                <Body size="sm" shade="muted">
                  Add both records with your DNS provider. You can finish this later.
                </Body>
              </Stack>
              <Notice tone="neutral" icon={Info}>
                Mailbox verified for <b>{contactEmail}</b>.
              </Notice>
              <Stack gap="sm">
                {dnsRecords.map((record) => (
                  <DnsRecordRow
                    key={record.key}
                    record={record}
                    copied={copiedKey === record.key}
                    onCopy={() => handleCopy(record)}
                  />
                ))}
              </Stack>
              <div className="h-px bg-neutral-100" />
              <Stack gap="xs">
                <Body weight="medium">Reply delivery test</Body>
                <Body size="sm" shade="muted">
                  Optional. A failed test shows a warning but does not block activation.
                </Body>
                <div>
                  <Button variant="secondary">Send test email</Button>
                </div>
              </Stack>
              <Group gap="sm" ax="end">
                <Button variant="stealth" onClick={goToMailbox}>
                  Change address
                </Button>
                <Button variant="primary" loading={checkingDns} onClick={handleCheckDns}>
                  Check DNS records
                </Button>
              </Group>
            </Stack>
          )}

          {state === "active" && (
            <Stack gap="lg">
              <Stack gap="sm" ax="center" className="rounded-lg border border-green-100 bg-green-50 p-6 text-center">
                <span className="flex size-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Check size={20} strokeWidth={2.5} />
                </span>
                <Body weight="medium">{displayName} is ready</Body>
                <Body size="sm" shade="muted">
                  Mailbox, DKIM, and Return-Path are verified.
                </Body>
                <Group gap="sm" ay="center" className="mt-2 rounded-md border border-neutral-100 bg-white px-3 py-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-neutral-800 text-xs font-medium text-white">
                    {displayName.charAt(0)}
                  </span>
                  <Stack gap="none" ax="start">
                    <Body size="sm" weight="medium">
                      {displayName}
                    </Body>
                    <Caption shade="muted">{contactEmail}</Caption>
                  </Stack>
                </Group>
              </Stack>

              {!replyTested && (
                <Group gap="sm" ay="center" wrap className="rounded-lg border border-sunshine-200 bg-sunshine-50 px-4 py-3">
                  <TriangleAlert size={18} className="shrink-0 text-sunshine-600" />
                  <Body size="sm" className="min-w-0">
                    <b>Reply delivery hasn&apos;t been confirmed.</b> Sending is active. We
                    recommend running a test.
                  </Body>
                  <Button
                    variant="fourth"
                    className="ml-auto bg-white hover:bg-neutral-50"
                    onClick={() => setReplyTested(true)}
                  >
                    Run test
                  </Button>
                </Group>
              )}

              <Group gap="sm" ax="end">
                <Button variant="stealth" onClick={() => setState("tabs")}>
                  Remove custom sender
                </Button>
                <Button variant="primary" onClick={goToMailbox}>
                  Change address
                </Button>
              </Group>
            </Stack>
          )}
        </Stack>
      </Card>
    </section>
  );
}
