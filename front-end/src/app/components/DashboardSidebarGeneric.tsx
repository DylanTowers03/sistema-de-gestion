"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";
import React from "react";
import { redirect } from "next/navigation";

export interface SidebarItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

interface SidebarProps {
  items: SidebarItem[];
  className?: string;
  defaultActive?: string; // título por defecto
}

export function Sidebar({ items, className, defaultActive }: SidebarProps) {
  const [activeItem, setActiveItem] = React.useState(
    defaultActive?.toLowerCase() || ""
  );

  const handleItemClick = (title: string, href: string) => {
    setActiveItem(title.toLowerCase());
    redirect(href);
  };

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-2 p-2">
              {items.map((item) => {
                const isActive = activeItem === item.title.toLowerCase();

                return (
                  <Button
                    key={item.title}
                    variant={isActive ? "secondary" : "ghost"}
                    onClick={() => handleItemClick(item.title, item.href)}
                    className={cn(
                      "w-full justify-start h-10 px-3 cursor-pointer",
                      isActive
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    <span className="flex-1 text-left">{item.title}</span>
                    {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
