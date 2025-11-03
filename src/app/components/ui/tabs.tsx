import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "../../lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    data-slot="tabs-list"
    dir="rtl"
    className={cn(
      // full width, horizontally scrollable in RTL, with fade overlay
      "w-full border-b-1 flex overflow-x-scroll whitespace-nowrap custom-scrollbar bg-scroll-transparent bg-background text-muted-foreground items-center h-9 scroll-fade-left",
      className
    )}
    style={{ WebkitOverflowScrolling: "touch" }}
    {...props}
  />
));
TabsList.displayName = "TabsList";

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "w-28 flex-none px-4 py-2 text-center border-b-2 border-transparent cursor-pointer text-sm font-medium whitespace-nowrap",
        "data-[state=active]:border-b-orange-400 text-foreground dark:text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
