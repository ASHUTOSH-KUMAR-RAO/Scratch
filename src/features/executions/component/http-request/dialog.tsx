"use client";

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
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Globe, Code2, Send } from "lucide-react";
import z from "zod";

const HttpRequestFormSchema = z.object({
  endpoint: z.url("Please enter a valid URL"),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional(),
});

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const METHOD_CONFIG: Record<
  HttpMethod,
  { color: string; badgeClass: string; description: string }
> = {
  GET: {
    color: "text-emerald-600",
    badgeClass:
      "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
    description: "Retrieve data from the server",
  },
  POST: {
    color: "text-blue-600",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
    description: "Send new data to the server",
  },
  PUT: {
    color: "text-amber-600",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
    description: "Replace existing data on the server",
  },
  PATCH: {
    color: "text-purple-600",
    badgeClass:
      "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50",
    description: "Partially update existing data",
  },
  DELETE: {
    color: "text-red-600",
    badgeClass: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
    description: "Remove data from the server",
  },
};

interface HttpRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEndPoint?: string;
  onSubmit: (values: z.infer<typeof HttpRequestFormSchema>) => void;
  defaultMethod?: HttpMethod;
  defaultBody?: string;
}

export const HttpRequestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultEndPoint = "",
  defaultMethod = "GET",
  defaultBody = "",
}: HttpRequestDialogProps) => {
  const form = useForm<z.infer<typeof HttpRequestFormSchema>>({
    resolver: zodResolver(HttpRequestFormSchema),
    defaultValues: {
      endpoint: defaultEndPoint,
      method: defaultMethod,
      body: defaultBody,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        endpoint: defaultEndPoint,
        method: defaultMethod,
        body: defaultBody,
      });
    }
  }, [open, defaultEndPoint, defaultMethod, defaultBody, form]);

  const watchMethod = form.watch("method") as HttpMethod;
  const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);
  const currentMethodConfig = METHOD_CONFIG[watchMethod];

  const handleSubmit = (values: z.infer<typeof HttpRequestFormSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">
        {/* Header with subtle gradient */}
        <div className="px-6 pt-6 pb-4 border-b bg-gradient-to-b from-muted/40 to-transparent">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              <DialogTitle className="text-base font-semibold">
                HTTP Request
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              Configure an HTTP request node. This executes when the workflow
              reaches this step.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form body */}
        <div className="px-6 py-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-5"
            >
              {/* Method + Endpoint */}
              <div className="flex flex-col sm:flex-row gap-3">
                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem className="w-full sm:w-[140px] sm:shrink-0">
                      <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Method
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full font-mono font-bold">
                            <SelectValue placeholder="Method">
                              <span className={METHOD_CONFIG[field.value as HttpMethod]?.color}>
                                {field.value}
                              </span>
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(Object.keys(METHOD_CONFIG) as HttpMethod[]).map((method) => (
                            <SelectItem key={method} value={method}>
                              <div className="flex items-center gap-2.5">
                                <span className={`text-xs font-mono font-bold w-[48px] ${METHOD_CONFIG[method].color}`}>
                                  {method}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {METHOD_CONFIG[method].description}
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

                <FormField
                  control={form.control}
                  name="endpoint"
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-0">
                      <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Endpoint URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://api.example.com/data"
                          className="font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* URL hint */}
              <div className="flex items-start gap-2 rounded-md bg-muted/50 border px-3 py-2.5 text-xs text-muted-foreground">
                <Code2 className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <p className="leading-relaxed">
                  Use{" "}
                  <code className="font-mono bg-background border rounded px-1 py-0.5 text-foreground">
                    {"{input}"}
                  </code>{" "}
                  for dynamic input, or{" "}
                  <code className="font-mono bg-background border rounded px-1 py-0.5 text-foreground">
                    {"{{json.variable}}"}
                  </code>{" "}
                  for JSON variables from previous nodes.
                </p>
              </div>

              {/* Body field — only for POST, PUT, PATCH */}
              {showBodyField && (
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Request Body
                        </FormLabel>
                        <Badge
                          variant="outline"
                          className={`text-xs font-mono ${currentMethodConfig.badgeClass}`}
                        >
                          JSON
                        </Badge>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder={
                            '{\n  "userId": "{{http.input.userId}}",\n  "name": "John Doe",\n  "email": "john@example.com"\n}'
                          }
                          {...field}
                          className="font-mono min-h-[130px] text-sm resize-none leading-relaxed"
                        />
                      </FormControl>
                      <FormDescription className="text-xs flex items-center gap-1.5">
                        <span>
                          Use{" "}
                          <code className="font-mono bg-muted rounded px-1">
                            {"{{http.input.variableName}}"}
                          </code>{" "}
                          to reference variables from previous nodes.
                        </span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Footer */}
              <DialogFooter className="pt-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 sm:flex-none gap-2"
                >
                  <Send className="h-3.5 w-3.5" />
                  Save Request
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
