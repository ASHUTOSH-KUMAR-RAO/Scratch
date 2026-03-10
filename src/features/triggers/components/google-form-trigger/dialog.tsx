"use client";

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
import { CheckIcon, CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { getGoogleAppsScript, GOOGLE_FORM_SETUP_STEPS } from "./utils";

interface GoogleFormTriggerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoogleFormTriggerDialog = ({
  open,
  onOpenChange,
}: GoogleFormTriggerDialogProps) => {
  const params = useParams();
  const workflowId = params.workflowId as string;

  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000";
  const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;

  const scriptWithUrl = getGoogleAppsScript(webhookUrl);

  const copyToClipboard = async (text: string, type: "webhook" | "script") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "webhook") {
        setCopiedWebhook(true);
        toast.success("Webhook URL copied to clipboard");
        setTimeout(() => setCopiedWebhook(false), 2000);
      } else {
        setCopiedScript(true);
        toast.success("Apps Script copied to clipboard");
        setTimeout(() => setCopiedScript(false), 2000);
      }
    } catch {
      toast.error("Failed to copy. Please copy manually.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <span>🔗</span> Google Form Trigger Configuration
          </DialogTitle>
          <DialogDescription className="text-sm">
            Use this webhook URL in your Google Form&apos;s Apps Script to
            trigger this workflow whenever a form is submitted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-1">
          {/* ── Webhook URL ── */}
          <div className="space-y-2">
            <Label htmlFor="webhook-url" className="text-sm font-medium">
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
                onClick={() => copyToClipboard(webhookUrl, "webhook")}
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
          </div>

          {/* ── Setup Instructions ── */}
          <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-1.5">
              📋 Setup Instructions
            </h4>
            <ol className="space-y-2">
              {GOOGLE_FORM_SETUP_STEPS.map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground"
                >
                  <span className="text-foreground font-medium shrink-0 leading-tight">
                    {step.emoji}
                  </span>
                  <span className="leading-tight">{step.text}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* ── Apps Script ── */}
          <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm flex items-center gap-1.5">
                🛠️ Google Apps Script
              </h4>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(scriptWithUrl, "script")}
                className="h-7 text-xs gap-1.5"
              >
                {copiedScript ? (
                  <>
                    <CheckIcon className="size-3 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <CopyIcon className="size-3" />
                    Copy Script
                  </>
                )}
              </Button>
            </div>

            {/* Script preview */}
            <pre className="text-xs bg-background rounded-md border p-3 overflow-x-auto text-muted-foreground leading-relaxed whitespace-pre-wrap break-all">
              {scriptWithUrl}
            </pre>

            <p className="text-xs text-muted-foreground">
              ✅ Your webhook URL is already injected into this script — just
              copy &amp; paste it directly.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
