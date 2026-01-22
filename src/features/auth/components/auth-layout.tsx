import React from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 dark:from-slate-950 dark:via-gray-900 dark:to-slate-950">
      {/* Animated Gradient Orbs - More Visible */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-96 h-96 bg-gradient-to-br from-gray-300/40 to-slate-300/40 dark:from-gray-700/20 dark:to-slate-700/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-[500px] h-[500px] bg-gradient-to-tl from-slate-300/40 to-gray-300/40 dark:from-slate-700/20 dark:to-gray-700/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gray-200/30 dark:bg-gray-800/15 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern Overlay - More Visible */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(148 163 184 / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(148 163 184 / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        {/* Glassy Container */}
        <div className="w-full max-w-md">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-700 to-slate-900 shadow-lg shadow-gray-500/50 mb-4">
              <Image
                src="/favicon.ico"
                alt="Scratch Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Scratch
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Workflow Automation Platform
            </p>
          </div>

          {/* Glassy Card Wrapper */}
          <div className="backdrop-blur-2xl bg-white/60 dark:bg-slate-900/60 rounded-3xl shadow-2xl border border-gray-200/60 dark:border-slate-700/60 p-1.5 ring-1 ring-gray-900/5">
            <div className="rounded-[20px] bg-gradient-to-b from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-900/40 p-0.5">
              {children}
            </div>
          </div>

          {/* Footer Text */}
          <div className="text-center mt-6 text-xs text-slate-500 dark:text-slate-400">
            By continuing, you agree to our{" "}
            <a href="#" className="underline hover:text-slate-700 dark:hover:text-slate-300">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-slate-700 dark:hover:text-slate-300">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
