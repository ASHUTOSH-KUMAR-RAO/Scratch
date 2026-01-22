"use client";

import Image from "next/image";
import Link from "next/link";
import { Workflow, Zap, Shield } from "lucide-react";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex bg-muted">
      {/* Left Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="flex items-center gap-2 mb-8 font-bold text-2xl hover:opacity-80 transition-opacity"
          >
            <Image
              src="/favicon.ico"
              alt="Scratch Logo"
              width={32}
              height={32}
            />
            SCRATCH
          </Link>
          {children}
        </div>
      </div>

      {/* Right Side - Marketing Content */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-muted">
        <div className="max-w-lg space-y-8">
          {/* Main Content */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Workflow className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Workflow Automation Platform
              </span>
            </div>

            <h2 className="text-3xl font-bold text-foreground leading-tight">
              Automate workflows with a visual canvas
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed">
              Connect apps, build automation workflows visually, and streamline
              your business processes. No coding required.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Visual Workflow Builder
                </h3>
                <p className="text-sm text-muted-foreground">
                  Drag-and-drop nodes to create complex automations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Self-Hosted & Secure
                </h3>
                <p className="text-sm text-muted-foreground">
                  Full control over your data and workflows
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Workflow className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  400+ Integrations
                </h3>
                <p className="text-sm text-muted-foreground">
                  Connect to your favorite apps and services
                </p>
              </div>
            </div>
          </div>

          {/* Creator Info */}
          <div className="pt-8 mt-8 border-t border-border space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Built with ❤️ by
                </p>
                <p className="text-xl font-bold text-foreground">
                  Ashutosh Kumar Rao
                </p>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Gorakhpur, India
                </p>
              </div>

              <a
                href="https://github.com/ASHUTOSH-KUMAR-RAO/Scratch"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 p-3 rounded-lg bg-foreground hover:bg-foreground/90 transition-colors group"
                aria-label="View on GitHub"
              >
                <svg
                  className="w-6 h-6 text-background"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-medium text-green-700 dark:text-green-400">
                  Open Source
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                  Self-Hosted
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-xs font-medium text-purple-700 dark:text-purple-400">
                  Paid Plans Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
