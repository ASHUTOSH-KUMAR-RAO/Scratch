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

// ───────────────────────────────────────────────────────────────────────────
// Models
// ───────────────────────────────────────────────────────────────────────────

const AVAILABLE_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-pro",
] as const;

type GeminiModel = (typeof AVAILABLE_MODELS)[number];

const MODEL_CONFIG: Record<
  GeminiModel,
  { description: string; badge: string; tag?: string }
> = {
  "gemini-2.0-flash": {
    description: "Latest & fastest — best for free tier",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    tag: "Recommended",
  },
  "gemini-2.0-flash-lite": {
    description: "Ultra-light, lowest latency",
    badge: "bg-teal-50 text-teal-700 border-teal-200",
    tag: "Free",
  },
  "gemini-1.5-flash": {
    description: "Reliable, fast for most tasks",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  "gemini-1.5-flash-8b": {
    description: "Lightweight, high free tier limits",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    tag: "Free",
  },
  "gemini-1.5-pro": {
    description: "Most capable, limited free quota",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
  },
};

// ───────────────────────────────────────────────────────────────────────────
// Prompt Templates
// ───────────────────────────────────────────────────────────────────────────

const PROMPT_TEMPLATES = [
  {
    label: "Summarizer",
    icon: "📝",
    systemPrompt:
      "You are a concise summarizer. Extract only the key points from the given text.",
    userPrompt: "Summarize the following text in 3-5 bullet points:\n\n{input}",
  },
  {
    label: "Translator",
    icon: "🌐",
    systemPrompt:
      "You are a professional translator. Translate the given text accurately while preserving tone and context.",
    userPrompt: "Translate the following text to English:\n\n{input}",
  },
  {
    label: "Data Extractor",
    icon: "🔍",
    systemPrompt:
      "You are a data extraction expert. Extract structured information from unstructured text and return it as JSON.",
    userPrompt:
      "Extract key information from the following and return as JSON:\n\n{input}",
  },
  {
    label: "Email Writer",
    icon: "✉️",
    systemPrompt:
      "You are a professional email writer. Write clear, concise, and professional emails.",
    userPrompt:
      "Write a professional email based on the following context:\n\n{input}",
  },
  {
    label: "Code Reviewer",
    icon: "💻",
    systemPrompt:
      "You are an expert code reviewer. Analyze code for bugs, performance issues, and best practices.",
    userPrompt:
      "Review the following code and provide detailed feedback:\n\n{input}",
  },
  {
    label: "Sentiment Analyzer",
    icon: "💬",
    systemPrompt:
      "You are a sentiment analysis expert. Analyze text and return sentiment as Positive, Negative, or Neutral with reasoning.",
    userPrompt: "Analyze the sentiment of the following text:\n\n{input}",
  },
] as const;

// ───────────────────────────────────────────────────────────────────────────
// Schema
// ───────────────────────────────────────────────────────────────────────────

const GeminiFormSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {
      message:
        "Must start with a letter or underscore, only letters, numbers & underscores allowed",
    }),
  model: z.enum(AVAILABLE_MODELS),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, { message: "User prompt is required" }),
});

export type GeminiFormValues = z.infer<typeof GeminiFormSchema>;

interface GeminiDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: GeminiFormValues) => void;
  defaultValues?: Partial<GeminiFormValues>;
  geminiApiKey?: string;
}

// ───────────────────────────────────────────────────────────────────────────
// Component
// ───────────────────────────────────────────────────────────────────────────

export const GeminiDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
  geminiApiKey = "",
}: GeminiDialogProps) => {
  const [testInput, setTestInput] = useState("");
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);

  const form = useForm<GeminiFormValues>({
    resolver: zodResolver(GeminiFormSchema),
    defaultValues: {
      variableName: defaultValues.variableName ?? "",
      model: defaultValues.model ?? "gemini-2.0-flash",
      systemPrompt: defaultValues.systemPrompt ?? "",
      userPrompt: defaultValues.userPrompt ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName ?? "",
        model: defaultValues.model ?? "gemini-2.0-flash",
        systemPrompt: defaultValues.systemPrompt ?? "",
        userPrompt: defaultValues.userPrompt ?? "",
      });
      setTestResult(null);
      setTestError(null);
      setTestInput("");
    }
  }, [open, defaultValues, form]);

  const applyTemplate = (template: (typeof PROMPT_TEMPLATES)[number]) => {
    form.setValue("systemPrompt", template.systemPrompt);
    form.setValue("userPrompt", template.userPrompt);
    setTestResult(null);
    setTestError(null);
  };

  // ───────────────────────────────────────────────────────────────────────
  // Test API Run (Inline Gemini call)
  // ───────────────────────────────────────────────────────────────────────

  const handleTestRun = async () => {
    const { model, systemPrompt, userPrompt } = form.getValues();
    if (!userPrompt) return;

    const resolvedPrompt = userPrompt.replace(
      /\{input\}/g,
      testInput || "(no input provided)",
    );

    setTestLoading(true);
    setTestResult(null);
    setTestError(null);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: systemPrompt
              ? { parts: [{ text: systemPrompt }] }
              : undefined,
            contents: [{ parts: [{ text: resolvedPrompt }] }],
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message ?? "Something went wrong");
      }

      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "No response received.";

      setTestResult(text);
    } catch (err: any) {
      setTestError(err.message ?? "Test run failed.");
    } finally {
      setTestLoading(false);
    }
  };

  const handleSubmit = (values: GeminiFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  // ───────────────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b bg-gradient-to-b from-muted/40 to-transparent">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <DialogTitle className="text-base font-semibold">
                Gemini Configuration
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground">
              Configure an AI model and prompts for this node
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form */}
        <div className="px-6 py-5 overflow-y-auto max-h-[70vh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">

              {/* VARIABLE NAME */}
              <FormField
                control={form.control}
                name="variableName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-muted-foreground uppercase">
                      Variable Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="gemini_response"
                        className="font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* MODEL SELECT */}
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-muted-foreground uppercase">
                      Model
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="font-mono text-sm">
                          <SelectValue placeholder="Select model">
                            {field.value}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AVAILABLE_MODELS.map((model) => (
                          <SelectItem key={model} value={model}>
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-xs">
                                  {model}
                                </span>
                                {MODEL_CONFIG[model].tag && (
                                  <span
                                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium border ${MODEL_CONFIG[model].badge}`}
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* INPUT HINT BOX */}
              <div className="flex items-start gap-2 rounded-md bg-muted/50 border px-3 py-2.5 text-xs text-muted-foreground">
                <Code2 className="h-3.5 w-3.5 mt-0.5" />
                <p>
                  Use <code className="font-mono bg-background px-1">{"{input}"}</code>{" "}
                  for dynamic input or{" "}
                  <code className="font-mono bg-background px-1">{"{{json.variable}}"}</code>{" "}
                  to access previous node variables.
                </p>
              </div>

              {/* TEMPLATES */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <LayoutTemplate className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    Prompt Templates
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {PROMPT_TEMPLATES.map((template) => (
                    <button
                      key={template.label}
                      type="button"
                      onClick={() => applyTemplate(template)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md border bg-background hover:bg-muted"
                    >
                      <span>{template.icon}</span>
                      <span>{template.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SYSTEM PROMPT */}
              <FormField
                control={form.control}
                name="systemPrompt"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs font-medium text-muted-foreground uppercase">
                        System Prompt
                      </FormLabel>
                      <Badge variant="outline" className="text-xs">
                        Optional
                      </Badge>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="You are a helpful assistant."
                        {...field}
                        className="min-h-[80px] text-sm resize-none"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Sets model behavior & personality.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* USER PROMPT */}
              <FormField
                control={form.control}
                name="userPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-muted-foreground uppercase">
                      User Prompt
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={"Summarize the following text:\\n\\n{input}"}
                        {...field}
                        className="min-h-[110px] text-sm resize-none font-mono"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Use <code className="font-mono bg-muted px-1">{"{{variableName}}"}</code> to reference previous outputs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TEST RUN SECTION */}
              <div className="rounded-md border bg-muted/30 p-3 space-y-3">
                <div className="flex items-center gap-1.5">
                  <FlaskConical className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium uppercase text-muted-foreground">
                    Test Run
                  </span>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Enter test input for {input}..."
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    className="text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleTestRun}
                    disabled={testLoading || !form.getValues("userPrompt")}
                    className="gap-1.5"
                  >
                    {testLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <FlaskConical className="h-3.5 w-3.5" />
                    )}
                    {testLoading ? "Running..." : "Run"}
                  </Button>
                </div>

                {/* Result */}
                {testResult && (
                  <div className="rounded-md bg-background border px-3 py-2.5 text-xs whitespace-pre-wrap max-h-[150px] overflow-y-auto">
                    {testResult}
                  </div>
                )}

                {/* Error */}
                {testError && (
                  <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2.5 text-xs text-red-600">
                    ⚠️ {testError}
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <DialogFooter className="pt-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 sm:flex-none gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
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
