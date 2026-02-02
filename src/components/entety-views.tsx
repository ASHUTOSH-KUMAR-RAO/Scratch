import {
  PlusIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
  AlertTriangleIcon,
  PackageOpenIcon,
  MoreVerticalIcon,
  TrashIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
                <Loader2Icon className="size-4 animate-spin" />
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

interface StateViewsProps {
  message?: string;
}

export const LoadingViews = ({ message }: StateViewsProps) => {
  return (
    <div className="flex justify-center items-center h-full flex-col flex-1 gap-y-4">
      <Loader2Icon className="size-8 text-muted-foreground animate-spin" />
      {message && (
        <p className="text-sm text-muted-foreground font-medium">{message}</p>
      )}
    </div>
  );
};

export const ErrorViews = ({ message }: StateViewsProps) => {
  return (
    <div className="flex justify-center items-center h-full flex-col flex-1 gap-y-4">
      <div className="rounded-full bg-destructive/10 p-3">
        <AlertTriangleIcon className="size-8 text-destructive" />
      </div>
      {message && (
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-foreground">
            Something went wrong
          </p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      )}
    </div>
  );
};

interface EmptyViewProps extends StateViewsProps {
  onNew?: () => void;
  buttonLabel?: string;
  title?: string;
}

export const EmptyView = ({
  message,
  onNew,
  buttonLabel = "Create New",
  title = "No items found",
}: EmptyViewProps) => {
  return (
    <Empty className="border-2 border-dashed rounded-xl bg-muted/30 py-16 px-8">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="text-muted-foreground">
          <PackageOpenIcon className="size-16" />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyTitle className="text-xl font-bold mt-4">{title}</EmptyTitle>
      {message && (
        <EmptyDescription className="text-muted-foreground text-base max-w-lg mx-auto mt-2 leading-relaxed">
          {message}
        </EmptyDescription>
      )}
      {onNew && (
        <EmptyContent className="mt-8">
          <Button
            onClick={onNew}
            size="lg"
            className="gap-2 px-6 h-11 text-base"
          >
            <PlusIcon className="size-5" />
            {buttonLabel}
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
};

interface EntityListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey: (item: T, index: number) => string | number;
  emptyView?: React.ReactNode;
  className?: string;
  itemClassName?: string;
}

export function EntityList<T>({
  getKey,
  items,
  renderItem,
  className,
  itemClassName,
  emptyView,
}: EntityListProps<T>) {
  if (items.length === 0 && emptyView) {
    return (
      <div className="flex flex-1 justify-center items-center w-full h-full">
        <div className="w-full max-w-2xl mx-auto px-4">{emptyView}</div>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4 auto-rows-max", className)}>
      {items.map((item, index) => (
        <div
          key={getKey(item, index)}
          className={cn(
            "rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
            itemClassName,
          )}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

interface EntityItemProps {
  href: string;
  title: string;
  subtitle?: React.ReactNode;
  image?: React.ReactNode;
  actions?: React.ReactNode;
  onRemove?: () => void | Promise<void>;
  isRemoving?: boolean;
  className?: string;
}

export const EntityItem = ({
  href,
  title,
  actions,
  className,
  image,
  isRemoving,
  onRemove,
  subtitle,
}: EntityItemProps) => {
  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRemoving) {
      return;
    }
    if (onRemove) {
      await onRemove();
    }
  };
  return (
    <Link href={href} prefetch>
      <Card
        className={cn(
          "p-4 shadow-none hover:shadow cursor-pointer",
          isRemoving && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <CardContent className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            {image}
            <div>
              <CardTitle className="text-base font-medium">{title}</CardTitle>
              {!!subtitle && (
                <CardDescription className="text-xs">
                  {subtitle}
                </CardDescription>
              )}
            </div>
          </div>
          {(actions || onRemove) && (
            <div className="flex gap-x-4 items-center">
              {actions}
              {onRemove && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVerticalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenuItem onClick={handleRemove}>
                      <TrashIcon className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
