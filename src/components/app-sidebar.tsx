"use client";

import {
  CreditCard,
  LogOut,
  Sparkles,
  Workflow,
  Key,
  Clock,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription";

const menuItems = [
  {
    title: "Workspace",
    items: [
      {
        title: "Workflows",
        icon: Workflow,
        url: "/workflows",
        badge: null,
      },
      {
        title: "Credentials",
        icon: Key,
        url: "/credentials",
        badge: null,
      },
      {
        title: "Executions",
        icon: Clock,
        url: "/executions",
        badge: null,
      },
    ],
  },
];

export const AppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { hasActiveSubscription, isLoading } = useHasActiveSubscription();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Scratch"
              asChild
              className="gap-x-3 h-14 px-3 hover:bg-accent/50 transition-colors group"
            >
              <Link href="/" prefetch>
                <Image
                  src="/favicon.ico"
                  alt="Scratch"
                  width={32}
                  height={32}
                  className="shrink-0"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-base">Scratch</span>
                  <span className="text-[10px] text-muted-foreground">
                    Automation Platform
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {menuItems.map((group, idx) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="mt-2">
              <SidebarMenu className="space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    item.url === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.url);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive}
                        asChild
                        className={`
                          gap-x-3 h-10 px-3 rounded-lg transition-all duration-200
                          ${
                            isActive
                              ? "bg-accent/80 text-accent-foreground shadow-sm"
                              : "hover:bg-accent/50"
                          }
                        `}
                      >
                        <Link href={item.url} prefetch>
                          <div
                            className={`
                            p-1.5 rounded-md transition-colors
                            ${
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground group-hover:text-foreground"
                            }
                          `}
                          >
                            <item.icon className="size-4" strokeWidth={2.5} />
                          </div>
                          <span className="font-medium text-sm">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-2">
        <SidebarMenu className="space-y-1">
          {!hasActiveSubscription && !isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Upgrade to Pro"
                className="gap-x-3 h-10 px-3 rounded-lg hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-orange-600/10 hover:text-orange-600 dark:hover:text-orange-400 transition-all group"
                onClick={() => authClient.checkout({ slug: "pro" })}
              >
                <div className="p-1.5 rounded-md bg-gradient-to-br from-orange-500/10 to-orange-600/10 text-orange-600 dark:text-orange-400">
                  <Sparkles className="h-4 w-4" strokeWidth={2.5} />
                </div>
                <span className="font-medium text-sm">Upgrade to Pro</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Billing Portal"
              className="gap-x-3 h-10 px-3 rounded-lg hover:bg-accent/50 transition-colors"
              onClick={() => {}}
            >
              <div className="p-1.5 rounded-md text-muted-foreground">
                <CreditCard className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <span className="font-medium text-sm">Billing Portal</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarSeparator className="my-2" />

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign Out"
              className="gap-x-3 h-10 px-3 rounded-lg hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all"
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/login");
                    },
                  },
                })
              }
            >
              <div className="p-1.5 rounded-md">
                <LogOut className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <span className="font-medium text-sm">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
