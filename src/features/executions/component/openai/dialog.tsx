"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Code2,
  FlaskConical,
  LayoutTemplate,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

// ─────────────────────────────────────────────────────────────
// OpenAI Models
// ─────────────────────────────────────────────────────────────

const AVAILABLE_MODELS = [
  "gpt-5.3",
  "gpt-5.3-mini",
  "gpt-5.2",
  "gpt-5.1",
  "gpt-4.1",
  "gpt-4.1-mini",
] as const;

type OpenAiModel = (typeof AVAILABLE_MODELS)[number];

const MODEL_CONFIG: Record<
  OpenAiModel,
  { description: string; badge: string; tag?: string }
> = {
  "gpt-5.3": {
    description: "Most capable & latest OpenAI model",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    tag: "Recommended",
  },
  "gpt-5.3-mini": {
    description: "Fastest & cheapest OpenAI model",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    tag: "Fast",
  },
  "gpt-5.2": {
    description: "Stable mid-tier performance",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  "gpt-5.1": {
    description: "Reliable for most use cases",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  "gpt-4.1": {
    description: "Balanced reasoning & speed",
    badge: "bg-sky-50 text-sky-700 border-sky-200",
  },
  "gpt-4.1-mini": {
    description: "Ultra-fast, low-cost",
    badge: "bg-teal-50 text-teal-700 border-teal-200",
  },
};

// ─────────────────────────────────────────────────────────────
// Prompt Templates
// ─────────────────────────────────────────────────────────────

const PROMPT_TEMPLATES = [
  {
    label: "Summarizer",
    icon: "📝",
    systemPrompt:
      "You are a concise summarizer. Extract only key points.",
    userPrompt: "Summarize this:\n\n{input}",
  },
  {
    label: "Translator",
    icon: "🌐",
    systemPrompt: "You are a professional translator.",
    userPrompt: "Translate this to English:\n\n{input}",
  },
  {
    label: "Data Extractor",
    icon: "🔍",
    systemPrompt: "You extract structured JSON from text.",
    userPrompt: "Extract JSON from this:\n\n{input}",
  },
  {
    label: "Email Writer",
    icon: "✉️",
    systemPrompt: "You write professional emails.",
    userPrompt: "Write an email based on:\n\n{input}",
  },
  {
    label: "Code Reviewer",
    icon: "💻",
    systemPrompt: "You review code for bugs & improvements.",
    userPrompt: "Review this code:\n\n{input}",
  },
  {
    label: "Sentiment Analyzer",
    icon: "💬",
    systemPrompt: "You analyze sentiment with reasoning.",
    userPrompt: "Analyze sentiment:\n\n{input}",
  },
] as const;

// ─────────────────────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────────────────────

const OpenAiFormSchema = z.object({
  variableName: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/),
  model: z.enum(AVAILABLE_MODELS),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1),
});

export type OpenAiFormValues = z.infer<typeof OpenAiFormSchema>;

interface OpenAiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: OpenAiFormValues) => void;
  defaultValues?: Partial<OpenAiFormValues>;
  openaiApiKey?: string;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export const OpenAiDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
  openaiApiKey = "",
}: OpenAiDialogProps) => {
  const [testInput, setTestInput] = useState("");
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

  const form = useForm<OpenAiFormValues>({
    resolver: zodResolver(OpenAiFormSchema),
    defaultValues: {
      variableName: defaultValues.variableName ?? "",
      model: defaultValues.model ?? "gpt-4.1-mini",
      systemPrompt: defaultValues.systemPrompt ?? "",
      userPrompt: defaultValues.userPrompt ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName ?? "",
        model: defaultValues.model ?? "gpt-4.1-mini",
        systemPrompt: defaultValues.systemPrompt ?? "",
        userPrompt: defaultValues.userPrompt ?? "",
      });
      setTestResult(null);
      setTestInput("");
      setTestError(null);
    }
  }, [open, defaultValues]);

  const applyTemplate = (t: any) => {
    form.setValue("systemPrompt", t.systemPrompt);
    form.setValue("userPrompt", t.userPrompt);
  };

  // ─────────────────────────────────────────────────────────────
  // OPENAI TEST RUN (replaces Gemini API)
  // ─────────────────────────────────────────────────────────────

  const handleTestRun = async () => {
    const { model, systemPrompt, userPrompt } = form.getValues();

    const resolvedPrompt = userPrompt.replace(
      /\{input\}/g,
      testInput || "(no input provided)",
    );

    setTestLoading(true);
    setTestError(null);
    setTestResult(null);

    try {
      const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          input: resolvedPrompt,
          ...(systemPrompt
            ? { system: systemPrompt }
            : {}),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message);

      const text = data.output_text ?? "No output.";
      setTestResult(text);
    } catch (err: any) {
      setTestError(err.message || "Test failed");
    } finally {
      setTestLoading(false);
    }
  };

  const handleSubmit = (values: OpenAiFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b bg-gradient-to-b from-muted/40 to-transparent">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <DialogTitle className="text-base font-semibold">
                OpenAI Configuration
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground">
              Configure OpenAI model & prompts
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form Body */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-5"
            >
              {/* Variable Name */}
              <FormField
                control={form.control}
                name="variableName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variable Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="openai_response"
                        {...field}
                        className="font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Model */}
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="font-mono">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AVAILABLE_MODELS.map((model) => (
                          <SelectItem key={model} value={model}>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-xs">
                                  {model}
                                </span>
                                {MODEL_CONFIG[model].tag && (
                                  <span
                                    className={`text-[10px] px-1.5 py-0.5 rounded-full border ${MODEL_CONFIG[model].badge}`}
                                  >
                                    {MODEL_CONFIG[model].tag}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {MODEL_CONFIG[model].description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Templates */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <LayoutTemplate className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium uppercase text-muted-foreground">
                    Templates
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {PROMPT_TEMPLATES.map((tmp) => (
                    <button
                      key={tmp.label}
                      type="button"
                      onClick={() => applyTemplate(tmp)}
                      className="px-2 py-1.5 text-xs border rounded-md bg-background hover:bg-muted"
                    >
                      {tmp.icon} {tmp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* System Prompt */}
              <FormField
                control={form.control}
                name="systemPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="You are a helpful assistant."
                        {...field}
                        className="min-h-[80px] text-sm"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* User Prompt */}
              <FormField
                control={form.control}
                name="userPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={"Summarize this:\n\n{input}"}
                        {...field}
                        className="min-h-[110px] font-mono"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Test Run */}
              <div className="border rounded-md p-3 space-y-3 bg-muted/40">
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase">
                    Test Run
                  </span>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Enter test input..."
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestRun}
                    disabled={testLoading}
                    className="gap-1.5"
                  >
                    {testLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FlaskConical className="h-4 w-4" />
                    )}
                    {testLoading ? "Running..." : "Run"}
                  </Button>
                </div>

                {testResult && (
                  <div className="text-xs border rounded-md bg-background p-2 whitespace-pre-wrap max-h-[140px] overflow-auto">
                    {testResult}
                  </div>
                )}

                {testError && (
                  <div className="text-xs border border-red-200 rounded-md bg-red-50 p-2 text-red-600">
                    ⚠️ {testError}
                  </div>
                )}
              </div>

              {/* Footer */}
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Save Configuration
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
