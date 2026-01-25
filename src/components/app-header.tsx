"use client"

import { useSidebar } from "./ui/sidebar";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "./ui/button";

export const AppHeader = () => {
  const { toggleSidebar, open } = useSidebar();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border/40 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="h-9 w-9 rounded-lg hover:bg-accent/50 transition-colors border-border/40"
        >
          {open ? (
            <ChevronsLeft className="h-4 w-4" strokeWidth={2.5} />
          ) : (
            <ChevronsRight className="h-4 w-4" strokeWidth={2.5} />
          )}
        </Button>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500/10 to-orange-600/5 border border-orange-500/20">
        <svg className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
        <p className="text-sm font-medium text-foreground/90">
          <span className="text-orange-600 dark:text-orange-400">Automate smarter,</span> not harder
        </p>
      </div>
    </header>
  );
};
