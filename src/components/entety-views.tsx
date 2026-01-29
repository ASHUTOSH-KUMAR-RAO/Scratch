import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

type EntityHeaderProps = {
  title: string;
  description?: string;
  newButtonLabel: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { newButtonHref: string; onNew?: never }
  | { onNew?: never; newButtonHref?: never }
);

export const EntityHeader = ({
  newButtonHref,
  onNew,
  title,
  description,
  newButtonLabel,
  disabled,
  isCreating,
}: EntityHeaderProps) => {
  const buttonContent = (
    <>
      <PlusIcon className="size-4 mr-2" />
      <span className="hidden sm:inline">{newButtonLabel}</span>
      <span className="sm:hidden">New</span>
    </>
  );

  return (
    <div className="flex flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex flex-col gap-y-1 flex-1 min-w-0">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="flex-shrink-0">
        {onNew && !newButtonHref && (
          <Button
            disabled={disabled || isCreating}
            onClick={onNew}
            size="sm"
            className="gap-2 shadow-sm"
          >
            {isCreating ? (
              <>
                <span className="animate-spin">⏳</span>
                <span className="hidden sm:inline">Creating...</span>
              </>
            ) : (
              buttonContent
            )}
          </Button>
        )}

        {newButtonHref && !onNew && (
          <Button size="sm" asChild className="shadow-sm">
            <Link
              href={newButtonHref}
              className={disabled ? "pointer-events-none opacity-50" : ""}
              prefetch
            >
              {buttonContent}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

type EntityContainerProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
};

export const EntityContainer = ({
  children,
  header,
  pagination,
  search,
}: EntityContainerProps) => {
  return (
    <div className="p-4 md:px-6 md:py-6 h-full">
      <div className="mx-auto max-w-7xl w-full flex flex-col gap-y-6 h-full">
        {header}
      </div>
      <div className="flex flex-col gap-y-4 h-full">
        {search}
        {children}
      </div>
      {pagination}
    </div>
  );
};
