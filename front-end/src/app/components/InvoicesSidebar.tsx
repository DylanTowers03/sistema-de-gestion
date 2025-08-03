"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building2, ChevronRight, UserPlus } from "lucide-react";
import React from "react";
import { redirect } from "next/navigation";
interface DashboardSidebarProps {
  className?: string;
}

const sidebarItems = [
  { title: "ver Facturas", icon: Building2, href: "/dashboard/invoices/get/" },
  { title: "Facturar", icon: UserPlus, href: "/dashboard/invoices/create/" },
];

export function InvoicesSidebar({ className }: DashboardSidebarProps) {
  const [activeItem, setActiveItem] = React.useState("facturar");
  const handleItemClick = (title: string) => {
    setActiveItem(title);
  };
  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="space-y-2 p-2">
                {sidebarItems.map((item) => (
                  <Button
                    key={item.title}
                    variant={
                      activeItem === item.title.toLowerCase()
                        ? "secondary"
                        : "ghost"
                    }
                    onClick={() => {
                      handleItemClick(item.title.toLowerCase());
                      redirect(item.href);
                    }}
                    className={cn(
                      "w-full justify-start h-10 px-3 cursor-pointer",
                      `${
                        activeItem === item.title.toLowerCase()
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`
                    )}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    <span className="flex-1 text-left">{item.title}</span>
                    {activeItem === item.title.toLowerCase() && (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    )}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
