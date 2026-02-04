"use client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import {
  useSuspenseWorkflow,
  useUpdateWokflowName,
} from "@/features/workflow/hooks/use-workflows";
import { ChevronsLeft, ChevronsRight, SaveIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
  return (
    <Button
      size="sm"
      onClick={() => {}}
      disabled={false}
      className="gap-2 shadow-sm hover:shadow transition-shadow"
    >
      <SaveIcon className="size-4" />
      Save
    </Button>
  );
};

export const EditorNameInput = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const updateWorkflow = useUpdateWokflowName();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(workflow.name);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (workflow.name) {
      setName(workflow.name);
    }
  }, [workflow.name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (name === workflow.name) {
      setIsEditing(false);
      return;
    }

    if (!name.trim()) {
      setName(workflow.name);
      setIsEditing(false);
      return;
    }

    try {
      await updateWorkflow.mutateAsync({
        id: workflowId,
        name: name.trim(),
      });
    } catch {
      setName(workflow.name);
    } finally {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setName(workflow.name);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        disabled={updateWorkflow.isPending}
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="h-7 w-auto min-w-[150px] max-w-[300px] px-2 text-sm font-medium"
      />
    );
  }

  return (
    <BreadcrumbItem
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:text-foreground transition-colors select-none font-medium"
    >
      {workflow.name}
    </BreadcrumbItem>
  );
};

export const EditorBreadcrumbs = ({ workflowId }: { workflowId: string }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/workflows"
              prefetch
              className="hover:text-foreground transition-colors"
            >
              Workflows
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <EditorNameInput workflowId={workflowId} />
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export const EditorHeader = ({ workflowId }: { workflowId: string }) => {
  const { toggleSidebar, open } = useSidebar();

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border/40 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left Section - Sidebar Toggle & Breadcrumbs */}
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="h-9 w-9 rounded-lg hover:bg-accent/50 transition-all border-border/40 shadow-sm"
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          {open ? (
            <ChevronsLeft className="h-4 w-4" strokeWidth={2.5} />
          ) : (
            <ChevronsRight className="h-4 w-4" strokeWidth={2.5} />
          )}
        </Button>
        <EditorBreadcrumbs workflowId={workflowId} />
      </div>

      {/* Center Section - Motivational Banner */}
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent border border-orange-500/20 shadow-sm">
        <svg
          className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <p className="text-sm font-medium text-foreground/90 whitespace-nowrap">
          <span className="text-orange-600 dark:text-orange-400 font-semibold">
            Automate smarter,
          </span>{" "}
          not harder
        </p>
      </div>

      {/* Right Section - Save Button */}
      <div className="flex items-center">
        <EditorSaveButton workflowId={workflowId} />
      </div>
    </header>
  );
};
