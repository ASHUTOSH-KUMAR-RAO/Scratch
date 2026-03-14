"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BracesIcon,
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  KeyRoundIcon,
  LinkIcon,
  ListOrderedIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface StripeTriggerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VARIABLES = [
  {
    token: "{{stripe.amount}}",
    description: "Payment amount (in smallest currency unit)",
    badge: "number",
  },
  {
    token: "{{stripe.currency}}",
    description: "3-letter ISO currency code",
    badge: "string",
  },
  {
    token: "{{stripe.customer_id}}",
    description: "Stripe customer ID",
    badge: "string",
  },
  {
    token: "{{stripe.event_type}}",
    description: "Event type — e.g. payment_intent.succeeded",
    badge: "string",
  },
  {
    token: "{{json stripe.metadata}}",
    description: "Full metadata object as formatted JSON",
    badge: "object",
  },
];

const BADGE_STYLES: Record<string, string> = {
  number: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  string: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  object: "bg-violet-500/10 text-violet-500 border-violet-500/20",
};

const STEPS = [
  "Open your Stripe Dashboard",
  <>
    Go to{" "}
    <span className="font-medium text-foreground">Developers → Webhooks</span>
  </>,
  <>
    Click <span className="font-medium text-foreground">"Add endpoint"</span>
  </>,
  "Paste the webhook URL above",
  <>
    Select events to listen for — e.g.{" "}
    <code className="text-xs font-mono bg-background px-1 py-0.5 rounded border">
      payment_intent.succeeded
    </code>
  </>,
  "Save and copy the signing secret into your environment variables",
];

export const StripeTriggerDialog = ({
  open,
  onOpenChange,
}: StripeTriggerDialogProps) => {
  const params = useParams();
  const workflowId = params.workflowId as string;

  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000";
  const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedWebhook(true);
      toast.success("Webhook URL copied to clipboard");
      setTimeout(() => setCopiedWebhook(false), 2000);
    } catch {
      toast.error("Failed to copy. Please copy manually.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <span className="text-lg">🔗</span>
            Stripe Trigger Configuration
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            Configure this webhook URL in your Stripe Dashboard to trigger the
            workflow on payment events.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* ── Webhook URL ── */}
          <section className="space-y-2">
            <Label
              htmlFor="webhook-url"
              className="flex items-center gap-1.5 text-sm font-medium"
            >
              <LinkIcon className="size-3.5 text-muted-foreground" />
              Webhook URL
            </Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                value={webhookUrl}
                readOnly
                className="font-mono text-xs bg-muted/50 truncate"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard(webhookUrl)}
                className="shrink-0"
                title="Copy webhook URL"
              >
                {copiedWebhook ? (
                  <CheckIcon className="size-4 text-green-500" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
              </Button>
            </div>
          </section>

          {/* ── Setup Instructions ── */}
          <section className="rounded-lg bg-muted/60 border p-4 space-y-3">
            <h4 className="flex items-center gap-1.5 text-sm font-medium">
              <ListOrderedIcon className="size-3.5 text-muted-foreground" />
              Setup Instructions
            </h4>
            <ol className="space-y-2 pl-1">
              {STEPS.map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-background border text-[11px] font-semibold text-foreground">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
            <a
              href="https://dashboard.stripe.com/webhooks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
            >
              <ExternalLinkIcon className="size-3" />
              Open Stripe Dashboard
            </a>
          </section>

          {/* ── Signing Secret ── */}
          <section className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-4 space-y-2">
            <h4 className="flex items-center gap-1.5 text-sm font-medium text-amber-600 dark:text-amber-400">
              <KeyRoundIcon className="size-3.5" />
              Signing Secret
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              After saving your endpoint, Stripe will provide a{" "}
              <code className="font-mono bg-background px-1 py-0.5 rounded border text-[11px]">
                whsec_...
              </code>{" "}
              signing secret. Add it to your environment as{" "}
              <code className="font-mono bg-background px-1 py-0.5 rounded border text-[11px]">
                STRIPE_WEBHOOK_SECRET
              </code>
              .
            </p>
          </section>

          {/* ── Available Variables ── */}
          <section className="rounded-lg bg-muted/60 border p-4 space-y-3">
            <h4 className="flex items-center gap-1.5 text-sm font-medium">
              <BracesIcon className="size-3.5 text-muted-foreground" />
              Available Variables
            </h4>
            <ul className="space-y-2">
              {VARIABLES.map(({ token, description, badge }) => (
                <li key={token} className="flex items-start gap-3">
                  <code className="shrink-0 bg-background border px-1.5 py-0.5 rounded text-xs font-mono text-foreground">
                    {token}
                  </code>
                  <div className="flex items-center gap-2 min-w-0 pt-0.5">
                    <span className="text-xs text-muted-foreground leading-relaxed truncate">
                      {description}
                    </span>
                    <Badge
                      variant="outline"
                      className={`shrink-0 text-[10px] px-1.5 py-0 h-4 font-mono ${BADGE_STYLES[badge]}`}
                    >
                      {badge}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
