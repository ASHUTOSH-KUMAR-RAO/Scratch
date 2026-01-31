import {
  PlusIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";

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
    <div className="p-4 md:px-6 md:py-6 h-full flex flex-col">
      <div className="mx-auto max-w-7xl w-full flex flex-col flex-1 min-h-0">
        {header}
        {search && <div className="mt-6">{search}</div>}
        <div className="flex-1 min-h-0 overflow-auto mt-6">{children}</div>
        {pagination && <div className="mt-auto pt-4">{pagination}</div>}
      </div>
    </div>
  );
};

interface EntitySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const EntitySearch = ({
  value,
  onChange,
  placeholder = "Search...",
}: EntitySearchProps) => {
  return (
    <div className="relative w-full max-w-sm ml-auto">
      <SearchIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        className="pl-9 bg-background shadow-sm border-border focus-visible:ring-2"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

interface EntityPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const EntityPagination = ({
  onPageChange,
  page,
  totalPages,
  disabled,
}: EntityPaginationProps) => {
  const safeTotalPages = Math.max(1, totalPages);

  return (
    <div className="flex items-center justify-between gap-x-2 w-full border-t pt-4">
      <p className="text-sm text-muted-foreground">
        Page {page} of {safeTotalPages}
      </p>

      <div className="flex items-center gap-x-1">
        <Button
          disabled={page === 1 || disabled}
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeftIcon className="size-4" />
        </Button>

        <span className="text-sm font-medium bg-muted rounded-md h-8 w-8 flex items-center justify-center">
          {page}
        </span>

        <Button
          disabled={page === safeTotalPages || disabled}
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};
