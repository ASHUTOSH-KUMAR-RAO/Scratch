import { TRPCClientError } from "@trpc/client";
import { useState } from "react";
import { UpgradeModal } from "@/components/upgrade-model";
export const useUpgradeModel = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleError = (error: unknown) => {
    if (error instanceof TRPCClientError) {
      if (error.data?.code === "FORBIDDEN") {
        setIsOpen(true);
        return true;
      }
    }
    return false;
  };

  const model = <UpgradeModal open={isOpen} onOpenChange={setIsOpen} />;
  return { handleError, model };
};
