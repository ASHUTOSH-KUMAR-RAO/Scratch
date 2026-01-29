"use client";

import { authClient } from "@/lib/auth-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Check, Zap } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string; // Optional: to show which feature triggered the upgrade
}

const proFeatures = [
  "Unlimited workflows and executions",
  "Advanced workflow steps and actions",
  "Premium integrations and connectors",
  "Faster execution times",
  "Priority workflow support",
  "Team collaboration features",
];

export const UpgradeModal = ({
  open,
  onOpenChange,
  feature
}: UpgradeModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>

          <AlertDialogTitle className="text-center text-2xl font-bold">
            Upgrade to Pro
          </AlertDialogTitle>

          <AlertDialogDescription className="text-center space-y-4">
            {feature && (
              <p className="text-base font-medium text-foreground">
                <span className="inline-flex items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-500" />
                  {feature}
                </span>{" "}
                is a Pro feature.
              </p>
            )}

            <p className="text-sm">
              Unlock unlimited automation power and scale your workflows.
            </p>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-left">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
                Pro includes:
              </p>
              {proFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="w-full sm:w-auto">
            Not Now
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => authClient.checkout({ slug: "pro" })}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
          >
            <Zap className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
